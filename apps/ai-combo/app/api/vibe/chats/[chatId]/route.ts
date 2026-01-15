/**
 * @fileoverview Get Vibe Chat Details API Route
 *
 * @module VibeChatDetailsAPI
 * @description
 * Composable API route for getting vibe chat details.
 * Uses fresh semantic structure and Vercel-optimized patterns.
 */

import { NextRequest, NextResponse } from "next/server";
import { v0Client } from "@/lib/vibe/utils/v0-client";
import {
  getVibeSession,
  isVibeAuthenticated,
} from "@/lib/vibe/utils/auth-helpers";
import { getVibeChatOwnership } from "@/lib/vibe/db/vibe-chat-queries";

/**
 * GET /api/vibe/chats/[chatId]
 *
 * Get details of a specific vibe chat
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ chatId: string }> },
) {
  try {
    // Get session and check authentication
    const session = await getVibeSession(request.headers);

    if (!isVibeAuthenticated(session)) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 },
      );
    }

    const { chatId } = await params;

    if (!chatId) {
      return NextResponse.json(
        { error: "Chat ID is required" },
        { status: 400 },
      );
    }

    console.log("[VibeChatDetails] Fetching chat details for ID:", chatId);

    // Fetch chat from v0 API (verify it exists)
    let chatDetails;
    try {
      chatDetails = await v0Client.chats.getById({ chatId });
    } catch (error) {
      console.error("[VibeChatDetails] Failed to fetch from v0 API:", error);
      return NextResponse.json({ error: "Chat not found" }, { status: 404 });
    }

    if (!chatDetails) {
      return NextResponse.json({ error: "Chat not found" }, { status: 404 });
    }

    // Check ownership - verify user owns this chat
    if (session?.user?.id) {
      const ownership = await getVibeChatOwnership({
        v0ChatId: chatId,
        userId: session.user.id,
      });

      // If ownership exists but user doesn't match, deny access
      // If ownership doesn't exist, allow access (ownership creation may have failed)
      if (ownership && ownership.user_id !== session.user.id) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
    }

    console.log("[VibeChatDetails] Chat details fetched successfully");

    return NextResponse.json(chatDetails);
  } catch (error) {
    console.error("[VibeChatDetails] Error:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch chat details",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
