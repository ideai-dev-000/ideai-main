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

export interface MenuSettings {
  /** Animation mode for all menus */
  animationMode?: MenuAnimationMode;
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
  leftMenu: {
    trigger: "always",
    initialState: "open",
    fixedOpen: false, // Set to true to fix menu open with no toggle icon
    showToggleIcon: true, // Set to false to hide toggle icon
    swipeToClose: true, // Enable swipe to close on mobile
  },
  rightMenu: {
    trigger: "always",
    initialState: "open",
    fixedOpen: false, // Set to true to fix menu open with no toggle icon
    showToggleIcon: true, // Set to false to hide toggle icon
    swipeToClose: true, // Enable swipe to close on mobile
  },
  bottomMenu: {
    trigger: "always",
    initialState: "open",
    fixedOpen: false, // Set to true to fix menu open with no toggle icon
    showToggleIcon: true, // Set to false to hide toggle icon
    swipeToClose: true, // Enable swipe to close on mobile
  },
  topMenu: {
    trigger: "always",
    initialState: "open",
    fixedOpen: false, // Set to true to fix menu open with no toggle icon
    showToggleIcon: true, // Set to false to hide toggle icon
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
