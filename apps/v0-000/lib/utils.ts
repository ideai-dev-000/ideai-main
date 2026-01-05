/**
 * @fileoverview Utility functions for v0-000
 *
 * @module Utils
 * @description
 * Utility functions including class name merging with Tailwind conflict resolution.
 */

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
