/**
 * @fileoverview IdeaI Menu Types
 *
 * @module IdeAIMenuTypes
 * @description
 * Type definitions for the IdeaI Menu System
 */

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
 * Menu Display Mode
 * Auto selects based on position, or can be explicitly set
 */
export type IdeAIMenuMode =
  | "auto"
  | "sidebar"
  | "drawer"
  | "navigation"
  | "menubar"
  | "popover";

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
  /** Display mode - auto selects based on position */
  mode?: IdeAIMenuMode;
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
  /** Enable swipe to close on mobile (default: true) */
  swipeToClose?: boolean;
  /** Animation duration in ms (default: 350) */
  animationDuration?: number;
  /** CSS easing function (default: cubic-bezier(0.16, 1, 0.3, 1)) */
  easing?: string;
  /** Top menu options (only for position="top") */
  topMenuOptions?: {
    /** Use shadcn Menubar component instead of NavigationMenu (default: false = uses our minimal UI) */
    useMenubar?: boolean;
    /** Layout items horizontally (default: true) */
    horizontal?: boolean;
    /** Menu sticks to top when scrolling (default: false) */
    sticky?: boolean;
  };
  /** Sidebar options (only for mode="sidebar") */
  sidebarOptions?: {
    /** Sidebar collapse behavior */
    collapsible?: "offcanvas" | "icon" | "none";
    /** Sidebar visual variant */
    variant?: "sidebar" | "floating" | "inset";
  };
  /** Drawer options (only for mode="drawer") */
  drawerOptions?: {
    /** Drawer slide direction */
    direction?: "top" | "bottom" | "left" | "right";
    /** Can be dismissed by clicking outside */
    dismissible?: boolean;
    /** Show drag handle at top */
    showHandle?: boolean;
  };
  /** Popover options (only for mode="popover") */
  popoverOptions?: {
    /** Alignment relative to trigger */
    align?: "start" | "center" | "end";
    /** Which side of trigger to show popover */
    side?: "top" | "bottom" | "left" | "right";
    /** Distance from trigger in pixels */
    sideOffset?: number;
  };
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
 * Base Menu Context
 * Manages section state and step-based progression
 */
export interface IdeAIMenuContextValue {
  sections: Map<string, { isOpen: boolean; isCompleted: boolean }>;
  setSectionOpen: (id: string, open: boolean) => void;
  setSectionCompleted: (id: string, completed: boolean) => void;
  registerSection: (id: string, autoOpenNext?: boolean) => void;
}
