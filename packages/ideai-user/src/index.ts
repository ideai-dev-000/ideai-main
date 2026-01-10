/**
 * @fileoverview IdeaI User Module - Centralized user/auth/access module
 *
 * @module IdeAIUserModule
 * @description
 * Centralized user, authentication, and access control module for IdeaI.
 * Supports modular capabilities (workflows, vibecoder, etc.) with semantic
 * table naming and boilerplate patterns for onboarding new capabilities.
 *
 * @example
 * ```typescript
 * import { auth, db, users } from "@repo/ideai-user";
 *
 * // Get user session
 * const session = await auth.api.getSession({ headers });
 *
 * // Query user data
 * const user = await db.query.users.findFirst({
 *   where: eq(users.id, session.user.id)
 * });
 * ```
 *
 * @see ./lib/auth.ts - Auth service
 * @see ./lib/db/schema.ts - Database schema
 * @see ./types/index.ts - Type definitions
 */

// Core exports
export * from "./lib/auth";
export * from "./lib/auth-client";
export * from "./lib/auth-providers";
export * from "./lib/db";
export * from "./lib/services";
export * from "./types";

// Component exports
export * from "./components/auth";
export * from "./components/header";
