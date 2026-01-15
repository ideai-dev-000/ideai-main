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
import { Code, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useVibeChatsNav, type VibeChatItem } from "./use-vibe-chats-nav";

interface VibeChatsListProps {
  title?: string;
  className?: string;
}

/**
 * Vibe Chats List Component
 * Shows list of user's previous vibe chats in the side menu
 */
export function VibeChatsList({
  title = "Vibe Chats",
  className,
}: VibeChatsListProps) {
  const router = useRouter();
  const { chats, isLoading, currentChatId } = useVibeChatsNav();
  const [isExpanded, setIsExpanded] = React.useState(true);

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
    <div className={cn("ideai-side-menu-section", className)}>
      <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700">
        <button
          type="button"
          className="flex items-center gap-2 w-full text-left"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <Code className="h-4 w-4 text-slate-600 dark:text-slate-400" />
          <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            {title}
          </span>
          <ChevronRight
            className={cn(
              "h-4 w-4 ml-auto text-slate-600 dark:text-slate-400 transition-transform",
              isExpanded && "rotate-90",
            )}
          />
        </button>
      </div>
      {isExpanded && (
        <div className="ideai-side-menu-section-content">
          {isLoading ? (
            <div className="ideai-side-menu-empty">Loading chats...</div>
          ) : chatItems.length === 0 ? (
            <div className="ideai-side-menu-empty">No chats found</div>
          ) : (
            <ul className="ideai-side-menu-list">
              {chatItems.map((chat) => (
                <li key={chat.id}>
                  <div className="ideai-side-menu-item-wrapper group">
                    <button
                      type="button"
                      onClick={() => handleChatClick(chat)}
                      className={cn(
                        "ideai-side-menu-item",
                        chat.isActive && "ideai-side-menu-item--active",
                      )}
                    >
                      <span className="ideai-side-menu-item-name">
                        {chat.name}
                      </span>
                      {chat.updatedAt && (
                        <span className="ideai-side-menu-item-meta">
                          {new Date(chat.updatedAt).toLocaleDateString()}
                        </span>
                      )}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
