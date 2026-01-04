/**
 * @fileoverview Theme Selector Component
 * 
 * @module ThemeSelector
 * @description
 * Component for selecting and applying themes.
 * Works independently of UI components - themes are applied via CSS variables.
 */

"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { themes, type ThemeName } from "@/themes";
import { useTheme } from "next-themes";

export function ThemeSelector() {
  const { theme: currentMode, setTheme: setMode } = useTheme();
  const [currentTheme, setCurrentTheme] = useState<ThemeName>("default");

  useEffect(() => {
    // Apply theme CSS variables
    const root = document.documentElement;
    const theme = themes[currentTheme];

    // Set CSS variables on :root (for light mode)
    Object.entries(theme.colors).forEach(([key, value]) => {
      const cssVarName = key.replace(/([A-Z])/g, '-$1').toLowerCase();
      const cssValue = value.replace(/^hsl\(|\)$/g, '');
      root.style.setProperty(`--${cssVarName}`, cssValue);
    });

    // Set CSS variables on .dark (for dark mode)
    Object.entries(theme.dark).forEach(([key, value]) => {
      const cssVarName = key.replace(/([A-Z])/g, '-$1').toLowerCase();
      const cssValue = value.replace(/^hsl\(|\)$/g, '');
      root.style.setProperty(`--${cssVarName}`, cssValue);
    });
  }, [currentTheme, currentMode]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Theme Selector</CardTitle>
        <CardDescription>
          Select a theme and mode. Themes work independently of UI components.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="text-sm font-semibold mb-2">Theme</h3>
          <div className="flex flex-wrap gap-2">
            {Object.entries(themes).map(([name, theme]) => (
              <Button
                key={name}
                variant={currentTheme === name ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentTheme(name as ThemeName)}
              >
                {theme.displayName}
              </Button>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-sm font-semibold mb-2">Mode</h3>
          <div className="flex gap-2">
            <Button
              variant={currentMode === "light" ? "default" : "outline"}
              size="sm"
              onClick={() => setMode("light")}
            >
              Light
            </Button>
            <Button
              variant={currentMode === "dark" ? "default" : "outline"}
              size="sm"
              onClick={() => setMode("dark")}
            >
              Dark
            </Button>
            <Button
              variant={currentMode === "system" ? "default" : "outline"}
              size="sm"
              onClick={() => setMode("system")}
            >
              System
            </Button>
          </div>
        </div>
        <div className="p-3 bg-muted rounded-lg">
          <p className="text-xs text-muted-foreground">
            <strong>Current:</strong> {themes[currentTheme].displayName} • {currentMode}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

