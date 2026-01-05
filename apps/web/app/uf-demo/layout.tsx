/**
 * @fileoverview UniFrame Demo Layout - Minimal Layout for IFrame
 * 
 * @file uf-demo/layout.tsx
 * @module UFDemoLayout
 * @description
 * Minimal layout for UniFrame demo page. Only includes normalize CSS.
 * No additional styles, fonts, or metadata that could interfere.
 * 
 * Note: This is a route group layout, not a root layout, so it should
 * not define <html> and <body> tags. Those come from the root layout.
 */

import "./globals.css";

export default function UFDemoLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // This is a nested layout, not a root layout
  // Next.js will use the root layout's html/body
  return <>{children}</>;
}
