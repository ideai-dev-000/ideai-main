/**
 * @fileoverview Chat ownership API route - protected
 *
 * @module ChatOwnershipRoute
 * @description
 * CRITICAL: Requires authentication. Creates chat ownership mapping for authenticated users only.
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { createChatOwnership } from "@/lib/db/queries";

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

    // Authenticated user - create ownership mapping
    await createChatOwnership({
      v0ChatId: chatId,
      userId: session.user.id,
    });
    console.log("Chat ownership created via API:", chatId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to create chat ownership:", error);
    return NextResponse.json(
      { error: "Failed to create ownership record" },
      { status: 500 },
    );
  }
}
