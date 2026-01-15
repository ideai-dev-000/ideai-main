/**
 * @fileoverview Legacy Menu Compatibility Shims
 *
 * @module CompatibilityShims
 * @description
 * Compatibility shims for legacy menu components.
 * These re-export the new ideai-menu-000 system with old names
 * to maintain backward compatibility during migration.
 *
 * @deprecated Use ideai-menu-000 system directly:
 * - IdeAIMenuControls → IdeAIMenu with mode="sidebar" or position="left"/"right"
 * - IdeAIMenuMain → IdeAIMenu with mode="navigation" or position="top"
 */

"use client";

import {
  IdeAIMenu,
  IdeAIMenuSection,
  useIdeAIMenuContext,
  getMenuPositionStyles,
  type IdeAIMenuPosition,
  type IdeAIMenuTrigger,
  type IdeAIMenuBaseProps,
  type IdeAIMenuSectionProps,
} from "../ideai-menu-000";

/**
 * @deprecated Use IdeAIMenu with position="left" or position="right" instead
 */
export function IdeAIMenuControls(props: IdeAIMenuBaseProps) {
  // Map old IdeAIMenuControls to new IdeAIMenu
  // Default to left position if not specified
  const position = props.position || "left";
  return (
    <IdeAIMenu {...props} position={position} mode={props.mode || "sidebar"} />
  );
}

/**
 * @deprecated Use IdeAIMenu with position="top" or mode="navigation" instead
 */
export function IdeAIMenuMain(props: IdeAIMenuBaseProps) {
  // Map old IdeAIMenuMain to new IdeAIMenu
  // Default to right position if not specified
  const position = props.position || "right";
  return (
    <IdeAIMenu
      {...props}
      position={position}
      mode={props.mode || "navigation"}
    />
  );
}

// Re-export types and utilities for compatibility
export type IdeAIMenuControlsProps = IdeAIMenuBaseProps;
export type IdeAIMenuMainProps = IdeAIMenuBaseProps;

// Re-export section and context (these are compatible)
export { IdeAIMenuSection, useIdeAIMenuContext, getMenuPositionStyles };
export type {
  IdeAIMenuPosition,
  IdeAIMenuTrigger,
  IdeAIMenuBaseProps,
  IdeAIMenuSectionProps,
};
