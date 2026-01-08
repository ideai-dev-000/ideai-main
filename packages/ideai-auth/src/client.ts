import { anonymousClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

/**
 * @fileoverview Client-side Better Auth configuration for IdeaI
 *
 * @module IdeAIAuthClient
 * @description
 * Centralized authentication client configuration using Better Auth.
 * All IdeaI apps use this same client for unified authentication.
 */

// Use the same baseURL logic as the server-side auth
function getBaseURL(): string {
  if (typeof window !== "undefined") {
    return window.location.origin;
  }
  // Server-side: match the logic in server.ts
  if (process.env.BETTER_AUTH_URL) {
    return process.env.BETTER_AUTH_URL;
  }
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  // Default to web app port
  return "http://localhost:3000";
}

export const authClient = createAuthClient({
  baseURL: getBaseURL(),
  plugins: [anonymousClient()],
});

export const { signIn, signOut, signUp, useSession } = authClient;
