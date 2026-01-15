/**
 * @fileoverview Menu Settings Configuration
 *
 * @module MenuSettings
 * @description
 * Centralized settings for menu behavior. These are settings (not if statements)
 * that control how menus appear and behave.
 *
 * Settings:
 * - Menu trigger mode (always, button, hover)
 * - Initial open state
 * - Whether menu is fixed open (no toggle icon)
 * - Whether toggle icon is shown in header
 */

export type MenuTriggerMode = "always" | "button" | "hover";
export type MenuInitialState = "open" | "closed";

export type MenuAnimationMode = "overlay" | "push";

/**
 * Transition easing functions
 * - ease: Standard ease (default)
 * - ease-in: Slow start
 * - ease-out: Slow end
 * - ease-in-out: Slow start and end
 * - bounce: Bouncy animation
 * - spring: Spring-like animation
 * - elastic: Elastic/rubber band effect
 */
export type MenuEasing =
  | "ease"
  | "ease-in"
  | "ease-out"
  | "ease-in-out"
  | "bounce"
  | "spring"
  | "elastic";

/**
 * Transition duration in milliseconds
 */
export type MenuDuration = number; // milliseconds

export interface MenuSettings {
  /** Animation mode for all menus */
  animationMode?: MenuAnimationMode;
  /** Transition duration for all menus (ms) */
  transitionDuration?: MenuDuration;
  /** Transition easing function for all menus */
  transitionEasing?: MenuEasing;
  /** Left menu (Controls) settings */
  leftMenu: {
    /** Trigger mode - how menu is shown */
    trigger: MenuTriggerMode;
    /** Initial state when page loads */
    initialState: MenuInitialState;
    /** If true, menu is fixed open and cannot be toggled (no icon shown) */
    fixedOpen: boolean;
    /** If true, show toggle icon in header */
    showToggleIcon: boolean;
    /** Enable swipe to close (default: true) */
    swipeToClose?: boolean;
  };
  /** Right menu (Main) settings */
  rightMenu: {
    /** Trigger mode - how menu is shown */
    trigger: MenuTriggerMode;
    /** Initial state when page loads */
    initialState: MenuInitialState;
    /** If true, menu is fixed open and cannot be toggled (no icon shown) */
    fixedOpen: boolean;
    /** If true, show toggle icon in header */
    showToggleIcon: boolean;
    /** Enable swipe to close (default: true) */
    swipeToClose?: boolean;
  };
  /** Bottom menu (Quick Nav) settings */
  bottomMenu: {
    /** Trigger mode - how menu is shown */
    trigger: MenuTriggerMode;
    /** Initial state when page loads */
    initialState: MenuInitialState;
    /** If true, menu is fixed open and cannot be toggled (no icon shown) */
    fixedOpen: boolean;
    /** If true, show toggle icon in header */
    showToggleIcon: boolean;
    /** Enable swipe to close (default: true) */
    swipeToClose?: boolean;
  };
  /** Top menu (Navigation) settings */
  topMenu: {
    /** Trigger mode - how menu is shown */
    trigger: MenuTriggerMode;
    /** Initial state when page loads */
    initialState: MenuInitialState;
    /** If true, menu is fixed open and cannot be toggled (no icon shown) */
    fixedOpen: boolean;
    /** If true, show toggle icon in header */
    showToggleIcon: boolean;
    /** Enable swipe to close (default: true) */
    swipeToClose?: boolean;
  };
}

/**
 * Default menu settings
 * These can be changed to test different configurations
 */
export const MENU_SETTINGS: MenuSettings = {
  animationMode: "overlay", // "overlay" (on top) or "push" (moves content)
  transitionDuration: 350, // milliseconds
  transitionEasing: "ease-out", // easing function
  leftMenu: {
    trigger: "button", // "button" = controlled by toggle button, "always" = always visible, "hover" = hover to show
    initialState: "closed", // Initial state when page loads
    fixedOpen: false, // Set to true to fix menu open with no toggle icon
    showToggleIcon: true, // Set to false to hide toggle icon (only applies when trigger is "button")
    swipeToClose: true, // Enable swipe to close on mobile
  },
  rightMenu: {
    trigger: "button", // "button" = controlled by toggle button, "always" = always visible, "hover" = hover to show
    initialState: "closed", // Initial state when page loads
    fixedOpen: false, // Set to true to fix menu open with no toggle icon
    showToggleIcon: true, // Set to false to hide toggle icon (only applies when trigger is "button")
    swipeToClose: true, // Enable swipe to close on mobile
  },
  bottomMenu: {
    trigger: "button", // "button" = controlled by toggle button, "always" = always visible, "hover" = hover to show
    initialState: "closed", // Initial state when page loads
    fixedOpen: false, // Set to true to fix menu open with no toggle icon
    showToggleIcon: true, // Set to false to hide toggle icon (only applies when trigger is "button")
    swipeToClose: true, // Enable swipe to close on mobile
  },
  topMenu: {
    trigger: "always", // Top menu is always visible (it's in the header area, no button needed)
    initialState: "open", // Always open when trigger is "always"
    fixedOpen: true, // Top menu is fixed open (it's part of the header)
    showToggleIcon: false, // Never show toggle icon for top menu (it's in the header, would be weird)
    swipeToClose: true, // Enable swipe to close on mobile
  },
};

/**
 * Get effective trigger mode based on settings
 * If fixedOpen is true, trigger is always "always" (no toggle possible)
 */
export function getEffectiveTrigger(
  settings:
    | MenuSettings["leftMenu"]
    | MenuSettings["rightMenu"]
    | MenuSettings["bottomMenu"]
    | MenuSettings["topMenu"],
): MenuTriggerMode {
  if (!settings) {
    return "always"; // Default fallback
  }
  if (settings.fixedOpen) {
    return "always";
  }
  return settings.trigger;
}

/**
 * Get initial open state based on settings
 */
export function getInitialOpenState(
  settings:
    | MenuSettings["leftMenu"]
    | MenuSettings["rightMenu"]
    | MenuSettings["bottomMenu"]
    | MenuSettings["topMenu"],
): boolean {
  if (!settings) {
    return true; // Default fallback
  }
  if (settings.fixedOpen) {
    return true; // Fixed open menus are always open
  }
  return settings.initialState === "open";
}

/**
 * Convert MenuEasing to CSS easing function
 */
export function getEasingFunction(easing: MenuEasing = "ease-out"): string {
  const easingMap: Record<MenuEasing, string> = {
    ease: "ease",
    "ease-in": "ease-in",
    "ease-out": "ease-out",
    "ease-in-out": "ease-in-out",
    bounce: "cubic-bezier(0.68, -0.55, 0.265, 1.55)", // Bouncy
    spring: "cubic-bezier(0.34, 1.56, 0.64, 1)", // Spring-like
    elastic: "cubic-bezier(0.68, -0.6, 0.32, 1.6)", // Elastic/rubber band
  };
  return easingMap[easing] || easingMap["ease-out"];
}
