/**
 * @fileoverview List Assets for Vibe Chat API Route
 *
 * @module VibeAssetsListAPI
 * @description
 * Composable API route for listing extracted assets from a vibe chat.
 * Uses fresh semantic structure and Vercel-optimized patterns.
 */

import { NextRequest, NextResponse } from "next/server";
import { readdir, stat } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";
import {
  getVibeSession,
  isVibeAuthenticated,
} from "@/lib/vibe/utils/auth-helpers";
import { getVibeChatOwnership } from "@/lib/vibe/db/vibe-chat-queries";
import { getAssetType } from "@/lib/vibe/utils/asset-utils";

/**
 * GET /api/vibe/chats/[chatId]/assets
 *
 * Get list of extracted assets for a chat
 */
export async function GET(
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

      if (ownership && ownership.user_id !== session.user.id) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
    }

    // Check if assets directory exists
    const assetsDir = join(process.cwd(), "public", "assets", chatId);
    if (!existsSync(assetsDir)) {
      return NextResponse.json({
        assets: [],
        count: 0,
      });
    }

    // Read assets directory
    const files = await readdir(assetsDir);
    const assets: Array<{
      id: string;
      name: string;
      path: string;
      url: string;
      type: "image" | "font" | "file";
      size: number;
    }> = [];

    for (const file of files) {
      try {
        const filePath = join(assetsDir, file);
        const stats = await stat(filePath);

        // Skip directories
        if (stats.isDirectory()) continue;

        // Remove timestamp prefix from filename for display
        const displayName = file.replace(/^\d+-/, "");

        assets.push({
          id: file, // Use filename as ID
          name: displayName,
          path: filePath,
          url: `/assets/${chatId}/${file}`,
          type: getAssetType(file),
          size: stats.size,
        });
      } catch (error) {
        console.error(`[VibeAssetsList] Failed to read ${file}:`, error);
        // Continue with other files
      }
    }

    // Sort by name
    assets.sort((a, b) => a.name.localeCompare(b.name));

    console.log(
      `[VibeAssetsList] Found ${assets.length} assets for chat ${chatId}`,
    );

    return NextResponse.json({
      assets,
      count: assets.length,
    });
  } catch (error) {
    console.error("[VibeAssetsList] Error:", error);

    return NextResponse.json(
      {
        error: "Failed to get assets",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
