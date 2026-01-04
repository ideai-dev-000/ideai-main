/**
 * @fileoverview Theme Registry
 * 
 * @module ThemeRegistry
 * @description
 * Central registry for all available themes.
 * Add new themes here to make them available.
 */

import { defaultTheme } from "./default-theme";
import { oceanTheme } from "./ocean-theme";
import { sunsetTheme } from "./sunset-theme";

export type Theme = typeof defaultTheme;

export const themes = {
  default: defaultTheme,
  ocean: oceanTheme,
  sunset: sunsetTheme,
} as const;

export type ThemeName = keyof typeof themes;

export function getTheme(name: ThemeName): Theme {
  return themes[name];
}

export function getAllThemes(): Theme[] {
  return Object.values(themes);
}

