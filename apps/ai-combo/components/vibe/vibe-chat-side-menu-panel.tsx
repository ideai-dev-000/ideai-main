/**
 * @fileoverview Vibe Chat Side Menu Panel
 *
 * @module VibeChatSideMenuPanel
 * @description
 * Self-contained chat UI component that can be embedded in the IdeaI side menu.
 * Works on both /vibe (home) and /vibe/chats/[chatId] (detail) pages.
 * Preserves all functionality and hooks from the original vibe chat UI.
 */

"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import {
  useRouter,
  usePathname,
  useParams,
  useSearchParams,
} from "next/navigation";
import { VibeChatMessages } from "./vibe-chat-messages";
import { VibeChatInput } from "./vibe-chat-input";
import { useVibeChat } from "@/lib/vibe/hooks/use-vibe-chat";
import { useVibeStreaming } from "@/lib/vibe/contexts/streaming-context";
import type {
  VibeChat,
  VibeChatHistoryItem,
} from "@/lib/vibe/types/vibe-types";
import type { ImageAttachment } from "@/components/ai-elements/prompt-input";
import {
  createImageAttachment,
  createImageAttachmentFromStored,
  savePromptToStorage,
  loadPromptFromStorage,
  clearPromptFromStorage,
} from "@/components/ai-elements/prompt-input";

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

/**
 * Vibe Chat Side Menu Panel
 *
 * Self-contained chat UI that works on both home and detail pages.
 * All state and hooks are preserved from the original implementation.
 */
export function VibeChatSideMenuPanel() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const chatId = params.chatId as string | undefined;
  const isOnChatDetailPage = Boolean(chatId);
  const isOnVibeHome = pathname === "/vibe";

  // Shared state (for home page)
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showChatInterface, setShowChatInterface] = useState(false);
  const [attachments, setAttachments] = useState<ImageAttachment[]>([]);
  const [chatHistory, setChatHistory] = useState<VibeChatHistoryItem[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [currentChat, setCurrentChat] = useState<VibeChat | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { isStreamingEnabled, startHandoff } = useVibeStreaming();

  // Use vibe chat hook for detail pages
  const vibeChatHook = useVibeChat({
    chatId: chatId || "",
    onStreamingComplete: () => {
      // Handle streaming complete
    },
  });

  // Determine which state/hooks to use based on page
  const activeMessage = isOnChatDetailPage ? vibeChatHook.message : message;
  const activeSetMessage = isOnChatDetailPage
    ? vibeChatHook.setMessage
    : setMessage;
  const activeChatHistory = isOnChatDetailPage
    ? vibeChatHook.chatHistory
    : chatHistory;
  const activeSetChatHistory = isOnChatDetailPage
    ? vibeChatHook.setChatHistory
    : setChatHistory;
  const activeCurrentChat = isOnChatDetailPage
    ? vibeChatHook.currentChat
    : currentChat;
  const activeIsLoading = isOnChatDetailPage
    ? vibeChatHook.isLoading
    : isLoading;
  const activeIsStreaming = isOnChatDetailPage
    ? vibeChatHook.isStreaming
    : false;
  const activeIsLoadingChat = isOnChatDetailPage
    ? vibeChatHook.isLoadingChat
    : false;
  const activeSendMessage = isOnChatDetailPage
    ? vibeChatHook.sendMessage
    : undefined;
  const activeHandleStreamComplete = isOnChatDetailPage
    ? vibeChatHook.handleStreamComplete
    : undefined;

  // Restore from sessionStorage on mount (home page only)
  useEffect(() => {
    if (!isOnChatDetailPage) {
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
    }
  }, [isOnChatDetailPage]);

  // Handle reset (home page only)
  const handleReset = () => {
    if (isOnChatDetailPage) return;

    setShowChatInterface(false);
    setChatHistory([]);
    setCurrentChatId(null);
    setCurrentChat(null);
    setMessage("");
    setAttachments([]);
    setIsLoading(false);
    clearPromptFromStorage();
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    }, 0);
  };

  // Handle send message for home page
  const handleSendMessage = async (
    e: React.FormEvent<HTMLFormElement>,
    attachmentUrls?: Array<{ url: string }>,
  ) => {
    if (isOnChatDetailPage) {
      // Use detail page handler
      if (activeSendMessage) {
        clearPromptFromStorage();
        setAttachments([]);
        return activeSendMessage(e, attachmentUrls);
      }
      return;
    }

    // Home page handler
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
        setIsLoading(false);
        setChatHistory((prev) => [
          ...prev,
          {
            type: "assistant",
            content: [],
            isStreaming: true,
            stream: response.body,
          },
        ]);
      } else {
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

  // Handle streaming complete for home page
  const handleStreamingComplete = (finalContent: any) => {
    if (isOnChatDetailPage) {
      if (activeHandleStreamComplete) {
        activeHandleStreamComplete(finalContent);
      }
      return;
    }

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

  // Handle chat data callback for home page
  const handleChatData = (chatData: any) => {
    if (isOnChatDetailPage) return;

    if (chatData?.id && !currentChatId) {
      setCurrentChatId(chatData.id);
      setCurrentChat((prev) =>
        prev
          ? { ...prev, id: chatData.id, demo: chatData.demo || chatData.url }
          : { id: chatData.id, demo: chatData.demo || chatData.url },
      );
    }
  };

  // Auto-focus textarea for detail pages
  useEffect(() => {
    if (isOnChatDetailPage && textareaRef.current && !activeIsLoadingChat) {
      textareaRef.current.focus();
    }
  }, [isOnChatDetailPage, activeIsLoadingChat]);

  // Handle streaming handoff for detail pages
  const { handoff, clearHandoff } = useVibeStreaming();
  useEffect(() => {
    if (
      isOnChatDetailPage &&
      handoff.chatId === chatId &&
      handoff.stream &&
      handoff.userMessage
    ) {
      activeSetChatHistory((prev) => {
        // Avoid duplicate user message
        const hasUserMessage = prev.some(
          (msg) => msg.type === "user" && msg.content === handoff.userMessage,
        );
        if (hasUserMessage) return prev;
        return [...prev, { type: "user", content: handoff.userMessage! }];
      });

      activeSetChatHistory((prev) => {
        // Avoid duplicate streaming message
        const hasStreaming = prev.some((msg) => msg.isStreaming);
        if (hasStreaming) return prev;
        return [
          ...prev,
          {
            type: "assistant",
            content: [],
            isStreaming: true,
            stream: handoff.stream,
          },
        ];
      });

      clearHandoff();
    }
  }, [isOnChatDetailPage, handoff, chatId, clearHandoff, activeSetChatHistory]);

  // Show loading state for detail pages
  if (isOnChatDetailPage && activeIsLoadingChat) {
    return (
      <div className="flex flex-col h-full">
        <div className="flex-1 flex items-center justify-center">
          <p className="text-slate-600 dark:text-slate-400 text-sm">
            Loading chat...
          </p>
        </div>
      </div>
    );
  }

  // Chat UI ONLY shows on detail pages (/vibe/chats/[chatId])
  // Home page will show prompt input instead (see ideai-side-menu-wrapper.tsx)
  if (!isOnChatDetailPage) {
    // On home page - don't show chat UI
    // Prompt input is handled separately in side menu wrapper
    return null;
  }

  return (
    <>
      {!isOnChatDetailPage && (
        <Suspense fallback={null}>
          <SearchParamsHandler onReset={handleReset} />
        </Suspense>
      )}
      <div className="flex flex-col h-full border-t border-slate-200 dark:border-slate-700 mt-auto pointer-events-auto">
        <div className="flex-1 overflow-y-auto min-h-0">
          <VibeChatMessages
            chatHistory={activeChatHistory}
            isLoading={
              activeIsLoading ||
              activeIsStreaming ||
              (activeChatHistory.length > 0 &&
                activeChatHistory[activeChatHistory.length - 1]?.isStreaming)
            }
            currentChat={activeCurrentChat}
            onStreamingComplete={handleStreamingComplete}
            onChatData={handleChatData}
          />
        </div>
        <div className="border-t border-slate-200 dark:border-slate-700 flex-shrink-0">
          <VibeChatInput
            message={activeMessage}
            setMessage={activeSetMessage}
            onSubmit={(e) => {
              if (isOnChatDetailPage) {
                handleSendMessage(
                  e,
                  attachments.length > 0
                    ? attachments.map((a) => ({ url: a.url }))
                    : undefined,
                );
              } else {
                handleSendMessage(
                  e,
                  attachments.length > 0
                    ? attachments.map((a) => ({ url: a.url }))
                    : undefined,
                );
              }
            }}
            isLoading={activeIsLoading || activeIsStreaming}
            attachments={attachments}
            onAttachmentsChange={setAttachments}
            textareaRef={textareaRef}
          />
        </div>
      </div>
    </>
  );
}
