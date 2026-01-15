/**
 * @fileoverview Authentication Helpers for Vibe
 *
 * @module VibeAuthHelpers
 * @description
 * Composable authentication helpers for vibe functionality.
 * Uses shared IdeaI auth system (@repo/ideai-user/auth).
 */

import { auth } from "@/lib/auth";
import { headers } from "next/headers";

// Session type from better-auth
type Session = Awaited<ReturnType<typeof auth.api.getSession>>;

/**
 * Get authenticated session for vibe operations
 *
 * @param requestHeaders Optional request headers (from API route)
 * @returns Session object or null if not authenticated
 */
export async function getVibeSession(
  requestHeaders?: Headers,
): Promise<Session | null> {
  try {
    // Use provided headers or get from next/headers
    const headersToUse = requestHeaders || (await headers());

    const session = await auth.api.getSession({
      headers: headersToUse,
    });

    return session;
  } catch (error) {
    console.error("[VibeAuthHelpers] Failed to get session:", error);
    return null;
  }
}

/**
 * Check if user is authenticated for vibe operations
 * Uses same pattern as workflow routes - just check if session exists
 *
 * @param session Session object from getVibeSession
 * @returns true if user is authenticated, false otherwise
 */
export function isVibeAuthenticated(session: Session | null): boolean {
  // Same check as workflow routes - just verify session exists
  return !!session?.user;
}

/**
 * Get client IP address from request
 * Used for rate limiting anonymous users
 *
 * @param requestHeaders Request headers
 * @returns IP address string
 */
export function getVibeClientIP(requestHeaders: Headers): string {
  const forwarded = requestHeaders.get("x-forwarded-for");
  const realIP = requestHeaders.get("x-real-ip");

  if (forwarded) {
    const firstIP = forwarded.split(",")[0];
    return firstIP ? firstIP.trim() : "unknown";
  }

  if (realIP) {
    return realIP;
  }

  return "unknown";
}
