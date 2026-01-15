/**
 * @fileoverview IdeaI Menu Main Component
 *
 * @module IdeAIMenuMain
 * @description
 * Main navigation menu variant for primary app navigation.
 *
 * **Pattern Inheritance**: Inherits all base patterns from ideai-menu:
 * - Positioning (top, bottom, left, right, floating)
 * - Triggers (always, button, hover)
 * - Touch/swipe support for mobile
 * - Pop-out animations
 * - Section management with step-based progression
 * - Context-based state management
 *
 * This component demonstrates how menu variants inherit shared patterns
 * from the parent base component, ensuring consistent UX while allowing
 * variant-specific styling and behavior.
 *
 * @example
 * ```tsx
 * // Vertical side menu with hover trigger
 * <IdeAIMenuMain position="left" trigger="hover" size={280}>
 *   <IdeAIMenuSection id="nav" title="Navigation" defaultOpen>
 *     <NavigationItems />
 *   </IdeAIMenuSection>
 * </IdeAIMenuMain>
 *
 * // Horizontal top menu
 * <IdeAIMenuMain position="top" trigger="always" size={80}>
 *   <div className="ideai-menu-body flex flex-row">
 *     <button className="ideai-menu-item-button">Home</button>
 *   </div>
 * </IdeAIMenuMain>
 * ```
 */

"use client";

import * as React from "react";
import { cn } from "../../lib/utils";
import { X, Menu as MenuIcon } from "lucide-react";
import {
  IdeAIMenuBaseProps,
  IdeAIMenuSection,
  useIdeAIMenuBase,
  getMenuPositionStyles,
  IdeAIMenuContext,
  type IdeAIMenuPosition,
  type IdeAIMenuTrigger,
} from "./ideai-menu";

export interface IdeAIMenuMainProps extends IdeAIMenuBaseProps {
  /** Position of the menu */
  position?: IdeAIMenuPosition;
  /** How the menu is triggered/shown */
  trigger?: IdeAIMenuTrigger;
  /** Show logo/branding in header */
  showLogo?: boolean;
  /** Logo component */
  logo?: React.ReactNode;
}

/**
 * IdeaI Menu Main Component
 * Main navigation menu variant
 */
export function IdeAIMenuMain({
  position = "left",
  trigger = "always",
  size = 280,
  className,
  children,
  open: openProp,
  onOpenChange: onOpenChangeProp,
  buttonLabel = "Menu",
  floatingPosition,
  title = "Menu",
  headerContent,
  showLogo = false,
  logo,
  animationMode = "overlay",
  swipeToClose = true,
  animationDuration = 300,
}: IdeAIMenuMainProps) {
  const menuRef = React.useRef<HTMLDivElement>(null);
  const contentRef = React.useRef<HTMLDivElement>(null);

  const {
    isOpen,
    isVisible,
    handleOpenChange,
    isHovered,
    setIsHovered,
    contextValue,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    animationMode: effectiveAnimationMode,
  } = useIdeAIMenuBase({
    open: openProp,
    onOpenChange: onOpenChangeProp,
    trigger,
    position,
    menuRef,
    animationMode,
    swipeToClose,
  });

  const positionStyles = getMenuPositionStyles(
    position,
    size,
    floatingPosition,
  );

  // Allow custom top offset for top-positioned menus (e.g., below header)
  const finalStyles = React.useMemo(() => {
    if (position === "top" && floatingPosition?.top !== undefined) {
      return { ...positionStyles, top: `${floatingPosition.top}px` };
    }
    return positionStyles;
  }, [position, positionStyles, floatingPosition]);

  const MenuContent = () => (
    <div
      className={cn(
        "ideai-menu-content ideai-menu-main",
        `ideai-menu--${position}`,
        isVisible && "ideai-menu--visible",
        className,
      )}
      style={
        {
          position: "fixed",
          ...finalStyles,
          zIndex: 95, // Below header (z-100) but above content (z-0)
          backgroundColor: "white", // Explicit background to ensure visibility
          "--menu-width": `${size}px`,
        } as React.CSSProperties
      }
      ref={menuRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      data-animation-mode={effectiveAnimationMode}
      data-swipe-to-close={swipeToClose}
    >
      <div className="ideai-menu-header ideai-menu-header-main">
        {headerContent || (
          <>
            {showLogo && logo && <div className="ideai-menu-logo">{logo}</div>}
            <h2 className="ideai-menu-title">{title}</h2>
            {trigger !== "always" && (
              <button
                type="button"
                className="ideai-menu-close"
                onClick={() => handleOpenChange(false)}
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </>
        )}
      </div>
      <div
        className="ideai-menu-body"
        ref={contentRef}
        data-swipeable={
          position === "top" || position === "bottom" ? "true" : "false"
        }
      >
        <IdeAIMenuContext.Provider value={contextValue}>
          {children}
        </IdeAIMenuContext.Provider>
      </div>
    </div>
  );

  return (
    <>
      {/* Backdrop Overlay (for overlay mode) */}
      {effectiveAnimationMode === "overlay" && isVisible && (
        <div
          className={cn(
            "ideai-menu-backdrop",
            isVisible && "ideai-menu-backdrop--visible",
          )}
          onClick={() => handleOpenChange(false)}
          aria-hidden="true"
        />
      )}

      {/* Trigger Button */}
      {trigger === "button" && (
        <button
          type="button"
          className={cn(
            "ideai-menu-trigger ideai-menu-trigger-main",
            `ideai-menu-trigger--${position}`,
          )}
          onClick={() => handleOpenChange(!isOpen)}
          aria-label={isOpen ? "Close menu" : "Open menu"}
        >
          <MenuIcon className="h-5 w-5" />
          {buttonLabel}
        </button>
      )}

      {/* Hover Trigger Area */}
      {trigger === "hover" && (
        <div
          className={cn(
            "ideai-menu-hover-trigger",
            `ideai-menu-hover-trigger--${position}`,
          )}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        />
      )}

      {/* Menu - Always render for CSS transitions to work */}
      <MenuContent />
    </>
  );
}

// Re-export section component for convenience
export { IdeAIMenuSection } from "./ideai-menu";
