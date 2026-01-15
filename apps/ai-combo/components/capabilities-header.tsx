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
import { UserMenu } from "@/components/workflow/user-menu";
import { useSession } from "@/lib/auth-client";
import { demoModeAtom } from "@/lib/workflow-store";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { IdeAIMenu, IdeAIMenuSection } from "@repo/ui";
import { NAV_CONFIG, getAllNavItems } from "@/lib/nav-config";
import { cn } from "@/lib/utils";

export function CapabilitiesHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const { data: session } = useSession();
  const pathname = usePathname();
  const [demoMode, setDemoMode] = useAtom(demoModeAtom);

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

          {/* Navigation - IdeaI Menu in header (minimal styling, supports shadcn) */}
          <div className="hidden md:flex">
            <IdeAIMenu
              position="top"
              trigger="always"
              mode="navigation"
              className="!relative !top-0 !left-0 !right-auto !h-auto !w-auto !border-0 !shadow-none !bg-transparent dark:!bg-transparent !transform-none"
              topMenuOptions={{
                horizontal: true,
                sticky: false,
                useMenubar: false, // Set to true to use shadcn Menubar component
              }}
            >
              <IdeAIMenuSection id="header-nav" title="" defaultOpen={true}>
                <nav
                  className="flex items-center gap-6"
                  aria-label="Main navigation"
                >
                  {NAV_CONFIG.flatMap((section) =>
                    section.items.map((item) => {
                      const isActive =
                        pathname === item.href ||
                        pathname.startsWith(item.href + "/");
                      const IconComponent = item.icon;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={cn(
                            "flex items-center gap-2 text-sm font-medium transition-colors",
                            isActive
                              ? "text-slate-900 dark:text-slate-100"
                              : "text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-100",
                          )}
                        >
                          {IconComponent && (
                            <IconComponent className="h-4 w-4" />
                          )}
                          {item.label}
                        </Link>
                      );
                    }),
                  )}
                </nav>
              </IdeAIMenuSection>
            </IdeAIMenu>
          </div>

          {/* Right Side */}
          <div className="relative z-[60] flex items-center gap-2">
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
