/**
 * @fileoverview Sunset Theme
 * 
 * @module SunsetTheme
 * @description
 * Warm sunset theme with oranges and purples.
 * Demonstrates vibrant color schemes.
 */

export const sunsetTheme = {
  name: "sunset",
  displayName: "Sunset",
  colors: {
    primary: "hsl(24 95% 53%)",
    primaryForeground: "hsl(0 0% 100%)",
    secondary: "hsl(280 80% 60%)",
    secondaryForeground: "hsl(0 0% 100%)",
    muted: "hsl(24 50% 90%)",
    mutedForeground: "hsl(24 95% 30%)",
    accent: "hsl(280 80% 60%)",
    accentForeground: "hsl(0 0% 100%)",
    destructive: "hsl(0 84.2% 60.2%)",
    destructiveForeground: "hsl(0 0% 100%)",
    border: "hsl(24 50% 80%)",
    input: "hsl(24 50% 85%)",
    ring: "hsl(24 95% 53%)",
    background: "hsl(24 30% 98%)",
    foreground: "hsl(24 95% 20%)",
    card: "hsl(0 0% 100%)",
    cardForeground: "hsl(24 95% 20%)",
  },
  dark: {
    primary: "hsl(24 95% 65%)",
    primaryForeground: "hsl(24 95% 10%)",
    secondary: "hsl(280 80% 50%)",
    secondaryForeground: "hsl(0 0% 100%)",
    muted: "hsl(24 50% 20%)",
    mutedForeground: "hsl(24 50% 80%)",
    accent: "hsl(280 80% 50%)",
    accentForeground: "hsl(0 0% 100%)",
    destructive: "hsl(0 62.8% 50%)",
    destructiveForeground: "hsl(0 0% 100%)",
    border: "hsl(24 50% 25%)",
    input: "hsl(24 50% 25%)",
    ring: "hsl(24 95% 65%)",
    background: "hsl(24 95% 8%)",
    foreground: "hsl(24 30% 95%)",
    card: "hsl(24 95% 10%)",
    cardForeground: "hsl(24 30% 95%)",
  },
} as const;

