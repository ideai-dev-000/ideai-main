/**
 * @fileoverview Root layout for IdeaI Capabilities site (Merged with Workflow)
 *
 * @module CapabilitiesLayout
 * @description
 * Root layout with standalone navigation, IdeaI design system, and merged workflow functionality.
 * This site combines IdeaI UI with workflow capabilities in a single unified app.
 */

import type { Metadata } from "next";
import { ThemeProvider } from "@repo/ui";
import { ReactFlowProvider } from "@xyflow/react";
import { Provider } from "jotai";
import { type ReactNode } from "react";
import { AuthProvider } from "@/components/auth/provider";
import { GlobalModals } from "@/components/global-modals";
import { OverlayProvider } from "@/components/overlays/overlay-provider";
import { Toaster } from "@/components/ui/sonner";
import { PersistentCanvas } from "@/components/workflow/persistent-canvas";
import { CapabilitiesHeader } from "@/components/capabilities-header";
import { IdeAISideMenuWrapper } from "@/components/ideai-side-menu-wrapper";
import { DevSetupModal } from "@/components/dev-setup-modal";
import { StreamingProvider } from "@/contexts/streaming-context";
import { VibeStreamingProvider } from "@/lib/vibe/contexts/streaming-context";
import { SWRProvider } from "@/components/providers/swr-provider";
import { SessionProvider } from "@/components/providers/session-provider";
import { LayoutClient } from "@/components/layout-client";
import { ContentWrapper } from "@/components/content-wrapper";
import { mono, sans } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import "./globals.css";

export const metadata: Metadata = {
  title: "IdeaI Capabilities - Unified Workflow & Capabilities Platform",
  description:
    "Unified platform combining IdeaI UI with workflow automation capabilities. Merged app demonstrating shared codebase architecture.",
};

// Inner content wrapped by workflow providers
function LayoutContent({ children }: { children: ReactNode }) {
  return (
    <ReactFlowProvider>
      <PersistentCanvas />
      {/* IdeaI Side Menu - outside z-[1] wrapper so it's above canvas (sidebar has z-30) */}
      {/* Hide on landing page - only show when authenticated and not on homepage */}
      <LayoutClient>
        <div className="pointer-events-auto">
          <IdeAISideMenuWrapper />
        </div>
      </LayoutClient>
      <div className="relative z-[100]">
        {/* Header needs pointer events for buttons to work - z-[100] to be above canvas (z-[15]) */}
        <div className="pointer-events-auto">
          <CapabilitiesHeader />
        </div>
        {/* Main content - needs pointer events for interactive elements */}
        {/* No left padding needed - sidebar is now an overlay */}
        <ContentWrapper className="pointer-events-auto min-h-screen pt-16">
          {children}
        </ContentWrapper>
      </div>
    </ReactFlowProvider>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(sans.variable, mono.variable, "antialiased")}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Provider>
            <AuthProvider>
              <SessionProvider>
                <SWRProvider>
                  <StreamingProvider>
                    <VibeStreamingProvider>
                      <OverlayProvider>
                        <LayoutContent>{children}</LayoutContent>
                        <GlobalModals />
                        <DevSetupModal />
                        <Toaster />
                      </OverlayProvider>
                    </VibeStreamingProvider>
                  </StreamingProvider>
                </SWRProvider>
              </SessionProvider>
            </AuthProvider>
          </Provider>
        </ThemeProvider>
      </body>
    </html>
  );
}
