/**
 * @fileoverview Auth for IdeaI Capability App
 *
 * @module IdeAICapabilityAuth
 * @description
 * Re-exports shared auth from @repo/ideai-user for centralized authentication.
 * Capability app now uses the unified IdeaI auth system with shared user accounts
 * and sessions across all IdeaI apps.
 *
 * Note: Vercel OAuth and anonymous migration features will be added to shared auth
 * in subsequent phases. These features are temporarily unavailable.
 *
 * @see @repo/ideai-user/auth - Shared auth configuration
 */

// Re-export shared auth instance from IdeaI User Module
// This ensures all IdeaI apps use the same auth system and share sessions
export { auth } from "@repo/ideai-user/auth";
