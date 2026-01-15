/**
 * @fileoverview IdeaI Menu Components Index
 *
 * @module IdeAIMenuExports
 * @description
 * Centralized exports for all IdeaI menu components.
 * All menu variants inherit from the base ideai-menu component.
 */

// Base menu (shared patterns)
export {
  IdeAIMenuSection,
  useIdeAIMenuBase,
  useIdeAIMenuContext,
  getMenuPositionStyles,
  IdeAIMenuContext,
  type IdeAIMenuPosition,
  type IdeAIMenuTrigger,
  type IdeAIMenuContextValue,
  type IdeAIMenuBaseProps,
  type IdeAIMenuSectionProps,
} from "./ideai-menu";

// Menu variants
export {
  IdeAIMenuControls,
  type IdeAIMenuControlsProps,
} from "./ideai-menu-controls";

export { IdeAIMenuMain, type IdeAIMenuMainProps } from "./ideai-menu-main";
