/**
 * @fileoverview Root layout for IdeaI VibeCoder (v0 clone with Better Auth)
 *
 * @module IdeaiVibeCoderLayout
 * @description
 * Root layout with IdeaI design system and Better Auth integration.
 * The world's most performant forward-facing vibe coding platform.
 */

import type { Metadata } from "next";
import { ThemeProvider } from "@repo/ui";
import { type ReactNode } from "react";
import { Toaster } from "sonner";
import { StreamingProvider } from "@/contexts/streaming-context";
import { SWRProvider } from "@/components/providers/swr-provider";
import { SessionProvider } from "@/components/providers/session-provider";
import { mono, sans } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import "./globals.css";

export const metadata: Metadata = {
  title: "IdeaI VibeCoder - The World's Most Performant Vibe Coding Platform",
  description:
    "AI-powered vibe coding platform using v0 SDK - Generate React components with beautiful UIs through natural conversation",
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
          <Toaster position="top-center" richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
