/**
 * @fileoverview Root layout component for the IdeaI Material UI application
 * 
 * @module RootLayout
 * @description
 * Defines the root HTML structure, fonts, and metadata for the Material UI app.
 */

import type { Metadata } from "next";
import localFont from "next/font/local";
import { getIdeAIFaviconMetadata } from "@repo/ui/lib/favicon-metadata";
import { IdeAIDiagnostics } from "@repo/ui/components/ideai-diagnostics";
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
  title: "IdeaI /material",
  description: "IdeaI Material UI showcase",
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
        {children}
        <IdeAIDiagnostics appName="material" />
      </body>
    </html>
  );
}



