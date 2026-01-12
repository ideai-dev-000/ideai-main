/**
 * @fileoverview Vibe Chat Detail Client Component
 *
 * @module VibeChatDetailClient
 * @description
 * Component for displaying and interacting with a specific vibe chat.
 * Uses /api/vibe/* routes and composable vibe components.
 */

"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { AppHeader } from "@/components/shared/app-header";
import { VibeChatMessages } from "./vibe-chat-messages";
import { VibeChatInput } from "./vibe-chat-input";
import { VibePreviewPanel } from "./vibe-preview-panel";
import { ResizableLayout } from "@/components/shared/resizable-layout";
import { BottomToolbar } from "@/components/shared/bottom-toolbar";
import { useVibeChat } from "@/lib/vibe/hooks/use-vibe-chat";
import { useVibeStreaming } from "@/lib/vibe/contexts/streaming-context";
import type { ImageAttachment } from "@/components/ai-elements/prompt-input";
import { clearPromptFromStorage } from "@/components/ai-elements/prompt-input";

export function VibeChatDetailClient() {
  const params = useParams();
  const chatId = params.chatId as string;
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [attachments, setAttachments] = useState<ImageAttachment[]>([]);
  const [activePanel, setActivePanel] = useState<"chat" | "preview">("chat");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { handoff, clearHandoff } = useVibeStreaming();
  const {
    message,
    setMessage,
    currentChat,
    isLoading,
    isStreaming,
    chatHistory,
    setChatHistory,
    isLoadingChat,
    sendMessage,
    handleStreamComplete,
  } = useVibeChat({
    chatId,
    onStreamingComplete: () => {
      clearHandoff();
    },
  });

  // Handle streaming handoff from home page
  useEffect(() => {
    if (handoff.chatId === chatId && handoff.stream && handoff.userMessage) {
      // Add user message
      setChatHistory((prev) => [
        ...prev,
        { type: "user", content: handoff.userMessage! },
      ]);

      // Add streaming assistant message
      setChatHistory((prev) => [
        ...prev,
        {
          type: "assistant",
          content: [],
          isStreaming: true,
          stream: handoff.stream,
        },
      ]);

      clearHandoff();
    }
  }, [handoff, chatId, clearHandoff, setChatHistory]);

  const handleSubmitWithAttachments = (
    e: React.FormEvent<HTMLFormElement>,
    attachmentUrls?: Array<{ url: string }>,
  ) => {
    clearPromptFromStorage();
    setAttachments([]);
    return sendMessage(e, attachmentUrls);
  };

  // Handle fullscreen keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isFullscreen]);

  // Auto-focus the textarea on page load
  useEffect(() => {
    if (textareaRef.current && !isLoadingChat) {
      textareaRef.current.focus();
    }
  }, [isLoadingChat]);

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-black">
      <AppHeader />

      <div className="flex-1 overflow-hidden">
        <ResizableLayout
          leftPanel={
            <div className="flex flex-col h-full">
              {isLoadingChat ? (
                <div className="flex-1 flex items-center justify-center">
                  <p className="text-gray-600 dark:text-gray-400">
                    Loading chat...
                  </p>
                </div>
              ) : (
                <>
                  <VibeChatMessages
                    chatHistory={chatHistory}
                    isLoading={isLoading || isStreaming}
                    currentChat={currentChat}
                    onStreamingComplete={handleStreamComplete}
                  />
                  <VibeChatInput
                    message={message}
                    setMessage={setMessage}
                    onSubmit={handleSubmitWithAttachments}
                    isLoading={isLoading || isStreaming}
                    attachments={attachments}
                    onAttachmentsChange={setAttachments}
                    textareaRef={textareaRef}
                  />
                </>
              )}
            </div>
          }
          rightPanel={
            <VibePreviewPanel
              currentChat={currentChat}
              isFullscreen={isFullscreen}
              setIsFullscreen={setIsFullscreen}
              refreshKey={refreshKey}
              setRefreshKey={setRefreshKey}
            />
          }
          activePanel={activePanel}
          setActivePanel={setActivePanel}
        />
      </div>
    </div>
  );
}
