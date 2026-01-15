/**
 * @fileoverview Client component to adjust main content padding based on side menu visibility
 *
 * @module ContentWrapper
 * @description
 * Wraps main content and adjusts left padding when side menu is hidden (landing page).
 */

"use client";

import { type ReactNode, useMemo } from "react";
import { usePathname } from "next/navigation";
import { useMenuState } from "@/components/menu-state-provider";
import { MENU_SETTINGS, getEasingFunction } from "@/lib/menu-settings";
import { needsIdeaiControls } from "@/lib/route-config";
import { cn } from "@/lib/utils";

interface ContentWrapperProps {
  children: ReactNode;
  className?: string;
  /** Animation mode: overlay (on top) or push (moves content) */
  animationMode?: "overlay" | "push";
  /** Left menu size for push mode */
  leftMenuSize?: number;
  /** Right menu size for push mode */
  rightMenuSize?: number;
}

export function ContentWrapper({
  children,
  className,
  animationMode = "overlay",
  leftMenuSize = 280,
  rightMenuSize = 280,
}: ContentWrapperProps) {
  const pathname = usePathname();
  const menuState = useMenuState();

  // Check if left menu (controls) should be visible for this route
  // Left menu only appears for IdeaI modules/services (workflow, vibe, etc.)
  const hasLeftMenu = needsIdeaiControls(pathname);

  // On workflow pages, we don't want to block canvas clicks
  // The canvas is at z-0, so content wrapper should not interfere
  const isWorkflowPage =
    pathname === "/workflow" || pathname?.startsWith("/workflow/workflows/");

  // Get transition settings from menu config
  const transitionDuration = MENU_SETTINGS.transitionDuration || 350;
  const transitionEasing = getEasingFunction(MENU_SETTINGS.transitionEasing);

  // For push mode, adjust margins based on menu state with smooth transitions
  // Only apply left menu margin if left menu is actually visible for this route
  // CRITICAL: Always account for header height (64px) + top menu if open (80px)
  const pushModeStyles = useMemo(
    () =>
      animationMode === "push"
        ? {
            marginLeft:
              hasLeftMenu && menuState.leftMenuOpen ? `${leftMenuSize}px` : "0",
            marginRight: "0", // Right menu removed
            marginTop: "64px", // Always: Header (64px) - top menu removed
            marginBottom: menuState.bottomMenuOpen ? "80px" : "0",
            transition: `margin-left ${transitionDuration}ms ${transitionEasing}, margin-right ${transitionDuration}ms ${transitionEasing}, margin-top ${transitionDuration}ms ${transitionEasing}, margin-bottom ${transitionDuration}ms ${transitionEasing}`,
          }
        : {},
    [
      animationMode,
      hasLeftMenu,
      menuState.leftMenuOpen,
      menuState.rightMenuOpen,
      menuState.topMenuOpen,
      menuState.bottomMenuOpen,
      leftMenuSize,
      rightMenuSize,
      transitionDuration,
      transitionEasing,
    ],
  );

  // For overlay mode, use padding with transitions (content doesn't move but padding animates)
  // CRITICAL: Always account for header height (64px) + top menu if open (80px)
  // This ensures main content is never overlapped by the fixed header
  const overlayStyles = useMemo(
    () =>
      animationMode === "overlay"
        ? {
            paddingLeft:
              hasLeftMenu && menuState.leftMenuOpen ? `${leftMenuSize}px` : "0",
            paddingRight: "0", // Right menu removed
            paddingTop: "64px", // Always: Header (64px) - top menu removed
            paddingBottom: menuState.bottomMenuOpen ? "80px" : "0",
            transition: `padding-left ${transitionDuration}ms ${transitionEasing}, padding-right ${transitionDuration}ms ${transitionEasing}, padding-top ${transitionDuration}ms ${transitionEasing}, padding-bottom ${transitionDuration}ms ${transitionEasing}`,
          }
        : {
            // Even in overlay mode, we need top padding for header
            // This ensures main is never overlapped by fixed header
            paddingTop: "64px", // Always: Header (64px) - top menu removed
            transition: `padding-top ${transitionDuration}ms ${transitionEasing}`,
          },
    [
      animationMode,
      hasLeftMenu,
      menuState.leftMenuOpen,
      menuState.rightMenuOpen,
      menuState.topMenuOpen,
      menuState.bottomMenuOpen,
      leftMenuSize,
      rightMenuSize,
      transitionDuration,
      transitionEasing,
    ],
  );

  return (
    <main
      className={cn(
        className,
        "flex-1 min-w-0 overflow-y-auto", // Fill remaining space, scrollable, allow shrinking
        isWorkflowPage && "pointer-events-none",
      )}
      style={{
        ...(isWorkflowPage ? { pointerEvents: "none" as const } : {}),
        ...pushModeStyles,
        ...overlayStyles,
        // Calculate exact height: viewport - header - bottom menu (top menu removed)
        height: menuState.bottomMenuOpen
          ? "calc(100vh - 64px - 80px)" // Header + bottom menu
          : "calc(100vh - 64px)", // Header only
      }}
      data-menu-push-mode={
        animationMode === "push" && menuState.leftMenuOpen ? "left" : undefined
      }
      data-menu-open={animationMode === "push" && menuState.leftMenuOpen}
    >
      {/* Only re-enable pointer events for actual page content (not on workflow pages with canvas) */}
      {isWorkflowPage ? (
        // On workflow pages, children handle their own pointer events
        children
      ) : (
        // On other pages, wrap in pointer-events-auto
        <div className="pointer-events-auto">{children}</div>
      )}
    </main>
  );
}
