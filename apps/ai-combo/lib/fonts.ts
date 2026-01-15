/**
 * @fileoverview Font Definitions - Vercel Optimized Fonts
 *
 * @module Fonts
 * @description
 * All Vercel-optimized fonts are loaded here.
 * These fonts are used by default and can be toggled via font-config.ts.
 */

import {
  Geist,
  Geist_Mono,
  Inter,
  Inter_Tight,
  JetBrains_Mono,
  Space_Grotesk,
  Space_Mono,
} from "next/font/google";

// Geist (Vercel's default - very performant)
export const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  weight: "variable",
  display: "swap",
});

export const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  weight: "variable",
  display: "swap",
});

// Inter (Very popular, excellent readability)
export const interSans = Inter({
  variable: "--font-inter-sans",
  subsets: ["latin"],
  weight: "variable",
  display: "swap",
});

// Inter Tight (Tighter spacing variant)
export const interTightSans = Inter_Tight({
  variable: "--font-inter-tight-sans",
  subsets: ["latin"],
  weight: "variable",
  display: "swap",
});

// Space Grotesk (Modern, geometric)
export const spaceGroteskSans = Space_Grotesk({
  variable: "--font-space-grotesk-sans",
  subsets: ["latin"],
  weight: "variable",
  display: "swap",
});

// JetBrains Mono (Great for code)
export const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: "variable",
  display: "swap",
});

// Space Mono (Monospace with character)
export const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

// Default exports for backward compatibility
export const sans = geistSans;
export const mono = geistMono;
