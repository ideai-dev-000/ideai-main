/**
 * @fileoverview Navigation Mode Adapter
 *
 * @module NavigationMode
 * @description
 * Adapter for shadcn NavigationMenu or Menubar component (top menus)
 * Default: Uses our minimal UI code
 * Option: Can use shadcn Menubar via topMenuOptions.useMenubar
 */

"use client";

import * as React from "react";
import { cn } from "../../../lib/utils";
import type { IdeAIMenuBaseProps } from "../types";
import { IdeAIMenuContext, useMenuContextValue } from "../context";

// Note: In production, import from shadcn components when useMenubar is true
// import { NavigationMenu, NavigationMenuList, NavigationMenuItem } from "@/components/ui/navigation-menu";
// import { Menubar, MenubarMenu, MenubarTrigger } from "@/components/ui/menubar";

/**
 * Navigation Mode Component
 * Uses shadcn NavigationMenu (default) or Menubar (optional) for top positioned menus
 */
export function NavigationMode({
  size = 80,
  title,
  headerContent,
  children,
  open = true,
  trigger = "always",
  className,
  topMenuOptions,
}: IdeAIMenuBaseProps) {
  const contextValue = useMenuContextValue();
  const useMenubar = topMenuOptions?.useMenubar ?? false;
  const isSticky = topMenuOptions?.sticky ?? false;

  // When trigger is "always", menu should always be visible (open state is ignored)
  // When trigger is "button" or "hover", menu visibility is controlled by open prop
  const isVisible = trigger === "always" ? true : (open ?? true);

  // If useMenubar is true, use shadcn Menubar component
  // Otherwise, use our minimal UI (default)
  if (useMenubar) {
    // TODO: Replace with actual Menubar component from shadcn
    // For now, use placeholder structure
    return (
      <IdeAIMenuContext.Provider value={contextValue}>
        <nav
          className={cn(
            "ideai-menu ideai-menu-navigation ideai-menu-menubar",
            isVisible && "ideai-menu--open",
            !isVisible && "ideai-menu--closed",
            isSticky && "ideai-menu--sticky",
            className,
          )}
          style={{
            height: `${size}px`,
            top: 0,
          }}
        >
          {(headerContent || title) && (
            <div className="ideai-menu-header">
              {headerContent || <h2 className="ideai-menu-title">{title}</h2>}
            </div>
          )}
          <div className="ideai-menu-body ideai-menu-body--horizontal ideai-menu-body--menubar">
            {children}
          </div>
        </nav>
      </IdeAIMenuContext.Provider>
    );
  }

  // Default: Our minimal UI (NavigationMenu structure)
  // Check if className includes overrides for inline/header use
  const isInline = className?.includes("!relative");

  return (
    <IdeAIMenuContext.Provider value={contextValue}>
      <nav
        className={cn(
          "ideai-menu ideai-menu-navigation ideai-menu--top",
          isVisible && "ideai-menu--open",
          !isVisible && "ideai-menu--closed",
          isSticky && "ideai-menu--sticky",
          className,
        )}
        style={
          isInline
            ? undefined // Let className handle positioning for inline
            : {
                height: `${size}px`,
                top: 0,
                left: 0,
                right: 0,
                zIndex: 50,
              }
        }
      >
        {(headerContent || title) && !isInline && (
          <div className="ideai-menu-header">
            {headerContent || <h2 className="ideai-menu-title">{title}</h2>}
          </div>
        )}
        <div
          className={cn(
            "ideai-menu-body ideai-menu-body--horizontal",
            isInline && "!p-0", // Remove padding for inline header use
          )}
        >
          {children}
        </div>
      </nav>
    </IdeAIMenuContext.Provider>
  );
}
