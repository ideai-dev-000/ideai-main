/**
 * @fileoverview Utility functions for the web app
 *
 * @module Utils
 * @description
 * Common utility functions for className merging and component utilities.
 * Uses clsx and tailwind-merge for optimal class name handling.
 *
 * This is a local copy for shadcn/ui components compatibility.
 */

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges class names with Tailwind conflict resolution
 *
 * @param inputs - Class names to merge
 * @returns Merged class string
 *
 * @example
 * ```tsx
 * cn("px-2 py-1", "px-4") // Returns "py-1 px-4" (px-4 wins)
 * ```
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
