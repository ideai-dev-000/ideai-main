/**
 * @fileoverview Type definitions for Vibe functionality
 *
 * @module VibeTypes
 * @description
 * Centralized type definitions for vibe (chat) functionality.
 * Composable, type-safe types for Vercel-optimized vibe integration.
 */

/**
 * Vibe Chat Interface
 * Represents a chat conversation with v0 SDK
 */
export interface VibeChat {
  id: string;
  name?: string;
  demo?: string;
  url?: string;
  privacy?: "private" | "public";
  messages?: VibeChatMessage[];
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Chat Message
 * Individual message in a vibe chat
 */
export interface VibeChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string | any;
  experimental_content?: any;
  createdAt?: string;
}

/**
 * Chat History Item
 * Used in UI for displaying chat messages
 */
export interface VibeChatHistoryItem {
  type: "user" | "assistant";
  content: string | any;
  isStreaming?: boolean;
  stream?: ReadableStream<Uint8Array> | null;
}

/**
 * Chat Creation Request
 * Payload for creating a new chat
 */
export interface VibeChatCreateRequest {
  message: string;
  streaming?: boolean;
  attachments?: Array<{ url: string }>;
  projectId?: string;
}

/**
 * Chat Message Request
 * Payload for sending a message to an existing chat
 */
export interface VibeChatMessageRequest {
  message: string;
  chatId: string;
  streaming?: boolean;
  attachments?: Array<{ url: string }>;
}

/**
 * Chat Ownership
 * Database model for chat ownership tracking
 */
export interface VibeChatOwnership {
  id: string;
  v0_chat_id: string;
  user_id: string;
  created_at: Date;
}

/**
 * Asset Item
 * Extracted asset from a vibe chat
 */
export interface VibeAssetItem {
  id: string;
  path: string;
  name: string;
  type: "image" | "font" | "file";
  size: number;
  url: string;
}

/**
 * Vibe Chat Status
 * Status of a chat operation
 */
export type VibeChatStatus =
  | "idle"
  | "loading"
  | "streaming"
  | "success"
  | "error";

/**
 * Vibe Streaming Handoff
 * Context for streaming chat from home to detail page
 */
export interface VibeStreamingHandoff {
  chatId: string | null;
  stream: ReadableStream<Uint8Array> | null;
  userMessage: string | null;
}
