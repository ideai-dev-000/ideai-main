/**
 * @fileoverview Font Provider
 *
 * @module FontProvider
 * @description
 * Provides font configuration and applies font variables to the document.
 * Wraps the app to enable font toggling.
 */

"use client";

import { useEffect, useState } from "react";
import {
  DEFAULT_FONT_CONFIG,
  FONT_DEFINITIONS,
  type FontConfig,
} from "@/lib/font-config";

export function FontProvider({ children }: { children: React.ReactNode }) {
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

    // Remove all font variables first
    const allVariables = [
      "--font-geist-sans",
      "--font-geist-mono",
      "--font-inter-sans",
      "--font-inter-tight-sans",
      "--font-space-grotesk-sans",
      "--font-jetbrains-mono",
      "--font-space-mono",
    ];

    allVariables.forEach((varName) => {
      root.classList.remove(varName);
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

  // Expose setConfig via context if needed, but for now just apply it
  return <>{children}</>;
}
