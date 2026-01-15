/**
 * @fileoverview IdeaI Menu Base Component
 *
 * @module IdeAIMenu
 * @description
 * Base menu component with shared patterns for all IdeaI menu variants.
 * Provides common functionality: positioning, triggers, sections, touch support.
 *
 * **Pattern Inheritance Architecture**:
 * This is the parent component that all menu variants inherit from:
 * - `ideai-menu-main` - Main navigation menu variant
 * - `ideai-menu-controls` - Control menu variant for service UIs
 *
 * All variants inherit:
 * - Positioning system (top, bottom, left, right, floating)
 * - Trigger modes (always, button, hover)
 * - Touch/swipe support for mobile
 * - Pop-out animations
 * - Section management with step-based progression
 * - Context-based state management
 *
 * This ensures consistent UX across all menu variants while allowing
 * variant-specific styling and behavior. Code is always a pattern
 * inherited from this parent as far as possible.
 */

"use client";

import * as React from "react";
import { cn } from "../../lib/utils";
import { ChevronDown, ChevronRight, X } from "lucide-react";

/**
 * Menu Position Types
 */
export type IdeAIMenuPosition =
  | "top"
  | "bottom"
  | "left"
  | "right"
  | "floating";

/**
 * Menu Trigger Types
 */
export type IdeAIMenuTrigger = "always" | "button" | "hover";

/**
 * Base Menu Context
 * Manages section state and step-based progression
 */
export interface IdeAIMenuContextValue {
  sections: Map<string, { isOpen: boolean; isCompleted: boolean }>;
  setSectionOpen: (id: string, open: boolean) => void;
  setSectionCompleted: (id: string, completed: boolean) => void;
  registerSection: (id: string, autoOpenNext?: boolean) => void;
}

export const IdeAIMenuContext =
  React.createContext<IdeAIMenuContextValue | null>(null);

export function useIdeAIMenuContext() {
  const context = React.useContext(IdeAIMenuContext);
  if (!context) {
    throw new Error("Menu section must be used within an IdeAI Menu component");
  }
  return context;
}

/**
 * Animation Mode
 * Controls how menu interacts with content
 */
export type IdeAIMenuAnimationMode = "overlay" | "push";

/**
 * Base Menu Props
 * Shared props for all menu variants
 */
export interface IdeAIMenuBaseProps {
  /** Position of the menu */
  position?: IdeAIMenuPosition;
  /** How the menu is triggered/shown */
  trigger?: IdeAIMenuTrigger;
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
  /** Menu title */
  title?: string;
  /** Custom header content */
  headerContent?: React.ReactNode;
  /** Animation mode: overlay (on top) or push (moves content) */
  animationMode?: IdeAIMenuAnimationMode;
  /** Enable swipe to close (default: true) */
  swipeToClose?: boolean;
  /** Animation duration in ms (default: 300) */
  animationDuration?: number;
}

/**
 * Menu Section Props
 */
export interface IdeAIMenuSectionProps {
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
 * Base Menu Section Component
 * Individual collapsible section within any IdeaI menu
 */
export function IdeAIMenuSection({
  id,
  title,
  defaultOpen = false,
  isCompleted: isCompletedProp = false,
  autoOpenNext = false,
  children,
  className,
}: IdeAIMenuSectionProps) {
  const context = React.useContext(IdeAIMenuContext);
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

  // Store context functions in refs to avoid dependency issues
  const contextRef = React.useRef(context);
  React.useEffect(() => {
    contextRef.current = context;
  }, [context]);

  // Track if section has been registered to prevent infinite loops
  const hasRegisteredRef = React.useRef(false);
  const registeredIdRef = React.useRef<string | null>(null);

  // Track if we've set defaultOpen to avoid infinite loops
  const defaultOpenSetRef = React.useRef(false);

  // Register section with context on mount (only once per id)
  React.useEffect(() => {
    const currentContext = contextRef.current;
    if (
      currentContext &&
      (!hasRegisteredRef.current || registeredIdRef.current !== id)
    ) {
      currentContext.registerSection(id, autoOpenNext);
      hasRegisteredRef.current = true;
      registeredIdRef.current = id;

      // Only set defaultOpen once, and only if it's true and hasn't been set yet
      if (defaultOpen && !defaultOpenSetRef.current) {
        // Check if section is already open before setting
        const currentSection = currentContext.sections.get(id);
        if (!currentSection?.isOpen) {
          currentContext.setSectionOpen(id, true);
        }
        defaultOpenSetRef.current = true;
      }
    }
    // Only depend on id and props, not the whole context object
  }, [id, autoOpenNext, defaultOpen]);

  // Update context when isCompleted prop changes
  const prevIsCompletedRef = React.useRef(isCompletedProp);
  React.useEffect(() => {
    const currentContext = contextRef.current;
    if (currentContext && isCompletedProp !== prevIsCompletedRef.current) {
      currentContext.setSectionCompleted(id, isCompletedProp);
      prevIsCompletedRef.current = isCompletedProp;
      setLocalIsCompleted(isCompletedProp);
    }
    // Only depend on id and isCompletedProp, not the whole context object
  }, [id, isCompletedProp]);

  const handleToggle = () => {
    const newOpen = !isOpen;
    if (context) {
      context.setSectionOpen(id, newOpen);
    } else {
      setLocalIsOpen(newOpen);
    }
  };

  return (
    <div className={cn("ideai-menu-section", className)} data-section-id={id}>
      <button
        type="button"
        className="ideai-menu-section-header"
        onClick={handleToggle}
        aria-expanded={isOpen}
      >
        <span className="ideai-menu-section-title">{title}</span>
        <div className="ideai-menu-section-actions">
          {isCompleted && (
            <span
              className="ideai-menu-section-completed"
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
      {isOpen && <div className="ideai-menu-section-content">{children}</div>}
    </div>
  );
}

/**
 * Base Menu Hook
 * Provides shared menu functionality for all variants
 */
export function useIdeAIMenuBase({
  open: openProp,
  onOpenChange: onOpenChangeProp,
  trigger,
  position,
  menuRef,
  animationMode = "overlay",
  swipeToClose = true,
}: {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger: IdeAIMenuTrigger;
  position: IdeAIMenuPosition;
  menuRef: React.RefObject<HTMLDivElement>;
  animationMode?: IdeAIMenuAnimationMode;
  swipeToClose?: boolean;
}) {
  const [open, setOpen] = React.useState(false);
  const [isHovered, setIsHovered] = React.useState(false);

  // Use controlled state if provided
  const isOpen = openProp !== undefined ? openProp : open;
  const handleOpenChange =
    onOpenChangeProp !== undefined
      ? onOpenChangeProp
      : (newOpen: boolean) => setOpen(newOpen);

  // Determine visibility based on trigger mode
  // CRITICAL: If openProp is provided (controlled mode), always respect it
  // This ensures buttons always work, even when trigger="always"
  const isVisible =
    openProp !== undefined
      ? isOpen // Controlled mode: respect open state
      : trigger === "always" || isOpen || (trigger === "hover" && isHovered); // Uncontrolled mode: use trigger logic

  // Section state management for step-based progression
  const [sections, setSections] = React.useState<
    Map<
      string,
      { isOpen: boolean; isCompleted: boolean; autoOpenNext?: boolean }
    >
  >(new Map());

  const setSectionOpen = React.useCallback((id: string, open: boolean) => {
    setSections((prev) => {
      const current = prev.get(id);
      // If already in desired state, don't update
      if (current && current.isOpen === open) {
        return prev;
      }
      // Update only if state actually changed
      const next = new Map(prev);
      const sectionData = current || { isOpen: false, isCompleted: false };
      next.set(id, { ...sectionData, isOpen: open });
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
    [menuRef],
  );

  // Track registered sections to avoid unnecessary state updates
  const registeredSectionsRef = React.useRef<Map<string, boolean | undefined>>(
    new Map(),
  );

  const registerSection = React.useCallback(
    (id: string, autoOpenNext?: boolean) => {
      // Ensure ref is initialized and is a Map
      if (
        !registeredSectionsRef.current ||
        !(registeredSectionsRef.current instanceof Map)
      ) {
        registeredSectionsRef.current = new Map<string, boolean | undefined>();
      }

      // Check if already registered with same values using ref (no state dependency)
      const existingAutoOpenNext = registeredSectionsRef.current.get(id);
      if (existingAutoOpenNext === autoOpenNext) {
        // Already registered with same values - no update needed
        return;
      }

      // Update ref
      registeredSectionsRef.current.set(id, autoOpenNext);

      setSections((prev) => {
        // Only update if section doesn't exist or autoOpenNext changed
        const current = prev.get(id);
        if (!current) {
          // New section - add it
          const next = new Map(prev);
          next.set(id, {
            isOpen: false,
            isCompleted: false,
            autoOpenNext,
          });
          return next;
        } else if (
          autoOpenNext !== undefined &&
          current.autoOpenNext !== autoOpenNext
        ) {
          // Update autoOpenNext if it changed
          const next = new Map(prev);
          next.set(id, { ...current, autoOpenNext });
          return next;
        }
        // No changes needed - return same map to prevent re-render
        return prev;
      });
    },
    [], // Empty deps - function is stable
  );

  const contextValue: IdeAIMenuContextValue = React.useMemo(
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

  // Touch/swipe handlers for mobile with smooth drag feedback
  const touchStartRef = React.useRef<{
    x: number;
    y: number;
    time: number;
  } | null>(null);
  const dragOffsetRef = React.useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const touchThreshold = 50; // Minimum swipe distance
  const swipeVelocityThreshold = 0.3; // Minimum velocity for swipe (px/ms)

  const handleTouchStart = React.useCallback(
    (e: React.TouchEvent) => {
      if (!swipeToClose) return;
      touchStartRef.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
        time: Date.now(),
      };
      dragOffsetRef.current = { x: 0, y: 0 };

      // Add drag class for visual feedback
      if (menuRef.current) {
        menuRef.current.classList.add("ideai-menu--dragging");
      }
    },
    [swipeToClose, menuRef],
  );

  const handleTouchMove = React.useCallback(
    (e: React.TouchEvent) => {
      if (!swipeToClose || !touchStartRef.current || !menuRef.current) return;

      const currentTouch = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      };

      const deltaX = currentTouch.x - touchStartRef.current.x;
      const deltaY = currentTouch.y - touchStartRef.current.y;
      const absDeltaX = Math.abs(deltaX);
      const absDeltaY = Math.abs(deltaY);

      // Only allow drag in the direction that closes the menu
      if (position === "right" && deltaX < 0) {
        dragOffsetRef.current.x = deltaX;
        menuRef.current.style.transform = `translateX(${deltaX}px)`;
      } else if (position === "left" && deltaX > 0) {
        dragOffsetRef.current.x = deltaX;
        menuRef.current.style.transform = `translateX(${deltaX}px)`;
      } else if (position === "top" && deltaY > 0) {
        dragOffsetRef.current.y = deltaY;
        menuRef.current.style.transform = `translateY(${deltaY}px)`;
      } else if (position === "bottom" && deltaY < 0) {
        dragOffsetRef.current.y = deltaY;
        menuRef.current.style.transform = `translateY(${deltaY}px)`;
      }
    },
    [swipeToClose, position, menuRef],
  );

  const handleTouchEnd = React.useCallback(
    (e: React.TouchEvent) => {
      if (!swipeToClose || !touchStartRef.current || !menuRef.current) return;

      const touchEnd = {
        x: e.changedTouches[0].clientX,
        y: e.changedTouches[0].clientY,
        time: Date.now(),
      };

      const deltaX = touchEnd.x - touchStartRef.current.x;
      const deltaY = touchEnd.y - touchStartRef.current.y;
      const absDeltaX = Math.abs(deltaX);
      const absDeltaY = Math.abs(deltaY);
      const deltaTime = touchEnd.time - touchStartRef.current.time;
      const velocityX = absDeltaX / deltaTime;
      const velocityY = absDeltaY / deltaTime;

      // Remove drag class
      menuRef.current.classList.remove("ideai-menu--dragging");

      // Reset transform
      menuRef.current.style.transform = "";

      // Determine if we should close based on distance and velocity
      let shouldClose = false;

      if (position === "top" || position === "bottom") {
        // For top/bottom: horizontal swipe scrolls, vertical swipe closes
        if (absDeltaX > absDeltaY && absDeltaX > touchThreshold) {
          // Horizontal swipe - scroll menu body
          const menuBody = menuRef.current.querySelector(".ideai-menu-body");
          if (menuBody) {
            const scrollAmount = deltaX > 0 ? 200 : -200;
            menuBody.scrollBy({ left: scrollAmount, behavior: "smooth" });
          }
        } else if (
          absDeltaY > touchThreshold ||
          velocityY > swipeVelocityThreshold
        ) {
          // Vertical swipe - close menu
          if (position === "top" && deltaY > touchThreshold) {
            shouldClose = true;
          } else if (position === "bottom" && deltaY < -touchThreshold) {
            shouldClose = true;
          }
        }
      } else {
        // For left/right: vertical swipe scrolls, horizontal swipe closes
        if (absDeltaY > absDeltaX && absDeltaY > touchThreshold) {
          // Vertical swipe - scroll menu body
          const menuBody = menuRef.current.querySelector(".ideai-menu-body");
          if (menuBody) {
            const scrollAmount = deltaY > 0 ? 200 : -200;
            menuBody.scrollBy({ top: scrollAmount, behavior: "smooth" });
          }
        } else if (
          absDeltaX > touchThreshold ||
          velocityX > swipeVelocityThreshold
        ) {
          // Horizontal swipe - close menu
          if (position === "right" && deltaX < -touchThreshold) {
            shouldClose = true;
          } else if (position === "left" && deltaX > touchThreshold) {
            shouldClose = true;
          }
        }
      }

      if (shouldClose) {
        handleOpenChange(false);
      }

      touchStartRef.current = null;
      dragOffsetRef.current = { x: 0, y: 0 };
    },
    [swipeToClose, position, menuRef, handleOpenChange],
  );

  return {
    isOpen,
    isVisible,
    handleOpenChange,
    isHovered,
    setIsHovered,
    contextValue,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    animationMode,
  };

  return {
    isOpen,
    isVisible,
    handleOpenChange,
    isHovered,
    setIsHovered,
    contextValue,
    handleTouchStart,
    handleTouchEnd,
  };
}

/**
 * Position-based styles helper
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
