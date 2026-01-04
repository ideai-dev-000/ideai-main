/**
 * @fileoverview Ocean Theme
 * 
 * @module OceanTheme
 * @description
 * Ocean-inspired theme with blues and teals.
 * Demonstrates how to create custom themes.
 */

export const oceanTheme = {
  name: "ocean",
  displayName: "Ocean",
  colors: {
    primary: "hsl(199 89% 48%)",
    primaryForeground: "hsl(0 0% 100%)",
    secondary: "hsl(187 85% 53%)",
    secondaryForeground: "hsl(199 89% 20%)",
    muted: "hsl(187 50% 90%)",
    mutedForeground: "hsl(199 89% 30%)",
    accent: "hsl(187 85% 53%)",
    accentForeground: "hsl(199 89% 20%)",
    destructive: "hsl(0 84.2% 60.2%)",
    destructiveForeground: "hsl(0 0% 100%)",
    border: "hsl(187 50% 80%)",
    input: "hsl(187 50% 85%)",
    ring: "hsl(199 89% 48%)",
    background: "hsl(187 50% 98%)",
    foreground: "hsl(199 89% 20%)",
    card: "hsl(0 0% 100%)",
    cardForeground: "hsl(199 89% 20%)",
  },
  dark: {
    primary: "hsl(199 89% 60%)",
    primaryForeground: "hsl(199 89% 10%)",
    secondary: "hsl(187 85% 40%)",
    secondaryForeground: "hsl(0 0% 100%)",
    muted: "hsl(199 50% 20%)",
    mutedForeground: "hsl(187 50% 80%)",
    accent: "hsl(187 85% 40%)",
    accentForeground: "hsl(0 0% 100%)",
    destructive: "hsl(0 62.8% 50%)",
    destructiveForeground: "hsl(0 0% 100%)",
    border: "hsl(199 50% 25%)",
    input: "hsl(199 50% 25%)",
    ring: "hsl(199 89% 60%)",
    background: "hsl(199 89% 8%)",
    foreground: "hsl(187 50% 95%)",
    card: "hsl(199 89% 10%)",
    cardForeground: "hsl(187 50% 95%)",
  },
} as const;

