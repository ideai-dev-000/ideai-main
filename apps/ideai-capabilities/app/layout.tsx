/**
 * @fileoverview Root layout for IdeaI Capabilities site
 *
 * @module CapabilitiesLayout
 * @description
 * Root layout with standalone navigation and IdeaI design system.
 * This site serves as a test bed for shared codebase architecture.
 */

import type { Metadata } from "next";
import { ThemeProvider } from "@repo/ui";
import { CapabilitiesHeader } from "@/components/capabilities-header";
import "./globals.css";

export const metadata: Metadata = {
  title: "IdeaI Capabilities - Shared Codebase Architecture Test Bed",
  description:
    "Test bed site demonstrating how to build new sites using shared capabilities as components. Bridges the path from separate apps to shared packages.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <CapabilitiesHeader />
          <main className="min-h-screen pt-16">{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}
