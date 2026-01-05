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
import { type ReactNode, Suspense } from "react";
import { AuthProvider } from "@/components/auth/provider";
import { OverlayProvider } from "@/components/overlays/overlay-provider";
import { Toaster } from "@/components/ui/sonner";
import { PersistentCanvas } from "@/components/workflow/persistent-canvas";
import { CapabilitiesHeader } from "@/components/capabilities-header";
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
      <div className="pointer-events-none relative z-10">
        <CapabilitiesHeader />
        <main className="min-h-screen pt-16">{children}</main>
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
              <OverlayProvider>
                <Suspense fallback={<LayoutContent>{children}</LayoutContent>}>
                  <LayoutContent>{children}</LayoutContent>
                </Suspense>
                <Toaster />
              </OverlayProvider>
            </AuthProvider>
          </Provider>
        </ThemeProvider>
      </body>
    </html>
  );
}
