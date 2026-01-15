/**
 * @fileoverview Font Configuration
 *
 * @module FontConfig
 * @description
 * Centralized font configuration using Vercel's optimized fonts.
 * Supports multiple font families with toggle capability.
 */

import {
  geistSans,
  geistMono,
  interSans,
  jetbrainsMono,
  spaceGroteskSans,
  spaceMono,
} from "./fonts";

export type FontFamily =
  | "geist"
  | "inter"
  | "inter-tight"
  | "space-grotesk"
  | "system";
export type FontMono =
  | "geist-mono"
  | "jetbrains-mono"
  | "space-mono"
  | "system";

export interface FontConfig {
  sans: FontFamily;
  mono: FontMono;
}

// Fonts are imported from fonts.ts

/**
 * Font definitions with metadata
 */
export const FONT_DEFINITIONS = {
  sans: {
    geist: {
      font: geistSans,
      name: "Geist",
      description: "Vercel's default font - optimized for performance",
      variable: "--font-geist-sans",
    },
    inter: {
      font: interSans,
      name: "Inter",
      description: "Highly readable, popular choice",
      variable: "--font-inter-sans",
    },
    "inter-tight": {
      font: interSans, // Using interSans for now, can add interTightSans later
      name: "Inter Tight",
      description: "Inter with tighter spacing",
      variable: "--font-inter-sans",
    },
    "space-grotesk": {
      font: spaceGroteskSans,
      name: "Space Grotesk",
      description: "Modern geometric sans-serif",
      variable: "--font-space-grotesk-sans",
    },
    system: {
      font: null,
      name: "System",
      description: "Use system default fonts",
      variable: null,
    },
  },
  mono: {
    "geist-mono": {
      font: geistMono,
      name: "Geist Mono",
      description: "Vercel's monospace font",
      variable: "--font-geist-mono",
    },
    "jetbrains-mono": {
      font: jetbrainsMono,
      name: "JetBrains Mono",
      description: "Excellent for code editing",
      variable: "--font-jetbrains-mono",
    },
    "space-mono": {
      font: spaceMono,
      name: "Space Mono",
      description: "Monospace with character",
      variable: "--font-space-mono",
    },
    system: {
      font: null,
      name: "System",
      description: "Use system default monospace",
      variable: null,
    },
  },
} as const;

/**
 * Default font configuration
 */
export const DEFAULT_FONT_CONFIG: FontConfig = {
  sans: "geist",
  mono: "geist-mono",
};

/**
 * Get all font variables for a given config
 */
export function getFontVariables(config: FontConfig): string {
  const sansDef = FONT_DEFINITIONS.sans[config.sans];
  const monoDef = FONT_DEFINITIONS.mono[config.mono];

  const variables: string[] = [];
  if (sansDef.variable) variables.push(sansDef.variable);
  if (monoDef.variable) variables.push(monoDef.variable);

  return variables.join(" ");
}

/**
 * Get all font class names for a given config
 */
export function getFontClasses(config: FontConfig): string {
  const sansDef = FONT_DEFINITIONS.sans[config.sans];
  const monoDef = FONT_DEFINITIONS.mono[config.mono];

  const classes: string[] = [];
  if (sansDef.font) classes.push(sansDef.font.className);
  if (monoDef.font) classes.push(monoDef.font.className);

  return classes.join(" ");
}
