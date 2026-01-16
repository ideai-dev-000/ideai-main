/**
 * @fileoverview Drawer Mode Adapter
 *
 * @module DrawerMode
 * @description
 * Adapter for shadcn Drawer component (bottom menus)
 *
 * CRITICAL: Bottom menu must always appear above fold
 * - Fixed to viewport (position: fixed, bottom: 0)
 * - Very high z-index (9999) to stay above all content
 * - Never disappears when scrolling - stays at bottom of screen
 * - Only closes when explicitly closed by user action
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
  animationDuration = 350,
  easing = "cubic-bezier(0.16, 1, 0.3, 1)",
}: IdeAIMenuBaseProps) {
  const contextValue = useMenuContextValue();

  // Menu visibility logic:
  // - "always": Always visible (ignore open prop) - STAYS AT BOTTOM OF VIEWPORT
  // - "button": Controlled by open prop (button toggles it)
  // - "hover": Controlled by open prop (hover toggles it)
  // CRITICAL: When visible, menu must always stay fixed at bottom of viewport
  // and never disappear when scrolling - only closes when user explicitly closes it
  const isVisible =
    trigger === "always"
      ? true
      : trigger === "button"
        ? (open ?? false)
        : (open ?? false);

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
        style={
          {
            height: `${size}px`,
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 9999, // CRITICAL: Very high z-index to always stay above everything
            position: "fixed", // CRITICAL: Fixed to viewport, not document
            // Ensure it stays in viewport even when scrolling
            transform: isVisible ? "translateY(0)" : "translateY(100%)",
            // Prevent any scroll behavior from affecting it
            willChange: "transform",
            // Ensure it's always above fold
            contain: "layout style paint",
            "--ideai-menu-transition-duration": `${animationDuration}ms`,
            "--ideai-menu-easing": easing,
          } as React.CSSProperties
        }
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
