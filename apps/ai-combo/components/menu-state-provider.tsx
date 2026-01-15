/**
 * @fileoverview Menu State Provider
 *
 * @module MenuStateProvider
 * @description
 * Provides global state management for left and right menus.
 * Uses settings from menu-settings.ts to control initial state and behavior.
 */

"use client";

import * as React from "react";
import { MENU_SETTINGS, getInitialOpenState } from "@/lib/menu-settings";

// Prevent hydration mismatch by initializing state on client only
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? React.useLayoutEffect : React.useEffect;

interface MenuStateContextValue {
  leftMenuOpen: boolean;
  rightMenuOpen: boolean;
  bottomMenuOpen: boolean;
  topMenuOpen: boolean;
  setLeftMenuOpen: (open: boolean) => void;
  setRightMenuOpen: (open: boolean) => void;
  setBottomMenuOpen: (open: boolean) => void;
  setTopMenuOpen: (open: boolean) => void;
  leftMenuSettings: typeof MENU_SETTINGS.leftMenu;
  rightMenuSettings: typeof MENU_SETTINGS.rightMenu;
  bottomMenuSettings: typeof MENU_SETTINGS.bottomMenu;
  topMenuSettings: typeof MENU_SETTINGS.topMenu;
}

const MenuStateContext = React.createContext<MenuStateContextValue | null>(
  null,
);

export function useMenuState() {
  const context = React.useContext(MenuStateContext);
  if (!context) {
    throw new Error("useMenuState must be used within MenuStateProvider");
  }
  return context;
}

export function MenuStateProvider({ children }: { children: React.ReactNode }) {
  // Initialize state to prevent hydration mismatch
  // Start with all menus closed, then set to correct state after mount
  const [leftMenuOpen, setLeftMenuOpen] = React.useState(false);
  const [rightMenuOpen, setRightMenuOpen] = React.useState(false);
  const [bottomMenuOpen, setBottomMenuOpen] = React.useState(false);
  const [topMenuOpen, setTopMenuOpen] = React.useState(false);

  // Set initial state after mount to prevent hydration mismatch
  useIsomorphicLayoutEffect(() => {
    setLeftMenuOpen(getInitialOpenState(MENU_SETTINGS.leftMenu));
    setRightMenuOpen(getInitialOpenState(MENU_SETTINGS.rightMenu));
    setBottomMenuOpen(getInitialOpenState(MENU_SETTINGS.bottomMenu));
    setTopMenuOpen(getInitialOpenState(MENU_SETTINGS.topMenu));
  }, []);

  // If menu is fixed open, always keep it open
  const handleSetLeftMenuOpen = React.useCallback((open: boolean) => {
    if (MENU_SETTINGS.leftMenu.fixedOpen) {
      return; // Don't allow changes if fixed open
    }
    setLeftMenuOpen(open);
  }, []);

  const handleSetRightMenuOpen = React.useCallback((open: boolean) => {
    if (MENU_SETTINGS.rightMenu.fixedOpen) {
      return; // Don't allow changes if fixed open
    }
    setRightMenuOpen(open);
  }, []);

  const handleSetBottomMenuOpen = React.useCallback((open: boolean) => {
    if (MENU_SETTINGS.bottomMenu.fixedOpen) {
      return; // Don't allow changes if fixed open
    }
    setBottomMenuOpen(open);
  }, []);

  const handleSetTopMenuOpen = React.useCallback((open: boolean) => {
    if (MENU_SETTINGS.topMenu.fixedOpen) {
      return; // Don't allow changes if fixed open
    }
    setTopMenuOpen(open);
  }, []);

  const value: MenuStateContextValue = React.useMemo(
    () => ({
      leftMenuOpen,
      rightMenuOpen,
      bottomMenuOpen,
      topMenuOpen,
      setLeftMenuOpen: handleSetLeftMenuOpen,
      setRightMenuOpen: handleSetRightMenuOpen,
      setBottomMenuOpen: handleSetBottomMenuOpen,
      setTopMenuOpen: handleSetTopMenuOpen,
      leftMenuSettings: MENU_SETTINGS.leftMenu,
      rightMenuSettings: MENU_SETTINGS.rightMenu,
      bottomMenuSettings: MENU_SETTINGS.bottomMenu,
      topMenuSettings: MENU_SETTINGS.topMenu,
    }),
    [
      leftMenuOpen,
      rightMenuOpen,
      bottomMenuOpen,
      topMenuOpen,
      handleSetLeftMenuOpen,
      handleSetRightMenuOpen,
      handleSetBottomMenuOpen,
      handleSetTopMenuOpen,
    ],
  );

  return (
    <MenuStateContext.Provider value={value}>
      {children}
    </MenuStateContext.Provider>
  );
}
