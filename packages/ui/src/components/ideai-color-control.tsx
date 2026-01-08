/**
 * @fileoverview IdeaI Color Control - Complex Theme Toggle
 *
 * @module IdeAIColorControl
 * @description
 * Toggles a comprehensive rainbow complex color theme on the entire site.
 * Uses CSS custom properties following Next.js/Tailwind/Shadcn best practices.
 *
 * When active, applies vibrant multi-color theme with extended palette including:
 * - Primary/Secondary/Accent (vibrant rainbow)
 * - Success, Warning, Info, Error colors
 * - Extended color families (purple, pink, orange, cyan)
 * - Works seamlessly with light and dark modes
 *
 * @example
 * ```tsx
 * <IdeAIColorControl />
 * ```
 */

"use client";

import * as React from "react";
import { Palette } from "lucide-react";
import { useTheme } from "next-themes";
import { rainbowComplexTheme } from "../themes/rainbow-complex-theme";

export function IdeAIColorControl() {
  const [isActive, setIsActive] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);
  const { theme: currentMode } = useTheme();

  // Prevent hydration mismatch
  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Apply or remove theme
  React.useEffect(() => {
    if (!mounted) return;

    const root = document.documentElement;

    if (isActive) {
      // Apply rainbow complex theme
      // Check if dark mode is active (next-themes adds .dark class)
      const isDark = root.classList.contains("dark");
      const colors = isDark
        ? rainbowComplexTheme.dark
        : rainbowComplexTheme.colors;

      // Set CSS variables on :root
      Object.entries(colors).forEach(([key, value]) => {
        // Convert camelCase to kebab-case (e.g., primaryForeground -> primary-foreground)
        const cssVarName = key.replace(/([A-Z])/g, "-$1").toLowerCase();
        // Extract HSL values (remove "hsl(" and ")")
        const cssValue = value.replace(/^hsl\(|\)$/g, "");
        root.style.setProperty(`--${cssVarName}`, cssValue);
      });

      // Add theme class for styling hooks
      root.classList.add("ideai-rainbow-theme");
    } else {
      // Remove theme - reset to default
      // Get all CSS variables we set and remove them (let defaults take over)
      Object.keys(rainbowComplexTheme.colors).forEach((key) => {
        const cssVarName = key.replace(/([A-Z])/g, "-$1").toLowerCase();
        root.style.removeProperty(`--${cssVarName}`);
      });

      root.classList.remove("ideai-rainbow-theme");
    }
  }, [isActive, mounted, currentMode]);

  // Watch for dark mode changes when theme is active
  React.useEffect(() => {
    if (!mounted || !isActive) return;

    const root = document.documentElement;

    // Watch for dark mode class changes
    const observer = new MutationObserver(() => {
      const isDark = root.classList.contains("dark");
      const colors = isDark
        ? rainbowComplexTheme.dark
        : rainbowComplexTheme.colors;

      // Update CSS variables when dark mode toggles
      Object.entries(colors).forEach(([key, value]) => {
        const cssVarName = key.replace(/([A-Z])/g, "-$1").toLowerCase();
        const cssValue = value.replace(/^hsl\(|\)$/g, "");
        root.style.setProperty(`--${cssVarName}`, cssValue);
      });
    });

    observer.observe(root, { attributes: true, attributeFilter: ["class"] });

    return () => observer.disconnect();
  }, [isActive, mounted]);

  if (!mounted) {
    return (
      <button
        type="button"
        className="ideai-color-control"
        aria-label="Toggle color theme"
        disabled
      >
        <Palette className="h-5 w-5" />
      </button>
    );
  }

  return (
    <button
      type="button"
      className={`ideai-color-control ${isActive ? "ideai-color-control--active" : ""}`}
      onClick={() => setIsActive(!isActive)}
      aria-label={isActive ? "Remove rainbow theme" : "Apply rainbow theme"}
      title={isActive ? "Remove rainbow theme" : "Apply rainbow theme"}
    >
      <Palette className="h-5 w-5" />
    </button>
  );
}
