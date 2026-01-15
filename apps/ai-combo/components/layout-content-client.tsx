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
import { IdeAISideMenuWrapper } from "@/components/ideai-side-menu-wrapper";
import { LayoutClient } from "@/components/layout-client";
import { ContentWrapper } from "@/components/content-wrapper";
import { UnifiedNav } from "@/components/unified-nav";
import { MENU_SETTINGS } from "@/lib/menu-settings";

export function LayoutContentClient({ children }: { children: ReactNode }) {
  return (
    <ReactFlowProvider>
      <PersistentCanvas />
      {/* IdeaI Side Menu - outside z-[1] wrapper so it's above canvas (sidebar has z-30) */}
      {/* Hide on landing page - only show when authenticated and not on homepage */}
      <LayoutClient>
        <IdeAISideMenuWrapper />
      </LayoutClient>
      {/* Header needs pointer events for buttons to work - z-[100] to be above canvas (z-[15]) */}
      <div className="pointer-events-auto relative z-[100]">
        <CapabilitiesHeader />
      </div>
      {/* RIGHT MENU = MAIN MENU (settings-controlled)
          LEFT MENU = CONTROLS (settings-controlled - configured in IdeAISideMenuWrapper)
          Uses unified nav config - single source of truth */}
      <UnifiedNav
        variant="standalone"
        position="right"
        size={280}
        title="Navigation"
      />

      {/* BOTTOM MENU = HORIZONTAL NAV (for testing horizontal mode) */}
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
