/**
 * @fileoverview Root layout for Capability2.0 - Unified Vibe Coding & Workflow Platform
 *
 * @module Capability2Layout
 * @description
 * Root layout combining Vibe Coding and Workflow tools with shared authentication.
 * One login for both AI-powered component generation and workflow automation.
 */

import type { Metadata } from "next";
import { ThemeProvider } from "@repo/ui";
import { ReactFlowProvider } from "@xyflow/react";
import { Provider } from "jotai";
import { type ReactNode } from "react";
import { Toaster } from "sonner";
import { StreamingProvider } from "@/contexts/streaming-context";
import { SWRProvider } from "@/components/providers/swr-provider";
import { SessionProvider } from "@/components/providers/session-provider";
import { mono, sans } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import "./globals.css";

export const metadata: Metadata = {
  title: "Capability2.0 - Unified Vibe Coding & Workflow Platform",
  description:
    "Unified platform combining AI-powered vibe coding with workflow automation. One login for both component generation and workflow tools.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
            <ReactFlowProvider>
              <SessionProvider>
                <SWRProvider>
                  <StreamingProvider>{children}</StreamingProvider>
                </SWRProvider>
              </SessionProvider>
            </ReactFlowProvider>
          </Provider>
          <Toaster position="top-center" richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
