/**
 * @fileoverview IdeaI Control Menu Component
 *
 * @module IdeAIControlMenu
 * @description
 * Flexible, dynamic control menu that can appear on any screen edge or float.
 * Supports sections, step-based progression, auto-scroll, and touch/swipe gestures.
 * Designed for service control UIs and dynamic module integration.
 *
 * Features:
 * - Multiple positioning: top, bottom, left, right, floating
 * - Collapsible sections with step-based progression
 * - Auto-scroll for overflow content
 * - Touch and swipe support for mobile
 * - Dynamic module registration
 * - Always open, button trigger, or hover-to-reveal modes
 *
 * @example
 * ```tsx
 * <IdeAIControlMenu position="right" trigger="button">
 *   <IdeAIControlSection title="Settings" defaultOpen>
 *     <YourControlComponent />
 *   </IdeAIControlSection>
 * </IdeAIControlMenu>
 * ```
 */

"use client";

import * as React from "react";
import { cn } from "../../lib/utils";
import {
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import { Button } from "./ui/button";

/**
 * Control Menu Context
 * Manages section state and step-based progression
 */
interface ControlMenuContextValue {
  sections: Map<string, { isOpen: boolean; isCompleted: boolean }>;
  setSectionOpen: (id: string, open: boolean) => void;
  setSectionCompleted: (id: string, completed: boolean) => void;
  registerSection: (id: string, autoOpenNext?: boolean) => void;
}

const ControlMenuContext = React.createContext<ControlMenuContextValue | null>(
  null,
);

function useControlMenuContext() {
  const context = React.useContext(ControlMenuContext);
  if (!context) {
    throw new Error("IdeAIControlSection must be used within IdeAIControlMenu");
  }
  return context;
}

export type ControlMenuPosition =
  | "top"
  | "bottom"
  | "left"
  | "right"
  | "floating";
export type ControlMenuTrigger = "always" | "button" | "hover";

export interface ControlMenuSection {
  id: string;
  title: string;
  isOpen: boolean;
  isCompleted?: boolean;
  autoOpenNext?: boolean;
  children: React.ReactNode;
}

export interface IdeAIControlMenuProps {
  /** Position of the menu */
  position?: ControlMenuPosition;
  /** How the menu is triggered/shown */
  trigger?: ControlMenuTrigger;
  /** Menu width (for left/right) or height (for top/bottom) */
  size?: number;
  /** Custom className */
  className?: string;
  /** Section content */
  children?: React.ReactNode;
  /** Control open state externally */
  open?: boolean;
  /** Callback when open state changes */
  onOpenChange?: (open: boolean) => void;
  /** Button label when trigger is "button" */
  buttonLabel?: string;
  /** Floating position (only for position="floating") */
  floatingPosition?: {
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
  };
}

interface ControlMenuSectionProps {
  /** Section ID (required for step-based progression) */
  id: string;
  /** Section title */
  title: string;
  /** Whether section is open by default */
  defaultOpen?: boolean;
  /** Whether this section is completed (for step-based progression) */
  isCompleted?: boolean;
  /** Auto-open next section when this one completes */
  autoOpenNext?: boolean;
  /** Section content */
  children?: React.ReactNode;
  /** Custom className */
  className?: string;
}

/**
 * Control Menu Section Component
 * Individual collapsible section within the control menu
 */
export function IdeAIControlSection({
  id,
  title,
  defaultOpen = false,
  isCompleted: isCompletedProp = false,
  autoOpenNext = false,
  children,
  className,
}: ControlMenuSectionProps) {
  const context = React.useContext(ControlMenuContext);
  const [localIsOpen, setLocalIsOpen] = React.useState(defaultOpen);
  const [localIsCompleted, setLocalIsCompleted] =
    React.useState(isCompletedProp);

  // Use context if available, otherwise use local state
  const isOpen = context
    ? (context.sections.get(id)?.isOpen ?? localIsOpen)
    : localIsOpen;
  const isCompleted = context
    ? (context.sections.get(id)?.isCompleted ?? localIsCompleted)
    : localIsCompleted;

  // Register section with context on mount
  React.useEffect(() => {
    if (context) {
      context.registerSection(id, autoOpenNext);
      if (defaultOpen) {
        context.setSectionOpen(id, true);
      }
    }
  }, [context, id, autoOpenNext, defaultOpen]);

  // Update context when prop changes
  React.useEffect(() => {
    if (context && isCompletedProp !== localIsCompleted) {
      context.setSectionCompleted(id, isCompletedProp);
      setLocalIsCompleted(isCompletedProp);
    }
  }, [context, id, isCompletedProp, localIsCompleted]);

  const handleToggle = () => {
    const newOpen = !isOpen;
    if (context) {
      context.setSectionOpen(id, newOpen);
    } else {
      setLocalIsOpen(newOpen);
    }
  };

  return (
    <div
      className={cn("ideai-control-section", className)}
      data-section-id={id}
    >
      <button
        type="button"
        className="ideai-control-section-header"
        onClick={handleToggle}
        aria-expanded={isOpen}
      >
        <span className="ideai-control-section-title">{title}</span>
        <div className="ideai-control-section-actions">
          {isCompleted && (
            <span
              className="ideai-control-section-completed"
              aria-label="Completed"
            >
              ✓
            </span>
          )}
          {isOpen ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </div>
      </button>
      {isOpen && (
        <div className="ideai-control-section-content">{children}</div>
      )}
    </div>
  );
}

/**
 * IdeaI Control Menu Component
 * Flexible control menu with positioning, sections, and touch support
 */
export function IdeAIControlMenu({
  position = "right",
  trigger = "button",
  size = 320,
  className,
  children,
  open: openProp,
  onOpenChange: onOpenChangeProp,
  buttonLabel = "Controls",
  floatingPosition,
}: IdeAIControlMenuProps) {
  const [open, setOpen] = React.useState(false);
  const [isHovered, setIsHovered] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);
  const contentRef = React.useRef<HTMLDivElement>(null);

  // Section state management for step-based progression
  const [sections, setSections] = React.useState<
    Map<
      string,
      { isOpen: boolean; isCompleted: boolean; autoOpenNext?: boolean }
    >
  >(new Map());

  const setSectionOpen = React.useCallback((id: string, open: boolean) => {
    setSections((prev) => {
      const next = new Map(prev);
      const current = next.get(id) || { isOpen: false, isCompleted: false };
      next.set(id, { ...current, isOpen: open });
      return next;
    });
  }, []);

  const setSectionCompleted = React.useCallback(
    (id: string, completed: boolean) => {
      setSections((prev) => {
        const next = new Map(prev);
        const current = next.get(id) || { isOpen: false, isCompleted: false };
        const updated = { ...current, isCompleted: completed };
        next.set(id, updated);

        // Auto-open next section if this one is completed and has autoOpenNext
        if (completed && current.autoOpenNext) {
          // Find next section in DOM order
          const sectionElements = Array.from(
            menuRef.current?.querySelectorAll("[data-section-id]") || [],
          );
          const currentIndex = sectionElements.findIndex(
            (el) => el.getAttribute("data-section-id") === id,
          );
          if (currentIndex >= 0 && currentIndex < sectionElements.length - 1) {
            const nextSectionId =
              sectionElements[currentIndex + 1]?.getAttribute(
                "data-section-id",
              );
            if (nextSectionId) {
              const nextSection = next.get(nextSectionId);
              if (nextSection && !nextSection.isOpen) {
                next.set(nextSectionId, { ...nextSection, isOpen: true });
              }
            }
          }
        }

        return next;
      });
    },
    [],
  );

  const registerSection = React.useCallback(
    (id: string, autoOpenNext?: boolean) => {
      setSections((prev) => {
        const next = new Map(prev);
        if (!next.has(id)) {
          next.set(id, {
            isOpen: false,
            isCompleted: false,
            autoOpenNext,
          });
        } else if (autoOpenNext !== undefined) {
          const current = next.get(id)!;
          next.set(id, { ...current, autoOpenNext });
        }
        return next;
      });
    },
    [],
  );

  const contextValue: ControlMenuContextValue = React.useMemo(
    () => ({
      sections: new Map(
        Array.from(sections.entries()).map(([id, { isOpen, isCompleted }]) => [
          id,
          { isOpen, isCompleted },
        ]),
      ),
      setSectionOpen,
      setSectionCompleted,
      registerSection,
    }),
    [sections, setSectionOpen, setSectionCompleted, registerSection],
  );

  // Use controlled state if provided
  const isOpen = openProp !== undefined ? openProp : open;
  const handleOpenChange =
    onOpenChangeProp !== undefined
      ? onOpenChangeProp
      : (newOpen: boolean) => setOpen(newOpen);

  // Determine visibility based on trigger mode
  const isVisible =
    trigger === "always" || isOpen || (trigger === "hover" && isHovered);

  // Auto-scroll to bottom when content changes
  React.useEffect(() => {
    if (contentRef.current && isVisible) {
      const scrollToBottom = () => {
        if (contentRef.current) {
          contentRef.current.scrollTop = contentRef.current.scrollHeight;
        }
      };
      // Small delay to ensure content is rendered
      const timeout = setTimeout(scrollToBottom, 100);
      return () => clearTimeout(timeout);
    }
  }, [children, isVisible]);

  // Touch/swipe handlers for mobile
  const touchStartRef = React.useRef<{ x: number; y: number } | null>(null);
  const touchThreshold = 50; // Minimum swipe distance

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartRef.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current) return;

    const touchEnd = {
      x: e.changedTouches[0].clientX,
      y: e.changedTouches[0].clientY,
    };

    const deltaX = touchEnd.x - touchStartRef.current.x;
    const deltaY = touchEnd.y - touchStartRef.current.y;

    // Determine swipe direction based on menu position
    if (position === "right" && deltaX < -touchThreshold) {
      // Swipe left to close
      handleOpenChange(false);
    } else if (position === "left" && deltaX > touchThreshold) {
      // Swipe right to close
      handleOpenChange(false);
    } else if (position === "top" && deltaY > touchThreshold) {
      // Swipe down to close
      handleOpenChange(false);
    } else if (position === "bottom" && deltaY < -touchThreshold) {
      // Swipe up to close
      handleOpenChange(false);
    }

    touchStartRef.current = null;
  };

  // Position-based styles
  const positionStyles: Record<ControlMenuPosition, React.CSSProperties> = {
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
      width: `${size}px`,
      maxHeight: "80vh",
    },
  };

  const MenuContent = () => (
    <div
      className={cn(
        "ideai-control-menu-content",
        `ideai-control-menu--${position}`,
        className,
      )}
      style={positionStyles[position]}
      ref={menuRef}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="ideai-control-menu-header">
        <h2 className="ideai-control-menu-title">Controls</h2>
        {trigger !== "always" && (
          <button
            type="button"
            className="ideai-control-menu-close"
            onClick={() => handleOpenChange(false)}
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>
      <div className="ideai-control-menu-body" ref={contentRef}>
        <ControlMenuContext.Provider value={contextValue}>
          {children}
        </ControlMenuContext.Provider>
      </div>
    </div>
  );

  return (
    <>
      {/* Trigger Button */}
      {trigger === "button" && (
        <button
          type="button"
          className={cn(
            "ideai-control-menu-trigger",
            `ideai-control-menu-trigger--${position}`,
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
            "ideai-control-menu-hover-trigger",
            `ideai-control-menu-hover-trigger--${position}`,
          )}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        />
      )}

      {/* Menu */}
      {isVisible && <MenuContent />}
    </>
  );
}
