/**
 * @fileoverview Tailwind CSS configuration for the shared UI package
 * 
 * @module TailwindConfig
 * @description
 * Standard Tailwind CSS configuration using only built-in colors.
 * No custom colors - uses robust 2026 Tailwind standards.
 */

import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Only extend with standard Tailwind utilities
      borderRadius: {
        lg: "0.5rem",
        md: "calc(0.5rem - 2px)",
        sm: "calc(0.5rem - 4px)",
      },
    },
  },
  plugins: [
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require("@tailwindcss/typography"),
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require("tailwindcss-animate"),
  ],
};

export default config;
