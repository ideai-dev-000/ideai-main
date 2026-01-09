/**
 * @fileoverview Central Theme Registry
 *
 * @module ThemeRegistry
 * @description
 * Centralized registry for all IdeaI color themes.
 * All themes are lightweight CSS variable-based, sprinkling on top of robust IdeaI base.
 *
 * Themes are defined with:
 * - Colors (fonts, tints, keyline widths via CSS variables)
 * - Light and dark mode variants
 * - Centralized configuration for easy maintenance
 */

import { rainbowNeonTheme } from "./rainbow-neon-theme";
import { orangeTheme } from "./orange-theme";

export type Theme = typeof rainbowNeonTheme;

export const themes = {
  "rainbow-neon": rainbowNeonTheme,
  orange: orangeTheme,
} as const;

export type ThemeName = keyof typeof themes | null;

export function getTheme(name: ThemeName): Theme | null {
  if (!name) return null;
  return (themes[name as keyof typeof themes] as Theme) || null;
}

export function getAllThemes(): Theme[] {
  return Object.values(themes) as Theme[];
}

export function getThemeNames(): ThemeName[] {
  return Object.keys(themes) as ThemeName[];
}
