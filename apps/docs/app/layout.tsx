/**
 * @fileoverview Root layout component for the IdeaI docs application
 * 
 * @module DocsRootLayout
 * @description
 * Defines the root HTML structure, fonts, and metadata for the docs application.
 * This layout wraps all pages and provides global styles and fonts.
 * 
 * @example
 * Automatically wraps all page components in the app directory
 * 
 * @see {@link ./page.tsx} - Home page component
 * @see {@link ./docs/[[...slug]]/page.tsx} - Documentation pages
 */

import type { Metadata } from "next";
import localFont from "next/font/local";
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
  title: {
    default: "IdeaI Docs",
    template: "%s – IdeaI Docs",
  },
  description: "IdeaI documentation site",
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
      </body>
    </html>
  );
}
