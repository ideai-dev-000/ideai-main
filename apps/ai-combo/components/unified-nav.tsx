/**
 * @fileoverview Unified Navigation Component
 *
 * @module UnifiedNav
 * @description
 * Single navigation component that uses ideai-menu-main.
 * Can be used in header or standalone.
 * Maps to unified nav-config.ts
 */

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { IdeAIMenuMain, IdeAIMenuSection } from "@repo/ui";
import { NAV_CONFIG } from "@/lib/nav-config";
import { useMenuState } from "@/components/menu-state-provider";
import { getEffectiveTrigger, MENU_SETTINGS } from "@/lib/menu-settings";
import { cn } from "@/lib/utils";
import { UserMenuItem } from "@/components/menu-items/user-menu-item";
import { ThemeMenuItem } from "@/components/menu-items/theme-menu-item";
import { FontMenuItem } from "@/components/menu-items/font-menu-item";
import { DemoModeMenuItem } from "@/components/menu-items/demo-mode-menu-item";

interface UnifiedNavProps {
  /** Position for the menu */
  position?: "right" | "left" | "top" | "bottom";
  /** Size of the menu */
  size?: number;
  /** Whether to show in header (horizontal) or standalone (vertical) */
  variant?: "header" | "standalone";
  /** Custom title */
  title?: string;
  /** Use different menu state (for bottom menu) */
  useBottomMenuState?: boolean;
}

/**
 * Unified Navigation Component
 * Uses ideai-menu-main with unified nav config
 */
export function UnifiedNav({
  position = "right",
  size = 280,
  variant = "standalone",
  title = "Navigation",
  useBottomMenuState = false,
}: UnifiedNavProps) {
  const pathname = usePathname();
  const menuState = useMenuState();

  // Determine which menu state to use based on position
  const isBottomMenu = position === "bottom" || useBottomMenuState;
  const isTopMenu = position === "top";
  const isLeftMenu = position === "left";

  const menuOpen = isBottomMenu
    ? menuState.bottomMenuOpen
    : isTopMenu
      ? menuState.topMenuOpen
      : isLeftMenu
        ? menuState.leftMenuOpen
        : menuState.rightMenuOpen;
  const setMenuOpen = isBottomMenu
    ? menuState.setBottomMenuOpen
    : isTopMenu
      ? menuState.setTopMenuOpen
      : isLeftMenu
        ? menuState.setLeftMenuOpen
        : menuState.setRightMenuOpen;
  const menuSettings = isBottomMenu
    ? menuState.bottomMenuSettings
    : isTopMenu
      ? menuState.topMenuSettings
      : isLeftMenu
        ? menuState.leftMenuSettings
        : menuState.rightMenuSettings;
  const effectiveTrigger = getEffectiveTrigger(menuSettings);

  // For header variant, use horizontal layout
  const isHeader = variant === "header";

  if (isHeader) {
    // Header variant: horizontal nav items
    return (
      <nav
        className="hidden md:flex md:items-center md:gap-6"
        aria-label="Main navigation"
      >
        <ul className="flex items-center gap-6">
          {NAV_CONFIG.flatMap((section) =>
            section.items.map((item) => {
              const isActive =
                pathname === item.href || pathname.startsWith(item.href + "/");
              const IconComponent = item.icon;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-2 text-sm font-medium transition-colors",
                      isActive
                        ? "text-slate-900 dark:text-slate-100"
                        : "text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-100",
                    )}
                  >
                    {IconComponent && <IconComponent className="h-4 w-4" />}
                    {item.label}
                  </Link>
                </li>
              );
            }),
          )}
        </ul>
      </nav>
    );
  }

  // Standalone variant: use IdeAIMenu with appropriate mode
  // Left/Right = sidebar mode, Top = navigation mode, Bottom = drawer mode
  const menuMode =
    position === "left" || position === "right"
      ? "sidebar"
      : position === "bottom"
        ? "drawer"
        : "navigation";

  return (
    <IdeAIMenuMain
      position={position}
      mode={menuMode}
      trigger={effectiveTrigger}
      size={size}
      title={title}
      open={menuOpen}
      onOpenChange={setMenuOpen}
      animationMode={MENU_SETTINGS.animationMode || "overlay"}
      swipeToClose={menuSettings.swipeToClose ?? true}
    >
      {/* Navigation Sections */}
      {NAV_CONFIG.map((section) => (
        <IdeAIMenuSection
          key={section.id}
          id={section.id}
          title={section.title}
          defaultOpen={true}
        >
          {/* For horizontal menus (top/bottom), use flex row layout */}
          <div
            className={cn(
              position === "top" || position === "bottom"
                ? "flex flex-row items-center gap-2"
                : "space-y-1",
            )}
          >
            {section.items.map((item) => {
              const isActive =
                pathname === item.href || pathname.startsWith(item.href + "/");
              const IconComponent = item.icon;
              // For horizontal menus, use compact button style
              if (position === "top" || position === "bottom") {
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors whitespace-nowrap",
                      isActive
                        ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-medium"
                        : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300",
                    )}
                    title={item.description}
                  >
                    {IconComponent && (
                      <IconComponent className="h-4 w-4 flex-shrink-0" />
                    )}
                    <span>{item.label}</span>
                  </Link>
                );
              }
              // For vertical menus, use full layout with description
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "block px-3 py-2 rounded-md text-sm transition-colors",
                    isActive
                      ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-medium"
                      : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300",
                  )}
                >
                  <div className="flex items-center gap-2">
                    {IconComponent && <IconComponent className="h-4 w-4" />}
                    <span>{item.label}</span>
                  </div>
                  {item.description && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 ml-6">
                      {item.description}
                    </p>
                  )}
                </Link>
              );
            })}
          </div>
        </IdeAIMenuSection>
      ))}

      {/* User Section - Always show, default open */}
      <IdeAIMenuSection id="nav-user" title="User" defaultOpen={true}>
        <UserMenuItem />
      </IdeAIMenuSection>

      {/* Theme Section - Always show, default open */}
      <IdeAIMenuSection id="nav-theme" title="Theme" defaultOpen={true}>
        <ThemeMenuItem />
      </IdeAIMenuSection>

      {/* Fonts Section - Always show, default open */}
      <IdeAIMenuSection id="nav-fonts" title="Fonts" defaultOpen={true}>
        <FontMenuItem />
      </IdeAIMenuSection>

      {/* Demo Mode - Only show on workflow pages, hide section if not on workflow page */}
      {pathname === "/workflow" || pathname?.startsWith("/workflow/") ? (
        <IdeAIMenuSection id="nav-demo" title="Demo Mode" defaultOpen={true}>
          <DemoModeMenuItem />
        </IdeAIMenuSection>
      ) : null}
    </IdeAIMenuMain>
  );
}
