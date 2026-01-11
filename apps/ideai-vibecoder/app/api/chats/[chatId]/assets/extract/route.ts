/**
 * @fileoverview Extract Assets API Route
 *
 * @module ExtractAssetsAPI
 * @description
 * Extracts assets (images, fonts, etc.) from project files and saves them to
 * public/assets folder. Returns the list of extracted assets.
 */

import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";
import { auth } from "@/lib/auth";
import { getChatOwnership } from "@/lib/db/queries";

// Asset file extensions to extract
const ASSET_EXTENSIONS = [
  // Images
  ".png",
  ".jpg",
  ".jpeg",
  ".gif",
  ".svg",
  ".webp",
  ".avif",
  ".ico",
  // Fonts
  ".woff",
  ".woff2",
  ".ttf",
  ".otf",
  ".eot",
  // Other assets
  ".json",
  ".xml",
  ".txt",
];

/**
 * Check if a file path is an asset
 */
function isAssetFile(filePath: string): boolean {
  const ext = filePath.toLowerCase().match(/\.[^.]+$/)?.[0];
  return ext ? ASSET_EXTENSIONS.includes(ext) : false;
}

/**
 * Extract asset type from file extension
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
 * Extract assets from project files to public/assets folder
 */
export async function POST(
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
        { success: false, error: "Authentication required" },
        { status: 401 },
      );
    }

    // Check ownership
    const ownership = await getChatOwnership({ v0ChatId: chatId });
    if (ownership && ownership.user_id !== session.user.id) {
      return NextResponse.json(
        { success: false, error: "Forbidden" },
        { status: 403 },
      );
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
      type: "image" | "document" | "font" | "other";
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
        // Handle both text and binary content
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
        const stats = await import("fs/promises").then((fs) =>
          fs.stat(assetPath),
        );

        extractedAssets.push({
          name: fileName,
          path: assetPath,
          url: assetUrl,
          type: getAssetType(filePath),
          size: stats.size,
        });
      } catch (error) {
        console.error(`[Extract Assets] Failed to extract ${filePath}:`, error);
        // Continue with other files
      }
    }

    console.log(
      `[Extract Assets] Extracted ${extractedAssets.length} assets for chat ${chatId}`,
    );

    return NextResponse.json({
      success: true,
      assets: extractedAssets,
      count: extractedAssets.length,
    });
  } catch (error) {
    console.error("[Extract Assets] Error:", error);
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
