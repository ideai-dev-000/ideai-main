/**
 * @fileoverview Sidebar Mode Adapter
 *
 * @module SidebarMode
 * @description
 * Adapter for shadcn Sidebar component (left/right menus)
 */

"use client";

import * as React from "react";
import { cn } from "../../../lib/utils";
import type { IdeAIMenuBaseProps } from "../types";
import { IdeAIMenuContext, useMenuContextValue } from "../context";

// Note: This is a placeholder - in production, import from shadcn sidebar
// import { SidebarProvider, Sidebar, SidebarContent } from "@/components/ui/sidebar";

/**
 * Sidebar Mode Component
 * Uses shadcn Sidebar for left/right positioned menus
 */
export function SidebarMode({
  position = "left",
  size = 280,
  title,
  headerContent,
  children,
  open,
  onOpenChange,
  trigger = "always",
  className,
}: IdeAIMenuBaseProps) {
  const contextValue = useMenuContextValue();

  // When trigger is "always", menu should always be visible (open state is ignored)
  // When trigger is "button" or "hover", menu visibility is controlled by open prop
  // CRITICAL: If trigger is "always", always show menu regardless of open prop
  // If trigger is "button" or "hover", use open prop (defaults to false if not provided)
  const isVisible = trigger === "always" ? true : (open ?? false);

  // Debug logging
  if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
    console.log(
      `[SidebarMode] position=${position}, trigger=${trigger}, open=${open}, isVisible=${isVisible}`,
    );
  }

  // For now, use a simple div structure
  // In production, replace with actual Sidebar components
  return (
    <IdeAIMenuContext.Provider value={contextValue}>
      <aside
        className={cn(
          "ideai-menu ideai-menu-sidebar",
          `ideai-menu--${position}`,
          isVisible ? "ideai-menu--open" : "ideai-menu--closed",
          className,
        )}
        data-menu-visible={isVisible}
        data-menu-trigger={trigger}
        data-menu-open={open}
        style={{
          width: `${size}px`,
          [position]: 0,
          top: position === "left" || position === "right" ? 64 : undefined, // Position below header (64px)
          bottom: position === "left" || position === "right" ? 0 : undefined,
          zIndex: 50,
          position: "fixed",
        }}
      >
        {(headerContent || title) && (
          <div className="ideai-menu-header">
            {headerContent || <h2 className="ideai-menu-title">{title}</h2>}
          </div>
        )}
        <div className="ideai-menu-body">{children}</div>
      </aside>
    </IdeAIMenuContext.Provider>
  );
}
