/**
 * @fileoverview Create New Vibe Chat API Route
 *
 * @module VibeChatCreateAPI
 * @description
 * Composable API route for creating new vibe chats.
 * Uses fresh semantic structure and Vercel-optimized patterns.
 */

import { NextRequest, NextResponse } from "next/server";
import { v0Client } from "@/lib/vibe/utils/v0-client";
import {
  getVibeSession,
  isVibeAuthenticated,
  getVibeClientIP,
} from "@/lib/vibe/utils/auth-helpers";
import {
  createVibeChatOwnership,
  createVibeAnonymousChatLog,
} from "@/lib/vibe/db/vibe-chat-queries";
import { checkVibeRateLimit } from "@/lib/vibe/utils/rate-limiter";
import type { VibeChatCreateRequest } from "@/lib/vibe/types/vibe-types";

/**
 * POST /api/vibe/chat/create
 *
 * Create a new vibe chat conversation
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
    const body: VibeChatCreateRequest = await request.json();
    const { message, streaming = true, attachments, projectId } = body;

    if (!message?.trim()) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 },
      );
    }

    // Rate limiting (skip in development)
    const isDevelopment = process.env.NODE_ENV === "development";
    if (!isDevelopment && session?.user?.id) {
      const clientIP = getVibeClientIP(request.headers);
      const rateLimitCheck = await checkVibeRateLimit(
        session.user.id,
        clientIP,
      );

      if (!rateLimitCheck.isAllowed) {
        return NextResponse.json(
          { error: rateLimitCheck.reason },
          { status: 429 },
        );
      }
    }

    // Create chat via v0 SDK
    let chat;

    if (streaming) {
      // Streaming mode - return stream directly
      console.log("[VibeChatCreate] Creating streaming chat:", {
        message: message.substring(0, 50),
        responseMode: "experimental_stream",
      });

      try {
        chat = await v0Client.chats.create({
          message,
          responseMode: "experimental_stream",
          ...(attachments && attachments.length > 0 && { attachments }),
          ...(projectId && { projectId }),
        });

        // Verify we got a stream
        if (!(chat instanceof ReadableStream)) {
          throw new Error("Expected streaming response but got non-stream");
        }

        // Create ownership mapping (non-blocking, after stream starts)
        if (session?.user?.id) {
          // We don't have chat ID yet for new chats, so we'll handle this in the client
          // The ownership will be created when the stream completes and we get the chat ID
        }

        // Return the stream directly
        return new Response(chat as ReadableStream<Uint8Array>, {
          headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            Connection: "keep-alive",
          },
        });
      } catch (streamError) {
        console.error("[VibeChatCreate] Streaming error:", streamError);
        throw streamError;
      }
    } else {
      // Sync mode - wait for full response
      console.log("[VibeChatCreate] Creating sync chat:", {
        message: message.substring(0, 50),
        responseMode: "sync",
      });

      chat = await v0Client.chats.create({
        message,
        responseMode: "sync",
        ...(attachments && attachments.length > 0 && { attachments }),
        ...(projectId && { projectId }),
      });

      // Create ownership mapping for new chat (non-blocking)
      if (session?.user?.id && "id" in chat && chat.id) {
        await createVibeChatOwnership({
          v0ChatId: chat.id,
          userId: session.user.id,
        });

        console.log("[VibeChatCreate] Created ownership for chat:", chat.id);
      } else if (!session?.user?.id) {
        // Anonymous user - log for rate limiting
        const clientIP = getVibeClientIP(request.headers);
        if ("id" in chat && chat.id) {
          await createVibeAnonymousChatLog({
            ipAddress: clientIP,
            v0ChatId: chat.id,
          });
        }
      }

      return NextResponse.json(chat);
    }
  } catch (error) {
    console.error("[VibeChatCreate] Error:", error);

    return NextResponse.json(
      {
        error: "Failed to create chat",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
