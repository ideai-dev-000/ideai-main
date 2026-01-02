/**
 * @fileoverview Root layout for /nocss - No CSS styling
 */

import type { Metadata } from "next";
import localFont from "next/font/local";
import { getIdeAIFaviconMetadata } from "@repo/ui/lib/favicon-metadata";
import { IdeAIDiagnostics } from "@repo/ui/components/ideai-diagnostics";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "IdeaI /nocss",
  description: "IdeaI app with no CSS styling - pure HTML defaults",
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
        <IdeAIDiagnostics appName="nocss" />
      </body>
    </html>
  );
}

