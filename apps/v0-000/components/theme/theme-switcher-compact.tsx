/**
 * @fileoverview Compact Theme Switcher
 * 
 * @module ThemeSwitcherCompact
 * @description
 * Compact theme switcher for header use.
 * Shows current theme and allows quick switching.
 */

"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { themes, type ThemeName } from "@/themes";
import { useTheme } from "next-themes";

export function ThemeSwitcherCompact() {
  const { theme: currentMode, setTheme: setMode } = useTheme();
  const [currentTheme, setCurrentTheme] = useState<ThemeName>("default");
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Update theme variables when theme or mode changes
  useEffect(() => {
    if (!mounted) return;
    
    const root = document.documentElement;
    const theme = themes[currentTheme];
    
    const updateTheme = () => {
      // Check if dark mode is active (next-themes adds .dark class)
      const isDark = root.classList.contains('dark');
      const colors = isDark ? theme.dark : theme.colors;
      
      console.log('[ThemeSwitcher] Updating theme:', currentTheme, 'isDark:', isDark, 'currentMode:', currentMode);
      
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
    
    // Watch for dark mode class changes (when sun/moon toggle is used OR when dropdown changes mode)
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          console.log('[ThemeSwitcher] Dark mode class changed via MutationObserver');
          // Small delay to ensure next-themes has finished updating
          setTimeout(updateTheme, 10);
        }
      });
    });
    observer.observe(root, { attributes: true, attributeFilter: ['class'] });
    
    // Also update when currentMode changes (for immediate response)
    // Use a small timeout to let next-themes update the DOM first
    const timeoutId = setTimeout(() => {
      console.log('[ThemeSwitcher] Mode changed, updating theme');
      updateTheme();
    }, 50);
    
    return () => {
      observer.disconnect();
      clearTimeout(timeoutId);
    };
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
        ref={buttonRef}
        variant="outline" 
        size="sm" 
        className="gap-2"
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
      >
        <span className="hidden sm:inline">{themes[currentTheme].displayName}</span>
        <span className="sm:hidden">Theme</span>
        <span className="text-xs opacity-60">•</span>
        <span className="text-xs capitalize">{actualMode || "system"}</span>
      </Button>
      
      {isOpen && (
        <div 
          ref={dropdownRef}
          className="absolute right-0 top-full mt-2 w-48 rounded-lg border bg-card shadow-lg z-50"
          onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
            <div className="p-2 space-y-1">
              <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                Themes
              </div>
              {Object.entries(themes).map(([name, theme]) => (
                <button
                  key={name}
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('[ThemeSwitcher] Theme clicked:', name);
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
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  console.log('[ThemeSwitcher] Mode clicked: light');
                  setMode("light");
                  // Force immediate update - don't wait for next-themes
                  const root = document.documentElement;
                  root.classList.remove('dark');
                  const theme = themes[currentTheme];
                  const colors = theme.colors; // Light mode colors
                  Object.entries(colors).forEach(([key, value]) => {
                    const cssVarName = key.replace(/([A-Z])/g, '-$1').toLowerCase();
                    const cssValue = value.replace(/^hsl\(|\)$/g, '');
                    root.style.setProperty(`--${cssVarName}`, cssValue);
                  });
                  console.log('[ThemeSwitcher] Force updated to light mode immediately');
                  setIsOpen(false);
                }}
                className={`w-full text-left px-2 py-1.5 text-sm rounded-md hover:bg-accent flex items-center justify-between ${
                  actualMode === "light" ? "bg-accent" : ""
                }`}
              >
                <span>Light</span>
                {actualMode === "light" && <span className="text-xs">✓</span>}
              </button>
              <button
                type="button"
                onClick={async (e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  console.log('[ThemeSwitcher] Mode clicked: dark');
                  await setMode("dark");
                  // Force immediate update after mode change
                  setTimeout(() => {
                    const root = document.documentElement;
                    const theme = themes[currentTheme];
                    const colors = theme.dark; // Dark mode colors
                    Object.entries(colors).forEach(([key, value]) => {
                      const cssVarName = key.replace(/([A-Z])/g, '-$1').toLowerCase();
                      const cssValue = value.replace(/^hsl\(|\)$/g, '');
                      root.style.setProperty(`--${cssVarName}`, cssValue);
                    });
                    console.log('[ThemeSwitcher] Force updated to dark mode');
                  }, 100);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-2 py-1.5 text-sm rounded-md hover:bg-accent flex items-center justify-between ${
                  actualMode === "dark" ? "bg-accent" : ""
                }`}
              >
                <span>Dark</span>
                {actualMode === "dark" && <span className="text-xs">✓</span>}
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  console.log('[ThemeSwitcher] Mode clicked: system');
                  setMode("system");
                  // Force update after system mode change (will use system preference)
                  setTimeout(() => {
                    const root = document.documentElement;
                    const theme = themes[currentTheme];
                    const isDark = root.classList.contains('dark');
                    const colors = isDark ? theme.dark : theme.colors;
                    Object.entries(colors).forEach(([key, value]) => {
                      const cssVarName = key.replace(/([A-Z])/g, '-$1').toLowerCase();
                      const cssValue = value.replace(/^hsl\(|\)$/g, '');
                      root.style.setProperty(`--${cssVarName}`, cssValue);
                    });
                    console.log('[ThemeSwitcher] Force updated to system mode, isDark:', isDark);
                  }, 150);
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
      )}
    </div>
  );
}
