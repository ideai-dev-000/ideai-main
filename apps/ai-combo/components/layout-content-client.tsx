/**
 * @fileoverview Layout Content Client Component
 *
 * @module LayoutContentClient
 * @description
 * Client component that wraps the layout content and provides menu state.
 * This is separated from layout.tsx because it needs to use client-side hooks.
 */

"use client";

import { type ReactNode, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { ReactFlowProvider } from "@xyflow/react";
import { PersistentCanvas } from "@/components/workflow/persistent-canvas";
import { CapabilitiesHeader } from "@/components/capabilities-header";
import { LayoutClient } from "@/components/layout-client";
import { ContentWrapper } from "@/components/content-wrapper";
import { UnifiedNav } from "@/components/unified-nav";
import { IdeAISideMenuWrapper } from "@/components/ideai-side-menu-wrapper";
import { MENU_SETTINGS } from "@/lib/menu-settings";
import { ScrollToTop } from "@/components/scroll-to-top";
import { needsIdeaiControls } from "@/lib/route-config";
import { useMenuState } from "@/components/menu-state-provider";

/**
 * Auto-open/close controls menu based on route
 * This component handles seamless menu transitions when navigating between pages
 */
function ControlsMenuAutoToggle() {
  const pathname = usePathname();
  const menuState = useMenuState();
  const hasIdeaiControls = needsIdeaiControls(pathname);
  const previousPathnameRef = useRef<string | null>(null);
  const transitionDuration = MENU_SETTINGS.transitionDuration || 350;

  useEffect(() => {
    const previousPathname = previousPathnameRef.current;
    previousPathnameRef.current = pathname;

    // Skip on initial mount (let initial state handle it)
    if (previousPathname === null) {
      return;
    }

    // If route changed and now needs controls, open menu smoothly
    if (hasIdeaiControls && !menuState.leftMenuOpen) {
      // Small delay to ensure smooth transition from previous page
      const timeoutId = setTimeout(() => {
        menuState.setLeftMenuOpen(true);
      }, 50); // Small delay for smooth transition

      return () => clearTimeout(timeoutId);
    }

    // If route changed and no longer needs controls, close menu smoothly
    if (!hasIdeaiControls && menuState.leftMenuOpen) {
      // Close menu before route change completes (smooth exit)
      menuState.setLeftMenuOpen(false);
    }
  }, [
    pathname,
    hasIdeaiControls,
    menuState.leftMenuOpen,
    menuState.setLeftMenuOpen,
  ]);

  // Also handle initial mount - if page needs controls, open menu
  // This runs once on mount to open menu if needed
  useEffect(() => {
    if (hasIdeaiControls && !menuState.leftMenuOpen) {
      // Delay slightly to ensure smooth animation on page load
      const timeoutId = setTimeout(() => {
        menuState.setLeftMenuOpen(true);
      }, 100);

      return () => clearTimeout(timeoutId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run on mount - we check hasIdeaiControls inside

  return null; // This component doesn't render anything
}

export function LayoutContentClient({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const hasIdeaiControls = needsIdeaiControls(pathname);

  return (
    <ReactFlowProvider>
      <ScrollToTop />
      <PersistentCanvas />
      {/* Auto-toggle controls menu based on route */}
      <ControlsMenuAutoToggle />
      {/* Header needs pointer events for buttons to work - z-[100] to be above canvas (z-[15]) */}
      <div className="pointer-events-auto relative z-[100]">
        <CapabilitiesHeader />
      </div>

      {/* LEFT MENU = IDEAI CONTROLS (only for IdeaI modules/services) */}
      {/* Automatically shows:
          - Workflow controls on /workflow* routes
          - Vibe controls on /vibe* routes
          - Hidden on all other routes (regular webpages don't need controls)
      */}
      {hasIdeaiControls && <IdeAISideMenuWrapper />}

      {/* RIGHT MENU = NAVIGATION (site pages) */}
      <UnifiedNav
        variant="standalone"
        position="right"
        size={280}
        title="Navigation"
      />

      {/* TOP MENU = HORIZONTAL NAV (site pages - for testing) */}
      <UnifiedNav
        variant="standalone"
        position="top"
        size={80}
        title="Quick Nav"
      />

      {/* BOTTOM MENU = HORIZONTAL NAV (site pages - for testing) */}
      <UnifiedNav
        variant="standalone"
        position="bottom"
        size={80}
        title="Quick Nav"
        useBottomMenuState={true}
      />

      {/* Layout container - flexbox to ensure main fills remaining space */}
      <div className="flex flex-col min-h-screen">
        {/* Main content - needs pointer events for interactive elements */}
        {/* ContentWrapper handles all padding/margin adjustments with smooth transitions */}
        {/* Main fills remaining space and animates when menus open/close */}
        <ContentWrapper
          className="pointer-events-auto flex-1 min-w-0"
          animationMode={MENU_SETTINGS.animationMode || "overlay"}
          leftMenuSize={280}
          rightMenuSize={280}
        >
          {children}
        </ContentWrapper>
      </div>
    </ReactFlowProvider>
  );
}
