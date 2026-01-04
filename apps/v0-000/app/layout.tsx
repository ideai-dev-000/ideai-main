/**
 * @fileoverview Root layout for v0-000
 * 
 * @module V0000Layout
 * @description
 * Root layout for v0-000 template app.
 * Uses IdeaI shared ThemeProvider and styling.
 */

import type { Metadata } from "next";
import { ThemeProvider } from "@repo/ui";
import "./globals.css";

export const metadata: Metadata = {
  title: "V0-000 - IdeaI Template",
  description: "Perfect v0-compatible template for IdeaI monorepo experiments",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}

