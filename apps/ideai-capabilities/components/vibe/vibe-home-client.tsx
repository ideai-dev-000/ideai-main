/**
 * @fileoverview Vibe Home Client Component
 *
 * @module VibeHomeClient
 * @description
 * Main vibe interface for creating new chats.
 * Uses /api/vibe/* routes and composable vibe components.
 */

"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  PromptInput,
  PromptInputImageButton,
  PromptInputImagePreview,
  PromptInputMicButton,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputToolbar,
  PromptInputTools,
  createImageAttachment,
  createImageAttachmentFromStored,
  savePromptToStorage,
  loadPromptFromStorage,
  clearPromptFromStorage,
  type ImageAttachment,
} from "@/components/ai-elements/prompt-input";
import { Suggestions, Suggestion } from "@/components/ai-elements/suggestion";
import { AppHeader } from "@/components/shared/app-header";
import { VibeChatMessages } from "./vibe-chat-messages";
import { VibeChatInput } from "./vibe-chat-input";
import { VibePreviewPanel } from "./vibe-preview-panel";
import { ResizableLayout } from "@/components/shared/resizable-layout";
import { BottomToolbar } from "@/components/shared/bottom-toolbar";
import { useVibeStreaming } from "@/lib/vibe/contexts/streaming-context";
import type {
  VibeChat,
  VibeChatHistoryItem,
} from "@/lib/vibe/types/vibe-types";

// Component that uses useSearchParams - needs to be wrapped in Suspense
function SearchParamsHandler({ onReset }: { onReset: () => void }) {
  const searchParams = useSearchParams();

  useEffect(() => {
    const reset = searchParams.get("reset");
    if (reset === "true") {
      onReset();
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete("reset");
      window.history.replaceState({}, "", newUrl.pathname);
    }
  }, [searchParams, onReset]);

  return null;
}

export function VibeHomeClient() {
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showChatInterface, setShowChatInterface] = useState(false);
  const [attachments, setAttachments] = useState<ImageAttachment[]>([]);
  const [chatHistory, setChatHistory] = useState<VibeChatHistoryItem[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [currentChat, setCurrentChat] = useState<VibeChat | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [activePanel, setActivePanel] = useState<"chat" | "preview">("chat");
  const router = useRouter();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { isStreamingEnabled, startHandoff } = useVibeStreaming();

  const handleReset = () => {
    setShowChatInterface(false);
    setChatHistory([]);
    setCurrentChatId(null);
    setCurrentChat(null);
    setMessage("");
    setAttachments([]);
    setIsLoading(false);
    setIsFullscreen(false);
    setRefreshKey((prev) => prev + 1);
    clearPromptFromStorage();
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    }, 0);
  };

  // Restore from sessionStorage on mount
  useEffect(() => {
    const storedData = loadPromptFromStorage();
    if (storedData) {
      setMessage(storedData.message);
      if (storedData.attachments.length > 0) {
        const restoredAttachments = storedData.attachments.map(
          createImageAttachmentFromStored,
        );
        setAttachments(restoredAttachments);
      }
    }
  }, []);

  const handleSendMessage = async (
    e: React.FormEvent<HTMLFormElement>,
    attachmentUrls?: Array<{ url: string }>,
  ) => {
    e.preventDefault();
    if (!message.trim() || isLoading) return;

    const userMessage = message.trim();
    setMessage("");
    setIsLoading(true);
    setShowChatInterface(true);
    clearPromptFromStorage();

    // Add user message to history
    setChatHistory((prev) => [...prev, { type: "user", content: userMessage }]);

    try {
      // Use vibe API route
      const response = await fetch("/api/vibe/chat/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage,
          streaming: isStreamingEnabled,
          ...(attachmentUrls &&
            attachmentUrls.length > 0 && { attachments: attachmentUrls }),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error || errorData.message || "Failed to create chat",
        );
      }

      if (isStreamingEnabled && response.body) {
        // Streaming mode
        setIsLoading(false);

        // Add streaming placeholder
        setChatHistory((prev) => [
          ...prev,
          {
            type: "assistant",
            content: [],
            isStreaming: true,
            stream: response.body,
          },
        ]);

        // For streaming, the stream will be handled by the client component
        // We need to let the stream flow and extract chat ID from the stream
        // The chat detail page will handle the actual streaming display

        // Read stream to find chat ID, then redirect
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";
        let chatIdFound = false;

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              try {
                const data = JSON.parse(line.slice(6));
                if (data.id && !chatIdFound) {
                  // Found chat ID - redirect to chat detail page with stream
                  const chatId = data.id;
                  chatIdFound = true;
                  setCurrentChatId(chatId);

                  // Start handoff for streaming continuation
                  // Note: response.body may be consumed, need to recreate stream
                  // For now, redirect and let chat detail page handle it
                  router.push(`/vibe/chats/${chatId}`);
                  return;
                }
              } catch (e) {
                // Ignore parse errors
              }
            }
          }
        }

        // If we didn't find chat ID in stream, stay on home page
        // User can manually navigate if needed
      } else {
        // Sync mode
        const chatData = await response.json();
        setIsLoading(false);

        if (chatData.id) {
          setCurrentChatId(chatData.id);
          setCurrentChat({
            id: chatData.id,
            demo: chatData.demo || chatData.latestVersion?.demoUrl,
          });
          router.push(`/vibe/chats/${chatData.id}`);
        }
      }
    } catch (error) {
      console.error("Error creating chat:", error);
      setIsLoading(false);
      setChatHistory((prev) => [
        ...prev,
        {
          type: "assistant",
          content: `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
        },
      ]);
    }
  };

  const handleStreamingComplete = (finalContent: any) => {
    setChatHistory((prev) => {
      const updated = [...prev];
      const lastIndex = updated.length - 1;
      if (lastIndex >= 0 && updated[lastIndex].isStreaming) {
        updated[lastIndex] = {
          ...updated[lastIndex],
          content: finalContent,
          isStreaming: false,
          stream: undefined,
        };
      }
      return updated;
    });
    setIsLoading(false);
  };

  return (
    <>
      <Suspense fallback={null}>
        <SearchParamsHandler onReset={handleReset} />
      </Suspense>

      <div className="flex flex-col h-screen bg-gray-50 dark:bg-black">
        <AppHeader />

        <div className="flex-1 overflow-hidden">
          {showChatInterface ? (
            <ResizableLayout
              leftPanel={
                <div className="flex flex-col h-full">
                  <VibeChatMessages
                    chatHistory={chatHistory}
                    isLoading={
                      isLoading ||
                      (chatHistory.length > 0 &&
                        chatHistory[chatHistory.length - 1]?.isStreaming)
                    }
                    currentChat={currentChat}
                    onStreamingComplete={handleStreamingComplete}
                  />
                  <VibeChatInput
                    message={message}
                    setMessage={setMessage}
                    onSubmit={handleSendMessage}
                    isLoading={isLoading}
                    attachments={attachments}
                    onAttachmentsChange={setAttachments}
                    textareaRef={textareaRef}
                  />
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
          ) : (
            <div className="flex flex-col items-center justify-center h-full max-w-3xl mx-auto px-4">
              <h1 className="text-4xl font-bold mb-4 text-center">
                Vibe Coding
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 text-center">
                Generate React components with beautiful UIs through natural
                conversation
              </p>

              <div className="w-full">
                <PromptInput onSubmit={handleSendMessage} className="w-full">
                  <PromptInputImagePreview
                    attachments={attachments}
                    onRemove={(id) =>
                      setAttachments((prev) => prev.filter((a) => a.id !== id))
                    }
                  />
                  <PromptInputTextarea
                    ref={textareaRef}
                    onChange={(e) => setMessage(e.target.value)}
                    value={message}
                    className="min-h-[120px]"
                    placeholder="Describe the UI you want to build..."
                  />
                  <PromptInputToolbar>
                    <PromptInputTools>
                      <PromptInputImageButton
                        onImageSelect={async (files) => {
                          const newAttachments = await Promise.all(
                            files.map((file) => createImageAttachment(file)),
                          );
                          setAttachments((prev) => [
                            ...prev,
                            ...newAttachments,
                          ]);
                        }}
                      />
                    </PromptInputTools>
                    <PromptInputSubmit
                      disabled={!message.trim() || isLoading}
                    />
                  </PromptInputToolbar>
                </PromptInput>
              </div>

              <Suggestions>
                <Suggestion
                  onClick={() => {
                    setMessage("Create a todo app with a clean, modern design");
                  }}
                  suggestion="Todo app"
                />
                <Suggestion
                  onClick={() => {
                    setMessage("Build a dashboard with charts and statistics");
                  }}
                  suggestion="Dashboard"
                />
                <Suggestion
                  onClick={() => {
                    setMessage("Make a landing page for a SaaS product");
                  }}
                  suggestion="Landing page"
                />
              </Suggestions>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
