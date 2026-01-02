/**
 * @fileoverview Tailwind CSS configuration for the web app
 * 
 * @module WebTailwindConfig
 * @description
 * Extends the shared UI package Tailwind config.
 * Ensures shadcn theme variables work properly.
 */

import type { Config } from "tailwindcss";
import sharedConfig from "../../packages/ui/tailwind.config.js";

const config: Config = {
  ...sharedConfig,
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "../../packages/ui/src/**/*.{js,ts,jsx,tsx}",
  ],
};

export default config;
