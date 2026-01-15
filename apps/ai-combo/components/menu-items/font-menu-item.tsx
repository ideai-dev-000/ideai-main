/**
 * @fileoverview Font Menu Item for IdeaI Menu
 *
 * @module FontMenuItem
 * @description
 * Font selector that can be used in IdeaI menus.
 * Allows toggling between different font families.
 */

"use client";

import { Type } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  FONT_DEFINITIONS,
  DEFAULT_FONT_CONFIG,
  type FontFamily,
  type FontMono,
  type FontConfig,
  getFontVariables,
} from "@/lib/font-config";

export function FontMenuItem() {
  const [config, setConfig] = useState<FontConfig>(DEFAULT_FONT_CONFIG);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Load saved font config from localStorage
    const saved = localStorage.getItem("ideai-font-config");
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as FontConfig;
        setConfig(parsed);
      } catch {
        // Invalid config, use default
      }
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;

    // Apply font variables to document
    const root = document.documentElement;
    const variables = getFontVariables(config);

    // Remove all font variables first
    Object.values(FONT_DEFINITIONS.sans).forEach((def) => {
      if (def.variable) {
        root.classList.remove(def.variable);
      }
    });
    Object.values(FONT_DEFINITIONS.mono).forEach((def) => {
      if (def.variable) {
        root.classList.remove(def.variable);
      }
    });

    // Add current font variables
    const sansDef = FONT_DEFINITIONS.sans[config.sans];
    const monoDef = FONT_DEFINITIONS.mono[config.mono];

    if (sansDef.variable) {
      root.classList.add(sansDef.variable);
    }
    if (monoDef.variable) {
      root.classList.add(monoDef.variable);
    }

    // Save to localStorage
    localStorage.setItem("ideai-font-config", JSON.stringify(config));
  }, [config, mounted]);

  if (!mounted) {
    return (
      <div className="px-3 py-2 text-sm text-slate-500 dark:text-slate-400">
        Loading fonts...
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Sans Serif Font */}
      <div>
        <div className="flex items-center gap-2 px-3 py-2 mb-2">
          <Type className="h-4 w-4" />
          <span className="text-sm font-medium">Sans Serif</span>
        </div>
        <div className="space-y-1 px-3">
          {(Object.keys(FONT_DEFINITIONS.sans) as FontFamily[]).map(
            (fontKey) => {
              const fontDef = FONT_DEFINITIONS.sans[fontKey];
              return (
                <Button
                  key={fontKey}
                  variant={config.sans === fontKey ? "default" : "ghost"}
                  size="sm"
                  className="w-full justify-start text-xs"
                  onClick={() => setConfig({ ...config, sans: fontKey })}
                  title={fontDef.description}
                >
                  <span className="font-medium">{fontDef.name}</span>
                </Button>
              );
            },
          )}
        </div>
      </div>

      {/* Monospace Font */}
      <div>
        <div className="flex items-center gap-2 px-3 py-2 mb-2">
          <Type className="h-4 w-4" />
          <span className="text-sm font-medium">Monospace</span>
        </div>
        <div className="space-y-1 px-3">
          {(Object.keys(FONT_DEFINITIONS.mono) as FontMono[]).map((fontKey) => {
            const fontDef = FONT_DEFINITIONS.mono[fontKey];
            return (
              <Button
                key={fontKey}
                variant={config.mono === fontKey ? "default" : "ghost"}
                size="sm"
                className="w-full justify-start text-xs"
                onClick={() => setConfig({ ...config, mono: fontKey })}
                title={fontDef.description}
              >
                <span className="font-medium">{fontDef.name}</span>
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
