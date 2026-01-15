/**
 * @fileoverview Vibes API Route
 *
 * @module VibesAPI
 * @description
 * Direct route for fetching user's vibe coded chats.
 * Queries the database directly (shared with vibecoder app) and fetches chat details from v0 API.
 * This avoids cross-port cookie issues.
 */

import { NextRequest, NextResponse } from "next/server";
// Use shared auth from @repo/ideai-user for cross-app compatibility
import { auth } from "@repo/ideai-user/auth";
import { getChatIdsByUserId } from "@/lib/db/queries";
import { createClient } from "v0-sdk";

// Vibecoder app URL (for linking to chats)
const VIBECODER_URL =
  process.env.NEXT_PUBLIC_VIBECODER_URL || "http://localhost:3020";

// Create v0 client with custom baseUrl if V0_API_URL is set
const v0 = createClient(
  process.env.V0_API_URL ? { baseUrl: process.env.V0_API_URL } : {},
);

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    // Require authentication
    const isAuthenticated =
      session?.user?.id &&
      session.user.name !== "Anonymous" &&
      (!session.user.email || !session.user.email.startsWith("temp-")) &&
      !session.user.isAnonymous;

    if (!isAuthenticated) {
      console.log("[Vibes API] ❌ Not authenticated");
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 },
      );
    }

    console.log(`[Vibes API] Fetching chats for user: ${session.user.id}`);

    // Get user's chat IDs from ownership mapping (shared database)
    let userChatIds: string[] = [];
    try {
      userChatIds = await getChatIdsByUserId({ userId: session.user.id });
      console.log(`[Vibes API] Found ${userChatIds.length} chat ownerships`);
    } catch (error) {
      console.error("[Vibes API] Error getting chat IDs:", error);
      // Return empty if ownership lookup fails
      return NextResponse.json({ data: [] });
    }

    if (userChatIds.length === 0) {
      console.log("[Vibes API] No chats found for user");
      return NextResponse.json({ data: [] });
    }

    // Fetch actual chat data from v0 API
    let allChats;
    try {
      allChats = await v0.chats.find();
      console.log(
        `[Vibes API] Fetched ${allChats.data?.length || 0} chats from v0 API`,
      );
    } catch (error) {
      console.error("[Vibes API] Error fetching from v0 API:", error);
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

    console.log(`[Vibes API] ✅ Returning ${userChats.length} user chats`);
    return NextResponse.json({ data: userChats });
  } catch (error) {
    console.error("[Vibes API] Error:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch vibes",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
