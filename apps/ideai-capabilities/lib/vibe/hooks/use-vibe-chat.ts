/**
 * @fileoverview Vibe Chat Hook
 *
 * @module UseVibeChat
 * @description
 * Composable hook for managing vibe chat state and interactions.
 * Handles message sending, streaming, and chat history.
 */

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import useSWR, { mutate } from "swr";
import type {
  VibeChat,
  VibeChatHistoryItem,
  VibeChatMessage,
} from "../types/vibe-types";

interface UseVibeChatOptions {
  chatId: string;
  onStreamComplete?: (chat: VibeChat) => void;
  onStreamingComplete?: () => void;
}

/**
 * Hook for managing a vibe chat conversation
 */
export function useVibeChat({
  chatId,
  onStreamComplete,
  onStreamingComplete,
}: UseVibeChatOptions) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [chatHistory, setChatHistory] = useState<VibeChatHistoryItem[]>([]);

  // Reset chat history when chatId changes
  useEffect(() => {
    if (chatId) {
      setChatHistory([]);
      setIsStreaming(false);
      setIsLoading(false);
      console.log(
        "[useVibeChat] Chat ID changed, resetting state for:",
        chatId,
      );
    }
  }, [chatId]);

  // Fetch chat data using vibe API route
  const {
    data: currentChat,
    error,
    isLoading: isLoadingChat,
    mutate: mutateChat,
  } = useSWR<VibeChat>(chatId ? `/api/vibe/chats/${chatId}` : null, {
    onError: (error) => {
      console.error("[useVibeChat] Error loading chat:", error);
      // Redirect to home if chat not found
      router.push("/vibe");
    },
    onSuccess: (chat) => {
      // Update chat history with existing messages when chat loads
      if (chat.messages && Array.isArray(chat.messages)) {
        console.log(
          "[useVibeChat] Loading existing chat history:",
          chat.messages.length,
          "messages for chat:",
          chatId,
        );
        setChatHistory(
          chat.messages.map((msg: VibeChatMessage) => ({
            type: msg.role,
            content: msg.experimental_content || msg.content,
          })),
        );
      }

      // Update demo URL if available
      if (chat.demo || chat.url || chat.latestVersion?.demoUrl) {
        console.log(
          "[useVibeChat] Chat demo URL:",
          chat.demo || chat.url || chat.latestVersion?.demoUrl,
        );
      }
    },
  });

  /**
   * Send a message to the chat
   */
  const sendMessage = async (
    e: React.FormEvent<HTMLFormElement>,
    attachments?: Array<{ url: string }>,
  ) => {
    e.preventDefault();
    if (!message.trim() || isLoading || !chatId) return;

    const userMessage = message.trim();
    setMessage("");
    setIsLoading(true);

    // Add user message to history
    setChatHistory((prev) => [...prev, { type: "user", content: userMessage }]);

    try {
      // Use streaming mode
      const response = await fetch("/api/vibe/chat/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage,
          chatId: chatId,
          streaming: true,
          ...(attachments && attachments.length > 0 && { attachments }),
        }),
      });

      if (!response.ok) {
        let errorMessage =
          "Sorry, there was an error processing your message. Please try again.";
        try {
          const errorData = await response.json();
          if (errorData.message || errorData.error) {
            errorMessage = errorData.message || errorData.error;
          } else if (response.status === 429) {
            errorMessage =
              "You have exceeded your maximum number of messages for the day. Please try again later.";
          }
        } catch (parseError) {
          console.error(
            "[useVibeChat] Error parsing error response:",
            parseError,
          );
          if (response.status === 429) {
            errorMessage =
              "You have exceeded your maximum number of messages for the day. Please try again later.";
          }
        }
        throw new Error(errorMessage);
      }

      if (!response.body) {
        throw new Error("No response body for streaming");
      }

      setIsStreaming(true);

      // Add placeholder for streaming response
      setChatHistory((prev) => [
        ...prev,
        {
          type: "assistant",
          content: [],
          isStreaming: true,
          stream: response.body,
        },
      ]);

      // Stream will be handled by the client component
      // This hook just manages state
    } catch (error) {
      console.error("[useVibeChat] Error:", error);

      // Remove user message and add error message
      setChatHistory((prev) => {
        const newHistory = [...prev];
        newHistory.pop(); // Remove user message
        return newHistory;
      });

      setChatHistory((prev) => [
        ...prev,
        {
          type: "assistant",
          content: `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
        },
      ]);

      setIsLoading(false);
      setIsStreaming(false);
    }
  };

  /**
   * Handle streaming completion
   */
  const handleStreamComplete = () => {
    setIsStreaming(false);
    setIsLoading(false);

    // Refresh chat data
    if (chatId) {
      mutate(`/api/vibe/chats/${chatId}`);
    }

    if (onStreamComplete && currentChat) {
      onStreamComplete(currentChat);
    }

    // Call onStreamingComplete callback if provided
    if (onStreamingComplete) {
      onStreamingComplete();
    }
  };

  return {
    message,
    setMessage,
    currentChat,
    isLoading: isLoading || isLoadingChat,
    isStreaming,
    chatHistory,
    setChatHistory,
    isLoadingChat,
    sendMessage,
    handleStreamComplete,
    handleStreamingComplete: handleStreamComplete, // Alias for compatibility
    error,
  };
}
