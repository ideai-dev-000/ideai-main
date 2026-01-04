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

  // Update theme variables when theme or mode changes
  useEffect(() => {
    if (!mounted) return;
    
    const root = document.documentElement;
    const theme = themes[currentTheme];
    
    const updateTheme = () => {
      // Check if dark mode is active (next-themes adds .dark class)
      const isDark = root.classList.contains('dark');
      const colors = isDark ? theme.dark : theme.colors;
      
      console.log('[ThemeSwitcher] Updating theme:', currentTheme, 'isDark:', isDark);
      
      // Set CSS variables - inline styles on root should override CSS
      // Note: CSS variables don't support !important, but inline styles have highest specificity
      Object.entries(colors).forEach(([key, value]) => {
        const cssVarName = key.replace(/([A-Z])/g, '-$1').toLowerCase();
        const cssValue = value.replace(/^hsl\(|\)$/g, '');
        root.style.setProperty(`--${cssVarName}`, cssValue);
        console.log(`[ThemeSwitcher] Set --${cssVarName} = ${cssValue}`);
      });
      
      // Verify variables were set
      const testVar = getComputedStyle(root).getPropertyValue('--primary').trim();
      console.log('[ThemeSwitcher] Verified --primary =', testVar);
    };

    // Initial update
    updateTheme();
    
    // Watch for dark mode class changes (when sun/moon toggle is used)
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          console.log('[ThemeSwitcher] Dark mode class changed');
          updateTheme();
        }
      });
    });
    observer.observe(root, { attributes: true, attributeFilter: ['class'] });
    
    return () => observer.disconnect();
  }, [currentTheme, mounted]);

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
