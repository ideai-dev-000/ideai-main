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

/**
 * Build plugins array with type-safe conditional plugins
 * Uses spread operator pattern to maintain proper TypeScript inference
 */
function buildPlugins() {
  return [
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
    // Conditionally add Vercel OAuth plugin using spread operator for type safety
    ...(process.env.VERCEL_CLIENT_ID && process.env.VERCEL_CLIENT_SECRET
      ? [
          genericOAuth({
            config: [
              {
                providerId: "vercel",
                clientId: process.env.VERCEL_CLIENT_ID,
                clientSecret: process.env.VERCEL_CLIENT_SECRET,
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

                  if (!response.ok) {
                    throw new Error(
                      `Vercel OAuth userinfo request failed: ${response.status} ${response.statusText}`,
                    );
                  }

                  const profile = await response.json();
                  console.log("[Vercel OAuth] userinfo response:", profile);

                  // Validate required fields
                  if (!profile.sub || !profile.email) {
                    throw new Error(
                      "Invalid user profile: missing required fields (sub, email)",
                    );
                  }

                  return {
                    id: profile.sub,
                    email: profile.email,
                    name: profile.name ?? profile.preferred_username ?? "",
                    emailVerified: profile.email_verified ?? true,
                    image: profile.picture ?? null,
                  };
                },
              },
            ],
          }),
        ]
      : []),
  ];
}

/**
 * Get the auth secret with validation
 * Validates at runtime (when auth is actually used), not at module load
 * This allows builds to succeed even if env vars aren't set locally
 *
 * @throws {Error} If secret is missing or invalid in production runtime
 */
function getAuthSecret(): string {
  const secret = process.env.BETTER_AUTH_SECRET;

  if (!secret) {
    // During build time, return a placeholder if not set
    // This will fail at runtime if actually used, which is the correct behavior
    if (process.env.NODE_ENV === "production" && !process.env.NEXT_PHASE) {
      // Runtime in production - this is a real error
      throw new Error(
        "BETTER_AUTH_SECRET is required in production. " +
          "Set it in Vercel environment variables.",
      );
    }
    // For local builds, return a placeholder (will fail at runtime if used)
    return "PLACEHOLDER_SECRET_FOR_BUILD_ONLY_DO_NOT_USE_IN_RUNTIME";
  }

  if (secret.length < 32) {
    throw new Error(
      "BETTER_AUTH_SECRET must be at least 32 characters for security. " +
        "Generate with: openssl rand -base64 32",
    );
  }

  return secret;
}

/**
 * Validate required authentication configuration
 * Throws error if critical security configuration is missing
 * Only validates at runtime, not during build
 */
function validateAuthConfig() {
  // Validate secret
  const secret = getAuthSecret();

  // If it's the placeholder, validation will fail at runtime (correct behavior)
  if (secret === "PLACEHOLDER_SECRET_FOR_BUILD_ONLY_DO_NOT_USE_IN_RUNTIME") {
    // Only warn during build, will fail at runtime when auth is used
    if (process.env.NEXT_PHASE === "phase-production-build") {
      console.warn(
        "[Auth Config] BETTER_AUTH_SECRET not set during build - " +
          "will be required at runtime. Set it in Vercel environment variables.",
      );
      return; // Don't fail build
    }
    throw new Error(
      "BETTER_AUTH_SECRET is required. Generate with: openssl rand -base64 32",
    );
  }

  // Validate OAuth configuration if Vercel OAuth is enabled
  if (process.env.VERCEL_CLIENT_ID && !process.env.VERCEL_CLIENT_SECRET) {
    throw new Error(
      "VERCEL_CLIENT_SECRET is required when VERCEL_CLIENT_ID is set",
    );
  }

  // Validate social provider configurations
  if (process.env.GITHUB_CLIENT_ID && !process.env.GITHUB_CLIENT_SECRET) {
    throw new Error(
      "GITHUB_CLIENT_SECRET is required when GITHUB_CLIENT_ID is set",
    );
  }

  if (process.env.GOOGLE_CLIENT_ID && !process.env.GOOGLE_CLIENT_SECRET) {
    throw new Error(
      "GOOGLE_CLIENT_SECRET is required when GOOGLE_CLIENT_ID is set",
    );
  }
}

// Validate configuration at module load only if we're not in build mode
// During builds, env vars may not be available - validation happens at runtime
if (process.env.NEXT_PHASE !== "phase-production-build") {
  try {
    validateAuthConfig();
  } catch (error) {
    // In runtime (dev or production), throw immediately
    throw error;
  }
}

// Create and export the auth instance
export const auth = betterAuth({
  baseURL: getBaseURL(),
  secret: getAuthSecret(), // Required for session encryption and JWT signing
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false, // Can be enabled in production for enhanced security
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
