/**
 * @fileoverview Vibe Chats Navigation Hook
 *
 * @module UseVibeChatsNav
 * @description
 * Hook for managing vibe chats list in navigation/side menu.
 * Similar to useWorkflowNav but for vibe chats.
 */

"use client";

import { useState, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import useSWR from "swr";
import type { VibeChat } from "@/lib/vibe/types/vibe-types";

export interface VibeChatItem {
  id: string;
  name: string;
  href: string;
  updatedAt?: string;
}

interface UseVibeChatsNavReturn {
  chats: VibeChatItem[];
  isLoading: boolean;
  error: Error | undefined;
  currentChatId: string | null;
  loadChats: () => Promise<void>;
}

/**
 * Hook for managing vibe chats navigation
 */
export function useVibeChatsNav(): UseVibeChatsNavReturn {
  const router = useRouter();
  const pathname = usePathname();

  // Get current chat ID from pathname
  const currentChatId = pathname?.match(/\/vibe\/chats\/([^/]+)/)?.[1] || null;

  // Fetch chats using SWR
  const {
    data: chatsResponse,
    error,
    isLoading,
    mutate,
  } = useSWR<{ data: VibeChat[] }>("/api/vibe/chats", async (url) => {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Failed to fetch chats");
    }
    return response.json();
  });

  // Transform chats to menu items
  const chats: VibeChatItem[] =
    chatsResponse?.data?.map((chat) => ({
      id: chat.id,
      name: chat.name || `Chat ${chat.id.slice(0, 8)}`,
      href: `/vibe/chats/${chat.id}`,
      updatedAt: chat.updatedAt,
    })) || [];

  // Load chats function (for manual refresh)
  const loadChats = useCallback(async () => {
    await mutate();
  }, [mutate]);

  return {
    chats,
    isLoading,
    error,
    currentChatId,
    loadChats,
  };
}
