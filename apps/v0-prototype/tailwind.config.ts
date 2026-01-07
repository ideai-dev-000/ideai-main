/**
 * @fileoverview Tailwind CSS configuration for V0 prototype
 *
 * @module V0PrototypeTailwindConfig
 * @description
 * Extends the shared UI package Tailwind config.
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


