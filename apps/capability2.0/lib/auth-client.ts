/**
 * @fileoverview Auth Client for IdeaI Capability App
 *
 * @module IdeAICapabilityAuthClient
 * @description
 * Re-exports shared auth client from @repo/ideai-user for centralized authentication.
 * Capability app now uses the unified IdeaI auth client with shared sessions.
 *
 * @see @repo/ideai-user/auth-client - Shared auth client
 */

// Re-export shared auth client from IdeaI User Module
export {
  authClient,
  signIn,
  signOut,
  signUp,
  useSession,
} from "@repo/ideai-user/auth-client";
