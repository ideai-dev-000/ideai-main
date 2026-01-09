/**
 * @fileoverview Root layout for App Builder (v0 clone with Better Auth)
 *
 * @module AppBuilderLayout
 * @description
 * Root layout with IdeaI design system and Better Auth integration.
 */

import type { Metadata } from "next";
import { ThemeProvider } from "@repo/ui";
import { type ReactNode } from "react";
import { StreamingProvider } from "@/contexts/streaming-context";
import { SWRProvider } from "@/components/providers/swr-provider";
import { SessionProvider } from "@/components/providers/session-provider";
import { mono, sans } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import "./globals.css";

export const metadata: Metadata = {
  title: "IdeaI App Builder - AI-Powered Component Generation",
  description:
    "Build React components with AI using v0 SDK - Vibe coding UI for generating beautiful UIs",
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
          <SessionProvider>
            <SWRProvider>
              <StreamingProvider>{children}</StreamingProvider>
            </SWRProvider>
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
