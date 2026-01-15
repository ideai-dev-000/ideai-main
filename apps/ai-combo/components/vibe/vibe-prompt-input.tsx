/**
 * @fileoverview Vibe Prompt Input Component
 *
 * @module VibePromptInput
 * @description
 * Shared prompt input component for creating new vibe chats.
 * Single source of truth - used in both home page and side menu.
 * Wraps the original prompt input logic to avoid duplication.
 */

"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  PromptInput,
  PromptInputImageButton,
  PromptInputImagePreview,
  PromptInputTextarea,
  PromptInputSubmit,
  PromptInputToolbar,
  PromptInputTools,
  createImageAttachment,
  createImageAttachmentFromStored,
  loadPromptFromStorage,
  clearPromptFromStorage,
  savePromptToStorage,
  type ImageAttachment,
} from "@/components/ai-elements/prompt-input";
import { useVibeStreaming } from "@/lib/vibe/contexts/streaming-context";

interface VibePromptInputProps {
  className?: string;
  compact?: boolean; // For side menu - smaller, more compact version
  onChatCreated?: (chatId: string) => void; // Callback when chat is created
  initialMessage?: string; // Initial message value (for suggestions)
  onMessageChange?: (message: string) => void; // Callback when message changes
}

/**
 * Vibe Prompt Input - Shared component for creating new chats
 *
 * Single source of truth for prompt logic - used in:
 * - Home page big prompt card
 * - Side menu prompt input
 */
export function VibePromptInput({
  className,
  compact = false,
  onChatCreated,
  initialMessage = "",
  onMessageChange,
}: VibePromptInputProps) {
  const router = useRouter();
  const [message, setMessage] = useState(initialMessage);
  const [isLoading, setIsLoading] = useState(false);
  const [attachments, setAttachments] = useState<ImageAttachment[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { isStreamingEnabled, startHandoff } = useVibeStreaming();

  // Handle message changes
  const handleMessageChange = (newMessage: string) => {
    setMessage(newMessage);
    if (onMessageChange) {
      onMessageChange(newMessage);
    }
  };

  // Update internal message when initialMessage prop changes
  useEffect(() => {
    if (initialMessage !== undefined) {
      setMessage(initialMessage);
    }
  }, [initialMessage]);

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

  // Auto-focus textarea on mount for compact mode
  useEffect(() => {
    if (compact && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [compact]);

  const handleSendMessage = async (
    e: React.FormEvent<HTMLFormElement>,
    attachmentUrls?: Array<{ url: string }>,
  ) => {
    e.preventDefault();
    if (!message.trim() || isLoading) return;

    const userMessage = message.trim();
    setMessage("");
    setIsLoading(true);
    clearPromptFromStorage();

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
        // Streaming mode - tee the stream so we can hand off to the detail page
        const [idStream, handoffStream] = response.body.tee();
        const reader = idStream.getReader();
        const decoder = new TextDecoder();
        let buffer = "";
        let chatIdFound = false;

        // Read stream to find chat ID
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
                  const chatId = data.id;
                  chatIdFound = true;
                  setIsLoading(false);

                  // Callback if provided
                  if (onChatCreated) {
                    onChatCreated(chatId);
                  }

                  // Hand off the stream to the detail page so streaming continues there
                  startHandoff(chatId, handoffStream, userMessage);

                  // Redirect to chat detail page
                  router.push(`/vibe/chats/${chatId}`);
                  return;
                }
              } catch (e) {
                // Ignore parse errors
              }
            }
          }
        }
        setIsLoading(false);
      } else {
        // Sync mode
        const chatData = await response.json();
        setIsLoading(false);

        if (chatData.id) {
          // Callback if provided
          if (onChatCreated) {
            onChatCreated(chatData.id);
          }

          // Redirect to chat detail page
          router.push(`/vibe/chats/${chatData.id}`);
        }
      }
    } catch (error) {
      console.error("Error creating chat:", error);
      setIsLoading(false);
      // Show error - could use toast here
      alert(error instanceof Error ? error.message : "Failed to create chat");
    }
  };

  // Save to sessionStorage when message changes
  useEffect(() => {
    if (message.trim() || attachments.length > 0) {
      savePromptToStorage({
        message,
        attachments: attachments.map((a) => ({
          id: a.id,
          url: a.url,
          file: null, // Don't store file blob
        })),
      });
    } else {
      clearPromptFromStorage();
    }
  }, [message, attachments]);

  if (compact) {
    // Compact version for side menu
    return (
      <div className={className}>
        <PromptInput onSubmit={handleSendMessage} className="w-full">
          <PromptInputImagePreview
            attachments={attachments}
            onRemove={(id) =>
              setAttachments((prev) => prev.filter((a) => a.id !== id))
            }
          />
          <PromptInputTextarea
            ref={textareaRef}
            onChange={(e) => handleMessageChange(e.target.value)}
            value={message}
            className="min-h-[80px] text-sm"
            placeholder="Describe your intent here..."
          />
          <PromptInputToolbar>
            <PromptInputTools>
              <PromptInputImageButton
                onImageSelect={async (files) => {
                  const newAttachments = await Promise.all(
                    files.map((file) => createImageAttachment(file)),
                  );
                  setAttachments((prev) => [...prev, ...newAttachments]);
                }}
              />
            </PromptInputTools>
            <PromptInputSubmit disabled={!message.trim() || isLoading} />
          </PromptInputToolbar>
        </PromptInput>
      </div>
    );
  }

  // Full version for home page
  return (
    <div className={className}>
      <PromptInput onSubmit={handleSendMessage} className="w-full">
        <PromptInputImagePreview
          attachments={attachments}
          onRemove={(id) =>
            setAttachments((prev) => prev.filter((a) => a.id !== id))
          }
        />
        <PromptInputTextarea
          ref={textareaRef}
          onChange={(e) => handleMessageChange(e.target.value)}
          value={message}
          className="min-h-[120px]"
          placeholder="Describe your intent here, upload media to assist below"
        />
        <PromptInputToolbar>
          <PromptInputTools>
            <PromptInputImageButton
              onImageSelect={async (files) => {
                const newAttachments = await Promise.all(
                  files.map((file) => createImageAttachment(file)),
                );
                setAttachments((prev) => [...prev, ...newAttachments]);
              }}
            />
          </PromptInputTools>
          <PromptInputSubmit disabled={!message.trim() || isLoading} />
        </PromptInputToolbar>
      </PromptInput>
    </div>
  );
}
