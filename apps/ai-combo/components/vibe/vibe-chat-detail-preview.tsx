/**
 * @fileoverview Vibe Chat Detail Preview Panel
 *
 * @module VibeChatDetailPreview
 * @description
 * Renders the preview panel for a vibe chat while chat UI lives in the sidebar.
 */

"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { VibePreviewPanel } from "./vibe-preview-panel";
import { useVibeChat } from "@/lib/vibe/hooks/use-vibe-chat";

export function VibeChatDetailPreview() {
  const params = useParams();
  const chatId = params.chatId as string;
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const { currentChat, isLoadingChat } = useVibeChat({ chatId });

  if (isLoadingChat) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-slate-600 dark:text-slate-300">Loading chat...</p>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-64px)] min-h-0 flex flex-col">
      <VibePreviewPanel
        currentChat={currentChat}
        isFullscreen={isFullscreen}
        setIsFullscreen={setIsFullscreen}
        refreshKey={refreshKey}
        setRefreshKey={setRefreshKey}
      />
    </div>
  );
}
