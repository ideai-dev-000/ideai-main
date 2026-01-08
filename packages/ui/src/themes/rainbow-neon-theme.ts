/**
 * @fileoverview Rainbow Neon Theme - Vibrant neon rainbow theme
 *
 * @module RainbowNeonTheme
 * @description
 * Comprehensive neon rainbow color theme with multiple color families.
 * Lightweight CSS variable-based theming following Next.js/Tailwind/Shadcn best practices.
 *
 * All colors, fonts, tints, and keyline widths are centrally defined here.
 */

export const rainbowNeonTheme = {
  name: "rainbow-neon",
  displayName: "Rainbow Neon",
  colors: {
    // Core colors - Vibrant neon rainbow palette
    primary: "hsl(280 85% 60%)", // Vibrant purple
    primaryForeground: "hsl(0 0% 100%)",

    secondary: "hsl(199 89% 55%)", // Electric blue
    secondaryForeground: "hsl(0 0% 100%)",

    accent: "hsl(142 76% 50%)", // Bright green
    accentForeground: "hsl(0 0% 100%)",

    // Extended palette - Success, Warning, Info, Error
    success: "hsl(142 76% 50%)",
    successForeground: "hsl(0 0% 100%)",

    warning: "hsl(38 92% 55%)", // Golden yellow
    warningForeground: "hsl(0 0% 100%)",

    info: "hsl(199 89% 55%)", // Sky blue
    infoForeground: "hsl(0 0% 100%)",

    error: "hsl(0 84% 60%)", // Bright red
    errorForeground: "hsl(0 0% 100%)",

    // Additional vibrant colors
    purple: "hsl(280 85% 60%)",
    purpleForeground: "hsl(0 0% 100%)",

    pink: "hsl(330 81% 60%)",
    pinkForeground: "hsl(0 0% 100%)",

    orange: "hsl(24 95% 55%)",
    orangeForeground: "hsl(0 0% 100%)",

    cyan: "hsl(187 85% 53%)",
    cyanForeground: "hsl(0 0% 100%)",

    // Neutral colors
    muted: "hsl(280 20% 96%)",
    mutedForeground: "hsl(280 30% 30%)",

    border: "hsl(280 30% 85%)",
    input: "hsl(280 30% 90%)",
    ring: "hsl(280 85% 60%)",

    background: "hsl(280 15% 98%)",
    foreground: "hsl(280 30% 20%)",

    card: "hsl(0 0% 100%)",
    cardForeground: "hsl(280 30% 20%)",

    popover: "hsl(0 0% 100%)",
    popoverForeground: "hsl(280 30% 20%)",
  },
  dark: {
    // Core colors - Vibrant neon adjusted for dark mode
    primary: "hsl(280 85% 70%)",
    primaryForeground: "hsl(280 30% 10%)",

    secondary: "hsl(199 89% 65%)",
    secondaryForeground: "hsl(199 89% 10%)",

    accent: "hsl(142 76% 60%)",
    accentForeground: "hsl(142 76% 10%)",

    // Extended palette - Adjusted for dark mode
    success: "hsl(142 76% 60%)",
    successForeground: "hsl(142 76% 10%)",

    warning: "hsl(38 92% 65%)",
    warningForeground: "hsl(38 92% 10%)",

    info: "hsl(199 89% 65%)",
    infoForeground: "hsl(199 89% 10%)",

    error: "hsl(0 84% 65%)",
    errorForeground: "hsl(0 84% 10%)",

    // Additional vibrant colors
    purple: "hsl(280 85% 70%)",
    purpleForeground: "hsl(280 30% 10%)",

    pink: "hsl(330 81% 70%)",
    pinkForeground: "hsl(330 30% 10%)",

    orange: "hsl(24 95% 65%)",
    orangeForeground: "hsl(24 95% 10%)",

    cyan: "hsl(187 85% 63%)",
    cyanForeground: "hsl(187 85% 10%)",

    // Neutral colors - Dark mode
    muted: "hsl(280 30% 20%)",
    mutedForeground: "hsl(280 20% 85%)",

    border: "hsl(280 30% 25%)",
    input: "hsl(280 30% 25%)",
    ring: "hsl(280 85% 70%)",

    background: "hsl(280 30% 8%)",
    foreground: "hsl(280 20% 95%)",

    card: "hsl(280 30% 10%)",
    cardForeground: "hsl(280 20% 95%)",

    popover: "hsl(280 30% 10%)",
    popoverForeground: "hsl(280 20% 95%)",
  },
} as const;
