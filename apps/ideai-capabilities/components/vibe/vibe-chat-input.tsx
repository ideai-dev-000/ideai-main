/**
 * @fileoverview Vibe Chat Input Component
 *
 * @module VibeChatInput
 * @description
 * Composable chat input component for vibe chats.
 * Wraps existing ChatInput but uses vibe-specific API routes.
 */

"use client";

import { ChatInput } from "@/components/chat/chat-input";
import type { ImageAttachment } from "@/components/ai-elements/prompt-input";

interface VibeChatInputProps {
  message: string;
  setMessage: (message: string) => void;
  onSubmit: (
    e: React.FormEvent<HTMLFormElement>,
    attachments?: Array<{ url: string }>,
  ) => void;
  isLoading: boolean;
  showSuggestions?: boolean;
  attachments?: ImageAttachment[];
  onAttachmentsChange?: (attachments: ImageAttachment[]) => void;
  textareaRef?: React.RefObject<HTMLTextAreaElement | null>;
}

/**
 * Vibe-specific chat input component
 * Uses the same UI as ChatInput but for vibe conversations
 */
export function VibeChatInput({
  message,
  setMessage,
  onSubmit,
  isLoading,
  showSuggestions = false,
  attachments = [],
  onAttachmentsChange,
  textareaRef,
}: VibeChatInputProps) {
  return (
    <ChatInput
      message={message}
      setMessage={setMessage}
      onSubmit={onSubmit}
      isLoading={isLoading}
      showSuggestions={showSuggestions}
      attachments={attachments}
      onAttachmentsChange={onAttachmentsChange}
      textareaRef={textareaRef}
    />
  );
}
