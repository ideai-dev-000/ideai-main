import { NextRequest, NextResponse } from "next/server";
import { createClient } from "v0-sdk";
import { auth } from "@/lib/auth";
import { getChatOwnership } from "@/lib/db/queries";

// Create v0 client with custom baseUrl if V0_API_URL is set
const v0 = createClient(
  process.env.V0_API_URL ? { baseUrl: process.env.V0_API_URL } : {},
);

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ chatId: string }> },
) {
  try {
    // Timeout wrapper for session lookup to prevent hangs
    let session = null;
    try {
      const sessionPromise = auth.api.getSession({
        headers: request.headers,
      });
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Session lookup timeout")), 3000),
      );
      session = await Promise.race([sessionPromise, timeoutPromise]);
    } catch (error) {
      // Fail gracefully if session lookup times out
      console.warn("[Chat Details API] Session lookup failed:", error);
      session = null;
    }
    const { chatId } = await params;

    console.log("Fetching chat details for ID:", chatId);

    if (!chatId) {
      return NextResponse.json(
        { error: "Chat ID is required" },
        { status: 400 },
      );
    }

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

    // Try to fetch chat from v0 API first (verify it exists)
    let chatDetails;
    try {
      chatDetails = await v0.chats.getById({ chatId });
    } catch (error) {
      console.error("Failed to fetch chat from v0 API:", error);
      return NextResponse.json({ error: "Chat not found" }, { status: 404 });
    }

    if (!chatDetails) {
      return NextResponse.json({ error: "Chat not found" }, { status: 404 });
    }

    // Check ownership - if ownership record exists, verify user owns it
    // If ownership record doesn't exist, allow access if authenticated (ownership creation may have failed)
    try {
      const ownership = await getChatOwnership({ v0ChatId: chatId });
      if (ownership && ownership.user_id !== session.user.id) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
      // If ownership exists and user matches, or if ownership doesn't exist, allow access
    } catch (error) {
      console.error("Error checking chat ownership:", error);
      // If ownership check fails, allow access if authenticated (fail open)
      // This handles cases where ownership creation failed but user created the chat
    }

    console.log("Chat details fetched:", chatDetails);

    return NextResponse.json(chatDetails);
  } catch (error) {
    console.error("Error fetching chat details:", error);

    // Log more detailed error information
    if (error instanceof Error) {
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }

    return NextResponse.json(
      {
        error: "Failed to fetch chat details",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
