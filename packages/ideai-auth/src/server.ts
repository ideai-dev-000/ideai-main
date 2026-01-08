import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { anonymous, genericOAuth } from "better-auth/plugins";
import { eq } from "drizzle-orm";
import { db } from "./db";
import {
  accounts,
  integrations,
  sessions,
  users,
  verifications,
  workflowExecutionLogs,
  workflowExecutions,
  workflowExecutionsRelations,
  workflows,
} from "./db/schema";

/**
 * @fileoverview Server-side Better Auth configuration for IdeaI
 *
 * @module IdeAIAuthServer
 * @description
 * Centralized authentication server configuration using Better Auth.
 * All IdeaI apps use this same configuration for unified authentication.
 */

// Construct schema object for drizzle adapter
const schema = {
  user: users,
  session: sessions,
  account: accounts,
  verification: verifications,
  workflows,
  workflowExecutions,
  workflowExecutionLogs,
  workflowExecutionsRelations,
};

// Determine the base URL for authentication
// This supports Vercel Preview deployments with dynamic URLs
export function getBaseURL(): string {
  // Priority 1: Explicit BETTER_AUTH_URL (set manually for production/dev)
  if (process.env.BETTER_AUTH_URL) {
    return process.env.BETTER_AUTH_URL;
  }

  // Priority 2: NEXT_PUBLIC_APP_URL
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL;
  }

  // Priority 3: Check if we're on Vercel (for preview deployments)
  if (process.env.VERCEL_URL) {
    // VERCEL_URL doesn't include protocol, so add it
    // Use https for Vercel deployments (both production and preview)
    return `https://${process.env.VERCEL_URL}`;
  }

  // Fallback: Default to web app port for compatibility
  return "http://localhost:3000";
}

// Optional: Check if AI Gateway managed keys are enabled
// This is app-specific and can be overridden
export function isAiGatewayManagedKeysEnabled(): boolean {
  return process.env.ENABLE_AI_GATEWAY_MANAGED_KEYS === "true";
}

// Build plugins array conditionally
function buildPlugins() {
  const plugins = [
    anonymous({
      async onLinkAccount(data) {
        // When an anonymous user links to a real account, migrate their data
        const fromUserId = data.anonymousUser.user.id;
        const toUserId = data.newUser.user.id;

        console.log(
          `[Anonymous Migration] Migrating from user ${fromUserId} to ${toUserId}`,
        );

        try {
          // Migrate workflows
          await db
            .update(workflows)
            .set({ userId: toUserId })
            .where(eq(workflows.userId, fromUserId));

          // Migrate workflow executions
          await db
            .update(workflowExecutions)
            .set({ userId: toUserId })
            .where(eq(workflowExecutions.userId, fromUserId));

          // Migrate integrations
          await db
            .update(integrations)
            .set({ userId: toUserId })
            .where(eq(integrations.userId, fromUserId));

          console.log(
            `[Anonymous Migration] Successfully migrated data from ${fromUserId} to ${toUserId}`,
          );
        } catch (error) {
          console.error(
            "[Anonymous Migration] Error migrating user data:",
            error,
          );
          throw error;
        }
      },
    }),
  ];

  // Add Vercel OAuth if configured
  if (process.env.VERCEL_CLIENT_ID) {
    plugins.push(
      genericOAuth({
        config: [
          {
            providerId: "vercel",
            clientId: process.env.VERCEL_CLIENT_ID,
            clientSecret: process.env.VERCEL_CLIENT_SECRET || "",
            authorizationUrl: "https://vercel.com/oauth/authorize",
            tokenUrl: "https://api.vercel.com/login/oauth/token",
            userInfoUrl: "https://api.vercel.com/login/oauth/userinfo",
            // Include read-write:team scope when AI Gateway User Keys is enabled
            scopes: isAiGatewayManagedKeysEnabled()
              ? ["openid", "email", "profile", "read-write:team"]
              : ["openid", "email", "profile"],
            discoveryUrl: undefined,
            pkce: true,
            getUserInfo: async (tokens) => {
              const response = await fetch(
                "https://api.vercel.com/login/oauth/userinfo",
                {
                  headers: {
                    Authorization: `Bearer ${tokens.accessToken}`,
                  },
                },
              );
              const profile = await response.json();
              console.log("[Vercel OAuth] userinfo response:", profile);
              return {
                id: profile.sub,
                email: profile.email,
                name: profile.name ?? profile.preferred_username,
                emailVerified: profile.email_verified ?? true,
                image: profile.picture,
              };
            },
          },
        ],
      }),
    );
  }

  return plugins;
}

// Create and export the auth instance
export const auth = betterAuth({
  baseURL: getBaseURL(),
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID || "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
      enabled: !!process.env.GITHUB_CLIENT_ID,
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      enabled: !!process.env.GOOGLE_CLIENT_ID,
    },
  },
  plugins: buildPlugins(),
});
