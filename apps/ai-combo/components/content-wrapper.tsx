/**
 * @fileoverview Client component to adjust main content padding based on side menu visibility
 *
 * @module ContentWrapper
 * @description
 * Wraps main content and adjusts left padding when side menu is hidden (landing page).
 */

"use client";

import { type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { useMenuState } from "@/components/menu-state-provider";
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

  // On workflow pages, we don't want to block canvas clicks
  // The canvas is at z-0, so content wrapper should not interfere
  const isWorkflowPage =
    pathname === "/workflow" || pathname?.startsWith("/workflow/workflows/");

  // For push mode, adjust margins based on menu state
  const pushModeStyles =
    animationMode === "push"
      ? {
          marginLeft: menuState.leftMenuOpen ? `${leftMenuSize}px` : "0",
          marginRight: menuState.rightMenuOpen ? `${rightMenuSize}px` : "0",
          marginBottom: menuState.bottomMenuOpen ? "80px" : "0",
          transition:
            "margin-left 300ms cubic-bezier(0.4, 0, 0.2, 1), margin-right 300ms cubic-bezier(0.4, 0, 0.2, 1), margin-bottom 300ms cubic-bezier(0.4, 0, 0.2, 1)",
        }
      : {};

  // For overlay mode, use padding (content doesn't move)
  const overlayPadding =
    animationMode === "overlay" &&
    (menuState.leftMenuOpen || menuState.rightMenuOpen)
      ? `md:pl-[${leftMenuSize}px] md:pr-[${rightMenuSize}px]`
      : "";

  // Top padding for top menu (always overlay mode, positioned below header)
  const topPadding = menuState.topMenuOpen ? "pt-[144px]" : ""; // Header (64px) + Top menu (80px)

  // Bottom padding for bottom menu (always overlay mode)
  const bottomPadding = menuState.bottomMenuOpen ? "pb-20" : "";

  return (
    <div
      className={cn(
        className,
        overlayPadding,
        topPadding,
        bottomPadding,
        isWorkflowPage && "pointer-events-none",
      )}
      style={{
        ...(isWorkflowPage ? { pointerEvents: "none" as const } : {}),
        ...pushModeStyles,
      }}
      data-menu-push-mode={
        animationMode === "push"
          ? menuState.leftMenuOpen
            ? "left"
            : menuState.rightMenuOpen
              ? "right"
              : undefined
          : undefined
      }
      data-menu-open={
        animationMode === "push" &&
        (menuState.leftMenuOpen || menuState.rightMenuOpen)
      }
    >
      {/* Only re-enable pointer events for actual page content (not on workflow pages with canvas) */}
      {isWorkflowPage ? (
        // On workflow pages, children handle their own pointer events
        children
      ) : (
        // On other pages, wrap in pointer-events-auto
        <div className="pointer-events-auto">{children}</div>
      )}
    </div>
  );
}
