/**
 * @fileoverview Compact Theme Switcher
 * 
 * @module ThemeSwitcherCompact
 * @description
 * Compact theme switcher for header use.
 * Shows current theme and allows quick switching.
 */

"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { themes, type ThemeName } from "@/themes";
import { useTheme } from "next-themes";

export function ThemeSwitcherCompact() {
  const { theme: currentMode, setTheme: setMode } = useTheme();
  const [currentTheme, setCurrentTheme] = useState<ThemeName>("default");
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    // Apply theme CSS variables
    const root = document.documentElement;
    const theme = themes[currentTheme];
    const colors = currentMode === "dark" ? theme.dark : theme.colors;

    // Set CSS variables - colors are already in HSL format
    Object.entries(colors).forEach(([key, value]) => {
      // Convert camelCase to kebab-case (e.g., primaryForeground -> primary-foreground)
      const cssVarName = key.replace(/([A-Z])/g, '-$1').toLowerCase();
      // Strip hsl() wrapper if present - CSS variables should just have the values
      // Tailwind will wrap them in hsl() when used
      const cssValue = value.replace(/^hsl\(|\)$/g, '');
      root.style.setProperty(`--${cssVarName}`, cssValue);
    });
  }, [currentTheme, currentMode, mounted]);

  if (!mounted) {
    return (
      <Button variant="outline" size="sm" disabled>
        Theme
      </Button>
    );
  }

  return (
    <div className="relative">
      <Button 
        variant="outline" 
        size="sm" 
        className="gap-2"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="hidden sm:inline">{themes[currentTheme].displayName}</span>
        <span className="sm:hidden">Theme</span>
        <span className="text-xs opacity-60">•</span>
        <span className="text-xs capitalize">{currentMode}</span>
      </Button>
      
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-full mt-2 w-48 rounded-lg border bg-card shadow-lg z-50">
            <div className="p-2 space-y-1">
              <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                Themes
              </div>
              {Object.entries(themes).map(([name, theme]) => (
                <button
                  key={name}
                  onClick={() => {
                    setCurrentTheme(name as ThemeName);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-2 py-1.5 text-sm rounded-md hover:bg-accent flex items-center justify-between ${
                    currentTheme === name ? "bg-accent" : ""
                  }`}
                >
                  <span>{theme.displayName}</span>
                  {currentTheme === name && <span className="text-xs">✓</span>}
                </button>
              ))}
              <div className="border-t my-1" />
              <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                Mode
              </div>
              <button
                onClick={() => {
                  setMode("light");
                  setIsOpen(false);
                }}
                className={`w-full text-left px-2 py-1.5 text-sm rounded-md hover:bg-accent flex items-center justify-between ${
                  currentMode === "light" ? "bg-accent" : ""
                }`}
              >
                <span>Light</span>
                {currentMode === "light" && <span className="text-xs">✓</span>}
              </button>
              <button
                onClick={() => {
                  setMode("dark");
                  setIsOpen(false);
                }}
                className={`w-full text-left px-2 py-1.5 text-sm rounded-md hover:bg-accent flex items-center justify-between ${
                  currentMode === "dark" ? "bg-accent" : ""
                }`}
              >
                <span>Dark</span>
                {currentMode === "dark" && <span className="text-xs">✓</span>}
              </button>
              <button
                onClick={() => {
                  setMode("system");
                  setIsOpen(false);
                }}
                className={`w-full text-left px-2 py-1.5 text-sm rounded-md hover:bg-accent flex items-center justify-between ${
                  currentMode === "system" ? "bg-accent" : ""
                }`}
              >
                <span>System</span>
                {currentMode === "system" && <span className="text-xs">✓</span>}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
