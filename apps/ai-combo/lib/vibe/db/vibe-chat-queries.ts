/**
 * @fileoverview Vibe Chat Database Queries
 *
 * @module VibeChatQueries
 * @description
 * Composable database queries for vibe chat functionality.
 * Uses shared database connection and follows IdeaI patterns.
 */

import "server-only";

import { eq, and, count, gte, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { chat_ownerships, anonymous_chat_logs } from "@/lib/db/schema";

/**
 * Create chat ownership mapping
 * Links a v0 chat ID to a user ID in our database
 */
export async function createVibeChatOwnership({
  v0ChatId,
  userId,
}: {
  v0ChatId: string;
  userId: string;
}) {
  try {
    if (!db) {
      console.warn(
        "[VibeChatQueries] Database not initialized, skipping ownership creation",
      );
      return null;
    }

    const result = await db
      .insert(chat_ownerships)
      .values({
        v0_chat_id: v0ChatId,
        user_id: userId,
      })
      .onConflictDoNothing({ target: chat_ownerships.v0_chat_id })
      .returning();

    return result[0] || null;
  } catch (error) {
    console.error("[VibeChatQueries] Failed to create chat ownership:", error);
    // Non-critical - ownership tracking is optional
    return null;
  }
}

/**
 * Get chat IDs owned by a user
 * Returns array of v0 chat IDs for the given user
 */
export async function getVibeChatIdsByUserId({
  userId,
}: {
  userId: string;
}): Promise<string[]> {
  try {
    if (!db) {
      console.warn("[VibeChatQueries] Database not initialized");
      return [];
    }

    const ownerships = await db
      .select({ v0_chat_id: chat_ownerships.v0_chat_id })
      .from(chat_ownerships)
      .where(eq(chat_ownerships.user_id, userId));

    return ownerships.map((o) => o.v0_chat_id);
  } catch (error) {
    console.error("[VibeChatQueries] Failed to get chat IDs:", error);
    return [];
  }
}

/**
 * Get chat ownership
 * Check if a user owns a specific chat
 */
export async function getVibeChatOwnership({
  v0ChatId,
  userId,
}: {
  v0ChatId: string;
  userId: string;
}) {
  try {
    if (!db) {
      return null;
    }

    const ownership = await db
      .select()
      .from(chat_ownerships)
      .where(
        and(
          eq(chat_ownerships.v0_chat_id, v0ChatId),
          eq(chat_ownerships.user_id, userId),
        ),
      )
      .limit(1);

    return ownership[0] || null;
  } catch (error) {
    console.error("[VibeChatQueries] Failed to get ownership:", error);
    return null;
  }
}

/**
 * Get chat count for user (for rate limiting)
 * Returns count of chats created by user in last N hours
 */
export async function getVibeChatCountByUserId({
  userId,
  differenceInHours = 24,
}: {
  userId: string;
  differenceInHours?: number;
}): Promise<number> {
  try {
    if (!db) {
      return 0;
    }

    const cutoffTime = new Date();
    cutoffTime.setHours(cutoffTime.getHours() - differenceInHours);

    const result = await db
      .select({ count: count() })
      .from(chat_ownerships)
      .where(
        and(
          eq(chat_ownerships.user_id, userId),
          gte(chat_ownerships.created_at, cutoffTime),
        ),
      );

    return result[0]?.count || 0;
  } catch (error) {
    console.error("[VibeChatQueries] Failed to get chat count:", error);
    return 0;
  }
}

/**
 * Create anonymous chat log (for rate limiting)
 * Logs anonymous chat creation for IP-based rate limiting
 */
export async function createVibeAnonymousChatLog({
  ipAddress,
  v0ChatId,
}: {
  ipAddress: string;
  v0ChatId: string;
}) {
  try {
    if (!db) {
      return null;
    }

    const result = await db
      .insert(anonymous_chat_logs)
      .values({
        ip_address: ipAddress,
        v0_chat_id: v0ChatId,
      })
      .returning();

    return result[0] || null;
  } catch (error) {
    console.error(
      "[VibeChatQueries] Failed to create anonymous chat log:",
      error,
    );
    return null;
  }
}

/**
 * Get anonymous chat count (for rate limiting)
 * Returns count of chats from IP in last N hours
 */
export async function getVibeChatCountByIP({
  ipAddress,
  differenceInHours = 24,
}: {
  ipAddress: string;
  differenceInHours?: number;
}): Promise<number> {
  try {
    if (!db) {
      return 0;
    }

    const cutoffTime = new Date();
    cutoffTime.setHours(cutoffTime.getHours() - differenceInHours);

    const result = await db
      .select({ count: count() })
      .from(anonymous_chat_logs)
      .where(
        and(
          eq(anonymous_chat_logs.ip_address, ipAddress),
          gte(anonymous_chat_logs.created_at, cutoffTime),
        ),
      );

    return result[0]?.count || 0;
  } catch (error) {
    console.error("[VibeChatQueries] Failed to get IP chat count:", error);
    return 0;
  }
}
