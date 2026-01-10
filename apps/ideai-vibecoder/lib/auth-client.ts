/**
 * @fileoverview Auth client for IdeaI VibeCoder
 *
 * @module IdeAIVibeCoderAuthClient
 * @description
 * Re-exports auth client from @repo/ideai-user for consistency.
 * Apps can also use the shared auth-client directly.
 */

// Re-export from shared user module for consistency
export {
  signIn,
  signOut,
  signUp,
  useSession,
  authClient,
} from "@repo/ideai-user/auth-client";
