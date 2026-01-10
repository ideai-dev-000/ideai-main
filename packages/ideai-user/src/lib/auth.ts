/**
 * @fileoverview Authentication service for IdeaI User Module
 *
 * @module IdeAIUserAuth
 * @description
 * Better Auth configuration and wrapper for centralized authentication.
 * Supports email/password, GitHub OAuth, Google OAuth, and anonymous sessions.
 *
 * Features:
 * - Email/password authentication
 * - OAuth providers (GitHub, Google, Vercel)
 * - Anonymous sessions (try before sign up)
 * - Session management across IdeaI apps
 * - Dynamic base URL detection for Vercel deployments
 *
 * @example
 * ```typescript
 * import { auth } from "@repo/ideai-user/auth";
 *
 * // Get session
 * const session = await auth.api.getSession({ headers: request.headers });
 *
 * // Sign in
 * await auth.api.signInEmail({ body: { email, password } });
 * ```
 *
 * @see https://www.better-auth.com/docs
 */

import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { anonymous, genericOAuth } from "better-auth/plugins";
import { eq } from "drizzle-orm";
import { db } from "./db";
import {
  accounts,
  sessions,
  users,
  verifications,
  workflows,
  workflowExecutions,
  workflowIntegrations,
} from "./db/schema";

/**
 * Construct schema object for Drizzle adapter
 * Better Auth requires specific table names for adapter
 */
const authSchema = {
  user: users,
  session: sessions,
  account: accounts,
  verification: verifications,
};

/**
 * Determine the base URL for authentication
 *
 * Priority order:
 * 1. BETTER_AUTH_URL (explicit, highest priority)
 * 2. NEXT_PUBLIC_APP_URL (app-specific URL)
 * 3. VERCEL_URL (Vercel deployment, preview or production)
 * 4. Fallback to localhost (development)
 *
 * This supports:
 * - Local development
 * - Vercel preview deployments (dynamic URLs)
 * - Vercel production deployments
 * - Multi-app deployments (different ports)
 */
function getBaseURL(): string {
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

  // Fallback: Local development
  // Default to port 3018 (capabilities app) as central auth endpoint
  return "http://localhost:3018";
}

/**
 * Build plugins array conditionally based on environment variables
 * Allows enabling/disabling features without code changes
 */
const plugins = [
  // Anonymous auth plugin - enables temporary users
  // Migrates workflows, executions, and integrations when anonymous user signs up
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

        // Migrate workflow integrations
        await db
          .update(workflowIntegrations)
          .set({ userId: toUserId })
          .where(eq(workflowIntegrations.userId, fromUserId));

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
  // Vercel OAuth plugin - enables Vercel OAuth for deployments
  // Only enabled if VERCEL_CLIENT_ID is set
  ...(process.env.VERCEL_CLIENT_ID
    ? [
        genericOAuth({
          config: [
            {
              providerId: "vercel",
              clientId: process.env.VERCEL_CLIENT_ID,
              clientSecret: process.env.VERCEL_CLIENT_SECRET || "",
              authorizationUrl: "https://vercel.com/oauth/authorize",
              tokenUrl: "https://api.vercel.com/login/oauth/token",
              userInfoUrl: "https://api.vercel.com/login/oauth/userinfo",
              scopes: ["openid", "email", "profile"],
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
      ]
    : []),
  // Note: GitHub and Google OAuth are handled via socialProviders in betterAuth config
];

/**
 * Better Auth instance
 *
 * Configured with:
 * - Drizzle adapter for database
 * - Email/password authentication
 * - Social providers (GitHub, Google)
 * - Anonymous sessions
 * - Dynamic base URL
 */
export const auth = betterAuth({
  baseURL: getBaseURL(),
  secret: process.env.BETTER_AUTH_SECRET, // Required for session encryption
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: authSchema,
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false, // Can be enabled in production
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
  plugins,
});

/**
 * Export getBaseURL for use in client-side auth
 */
export { getBaseURL };
