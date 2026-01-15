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
import { ReactFlowProvider } from "@xyflow/react";
import { PersistentCanvas } from "@/components/workflow/persistent-canvas";
import { CapabilitiesHeader } from "@/components/capabilities-header";
import { LayoutClient } from "@/components/layout-client";
import { ContentWrapper } from "@/components/content-wrapper";
import { UnifiedNav } from "@/components/unified-nav";
import { MENU_SETTINGS } from "@/lib/menu-settings";
import { ScrollToTop } from "@/components/scroll-to-top";

export function LayoutContentClient({ children }: { children: ReactNode }) {
  return (
    <ReactFlowProvider>
      <ScrollToTop />
      <PersistentCanvas />
      {/* Header needs pointer events for buttons to work - z-[100] to be above canvas (z-[15]) */}
      <div className="pointer-events-auto relative z-[100]">
        <CapabilitiesHeader />
      </div>

      {/* ALL 4 MENUS - Same code, different configs */}
      {/* LEFT MENU = NAVIGATION (site pages) */}
      <UnifiedNav
        variant="standalone"
        position="left"
        size={280}
        title="Navigation"
      />

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
      {/* Main content - needs pointer events for interactive elements */}
      {/* Adjust padding: header (64px) from top, left menu (280px) from left, right menu (280px) from right */}
      <ContentWrapper
        className="pointer-events-auto min-h-screen pt-[64px]"
        animationMode={MENU_SETTINGS.animationMode || "overlay"}
        leftMenuSize={280}
        rightMenuSize={280}
      >
        {children}
      </ContentWrapper>
    </ReactFlowProvider>
  );
}
