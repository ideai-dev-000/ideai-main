/**
 * @fileoverview Super Admin Package - Dev-Only User/DB Management
 *
 * @module @repo/ideai-db-manager
 * @description
 * Lightweight database manager for viewing and editing users in IdeaI.
 *
 * ⚠️ CRITICAL: This package is DEV-ONLY and must NEVER be deployed to production.
 * All exports include runtime checks to prevent accidental deployment.
 *
 * @example
 * ```tsx
 * import { SuperAdminPanel } from "@repo/ideai-db-manager";
 *
 * // Only works in development
 * <SuperAdminPanel />
 * ```
 */

export { SuperAdminPanel } from "./components/super-admin-panel";
export { useSuperAdminAuth } from "./hooks/use-super-admin-auth";
export { createSuperUserPassword } from "./utils/password-creation";
export { isSuperAdminEnabled } from "./utils/dev-check";
