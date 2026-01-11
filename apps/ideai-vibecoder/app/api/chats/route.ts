import { NextRequest, NextResponse } from "next/server";
import { createClient } from "v0-sdk";
import { auth } from "@/lib/auth";
import { getChatIdsByUserId } from "@/lib/db/queries";

// Create v0 client with custom baseUrl if V0_API_URL is set
const v0 = createClient(
  process.env.V0_API_URL ? { baseUrl: process.env.V0_API_URL } : {},
);

export async function GET(request: NextRequest) {
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

    console.log("[Chats API] Fetching chats for user:", session.user.id);

    // Get user's chat IDs from our ownership mapping
    let userChatIds: string[] = [];
    try {
      userChatIds = await getChatIdsByUserId({ userId: session.user.id });
      console.log("[Chats API] Found", userChatIds.length, "chat ownerships");
    } catch (error) {
      console.error("[Chats API] Error getting chat IDs:", error);
      // Return empty if ownership lookup fails
      return NextResponse.json({ data: [] });
    }

    if (userChatIds.length === 0) {
      console.log("[Chats API] No chats found for user");
      return NextResponse.json({ data: [] });
    }

    // Fetch actual chat data from v0 API
    let allChats;
    try {
      allChats = await v0.chats.find();
      console.log(
        "[Chats API] Fetched",
        allChats.data?.length || 0,
        "chats from v0 API",
      );
    } catch (error) {
      console.error("[Chats API] Error fetching from v0 API:", error);
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

    console.log("[Chats API] Returning", userChats.length, "user chats");

    return NextResponse.json({ data: userChats });
  } catch (error) {
    console.error("Chats fetch error:", error);

    // Log more detailed error information
    if (error instanceof Error) {
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }

    return NextResponse.json(
      {
        error: "Failed to fetch chats",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
