/**
 * @fileoverview IdeaI Menu System - Main Exports
 *
 * @module IdeAIMenu
 * @description
 * Extensible, unified menu component system with shadcn integration.
 *
 * Features:
 * - Multiple display modes (Sidebar, Drawer, Navigation, Popover)
 * - Position support (Top, Bottom, Left, Right, Floating)
 * - Trigger modes (Always, Button, Hover)
 * - Animation modes (Overlay, Push)
 * - Touch support with swipe to close
 * - Section management with step-based progression
 */

// Main component
export { IdeAIMenu } from "./ideai-menu";

// Section component
export { IdeAIMenuSection, useIdeAIMenuContext } from "./section";

// Types
export type {
  IdeAIMenuPosition,
  IdeAIMenuTrigger,
  IdeAIMenuMode,
  IdeAIMenuAnimationMode,
  IdeAIMenuBaseProps,
  IdeAIMenuSectionProps,
  IdeAIMenuContextValue,
} from "./types";

// Configuration schema
export { default as menuConfigSchema } from "./menu-config.json";

// Utilities
export { getMenuPositionStyles, getMenuMode } from "./utils";

// Context (for advanced usage)
export { IdeAIMenuContext, useMenuContextValue } from "./context";

// Mode adapters (for advanced usage)
export { SidebarMode, DrawerMode, NavigationMode, PopoverMode } from "./modes";
