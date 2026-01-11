/**
 * @fileoverview Get Assets API Route
 *
 * @module GetAssetsAPI
 * @description
 * Returns the list of extracted assets for a chat from the public/assets folder.
 */

import { NextRequest, NextResponse } from "next/server";
import { readdir, stat } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";
import { auth } from "@/lib/auth";
import { getChatOwnership } from "@/lib/db/queries";

/**
 * Get asset type from file extension
 */
function getAssetType(
  filePath: string,
): "image" | "document" | "font" | "other" {
  const ext = filePath.toLowerCase().match(/\.[^.]+$/)?.[0] || "";
  if (
    [
      ".png",
      ".jpg",
      ".jpeg",
      ".gif",
      ".svg",
      ".webp",
      ".avif",
      ".ico",
    ].includes(ext)
  ) {
    return "image";
  }
  if ([".woff", ".woff2", ".ttf", ".otf", ".eot"].includes(ext)) {
    return "font";
  }
  if ([".json", ".xml", ".txt", ".md"].includes(ext)) {
    return "document";
  }
  return "other";
}

/**
 * Get list of extracted assets
 */
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ chatId: string }> },
) {
  try {
    const { chatId } = await context.params;
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    // Check authentication
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 },
      );
    }

    // Check ownership
    const ownership = await getChatOwnership({ v0ChatId: chatId });
    if (ownership && ownership.user_id !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
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
      name: string;
      path: string;
      url: string;
      type: "image" | "document" | "font" | "other";
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
          name: displayName,
          path: filePath,
          url: `/assets/${chatId}/${file}`,
          type: getAssetType(file),
          size: stats.size,
        });
      } catch (error) {
        console.error(`[Get Assets] Failed to read ${file}:`, error);
        // Continue with other files
      }
    }

    // Sort by name
    assets.sort((a, b) => a.name.localeCompare(b.name));

    return NextResponse.json({
      assets,
      count: assets.length,
    });
  } catch (error) {
    console.error("[Get Assets] Error:", error);
    return NextResponse.json(
      {
        error: "Failed to get assets",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
