/**
 * @fileoverview UnoCSS configuration for /unocss app
 */

import { defineConfig, presetUno, presetAttributify } from "unocss";

export default defineConfig({
  presets: [
    presetUno(),
    presetAttributify(),
  ],
  content: {
    filesystem: [
      "./app/**/*.{js,ts,jsx,tsx}",
      "../../packages/ui/src/**/*.{js,ts,jsx,tsx}",
    ],
  },
  theme: {
    colors: {
      // Match Tailwind colors for consistency
      slate: {
        50: "#f8fafc",
        100: "#f1f5f9",
        200: "#e2e8f0",
        300: "#cbd5e1",
        400: "#94a3b8",
        500: "#64748b",
        600: "#475569",
        700: "#334155",
        800: "#1e293b",
        900: "#0f172a",
        950: "#020617",
      },
    },
  },
  // Enable CSS reset
  preflights: [],
});
