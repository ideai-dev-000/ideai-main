/**
 * @fileoverview IdeaI Menu Utilities
 *
 * @module IdeAIMenuUtils
 * @description
 * Utility functions for menu positioning and mode selection
 */

import type { IdeAIMenuPosition, IdeAIMenuMode } from "./types";

/**
 * Get position-based styles
 */
export function getMenuPositionStyles(
  position: IdeAIMenuPosition,
  size: number,
  floatingPosition?: {
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
  },
): React.CSSProperties {
  const baseStyles: Record<IdeAIMenuPosition, React.CSSProperties> = {
    top: {
      top: 0,
      left: 0,
      right: 0,
      height: `${size}px`,
      width: "100%",
    },
    bottom: {
      bottom: 0,
      left: 0,
      right: 0,
      height: `${size}px`,
      width: "100%",
    },
    left: {
      top: 0,
      left: 0,
      bottom: 0,
      width: `${size}px`,
      height: "100%",
    },
    right: {
      top: 0,
      right: 0,
      bottom: 0,
      width: `${size}px`,
      height: "100%",
    },
    floating: {
      ...floatingPosition,
      width: floatingPosition?.width || `${size}px`,
      maxHeight: "80vh",
    },
  };

  return baseStyles[position];
}

/**
 * Determine display mode based on position
 */
export function getMenuMode(
  position: IdeAIMenuPosition,
  mode?: IdeAIMenuMode,
): Exclude<IdeAIMenuMode, "auto"> {
  if (mode && mode !== "auto") {
    return mode;
  }

  // Auto-select based on position
  switch (position) {
    case "left":
    case "right":
      return "sidebar";
    case "bottom":
      return "drawer";
    case "top":
      return "navigation"; // Default to our minimal UI (NavigationMenu)
    case "floating":
      return "popover";
    default:
      return "sidebar";
  }
}
