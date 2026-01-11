/**
 * @fileoverview List Vibe Chats API Route
 *
 * @module VibeChatsListAPI
 * @description
 * Composable API route for listing user's vibe chats.
 * Uses fresh semantic structure and Vercel-optimized patterns.
 */

import { NextRequest, NextResponse } from "next/server";
import { v0Client } from "@/lib/vibe/utils/v0-client";
import {
  getVibeSession,
  isVibeAuthenticated,
} from "@/lib/vibe/utils/auth-helpers";
import { getVibeChatIdsByUserId } from "@/lib/vibe/db/vibe-chat-queries";

/**
 * GET /api/vibe/chats
 *
 * Get list of user's vibe chats
 */
export async function GET(request: NextRequest) {
  try {
    // Get session and check authentication
    const session = await getVibeSession(request.headers);

    if (!isVibeAuthenticated(session)) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 },
      );
    }

    console.log("[VibeChatsList] Fetching chats for user:", session.user.id);

    // Get user's chat IDs from ownership mapping
    const userChatIds = await getVibeChatIdsByUserId({
      userId: session.user.id,
    });

    console.log("[VibeChatsList] Found", userChatIds.length, "chat ownerships");

    if (userChatIds.length === 0) {
      return NextResponse.json({ data: [] });
    }

    // Fetch actual chat data from v0 API
    let allChats;
    try {
      allChats = await v0Client.chats.find();
      console.log(
        "[VibeChatsList] Fetched",
        allChats.data?.length || 0,
        "chats from v0 API",
      );
    } catch (error) {
      console.error("[VibeChatsList] Error fetching from v0 API:", error);
      return NextResponse.json(
        {
          error: "Failed to fetch chats from v0 API",
          details: error instanceof Error ? error.message : "Unknown error",
        },
        { status: 500 },
      );
    }

    // Filter to only include chats owned by this user
    const userChats =
      allChats.data?.filter((chat) => userChatIds.includes(chat.id)) || [];

    console.log("[VibeChatsList] Returning", userChats.length, "user chats");

    return NextResponse.json({ data: userChats });
  } catch (error) {
    console.error("[VibeChatsList] Error:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch chats",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
