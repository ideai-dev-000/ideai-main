/**
 * @fileoverview Dev-only validation utilities
 *
 * @module DevCheck
 * @description
 * Ensures dev tools are NEVER available in production.
 * All dev tools must use these checks.
 */

/**
 * Check if running in development environment
 *
 * @returns true if in development, false otherwise
 */
export function isDevelopment(): boolean {
  // Check NODE_ENV
  if (process.env.NODE_ENV === "production") {
    return false;
  }

  // Check if running on localhost (browser)
  if (typeof window !== "undefined") {
    return (
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1"
    );
  }

  // For Node.js scripts, check NODE_ENV
  return (
    process.env.NODE_ENV === "development" ||
    process.env.NODE_ENV !== "production"
  );
}

/**
 * Assert that we're in development, throw if not
 *
 * @throws Error if not in development
 */
export function assertDevelopment(): void {
  if (!isDevelopment()) {
    throw new Error(
      "IdeaI Developer tools are only available in development. " +
        "This code should never run in production.",
    );
  }
}

/**
 * Safe wrapper that returns null in production
 *
 * @param fn Function to execute only in dev
 * @returns Result of fn or null if in production
 */
export function devOnly<T>(fn: () => T): T | null {
  if (!isDevelopment()) {
    return null;
  }
  return fn();
}


