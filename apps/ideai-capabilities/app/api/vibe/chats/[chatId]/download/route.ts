/**
 * @fileoverview Download Vibe Chat as ZIP API Route
 *
 * @module VibeChatDownloadAPI
 * @description
 * Composable API route for downloading vibe chats as project ZIPs.
 * Uses fresh semantic structure and Vercel-optimized patterns.
 */

import { NextRequest, NextResponse } from "next/server";
import { v0Client } from "@/lib/vibe/utils/v0-client";
import {
  getVibeSession,
  isVibeAuthenticated,
} from "@/lib/vibe/utils/auth-helpers";
import { getVibeChatOwnership } from "@/lib/vibe/db/vibe-chat-queries";
import {
  extractFilesFromMessages,
  generateBasicNextJsFiles,
  sanitizeProjectName,
} from "@/lib/vibe/utils/download-utils";

/**
 * GET /api/vibe/chats/[chatId]/download
 *
 * Download a vibe chat as a project ZIP file
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

    // Fetch chat from v0 API (verify it exists)
    let chatDetails;
    try {
      chatDetails = await v0Client.chats.getById({ chatId });
    } catch (error) {
      console.error("[VibeChatDownload] Failed to fetch from v0 API:", error);
      return NextResponse.json(
        { success: false, error: "Chat not found" },
        { status: 404 },
      );
    }

    if (!chatDetails) {
      return NextResponse.json(
        { success: false, error: "Chat not found" },
        { status: 404 },
      );
    }

    // Check ownership - verify user owns this chat
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

    // Extract project name from chat
    const projectName =
      chatDetails.title || chatDetails.name || `v0-chat-${chatId.slice(0, 8)}`;
    const sanitizedName = sanitizeProjectName(projectName);

    // Extract code files from latestVersion.files (primary source)
    const extractedFiles: Record<string, string> = {};
    if (
      chatDetails.latestVersion &&
      chatDetails.latestVersion.files &&
      Array.isArray(chatDetails.latestVersion.files)
    ) {
      for (const file of chatDetails.latestVersion.files) {
        if (file.name && file.content) {
          extractedFiles[file.name] = file.content;
        }
      }
    }

    // Also try extracting from messages as fallback (for chats without latestVersion)
    if (
      Object.keys(extractedFiles).length === 0 &&
      chatDetails.messages &&
      Array.isArray(chatDetails.messages)
    ) {
      Object.assign(
        extractedFiles,
        extractFilesFromMessages(chatDetails.messages),
      );
    }

    // Combine all files
    const allFiles: Record<string, string> = {};

    // Always include basic Next.js project files
    const basicFiles = generateBasicNextJsFiles(sanitizedName);
    Object.assign(allFiles, basicFiles);

    // Add extracted code files
    Object.assign(allFiles, extractedFiles);

    // If no code files were extracted, create a basic app/page.tsx
    if (Object.keys(extractedFiles).length === 0) {
      allFiles["app/page.tsx"] = `export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">${projectName}</h1>
        <p className="text-gray-600">Generated from v0 chat</p>
      </div>
    </main>
  );
}
`;
      allFiles["app/layout.tsx"] = `import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "${projectName}",
  description: "Generated from v0 chat",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
`;
    }

    console.log("[VibeChatDownload] Prepared download for chat:", chatId);

    return NextResponse.json({
      success: true,
      files: allFiles,
      projectName: sanitizedName,
    });
  } catch (error) {
    console.error("[VibeChatDownload] Error:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to prepare chat download",
      },
      { status: 500 },
    );
  }
}
