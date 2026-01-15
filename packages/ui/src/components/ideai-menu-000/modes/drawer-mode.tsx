/**
 * @fileoverview Drawer Mode Adapter
 *
 * @module DrawerMode
 * @description
 * Adapter for shadcn Drawer component (bottom menus)
 */

"use client";

import * as React from "react";
import { cn } from "../../../lib/utils";
import type { IdeAIMenuBaseProps } from "../types";
import { IdeAIMenuContext, useMenuContextValue } from "../context";

// Note: This is a placeholder - in production, import from shadcn drawer
// import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";

/**
 * Drawer Mode Component
 * Uses shadcn Drawer for bottom positioned menus
 */
export function DrawerMode({
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
  // In production, replace with actual Drawer components
  return (
    <IdeAIMenuContext.Provider value={contextValue}>
      {open && (
        <div
          className="ideai-menu-backdrop"
          onClick={() => onOpenChange?.(false)}
        />
      )}
      <div
        className={cn(
          "ideai-menu ideai-menu-drawer",
          open && "ideai-menu--open",
          className,
        )}
        style={{
          height: `${size}px`,
          bottom: 0,
        }}
      >
        {(headerContent || title) && (
          <div className="ideai-menu-header">
            {headerContent || <h2 className="ideai-menu-title">{title}</h2>}
          </div>
        )}
        <div className="ideai-menu-body">{children}</div>
      </div>
    </IdeAIMenuContext.Provider>
  );
}
