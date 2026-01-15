/**
 * @fileoverview IdeaI Menu - Unified Menu Component
 *
 * @module IdeAIMenu
 * @description
 * Main unified menu component that automatically selects the appropriate
 * shadcn component based on position and mode.
 *
 * This is the primary entry point for the IdeaI Menu System.
 */

"use client";

import * as React from "react";
import { getMenuMode } from "./utils";
import { SidebarMode } from "./modes/sidebar-mode";
import { DrawerMode } from "./modes/drawer-mode";
import { NavigationMode } from "./modes/navigation-mode";
import { PopoverMode } from "./modes/popover-mode";
import type { IdeAIMenuBaseProps } from "./types";

/**
 * IdeaI Menu Component
 *
 * Automatically selects the appropriate display mode based on position:
 * - Left/Right → Sidebar
 * - Bottom → Drawer
 * - Top → Navigation Menu
 * - Floating → Popover
 *
 * @example
 * ```tsx
 * <IdeAIMenu position="left" trigger="always" size={280} title="Navigation">
 *   <IdeAIMenuSection id="nav" title="Navigation" defaultOpen>
 *     {/* Menu items *\/}
 *   </IdeAIMenuSection>
 * </IdeAIMenu>
 * ```
 */
export function IdeAIMenu(props: IdeAIMenuBaseProps) {
  const { position = "right", mode } = props;
  const effectiveMode = getMenuMode(position, mode);

  // Select appropriate mode component
  switch (effectiveMode) {
    case "sidebar":
      return <SidebarMode {...props} />;
    case "drawer":
      return <DrawerMode {...props} />;
    case "navigation":
    case "menubar":
      // Both navigation and menubar use NavigationMode
      // NavigationMode handles the useMenubar option internally
      // If mode is "menubar", set useMenubar to true
      return (
        <NavigationMode
          {...props}
          topMenuOptions={{
            ...props.topMenuOptions,
            useMenubar:
              effectiveMode === "menubar" || props.topMenuOptions?.useMenubar,
          }}
        />
      );
    case "popover":
      return <PopoverMode {...props} />;
    default:
      return <SidebarMode {...props} />;
  }
}
