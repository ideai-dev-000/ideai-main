/**
 * @fileoverview Extract Assets from Vibe Chat API Route
 *
 * @module VibeAssetsExtractAPI
 * @description
 * Composable API route for extracting assets from vibe chat files.
 * Uses fresh semantic structure and Vercel-optimized patterns.
 */

import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir, stat } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";
import {
  getVibeSession,
  isVibeAuthenticated,
} from "@/lib/vibe/utils/auth-helpers";
import { getVibeChatOwnership } from "@/lib/vibe/db/vibe-chat-queries";
import { isAssetFile, getAssetType } from "@/lib/vibe/utils/asset-utils";

/**
 * POST /api/vibe/chats/[chatId]/assets/extract
 *
 * Extract assets (images, fonts, etc.) from project files
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ chatId: string }> },
) {
  try {
    // Get session and check authentication
    const session = await getVibeSession(request.headers);

    if (!isVibeAuthenticated(session)) {
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 },
      );
    }

    const { chatId } = await params;

    if (!chatId) {
      return NextResponse.json(
        { success: false, error: "Chat ID is required" },
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
        return NextResponse.json(
          { success: false, error: "Forbidden" },
          { status: 403 },
        );
      }
    }

    // Get request body
    const body = await request.json();
    const { files, projectName } = body;

    if (!files || typeof files !== "object") {
      return NextResponse.json(
        { success: false, error: "Files are required" },
        { status: 400 },
      );
    }

    // Create assets directory
    const assetsDir = join(process.cwd(), "public", "assets", chatId);
    if (!existsSync(assetsDir)) {
      await mkdir(assetsDir, { recursive: true });
    }

    // Extract assets from files
    const extractedAssets: Array<{
      name: string;
      path: string;
      url: string;
      type: "image" | "font" | "file";
      size: number;
    }> = [];

    for (const [filePath, content] of Object.entries(files)) {
      // Skip if not an asset file
      if (!isAssetFile(filePath)) continue;

      // Skip if it's already in assets folder
      if (filePath.startsWith("public/assets/")) continue;

      // Skip if it's a code file (already in src/ or app/)
      if (filePath.startsWith("src/") || filePath.startsWith("app/")) {
        // Only extract if it's in an assets subdirectory
        if (!filePath.includes("/assets/") && !filePath.includes("/public/")) {
          continue;
        }
      }

      try {
        // Extract filename from path
        const fileName = filePath.split("/").pop() || filePath;
        const assetFileName = `${Date.now()}-${fileName}`;
        const assetPath = join(assetsDir, assetFileName);
        const assetUrl = `/assets/${chatId}/${assetFileName}`;

        // Write asset file
        if (typeof content === "string") {
          // Check if it's base64 encoded binary
          if (content.match(/^data:.*;base64,/)) {
            const base64Data = content.split(",")[1];
            const buffer = Buffer.from(base64Data, "base64");
            await writeFile(assetPath, buffer);
          } else {
            // Text content
            await writeFile(assetPath, content, "utf-8");
          }
        } else if (Buffer.isBuffer(content)) {
          await writeFile(assetPath, content);
        } else {
          // Convert to string and write
          await writeFile(assetPath, String(content), "utf-8");
        }

        // Get file size
        const stats = await stat(assetPath);

        extractedAssets.push({
          name: fileName,
          path: assetPath,
          url: assetUrl,
          type: getAssetType(filePath),
          size: stats.size,
        });
      } catch (error) {
        console.error(
          `[VibeAssetsExtract] Failed to extract ${filePath}:`,
          error,
        );
        // Continue with other files
      }
    }

    console.log(
      `[VibeAssetsExtract] Extracted ${extractedAssets.length} assets for chat ${chatId}`,
    );

    return NextResponse.json({
      success: true,
      assets: extractedAssets,
      count: extractedAssets.length,
    });
  } catch (error) {
    console.error("[VibeAssetsExtract] Error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to extract assets",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
