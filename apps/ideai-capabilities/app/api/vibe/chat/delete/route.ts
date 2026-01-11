/**
 * @fileoverview Delete Vibe Chat API Route
 *
 * @module VibeChatDeleteAPI
 * @description
 * Composable API route for deleting vibe chats.
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
 * POST /api/vibe/chat/delete
 *
 * Delete a vibe chat (only if user owns it)
 */
export async function POST(request: NextRequest) {
  try {
    // Get session and check authentication
    const session = await getVibeSession(request.headers);

    if (!isVibeAuthenticated(session)) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 },
      );
    }

    const { chatId } = await request.json();

    if (!chatId) {
      return NextResponse.json(
        { error: "Chat ID is required" },
        { status: 400 },
      );
    }

    // Verify chat ownership
    if (session?.user?.id) {
      const ownership = await getVibeChatOwnership({
        v0ChatId: chatId,
        userId: session.user.id,
      });

      if (!ownership) {
        return NextResponse.json(
          { error: "Chat not found or access denied" },
          { status: 403 },
        );
      }
    }

    console.log("[VibeChatDelete] Deleting chat:", chatId);

    // Delete the chat using v0 SDK
    const result = await v0Client.chats.delete({
      chatId,
    });

    console.log("[VibeChatDelete] Chat deleted successfully:", chatId);

    return NextResponse.json(result);
  } catch (error) {
    console.error("[VibeChatDelete] Error:", error);

    return NextResponse.json(
      {
        error: "Failed to delete chat",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
