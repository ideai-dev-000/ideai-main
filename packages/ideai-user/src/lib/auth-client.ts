/**
 * @fileoverview Client-side authentication for IdeaI User Module
 *
 * @module IdeAIUserAuthClient
 * @description
 * Better Auth client configuration for React/Next.js apps.
 * Provides hooks and methods for client-side authentication.
 *
 * Features:
 * - useSession hook for session state
 * - signIn, signUp, signOut methods
 * - Anonymous session support
 * - Automatic base URL detection
 *
 * @example
 * ```typescript
 * import { useSession, signIn, signOut } from "@repo/ideai-user/auth-client";
 *
 * function MyComponent() {
 *   const { data: session } = useSession();
 *
 *   if (!session?.user) {
 *     return <button onClick={() => signIn.email({ email, password })}>Sign In</button>;
 *   }
 *
 *   return <button onClick={() => signOut()}>Sign Out</button>;
 * }
 * ```
 *
 * @see ./auth.ts - Server-side auth configuration
 */

import { anonymousClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

/**
 * Get base URL for client-side auth
 *
 * Uses same logic as server-side auth for consistency.
 * Detects URL from window.location in browser, falls back to
 * environment variables for SSR.
 */
function getBaseURL(): string {
  // Client-side: use current origin
  if (typeof window !== "undefined") {
    return window.location.origin;
  }

  // Server-side: match the logic in lib/auth.ts
  if (process.env.BETTER_AUTH_URL) {
    return process.env.BETTER_AUTH_URL;
  }

  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL;
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  // Default to capabilities app port (central auth endpoint)
  return "http://localhost:3018";
}

/**
 * Better Auth client instance
 *
 * Configured with:
 * - Anonymous client plugin
 * - Dynamic base URL detection
 * - React hooks support
 */
export const authClient = createAuthClient({
  baseURL: getBaseURL(),
  plugins: [anonymousClient()],
});

/**
 * Export commonly used auth methods and hooks
 */
export const { signIn, signOut, signUp, useSession } = authClient;
