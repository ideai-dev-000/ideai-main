/**
 * @fileoverview IdeaI Authentication Package - Exports
 *
 * @module IdeAIAuth
 * @description
 * Centralized authentication system for all IdeaI applications.
 *
 * All IdeaI apps share the same database and authentication system,
 * enabling users to sign up once and access all IdeaI applications.
 *
 * @example
 * ```tsx
 * // Server-side
 * import { auth } from "@repo/ideai-auth/server";
 *
 * // Client-side
 * import { signIn, signOut, useSession } from "@repo/ideai-auth/client";
 *
 * // Database
 * import { db } from "@repo/ideai-auth/db";
 * import { users, workflows } from "@repo/ideai-auth/schema";
 * ```
 */

// Server-side exports
export { auth, getBaseURL, isAiGatewayManagedKeysEnabled } from "./server";

// Client-side exports
export { authClient, signIn, signOut, signUp, useSession } from "./client";

// Database exports
export { db, migrationClient } from "./db";

// Schema exports
export * from "./db/schema";
