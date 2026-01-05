/**
 * @fileoverview Development-only checks to prevent production deployment
 *
 * @module dev-check
 * @description
 * Runtime checks to ensure IdeaI DB Manager features are NEVER available in production.
 * These checks are critical for security.
 */

/**
 * Check if IdeaI DB Manager is enabled (dev-only)
 *
 * @returns true if in development mode, false otherwise
 * @throws Error if attempting to use in production
 */
export function isSuperAdminEnabled(): boolean {
  // CRITICAL: Never allow in production
  if (process.env.NODE_ENV === "production") {
    return false;
  }

  // Also check for explicit production flags
  if (process.env.VERCEL_ENV === "production") {
    return false;
  }

  // Only allow in development
  return process.env.NODE_ENV === "development";
}

/**
 * Assert that IdeaI DB Manager is enabled (throws if not)
 *
 * @throws Error if not in development mode
 */
export function assertSuperAdminEnabled(): void {
  if (!isSuperAdminEnabled()) {
    throw new Error(
      "IdeaI DB Manager features are DEV-ONLY and cannot be used in production. " +
        "This is a security measure to prevent accidental deployment.",
    );
  }
}

/**
 * Check if current environment is safe for IdeaI DB Manager
 *
 * @returns true if safe (dev), false if production
 */
export function isSafeEnvironment(): boolean {
  // Block in production
  if (process.env.NODE_ENV === "production") {
    return false;
  }

  // Block in Vercel production
  if (process.env.VERCEL_ENV === "production") {
    return false;
  }

  // Block if explicitly set to production
  if (process.env.SUPER_ADMIN_ENABLED === "false") {
    return false;
  }

  // Allow only in development
  return process.env.NODE_ENV === "development";
}
