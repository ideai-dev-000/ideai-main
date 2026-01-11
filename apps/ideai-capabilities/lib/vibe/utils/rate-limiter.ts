/**
 * @fileoverview Rate Limiting Utilities for Vibe
 *
 * @module VibeRateLimiter
 * @description
 * Composable rate limiting for vibe chat functionality.
 * Supports both authenticated user and IP-based rate limiting.
 */

import {
  getVibeChatCountByUserId,
  getVibeChatCountByIP,
} from "../db/vibe-chat-queries";

/**
 * Rate limit configuration
 */
export interface VibeRateLimitConfig {
  /** Maximum chats per period for authenticated users */
  authenticatedLimit: number;
  /** Maximum chats per period for anonymous users */
  anonymousLimit: number;
  /** Time period in hours */
  periodHours: number;
}

/**
 * Default rate limit configuration
 */
export const DEFAULT_VIBE_RATE_LIMIT: VibeRateLimitConfig = {
  authenticatedLimit: 100, // Per day
  anonymousLimit: 5, // Per day
  periodHours: 24,
};

/**
 * Check if user has exceeded rate limit
 *
 * @param userId User ID (null for anonymous)
 * @param ipAddress IP address (for anonymous users)
 * @param config Rate limit configuration
 * @returns Object with isAllowed flag and reason if not allowed
 */
export async function checkVibeRateLimit(
  userId: string | null,
  ipAddress: string,
  config: VibeRateLimitConfig = DEFAULT_VIBE_RATE_LIMIT,
): Promise<{
  isAllowed: boolean;
  reason?: string;
  currentCount: number;
  limit: number;
}> {
  try {
    let currentCount = 0;
    let limit = 0;

    if (userId) {
      // Authenticated user rate limiting
      currentCount = await getVibeChatCountByUserId({
        userId,
        differenceInHours: config.periodHours,
      });
      limit = config.authenticatedLimit;

      if (currentCount >= limit) {
        return {
          isAllowed: false,
          reason: `Rate limit exceeded. Maximum ${limit} chats per ${config.periodHours} hours.`,
          currentCount,
          limit,
        };
      }
    } else {
      // Anonymous user rate limiting
      currentCount = await getVibeChatCountByIP({
        ipAddress,
        differenceInHours: config.periodHours,
      });
      limit = config.anonymousLimit;

      if (currentCount >= limit) {
        return {
          isAllowed: false,
          reason: `Rate limit exceeded. Maximum ${limit} chats per ${config.periodHours} hours. Please sign in for higher limits.`,
          currentCount,
          limit,
        };
      }
    }

    return {
      isAllowed: true,
      currentCount,
      limit,
    };
  } catch (error) {
    console.error("[VibeRateLimiter] Rate limit check failed:", error);
    // Fail open - allow request if rate limit check fails
    return {
      isAllowed: true,
      currentCount: 0,
      limit: userId ? config.authenticatedLimit : config.anonymousLimit,
    };
  }
}
