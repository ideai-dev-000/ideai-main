/**
 * @fileoverview Update Vibe Chat Visibility API Route
 *
 * @module VibeChatVisibilityAPI
 * @description
 * Composable API route for updating vibe chat privacy/visibility.
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
 * PATCH /api/vibe/chats/[chatId]/visibility
 *
 * Update chat privacy/visibility setting
 */
export async function PATCH(
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

    // Verify chat ownership
    if (session?.user?.id) {
      const ownership = await getVibeChatOwnership({
        v0ChatId: chatId,
        userId: session.user.id,
      });

      if (!ownership || ownership.user_id !== session.user.id) {
        return NextResponse.json(
          { error: "Chat not found or access denied" },
          { status: 403 },
        );
      }
    }

    const { privacy } = await request.json();

    // Validate privacy setting
    const validPrivacyValues = [
      "public",
      "private",
      "team",
      "team-edit",
      "unlisted",
    ];
    if (!privacy || !validPrivacyValues.includes(privacy)) {
      return NextResponse.json(
        { error: "Invalid privacy setting" },
        { status: 400 },
      );
    }

    console.log(
      "[VibeChatVisibility] Changing visibility:",
      chatId,
      "to:",
      privacy,
    );

    // Update chat privacy via v0 SDK
    const updatedChat = await v0Client.chats.update({
      chatId,
      privacy: privacy as
        | "public"
        | "private"
        | "team"
        | "team-edit"
        | "unlisted",
    });

    console.log(
      "[VibeChatVisibility] Visibility changed successfully:",
      chatId,
    );

    return NextResponse.json(updatedChat);
  } catch (error) {
    console.error("[VibeChatVisibility] Error:", error);

    return NextResponse.json(
      {
        error: "Failed to change chat visibility",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
