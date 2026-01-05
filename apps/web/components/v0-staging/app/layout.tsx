/**
 * @fileoverview Root layout for V0 prototype
 *
 * @module V0PrototypeLayout
 * @description
 * Minimal root layout for V0 prototyping.
 * Uses IdeaI shared components and styling.
 */

import type React from "react";
import type { Metadata } from "next";
import { ThemeProvider } from "@repo/ui";
import "./globals.css";

export const metadata: Metadata = {
  title: "V0 Prototype - IdeaI",
  description: "Minimal V0 boilerplate for IdeaI-compatible prototypes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
