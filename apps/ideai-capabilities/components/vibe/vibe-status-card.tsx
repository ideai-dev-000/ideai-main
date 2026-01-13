/**
 * @fileoverview Vibe Status Card Component for Sidebar
 *
 * @module VibeStatusCard
 * @description
 * Status card that shows current vibe chat information at the top of the sidebar.
 * Similar to WorkflowStatusCard but for vibe chats.
 */

"use client";

import { Home } from "lucide-react";
import { useVibeChatsNav } from "./use-vibe-chats-nav";
import { useRouter, usePathname } from "next/navigation";

/**
 * Vibe Status Card - displays at top of sidebar
 * Shows current vibe chat info and provides navigation
 */
export function VibeStatusCard() {
  const router = useRouter();
  const pathname = usePathname();
  const { chats, currentChatId } = useVibeChatsNav();

  // Find current chat
  const currentChat = chats.find((chat) => chat.id === currentChatId);

  // Check if we're on a specific chat page or the vibe home page
  const isOnChatPage = currentChatId !== null;
  const isOnVibeHome = pathname === "/vibe";

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
          Vibe Status
        </h3>
        <button
          type="button"
          onClick={() => {
            router.push("/");
          }}
          className="h-7 w-7 p-0 rounded-md text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="Go to landing page"
        >
          <Home className="h-4 w-4" />
        </button>
      </div>

      {/* Current Vibe Info */}
      <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm p-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">
            {isOnChatPage ? "Current Chat" : "Vibe Home"}
          </span>
        </div>
        <div className="space-y-2">
          <p className="text-base font-semibold text-slate-900 dark:text-slate-100 truncate">
            {currentChat?.name ||
              (isOnVibeHome ? "Start New Chat" : "No Chat Selected")}
          </p>
          {currentChat?.updatedAt && (
            <div className="text-sm text-slate-600 dark:text-slate-400">
              Updated {new Date(currentChat.updatedAt).toLocaleDateString()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
