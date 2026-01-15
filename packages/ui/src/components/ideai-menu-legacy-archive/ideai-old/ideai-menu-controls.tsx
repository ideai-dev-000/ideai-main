/**
 * @fileoverview IdeaI Menu Controls Component
 *
 * @module IdeAIMenuControls
 * @description
 * Control menu variant for service control UIs and dynamic module integration.
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
 * <IdeAIMenuControls position="right" trigger="button">
 *   <IdeAIMenuSection id="settings" title="Settings" defaultOpen>
 *     <YourControlComponent />
 *   </IdeAIMenuSection>
 * </IdeAIMenuControls>
 * ```
 */

"use client";

import * as React from "react";
import { cn } from "../../lib/utils";
import { X } from "lucide-react";
import {
  IdeAIMenuBaseProps,
  IdeAIMenuSection,
  useIdeAIMenuBase,
  getMenuPositionStyles,
  IdeAIMenuContext,
  type IdeAIMenuPosition,
  type IdeAIMenuTrigger,
} from "./ideai-menu";

export interface IdeAIMenuControlsProps extends IdeAIMenuBaseProps {
  /** Position of the menu */
  position?: IdeAIMenuPosition;
  /** How the menu is triggered/shown */
  trigger?: IdeAIMenuTrigger;
}

/**
 * IdeaI Menu Controls Component
 * Control menu variant for service control UIs
 */
export function IdeAIMenuControls({
  position = "right",
  trigger = "button",
  size = 320,
  className,
  children,
  open: openProp,
  onOpenChange: onOpenChangeProp,
  buttonLabel = "Controls",
  floatingPosition,
  title = "Controls",
  headerContent,
  animationMode = "overlay",
  swipeToClose = true,
  animationDuration = 300,
}: IdeAIMenuControlsProps) {
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

  // Auto-scroll to bottom when content changes
  React.useEffect(() => {
    if (contentRef.current && isVisible) {
      const scrollToBottom = () => {
        if (contentRef.current) {
          contentRef.current.scrollTop = contentRef.current.scrollHeight;
        }
      };
      const timeout = setTimeout(scrollToBottom, 100);
      return () => clearTimeout(timeout);
    }
  }, [children, isVisible]);

  const positionStyles = getMenuPositionStyles(
    position,
    size,
    floatingPosition,
  );

  const MenuContent = () => (
    <div
      className={cn(
        "ideai-menu-content ideai-menu-controls",
        `ideai-menu--${position}`,
        isVisible && "ideai-menu--visible",
        className,
      )}
      style={{
        ...positionStyles,
        zIndex: 50, // Ensure menu is above other content
      }}
      ref={menuRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      data-animation-mode={effectiveAnimationMode}
      data-swipe-to-close={swipeToClose}
      style={
        {
          ...positionStyles,
          zIndex: 50,
          transitionDuration: `${animationDuration}ms`,
          "--menu-width": `${size}px`,
        } as React.CSSProperties
      }
    >
      <div className="ideai-menu-header">
        {headerContent || (
          <>
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
      <div className="ideai-menu-body" ref={contentRef}>
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
            "ideai-menu-trigger ideai-menu-trigger-controls",
            `ideai-menu-trigger--${position}`,
          )}
          onClick={() => handleOpenChange(!isOpen)}
          aria-label={isOpen ? "Close controls" : "Open controls"}
        >
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

      {/* Menu */}
      <MenuContent />
    </>
  );
}

// Re-export section component for convenience
export { IdeAIMenuSection } from "./ideai-menu";
