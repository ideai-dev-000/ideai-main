/**
 * @fileoverview Fork Vibe Chat API Route
 *
 * @module VibeChatForkAPI
 * @description
 * Composable API route for forking vibe chats.
 * Uses fresh semantic structure and Vercel-optimized patterns.
 */

import { NextRequest, NextResponse } from "next/server";
import { v0Client } from "@/lib/vibe/utils/v0-client";
import {
  getVibeSession,
  isVibeAuthenticated,
} from "@/lib/vibe/utils/auth-helpers";
import { createVibeChatOwnership } from "@/lib/vibe/db/vibe-chat-queries";

/**
 * POST /api/vibe/chat/fork
 *
 * Fork an existing vibe chat
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

    const { chatId, privacy = "private" } = await request.json();

    if (!chatId) {
      return NextResponse.json(
        { error: "Chat ID is required" },
        { status: 400 },
      );
    }

    console.log("[VibeChatFork] Forking chat:", chatId);

    // Fork the chat using v0 SDK
    const forkedChat = await v0Client.chats.fork({
      chatId,
      privacy: privacy as "private" | "public",
    });

    // Create ownership mapping for forked chat (non-blocking)
    if (session?.user?.id && forkedChat.id) {
      await createVibeChatOwnership({
        v0ChatId: forkedChat.id,
        userId: session.user.id,
      });

      console.log(
        "[VibeChatFork] Created ownership for forked chat:",
        forkedChat.id,
      );
    }

    console.log("[VibeChatFork] Chat forked successfully:", forkedChat.id);

    return NextResponse.json(forkedChat);
  } catch (error) {
    console.error("[VibeChatFork] Error:", error);

    return NextResponse.json(
      {
        error: "Failed to fork chat",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
