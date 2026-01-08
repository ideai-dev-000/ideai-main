/**
 * @fileoverview Orange Theme - Warm orange color theme
 *
 * @module OrangeTheme
 * @description
 * Comprehensive warm orange color theme with multiple color families.
 * Lightweight CSS variable-based theming following Next.js/Tailwind/Shadcn best practices.
 *
 * All colors, fonts, tints, and keyline widths are centrally defined here.
 */

export const orangeTheme = {
  name: "orange",
  displayName: "Orange",
  colors: {
    // Core colors - Warm orange palette
    primary: "hsl(24 95% 55%)", // Vibrant orange
    primaryForeground: "hsl(0 0% 100%)",

    secondary: "hsl(38 92% 55%)", // Golden orange
    secondaryForeground: "hsl(24 95% 20%)",

    accent: "hsl(15 100% 50%)", // Deep orange
    accentForeground: "hsl(0 0% 100%)",

    // Extended palette - Success, Warning, Info, Error
    success: "hsl(142 76% 50%)",
    successForeground: "hsl(0 0% 100%)",

    warning: "hsl(38 92% 55%)", // Golden yellow
    warningForeground: "hsl(24 95% 20%)",

    info: "hsl(199 89% 55%)", // Sky blue
    infoForeground: "hsl(0 0% 100%)",

    error: "hsl(0 84% 60%)", // Bright red
    errorForeground: "hsl(0 0% 100%)",

    // Additional warm colors
    purple: "hsl(280 85% 60%)",
    purpleForeground: "hsl(0 0% 100%)",

    pink: "hsl(330 81% 60%)",
    pinkForeground: "hsl(0 0% 100%)",

    orange: "hsl(24 95% 55%)",
    orangeForeground: "hsl(0 0% 100%)",

    cyan: "hsl(187 85% 53%)",
    cyanForeground: "hsl(0 0% 100%)",

    // Neutral colors - Warm tints
    muted: "hsl(24 30% 96%)",
    mutedForeground: "hsl(24 40% 30%)",

    border: "hsl(24 40% 85%)",
    input: "hsl(24 40% 90%)",
    ring: "hsl(24 95% 55%)",

    background: "hsl(24 20% 98%)",
    foreground: "hsl(24 40% 20%)",

    card: "hsl(0 0% 100%)",
    cardForeground: "hsl(24 40% 20%)",

    popover: "hsl(0 0% 100%)",
    popoverForeground: "hsl(24 40% 20%)",
  },
  dark: {
    // Core colors - Warm orange adjusted for dark mode
    primary: "hsl(24 95% 65%)",
    primaryForeground: "hsl(24 95% 10%)",

    secondary: "hsl(38 92% 65%)",
    secondaryForeground: "hsl(38 92% 10%)",

    accent: "hsl(15 100% 60%)",
    accentForeground: "hsl(15 100% 10%)",

    // Extended palette - Adjusted for dark mode
    success: "hsl(142 76% 60%)",
    successForeground: "hsl(142 76% 10%)",

    warning: "hsl(38 92% 65%)",
    warningForeground: "hsl(38 92% 10%)",

    info: "hsl(199 89% 65%)",
    infoForeground: "hsl(199 89% 10%)",

    error: "hsl(0 84% 65%)",
    errorForeground: "hsl(0 84% 10%)",

    // Additional warm colors
    purple: "hsl(280 85% 70%)",
    purpleForeground: "hsl(280 30% 10%)",

    pink: "hsl(330 81% 70%)",
    pinkForeground: "hsl(330 30% 10%)",

    orange: "hsl(24 95% 65%)",
    orangeForeground: "hsl(24 95% 10%)",

    cyan: "hsl(187 85% 63%)",
    cyanForeground: "hsl(187 85% 10%)",

    // Neutral colors - Dark mode with warm tints
    muted: "hsl(24 40% 20%)",
    mutedForeground: "hsl(24 30% 85%)",

    border: "hsl(24 40% 25%)",
    input: "hsl(24 40% 25%)",
    ring: "hsl(24 95% 65%)",

    background: "hsl(24 50% 8%)",
    foreground: "hsl(24 30% 95%)",

    card: "hsl(24 50% 10%)",
    cardForeground: "hsl(24 30% 95%)",

    popover: "hsl(24 50% 10%)",
    popoverForeground: "hsl(24 30% 95%)",
  },
} as const;
