import type React from "react";
/**
 * @fileoverview Root layout component for the IdeaI web application
 *
 * @module RootLayout
 * @description
 * Defines the root HTML structure, fonts, and metadata for the application.
 * This layout wraps all pages and provides global styles and fonts.
 *
 * @example
 * Automatically wraps all page components in the app directory
 *
 * @see {@link ./page.tsx} - Home page component
 */

import type { Metadata } from "next";
import localFont from "next/font/local";
import { getIdeAIFaviconMetadata } from "@repo/ui/lib/favicon-metadata";
import { ThemeProvider } from "@repo/ui/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
// TODO: Re-enable after fixing package linking
// import { Analytics } from "@repo/monitoring/analytics"
// import { SpeedInsights } from "@repo/monitoring/speed-insights"
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "IdeaI",
  description: "IdeaI web application",
  ...getIdeAIFaviconMetadata(),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
          {/* TODO: Re-enable after fixing package linking */}
          {/* <Analytics /> */}
          {/* <SpeedInsights /> */}
        </ThemeProvider>
      </body>
    </html>
  );
}
