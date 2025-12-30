/**
 * @fileoverview Tailwind CSS configuration for the docs application
 * 
 * @module DocsTailwindConfig
 * @description
 * Standard Tailwind CSS configuration using only built-in colors.
 * No custom colors - uses robust 2026 Tailwind standards.
 */

import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
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
  plugins: [require("@tailwindcss/typography"), require("tailwindcss-animate")],
};

export default config;
