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
import { Provider } from "jotai";
import { type ReactNode } from "react";
import { LayoutContentClient } from "@/components/layout-content-client";
import { AuthProvider } from "@/components/auth/provider";
import { GlobalModals } from "@/components/global-modals";
import { OverlayProvider } from "@/components/overlays/overlay-provider";
import { Toaster } from "@/components/ui/sonner";
import { DevSetupModal } from "@/components/dev-setup-modal";
import { StreamingProvider } from "@/contexts/streaming-context";
import { VibeStreamingProvider } from "@/lib/vibe/contexts/streaming-context";
import { SWRProvider } from "@/components/providers/swr-provider";
import { SessionProvider } from "@/components/providers/session-provider";
import { MenuStateProvider } from "@/components/menu-state-provider";
import {
  geistSans,
  geistMono,
  interSans,
  jetbrainsMono,
  spaceGroteskSans,
  spaceMono,
} from "@/lib/fonts";
import { cn } from "@/lib/utils";
import { FontProvider } from "@/components/font-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "IdeaI Capabilities - Unified Workflow & Capabilities Platform",
  description:
    "Unified platform combining IdeaI UI with workflow automation capabilities. Merged app demonstrating shared codebase architecture.",
};

// Layout content is now a client component (moved to layout-content-client.tsx)
// to support menu state hooks

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          geistSans.variable,
          geistMono.variable,
          interSans.variable,
          jetbrainsMono.variable,
          spaceGroteskSans.variable,
          spaceMono.variable,
          "antialiased",
        )}
      >
        <FontProvider>
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
                          <MenuStateProvider>
                            <LayoutContentClient>
                              {children}
                            </LayoutContentClient>
                          </MenuStateProvider>
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
        </FontProvider>
      </body>
    </html>
  );
}
