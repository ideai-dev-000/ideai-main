/**
 * @fileoverview Root layout for v0-000 (V0-Compatible Version)
 *
 * @module V0000LayoutV0
 * @description
 * V0-compatible layout WITHOUT @repo/ui dependencies.
 * Use this version when uploading to v0.dev.
 *
 * To use: Rename this file to layout.tsx before uploading to v0
 */

import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
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
