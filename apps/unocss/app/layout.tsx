/**
 * @fileoverview Root layout for /unocss - UnoCSS only
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
  title: "IdeaI /unocss",
  description: "IdeaI app with UnoCSS only - atomic CSS styling",
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
        <IdeAIDiagnostics appName="unocss" />
      </body>
    </html>
  );
}

