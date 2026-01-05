/**
 * @fileoverview Theme Provider for Next.js 16 - Dark/Light Mode Toggle
 * 
 * @module ThemeProvider
 * @description
 * Next.js 16 best practice theme provider using next-themes.
 * Provides dark/light mode switching with system preference detection.
 * 
 * @example
 * ```tsx
 * <ThemeProvider>
 *   <App />
 * </ThemeProvider>
 * ```
 */

"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ThemeProviderProps } from "next-themes";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
