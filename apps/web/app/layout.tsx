/**
 * @fileoverview Root layout component for the IDEAI web application
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
  title: "IDEAI",
  description: "IDEAI web application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
      </body>
    </html>
  );
}
