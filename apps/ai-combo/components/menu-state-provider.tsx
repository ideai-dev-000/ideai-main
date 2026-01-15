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
import {
  MENU_SETTINGS,
  getEffectiveTrigger,
  getInitialOpenState,
} from "@/lib/menu-settings";

interface MenuStateContextValue {
  leftMenuOpen: boolean;
  rightMenuOpen: boolean;
  bottomMenuOpen: boolean;
  setLeftMenuOpen: (open: boolean) => void;
  setRightMenuOpen: (open: boolean) => void;
  setBottomMenuOpen: (open: boolean) => void;
  leftMenuSettings: typeof MENU_SETTINGS.leftMenu;
  rightMenuSettings: typeof MENU_SETTINGS.rightMenu;
  bottomMenuSettings: typeof MENU_SETTINGS.bottomMenu;
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
  const [leftMenuOpen, setLeftMenuOpen] = React.useState(() =>
    getInitialOpenState(MENU_SETTINGS.leftMenu),
  );
  const [rightMenuOpen, setRightMenuOpen] = React.useState(() =>
    getInitialOpenState(MENU_SETTINGS.rightMenu),
  );
  const [bottomMenuOpen, setBottomMenuOpen] = React.useState(() =>
    getInitialOpenState(MENU_SETTINGS.bottomMenu),
  );

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

  const value: MenuStateContextValue = React.useMemo(
    () => ({
      leftMenuOpen,
      rightMenuOpen,
      bottomMenuOpen,
      setLeftMenuOpen: handleSetLeftMenuOpen,
      setRightMenuOpen: handleSetRightMenuOpen,
      setBottomMenuOpen: handleSetBottomMenuOpen,
      leftMenuSettings: MENU_SETTINGS.leftMenu,
      rightMenuSettings: MENU_SETTINGS.rightMenu,
      bottomMenuSettings: MENU_SETTINGS.bottomMenu,
    }),
    [
      leftMenuOpen,
      rightMenuOpen,
      bottomMenuOpen,
      handleSetLeftMenuOpen,
      handleSetRightMenuOpen,
      handleSetBottomMenuOpen,
    ],
  );

  return (
    <MenuStateContext.Provider value={value}>
      {children}
    </MenuStateContext.Provider>
  );
}
