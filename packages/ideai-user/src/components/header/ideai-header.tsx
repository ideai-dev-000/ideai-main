/**
 * @fileoverview Shared IdeaI header component for all IdeaI apps
 *
 * @module IdeAIHeader
 * @description
 * Flexible header component that provides consistent navigation across IdeaI apps.
 * Supports custom navigation items, user menu integration, and theme controls.
 *
 * Features:
 * - IdeAI logo and branding
 * - Custom navigation items
 * - User menu integration
 * - Theme toggle and selector
 * - Mobile navigation
 * - Scroll-based styling
 *
 * @example
 * ```tsx
 * import { IdeAIHeader } from "@repo/ideai-user/components/header/ideai-header";
 * import { IdeAILogo, ThemeToggle } from "@repo/ui";
 *
 * <IdeAIHeader
 *   siteName="Capabilities"
 *   navItems={[
 *     { label: "Home", href: "/", icon: <Home /> },
 *     { label: "Workflows", href: "/workflow" },
 *   ]}
 *   rightContent={<UserMenu />}
 * />
 * ```
 *
 * @see ../auth/auth-dialog - Authentication dialog
 * @see @repo/ui/components/ideai-logo - IdeAI logo component
 */

"use client";

import { useState, useEffect, type ReactNode } from "react";
import Link from "next/link";
import { IdeAILogo } from "@repo/ui";
import { ThemeToggle, IdeAIThemeSelector, MobileNav } from "@repo/ui";

export interface NavItem {
  label: string;
  href: string;
  icon?: ReactNode;
  basePath?: string; // For active state detection
}

export interface IdeAIHeaderProps {
  /**
   * Site name to display in logo
   */
  siteName?: string;
  /**
   * Navigation items to display
   */
  navItems?: NavItem[];
  /**
   * Content to display on the right side (e.g., UserMenu)
   */
  rightContent?: ReactNode;
  /**
   * Additional actions before right content
   */
  headerActions?: ReactNode;
  /**
   * Whether header should be sticky
   */
  sticky?: boolean;
  /**
   * Whether header should change appearance on scroll
   */
  shrinkOnScroll?: boolean;
  /**
   * Custom className for header
   */
  className?: string;
}

/**
 * IdeAIHeader - Shared header component for IdeaI apps
 *
 * Provides consistent header UI across all IdeaI apps with:
 * - Logo/branding on left
 * - Navigation in center (desktop) or mobile menu
 * - User menu and actions on right
 */
export const IdeAIHeader = ({
  siteName,
  navItems = [],
  rightContent,
  headerActions,
  sticky = true,
  shrinkOnScroll = true,
  className = "",
}: IdeAIHeaderProps) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    if (!shrinkOnScroll) return;

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [shrinkOnScroll]);

  const stickyClass = sticky ? "fixed top-0 left-0 right-0 z-50" : "";
  const scrolledBorderClass = isScrolled
    ? "border-slate-200 dark:border-slate-800"
    : "border-transparent";

  return (
    <header
      className={`${stickyClass} border-b bg-white/95 backdrop-blur-sm transition-all dark:bg-slate-950/95 ${scrolledBorderClass} ${className}`}
      role="banner"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Left: Logo/Brand */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <IdeAILogo siteName={siteName} />
            </Link>
          </div>

          {/* Center: Navigation (desktop only) */}
          {navItems.length > 0 && (
            <nav
              className="hidden md:flex md:items-center md:gap-6"
              aria-label="Main navigation"
            >
              <ul className="flex items-center gap-6">
                {navItems.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="flex items-center gap-2 text-sm font-medium text-slate-700 transition-colors hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-100"
                    >
                      {item.icon}
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          )}

          {/* Right: Actions, Theme, User Menu, Mobile Nav */}
          <div className="relative z-50 flex items-center gap-2">
            {/* Custom header actions */}
            {headerActions}

            {/* User menu or other right content */}
            {rightContent}

            {/* Theme selector */}
            <IdeAIThemeSelector />

            {/* Theme toggle */}
            <ThemeToggle />

            {/* Mobile navigation */}
            {navItems.length > 0 && <MobileNav navItems={navItems} />}
          </div>
        </div>
      </div>
    </header>
  );
};
