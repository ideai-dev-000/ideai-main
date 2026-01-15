/**
 * @fileoverview Popover Mode Adapter
 *
 * @module PopoverMode
 * @description
 * Adapter for shadcn Popover component (floating menus)
 */

"use client";

import * as React from "react";
import { cn } from "../../../lib/utils";
import type { IdeAIMenuBaseProps } from "../types";
import { IdeAIMenuContext, useMenuContextValue } from "../context";

// Note: This is a placeholder - in production, import from shadcn popover
// import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

/**
 * Popover Mode Component
 * Uses shadcn Popover for floating positioned menus
 */
export function PopoverMode({
  size = 280,
  title,
  headerContent,
  children,
  open,
  onOpenChange,
  floatingPosition,
  trigger = "button",
  buttonLabel = "Menu",
  className,
}: IdeAIMenuBaseProps) {
  const contextValue = useMenuContextValue();

  // For now, use a simple div structure
  // In production, replace with actual Popover components
  return (
    <IdeAIMenuContext.Provider value={contextValue}>
      {trigger === "button" && (
        <button
          type="button"
          onClick={() => onOpenChange?.(!open)}
          className="ideai-menu-trigger"
        >
          {buttonLabel}
        </button>
      )}
      {open && (
        <>
          <div
            className="ideai-menu-backdrop"
            onClick={() => onOpenChange?.(false)}
          />
          <div
            className={cn(
              "ideai-menu ideai-menu-popover",
              open && "ideai-menu--open",
              className,
            )}
            style={{
              width: `${size}px`,
              ...floatingPosition,
            }}
          >
            {(headerContent || title) && (
              <div className="ideai-menu-header">
                {headerContent || <h2 className="ideai-menu-title">{title}</h2>}
              </div>
            )}
            <div className="ideai-menu-body">{children}</div>
          </div>
        </>
      )}
    </IdeAIMenuContext.Provider>
  );
}
