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
 * - OAuth providers (GitHub, Google)
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
import { db } from "./db";
import { accounts, sessions, users, verifications } from "./db/schema";

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
  anonymous(),

  // Generic OAuth plugin - supports GitHub and Google
  ...(process.env.GITHUB_CLIENT_ID || process.env.GOOGLE_CLIENT_ID
    ? [
        genericOAuth({
          id: "github",
          clientId: process.env.GITHUB_CLIENT_ID || "",
          clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
          scope: ["user:email"],
          enabled: !!process.env.GITHUB_CLIENT_ID,
        }),
        genericOAuth({
          id: "google",
          clientId: process.env.GOOGLE_CLIENT_ID || "",
          clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
          scope: ["openid", "email", "profile"],
          enabled: !!process.env.GOOGLE_CLIENT_ID,
        }),
      ]
    : []),
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
