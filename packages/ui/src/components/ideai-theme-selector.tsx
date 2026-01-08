/**
 * @fileoverview IdeaI Theme Selector - Theme selection dropdown
 *
 * @module IdeAIThemeSelector
 * @description
 * Dropdown/popover component for selecting color themes.
 * Shows all available themes with visual previews.
 * Supports selecting a theme or "None" to turn off custom themes.
 *
 * @example
 * ```tsx
 * <IdeAIThemeSelector />
 * ```
 */

"use client";

import * as React from "react";
import { Palette, Check } from "lucide-react";
import { useTheme } from "next-themes";
import { themes, getTheme, type ThemeName } from "../themes";

export function IdeAIThemeSelector() {
  const [currentTheme, setCurrentTheme] = React.useState<ThemeName>(null);
  const [mounted, setMounted] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(false);
  const { theme: currentMode } = useTheme();
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const popoverRef = React.useRef<HTMLDivElement>(null);

  // Prevent hydration mismatch
  React.useEffect(() => {
    setMounted(true);
    // Load saved theme from localStorage
    const saved = localStorage.getItem("ideai-theme") as ThemeName | null;
    if (saved && (saved === null || themes[saved])) {
      setCurrentTheme(saved);
    }
  }, []);

  // Apply theme
  React.useEffect(() => {
    if (!mounted) return;

    const root = document.documentElement;
    const theme = getTheme(currentTheme);

    if (theme) {
      // Apply theme
      const isDark = root.classList.contains("dark");
      const colors = isDark ? theme.dark : theme.colors;

      // Set CSS variables on :root
      Object.entries(colors).forEach(([key, value]) => {
        const cssVarName = key.replace(/([A-Z])/g, "-$1").toLowerCase();
        const cssValue = value.replace(/^hsl\(|\)$/g, "");
        root.style.setProperty(`--${cssVarName}`, cssValue);
      });

      // Add theme class
      root.classList.add(`ideai-theme-${theme.name}`);

      // Save to localStorage
      localStorage.setItem("ideai-theme", theme.name);
    } else {
      // Remove theme - reset to default
      const allThemeNames = Object.keys(themes) as ThemeName[];
      allThemeNames.forEach((themeName) => {
        const themeToRemove = themes[themeName];
        if (themeToRemove) {
          Object.keys(themeToRemove.colors).forEach((key) => {
            const cssVarName = key.replace(/([A-Z])/g, "-$1").toLowerCase();
            root.style.removeProperty(`--${cssVarName}`);
          });
          root.classList.remove(`ideai-theme-${themeToRemove.name}`);
        }
      });

      localStorage.removeItem("ideai-theme");
    }
  }, [currentTheme, mounted, currentMode]);

  // Watch for dark mode changes when theme is active
  React.useEffect(() => {
    if (!mounted || !currentTheme) return;

    const root = document.documentElement;
    const theme = getTheme(currentTheme);
    if (!theme) return;

    // Watch for dark mode class changes
    const observer = new MutationObserver(() => {
      const isDark = root.classList.contains("dark");
      const colors = isDark ? theme.dark : theme.colors;

      // Update CSS variables when dark mode toggles
      Object.entries(colors).forEach(([key, value]) => {
        const cssVarName = key.replace(/([A-Z])/g, "-$1").toLowerCase();
        const cssValue = value.replace(/^hsl\(|\)$/g, "");
        root.style.setProperty(`--${cssVarName}`, cssValue);
      });
    });

    observer.observe(root, { attributes: true, attributeFilter: ["class"] });

    return () => observer.disconnect();
  }, [currentTheme, mounted]);

  // Close popover when clicking outside
  React.useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  if (!mounted) {
    return (
      <button
        type="button"
        className="ideai-color-control"
        aria-label="Select theme"
        disabled
      >
        <Palette className="h-5 w-5" />
      </button>
    );
  }

  const handleThemeSelect = (themeName: ThemeName) => {
    setCurrentTheme(themeName);
    setIsOpen(false);
  };

  return (
    <div className="ideai-theme-selector">
      <button
        ref={buttonRef}
        type="button"
        className={`ideai-color-control ${currentTheme ? "ideai-color-control--active" : ""}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Select theme"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <Palette className="h-5 w-5" />
      </button>

      {isOpen && (
        <div
          ref={popoverRef}
          className="ideai-theme-selector__popover"
          role="menu"
        >
          <div className="ideai-theme-selector__header">
            <span className="ideai-theme-selector__title">Select Theme</span>
          </div>
          <div className="ideai-theme-selector__list">
            {/* None option */}
            <button
              type="button"
              className={`ideai-theme-selector__item ${currentTheme === null ? "ideai-theme-selector__item--active" : ""}`}
              onClick={() => handleThemeSelect(null)}
              role="menuitem"
            >
              <span className="ideai-theme-selector__item-name">None</span>
              {currentTheme === null && <Check className="h-4 w-4" />}
            </button>

            {/* Theme options */}
            {Object.values(themes).map((theme) => (
              <button
                key={theme.name}
                type="button"
                className={`ideai-theme-selector__item ${currentTheme === theme.name ? "ideai-theme-selector__item--active" : ""}`}
                onClick={() => handleThemeSelect(theme.name as ThemeName)}
                role="menuitem"
              >
                <span className="ideai-theme-selector__item-name">
                  {theme.displayName}
                </span>
                {currentTheme === theme.name && <Check className="h-4 w-4" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
