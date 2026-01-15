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
  className,
}: IdeAIMenuBaseProps) {
  const contextValue = useMenuContextValue();

  // For now, use a simple div structure
  // In production, replace with actual Sidebar components
  return (
    <IdeAIMenuContext.Provider value={contextValue}>
      <aside
        className={cn(
          "ideai-menu ideai-menu-sidebar",
          `ideai-menu--${position}`,
          open && "ideai-menu--open",
          className,
        )}
        style={{
          width: `${size}px`,
          [position]: 0,
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
