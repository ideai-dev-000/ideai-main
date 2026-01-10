/**
 * @fileoverview Delete chat API route - protected
 *
 * @module DeleteChatRoute
 * @description
 * CRITICAL: Requires authentication. Allows authenticated users to delete their chats.
 */

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "v0-sdk";
import { auth } from "@repo/ideai-user/auth";
import { getChatOwnership } from "@/lib/db/queries";

// Create v0 client with custom baseUrl if V0_API_URL is set
const v0 = createClient(
  process.env.V0_API_URL ? { baseUrl: process.env.V0_API_URL } : {},
);

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    // CRITICAL: Require authentication - block anonymous users
    const isAuthenticated =
      session?.user &&
      session.user.name !== "Anonymous" &&
      !session.user.email?.startsWith("temp-") &&
      !session.user.isAnonymous;

    if (!isAuthenticated || !session?.user?.id) {
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

    // Check if user owns this chat
    const ownership = await getChatOwnership({ v0ChatId: chatId });
    if (!ownership || ownership.user_id !== session.user.id) {
      return NextResponse.json(
        { error: "Chat not found or access denied" },
        { status: 403 },
      );
    }

    // Delete the chat using v0 SDK
    const result = await v0.chats.delete({
      chatId,
    });

    console.log("Chat deleted successfully:", chatId);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error deleting chat:", error);
    return NextResponse.json(
      { error: "Failed to delete chat" },
      { status: 500 },
    );
  }
}
