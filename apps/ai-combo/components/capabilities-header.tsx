/**
 * @fileoverview Standalone navigation header for Capabilities site
 *
 * @module CapabilitiesHeader
 * @description
 * Enhanced header with dropdown menus for each section (Workflow Builder, App Builder).
 * Shows active state and provides quick access to items within each section.
 * Note: Lead Agent removed from header - will be added as module in future.
 */

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAtom } from "jotai";
import { IdeAILogo } from "@repo/ui";
import { ThemeToggle } from "@repo/ui";
import { IdeAIThemeSelector } from "@repo/ui";
import { MobileNav } from "@repo/ui";
import { PanelLeft, PanelRight, PanelBottom } from "lucide-react";
import { UserMenu } from "@/components/workflow/user-menu";
import { useSession } from "@/lib/auth-client";
import { demoModeAtom } from "@/lib/workflow-store";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useMenuState } from "@/components/menu-state-provider";
import { UnifiedNav } from "@/components/unified-nav";
import { getAllNavItems } from "@/lib/nav-config";

export function CapabilitiesHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const { data: session } = useSession();
  const pathname = usePathname();
  const [demoMode, setDemoMode] = useAtom(demoModeAtom);

  // Menu state for toggle icons
  // CRITICAL: useMenuState() will throw if MenuStateProvider is missing
  // This ensures buttons can NEVER exist without working menu state
  const menuState = useMenuState();

  // Show demo mode toggle only on workflow pages
  const isWorkflowPage =
    pathname === "/workflow" || pathname.startsWith("/workflow/");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleDemoModeChange = (checked: boolean) => {
    setDemoMode(checked);
    // Save to localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("workflow-demo-mode", String(checked));
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-[100] border-b bg-white/95 backdrop-blur-sm transition-all dark:bg-slate-950/95 ${
        isScrolled
          ? "border-slate-200 dark:border-slate-800"
          : "border-transparent"
      }`}
      role="banner"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo/Brand */}
          <div className="flex items-center ideai-header__brand">
            <Link
              href="/"
              className="flex items-center gap-2 [&_.ideai-logo]:!w-auto [&_.ideai-logo__container]:!gap-2 [&_.ideai-logo__container]:!justify-start [&_.ideai-logo__icon]:!w-7 [&_.ideai-logo__icon]:!h-7 [&_.ideai-logo__text]:!text-lg [&_.ideai-logo__text]:!font-semibold [&_.ideai-logo__text]:!leading-tight [&_.ideai-logo__brand]:!text-lg [&_.ideai-logo__site]:!text-xs"
            >
              <IdeAILogo siteName="Capabilities" />
            </Link>
          </div>

          {/* Navigation - uses unified nav config */}
          <UnifiedNav variant="header" />

          {/* Right Side */}
          <div className="relative z-[60] flex items-center gap-2">
            {/* Menu Toggle Icons - shown based on settings */}
            {/* CRITICAL: Buttons are ALWAYS connected to menu state via MenuStateProvider */}
            {/* If showToggleIcon is true and not fixedOpen, button MUST work */}
            {menuState.leftMenuSettings.showToggleIcon &&
              !menuState.leftMenuSettings.fixedOpen && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    // CRITICAL: Always toggle - menu state is guaranteed to exist
                    const newState = !menuState.leftMenuOpen;
                    menuState.setLeftMenuOpen(newState);
                    console.log(
                      `[Menu Toggle] Left menu: ${newState ? "OPEN" : "CLOSED"}`,
                    );
                  }}
                  className="flex items-center justify-center p-2 rounded-md bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors border border-slate-300 dark:border-slate-600 shadow-sm min-w-[36px] min-h-[36px] cursor-pointer"
                  aria-label={
                    menuState.leftMenuOpen
                      ? "Close left menu"
                      : "Open left menu"
                  }
                  title={
                    menuState.leftMenuOpen ? "Close Controls" : "Open Controls"
                  }
                >
                  <PanelLeft
                    className={`h-5 w-5 ${
                      menuState.leftMenuOpen
                        ? "text-slate-900 dark:text-slate-100"
                        : "text-slate-600 dark:text-slate-400"
                    }`}
                  />
                </button>
              )}
            {menuState.rightMenuSettings.showToggleIcon &&
              !menuState.rightMenuSettings.fixedOpen && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    // CRITICAL: Always toggle - menu state is guaranteed to exist
                    const newState = !menuState.rightMenuOpen;
                    menuState.setRightMenuOpen(newState);
                    console.log(
                      `[Menu Toggle] Right menu: ${newState ? "OPEN" : "CLOSED"}`,
                    );
                  }}
                  className="flex items-center justify-center p-2 rounded-md bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors border border-slate-300 dark:border-slate-600 shadow-sm min-w-[36px] min-h-[36px] cursor-pointer"
                  aria-label={
                    menuState.rightMenuOpen
                      ? "Close right menu"
                      : "Open right menu"
                  }
                  title={
                    menuState.rightMenuOpen
                      ? "Close Main Menu"
                      : "Open Main Menu"
                  }
                >
                  <PanelRight
                    className={`h-5 w-5 ${
                      menuState.rightMenuOpen
                        ? "text-slate-900 dark:text-slate-100"
                        : "text-slate-600 dark:text-slate-400"
                    }`}
                  />
                </button>
              )}
            {/* Bottom Menu Toggle */}
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                const newState = !menuState.bottomMenuOpen;
                menuState.setBottomMenuOpen(newState);
                console.log(
                  `[Menu Toggle] Bottom menu: ${newState ? "OPEN" : "CLOSED"}`,
                );
              }}
              className="flex items-center justify-center p-2 rounded-md bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors border border-slate-300 dark:border-slate-600 shadow-sm min-w-[36px] min-h-[36px] cursor-pointer"
              aria-label={
                menuState.bottomMenuOpen
                  ? "Close bottom menu"
                  : "Open bottom menu"
              }
              title={
                menuState.bottomMenuOpen
                  ? "Close Bottom Menu"
                  : "Open Bottom Menu"
              }
            >
              <PanelBottom
                className={`h-5 w-5 ${
                  menuState.bottomMenuOpen
                    ? "text-slate-900 dark:text-slate-100"
                    : "text-slate-600 dark:text-slate-400"
                }`}
              />
            </button>
            {/* Demo Mode Toggle - only show on workflow pages */}
            {isWorkflowPage && (
              <div className="hidden md:flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-1.5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                <Switch
                  checked={demoMode}
                  onCheckedChange={handleDemoModeChange}
                  id="demo-mode-toggle"
                />
                <Label
                  htmlFor="demo-mode-toggle"
                  className="text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer"
                >
                  Demo Mode
                </Label>
              </div>
            )}
            <UserMenu />
            <IdeAIThemeSelector />
            <ThemeToggle />
            <MobileNav navItems={getAllNavItems()} />
          </div>
        </div>
      </div>
    </header>
  );
}
