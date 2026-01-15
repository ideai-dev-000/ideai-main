/**
 * @fileoverview Asset Extraction Utilities
 *
 * @module VibeAssetUtils
 * @description
 * Utilities for extracting and managing assets from vibe chats.
 * Composable functions for asset processing.
 */

import { join } from "path";
import { writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import type { VibeAssetItem } from "../types/vibe-types";

/**
 * Asset file extensions to extract
 */
export const ASSET_EXTENSIONS = [
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
  ".md",
];

/**
 * Check if a file path is an asset
 */
export function isAssetFile(filePath: string): boolean {
  const ext = filePath.toLowerCase().match(/\.[^.]+$/)?.[0];
  return ext ? ASSET_EXTENSIONS.includes(ext) : false;
}

/**
 * Extract asset type from file extension
 */
export function getAssetType(filePath: string): "image" | "font" | "file" {
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

  return "file";
}

/**
 * Decode base64 content
 */
export function decodeBase64(base64: string): Buffer {
  // Remove data URL prefix if present (e.g., "data:image/png;base64,")
  const base64Data = base64.includes(",") ? base64.split(",")[1] : base64;

  return Buffer.from(base64Data, "base64");
}

/**
 * Save asset file to public/assets folder
 */
export async function saveAssetFile(
  chatId: string,
  filePath: string,
  content: string | Buffer,
): Promise<string> {
  // Get public assets directory
  const publicDir = join(process.cwd(), "public", "assets", chatId);

  // Ensure directory exists
  if (!existsSync(publicDir)) {
    await mkdir(publicDir, { recursive: true });
  }

  // Clean file path (remove leading slashes, normalize)
  const cleanPath = filePath.replace(/^\/+/, "").replace(/\.\./g, "");
  const fullPath = join(publicDir, cleanPath);

  // Ensure parent directory exists
  const parentDir = join(fullPath, "..");
  if (!existsSync(parentDir)) {
    await mkdir(parentDir, { recursive: true });
  }

  // Convert base64 string to buffer if needed
  const buffer =
    typeof content === "string" && content.startsWith("data:")
      ? decodeBase64(content)
      : typeof content === "string"
        ? Buffer.from(content, "utf-8")
        : content;

  // Write file
  await writeFile(fullPath, buffer);

  // Return relative path for URL
  return `/assets/${chatId}/${cleanPath}`;
}

/**
 * List all assets for a chat
 */
export async function listChatAssets(chatId: string): Promise<VibeAssetItem[]> {
  const assetsDir = join(process.cwd(), "public", "assets", chatId);

  if (!existsSync(assetsDir)) {
    return [];
  }

  // This would need to read the directory and return asset items
  // For now, return empty array - implementation depends on how we want to structure
  // the asset listing (could use a database or just read filesystem)
  return [];
}
