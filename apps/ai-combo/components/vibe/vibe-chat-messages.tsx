/**
 * @fileoverview Vibe Chat Messages Component
 *
 * @module VibeChatMessages
 * @description
 * Composable chat messages component for vibe chats.
 * Uses existing ChatMessages but adapted for vibe types.
 */

"use client";

import { ChatMessages } from "@/components/chat/chat-messages";
import type {
  VibeChat,
  VibeChatHistoryItem,
} from "@/lib/vibe/types/vibe-types";

interface VibeChatMessagesProps {
  chatHistory: VibeChatHistoryItem[];
  isLoading: boolean;
  currentChat: VibeChat | null;
  onStreamingComplete: (finalContent: any) => void;
  onChatData?: (chatData: any) => void;
  onStreamingStarted?: () => void;
}

/**
 * Vibe-specific chat messages component
 * Adapts existing ChatMessages for vibe chat types
 */
export function VibeChatMessages({
  chatHistory,
  isLoading,
  currentChat,
  onStreamingComplete,
  onChatData,
  onStreamingStarted,
}: VibeChatMessagesProps) {
  // Debug logging
  console.log(
    "[VibeChatMessages] Rendering with history:",
    chatHistory.length,
    "messages",
  );

  // Convert VibeChatHistoryItem[] to ChatMessage[] format
  const adaptedHistory = chatHistory.map((item, idx) => {
    console.log(
      `[VibeChatMessages] Message ${idx}:`,
      item.type,
      typeof item.content,
      item.isStreaming ? "streaming" : "static",
    );
    return {
      type: item.type,
      content: item.content,
      isStreaming: item.isStreaming,
      stream: item.stream,
    };
  });

  // Convert VibeChat to Chat format
  const adaptedChat = currentChat
    ? {
        id: currentChat.id,
        demo: currentChat.demo,
        url: currentChat.url,
      }
    : null;

  return (
    <ChatMessages
      chatHistory={adaptedHistory}
      isLoading={isLoading}
      currentChat={adaptedChat}
      onStreamingComplete={onStreamingComplete}
      onChatData={onChatData}
      onStreamingStarted={onStreamingStarted}
    />
  );
}
