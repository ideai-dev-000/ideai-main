/**
 * @fileoverview Auth for IdeaI VibeCoder
 *
 * @module IdeAIVibeCoderAuth
 * @description
 * Re-exports shared auth from @repo/ideai-user for centralized authentication.
 * Vibecoder now uses the unified IdeaI auth system with shared user accounts
 * and sessions across all IdeaI apps.
 *
 * The shared auth instance uses the unified database (same as capabilities app)
 * and automatically detects the correct baseURL from environment variables.
 */

// Re-export shared auth instance from IdeaI User Module
// This ensures all IdeaI apps use the same auth system and share sessions
export { auth } from "@repo/ideai-user/auth";
