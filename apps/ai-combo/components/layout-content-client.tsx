/**
 * @fileoverview Layout Content Client Component
 *
 * @module LayoutContentClient
 * @description
 * Client component that wraps the layout content and provides menu state.
 * This is separated from layout.tsx because it needs to use client-side hooks.
 */

"use client";

import { type ReactNode } from "react";
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

export function LayoutContentClient({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const hasIdeaiControls = needsIdeaiControls(pathname);

  return (
    <ReactFlowProvider>
      <ScrollToTop />
      <PersistentCanvas />
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
