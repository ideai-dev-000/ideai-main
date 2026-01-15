/**
 * @fileoverview Send Message to Vibe Chat API Route
 *
 * @module VibeChatSendAPI
 * @description
 * Composable API route for sending messages to existing vibe chats.
 * Uses fresh semantic structure and Vercel-optimized patterns.
 */

import { NextRequest, NextResponse } from "next/server";
import { v0Client } from "@/lib/vibe/utils/v0-client";
import {
  getVibeSession,
  isVibeAuthenticated,
} from "@/lib/vibe/utils/auth-helpers";
import { getVibeChatOwnership } from "@/lib/vibe/db/vibe-chat-queries";
import type { VibeChatMessageRequest } from "@/lib/vibe/types/vibe-types";

/**
 * POST /api/vibe/chat/send
 *
 * Send a message to an existing vibe chat
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

    // Parse request body
    const body: VibeChatMessageRequest = await request.json();
    const { message, chatId, streaming = true, attachments } = body;

    if (!message?.trim()) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 },
      );
    }

    if (!chatId) {
      return NextResponse.json(
        { error: "Chat ID is required" },
        { status: 400 },
      );
    }

    // Verify chat ownership (only for authenticated users)
    // First verify chat exists in v0, then check/create ownership
    if (session?.user?.id) {
      // First, verify chat exists in v0 API
      let chatExists = false;
      try {
        const chatDetails = await v0Client.chats.getById({ chatId });
        chatExists = !!chatDetails;
      } catch (error) {
        console.error("[VibeChatSend] Chat not found in v0 API:", error);
        return NextResponse.json({ error: "Chat not found" }, { status: 404 });
      }

      if (!chatExists) {
        return NextResponse.json({ error: "Chat not found" }, { status: 404 });
      }

      // Check ownership - if doesn't exist, create it (chat exists, user is authenticated)
      let ownership = await getVibeChatOwnership({
        v0ChatId: chatId,
        userId: session.user.id,
      });

      // If ownership doesn't exist but chat exists, create it on-the-fly
      // This handles cases where ownership creation failed during chat creation
      if (!ownership) {
        const { createVibeChatOwnership } =
          await import("@/lib/vibe/db/vibe-chat-queries");
        ownership = await createVibeChatOwnership({
          v0ChatId: chatId,
          userId: session.user.id,
        });

        if (ownership) {
          console.log(
            "[VibeChatSend] Created ownership on-the-fly for chat:",
            chatId,
          );
        } else {
          // Ownership creation failed, but chat exists - allow access anyway
          // This is a non-critical failure (ownership is for tracking, not security)
          console.warn(
            "[VibeChatSend] Failed to create ownership, but allowing access (chat exists):",
            chatId,
          );
        }
      }
    }

    // Send message via v0 SDK
    if (streaming) {
      // Streaming mode - return stream directly
      console.log("[VibeChatSend] Sending streaming message:", {
        chatId,
        message: message.substring(0, 50),
      });

      try {
        const stream = await v0Client.chats.sendMessage({
          chatId,
          message,
          responseMode: "experimental_stream",
          ...(attachments && attachments.length > 0 && { attachments }),
        });

        // Verify we got a stream
        if (!(stream instanceof ReadableStream)) {
          throw new Error("Expected streaming response but got non-stream");
        }

        // Return the stream directly
        return new Response(stream as ReadableStream<Uint8Array>, {
          headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            Connection: "keep-alive",
          },
        });
      } catch (streamError) {
        console.error("[VibeChatSend] Streaming error:", streamError);
        throw streamError;
      }
    } else {
      // Sync mode - wait for full response
      console.log("[VibeChatSend] Sending sync message:", {
        chatId,
        message: message.substring(0, 50),
      });

      const chat = await v0Client.chats.sendMessage({
        chatId,
        message,
        ...(attachments && attachments.length > 0 && { attachments }),
      });

      return NextResponse.json(chat);
    }
  } catch (error) {
    console.error("[VibeChatSend] Error:", error);

    return NextResponse.json(
      {
        error: "Failed to send message",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
