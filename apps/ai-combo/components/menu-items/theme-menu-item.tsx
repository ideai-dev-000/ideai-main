/**
 * @fileoverview Theme Menu Item for IdeaI Menu
 *
 * @module ThemeMenuItem
 * @description
 * Theme controls that can be used in IdeaI menus.
 * Includes theme toggle and theme selector.
 */

"use client";

import { Moon, Sun, Palette } from "lucide-react";
import { useTheme } from "next-themes";
import { ThemeToggle } from "@repo/ui";
import { IdeAIThemeSelector } from "@repo/ui";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export function ThemeMenuItem() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="px-3 py-2 text-sm text-slate-500 dark:text-slate-400">
        Loading theme...
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {/* Theme Mode Toggle */}
      <div className="flex items-center justify-between px-3 py-2">
        <div className="flex items-center gap-2">
          {theme === "dark" ? (
            <Moon className="h-4 w-4" />
          ) : (
            <Sun className="h-4 w-4" />
          )}
          <span className="text-sm font-medium">Theme Mode</span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={theme === "light" ? "default" : "ghost"}
            size="sm"
            onClick={() => setTheme("light")}
          >
            Light
          </Button>
          <Button
            variant={theme === "dark" ? "default" : "ghost"}
            size="sm"
            onClick={() => setTheme("dark")}
          >
            Dark
          </Button>
          <Button
            variant={theme === "system" ? "default" : "ghost"}
            size="sm"
            onClick={() => setTheme("system")}
          >
            System
          </Button>
        </div>
      </div>

      {/* Theme Color Selector */}
      <div className="px-3 py-2">
        <div className="flex items-center gap-2 mb-2">
          <Palette className="h-4 w-4" />
          <span className="text-sm font-medium">Theme Colors</span>
        </div>
        <IdeAIThemeSelector />
      </div>
    </div>
  );
}
