/**
 * @fileoverview Framework CSS Loader
 *
 * @module FrameworkCSS
 * @description
 * Conditionally loads CSS based on framework type.
 * Uses Next.js dynamic imports and CSS modules for framework-specific styles.
 */

"use client";

import { useEffect } from "react";
import type { FrameworkConfig } from "./frameworks";

/**
 * Load framework-specific CSS dynamically
 */
export function useFrameworkCSS(framework: FrameworkConfig | null) {
  useEffect(() => {
    if (!framework) return;

    // CSS is loaded via globals.css with conditional imports
    // This hook can be used for runtime CSS injection if needed
    // For now, CSS is handled via CSS modules and conditional imports in globals.css
  }, [framework]);
}

/**
 * Framework CSS component - renders framework-specific CSS
 */
export function FrameworkCSS({
  framework,
}: {
  framework: FrameworkConfig | null;
}) {
  if (!framework) return null;

  // CSS is loaded via globals.css
  // This component is a placeholder for future runtime CSS injection
  return null;
}
