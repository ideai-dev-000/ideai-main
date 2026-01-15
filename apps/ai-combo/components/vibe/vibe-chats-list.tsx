/**
 * @fileoverview Vibe Chats List Component for Side Menu
 *
 * @module VibeChatsList
 * @description
 * Displays a list of user's vibe chats in the side menu, similar to workflows list.
 */

"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Code } from "lucide-react";
import { cn } from "@/lib/utils";
import { useVibeChatsNav, type VibeChatItem } from "./use-vibe-chats-nav";

interface VibeChatsListProps {
  title?: string;
  className?: string;
}

/**
 * Vibe Chats List Component
 * Shows list of user's previous vibe chats in the side menu
 * Note: This component is now wrapped in IdeAIControlSection, so it only renders the list content
 */
export function VibeChatsList({
  title = "Vibe Chats",
  className,
}: VibeChatsListProps) {
  const router = useRouter();
  const { chats, isLoading, currentChatId } = useVibeChatsNav();

  // Sort chats by updatedAt (newest first) and exclude current chat
  const sortedChats = React.useMemo(() => {
    return [...chats]
      .filter((chat) => chat.id !== currentChatId) // Exclude current chat
      .sort((a, b) => {
        const dateA = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
        const dateB = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
        return dateB - dateA;
      });
  }, [chats, currentChatId]);

  // Memoize chat items to prevent re-renders
  const chatItems = React.useMemo(() => {
    return sortedChats.map((chat) => ({
      ...chat,
      isActive: false, // None should be active since we filtered out current
    }));
  }, [sortedChats]);

  const handleChatClick = React.useCallback(
    (chat: VibeChatItem) => {
      router.push(chat.href);
    },
    [router],
  );

  return (
    <div className={cn("space-y-1", className)}>
      {isLoading ? (
        <div className="text-sm text-slate-500 dark:text-slate-400 py-4">
          Loading chats...
        </div>
      ) : chatItems.length === 0 ? (
        <div className="text-sm text-slate-500 dark:text-slate-400 py-4">
          No chats found
        </div>
      ) : (
        <ul className="space-y-1">
          {chatItems.map((chat) => (
            <li key={chat.id}>
              <button
                type="button"
                onClick={() => handleChatClick(chat)}
                className={cn(
                  "w-full text-left px-3 py-2 rounded-md text-sm",
                  "hover:bg-slate-100 dark:hover:bg-slate-800",
                  "transition-colors",
                  chat.isActive && "bg-slate-100 dark:bg-slate-800 font-medium",
                )}
              >
                <div className="flex items-center gap-2">
                  <Code className="h-4 w-4 text-slate-500 dark:text-slate-400 shrink-0" />
                  <span className="truncate">{chat.name}</span>
                </div>
                {chat.updatedAt && (
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 ml-6">
                    {new Date(chat.updatedAt).toLocaleDateString()}
                  </div>
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
