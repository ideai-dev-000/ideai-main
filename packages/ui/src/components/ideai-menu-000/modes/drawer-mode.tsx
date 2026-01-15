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
  trigger = "always",
  className,
}: IdeAIMenuBaseProps) {
  const contextValue = useMenuContextValue();

  // When trigger is "always", menu should always be visible (open state is ignored)
  // When trigger is "button" or "hover", menu visibility is controlled by open prop
  const isVisible = trigger === "always" ? true : (open ?? false);

  // For now, use a simple div structure
  // In production, replace with actual Drawer components
  return (
    <IdeAIMenuContext.Provider value={contextValue}>
      {isVisible && trigger !== "always" && (
        <div
          className={cn(
            "ideai-menu-backdrop",
            isVisible && "ideai-menu-backdrop--visible",
          )}
          onClick={() => onOpenChange?.(false)}
        />
      )}
      <div
        className={cn(
          "ideai-menu ideai-menu-drawer ideai-menu--bottom",
          isVisible && "ideai-menu--open",
          !isVisible && "ideai-menu--closed",
          className,
        )}
        style={{
          height: `${size}px`,
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 50,
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
