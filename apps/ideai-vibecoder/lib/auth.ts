/**
 * @fileoverview Auth for IdeaI VibeCoder
 *
 * @module IdeAIVibeCoderAuth
 * @description
 * Better Auth configuration for ideai-vibecoder app.
 * Uses vibecoder's own database and schema (not shared yet - see TODO.md).
 */

import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { anonymous } from "better-auth/plugins";
import { db } from "./db";
import { accounts, sessions, users, verifications } from "./db/schema";

// Construct schema object for drizzle adapter (using shared schema)
const schema = {
  user: users,
  session: sessions,
  account: accounts,
  verification: verifications,
};

// Determine the base URL for authentication (vibecoder-specific port)
function getBaseURL() {
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
    return `https://${process.env.VERCEL_URL}`;
  }

  // Fallback: Local development (ideai-vibecoder app port)
  return "http://localhost:3020";
}

// Use shared database and schema, but vibecoder-specific baseURL
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
  plugins: [anonymous()],
});
