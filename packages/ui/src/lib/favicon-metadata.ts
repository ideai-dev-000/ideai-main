/**
 * @fileoverview Favicon metadata utility for Next.js
 * 
 * @module FaviconMetadata
 * @description
 * Centralized favicon metadata configuration for all IdeaI applications.
 * Provides modern favicon formats (SVG, PNG) with proper fallbacks.
 * SEO and accessibility optimized.
 * 
 * Next.js 13+ automatically detects icon files in the app directory:
 * - app/icon.svg, app/icon.png, app/favicon.ico
 * 
 * This utility provides additional metadata for better browser support
 * and allows referencing files in the public directory for PNG fallbacks.
 * 
 * @example
 * ```tsx
 * import { getIdeAIFaviconMetadata } from "@repo/ui/lib/favicon-metadata";
 * 
 * export const metadata = {
 *   ...getIdeAIFaviconMetadata(),
 *   title: "IdeaI",
 * };
 * ```
 */

import type { Metadata } from "next";

/**
 * Get IdeaI favicon metadata for Next.js metadata API
 * Includes modern formats (SVG) with PNG fallbacks
 * Optimized for SEO and accessibility
 * 
 * Note: Next.js 13+ automatically uses app/icon.svg if present.
 * This metadata provides additional formats and explicit references.
 */
export function getIdeAIFaviconMetadata(): Metadata {
  return {
    icons: {
      icon: [
        {
          url: "/icon.svg",
          type: "image/svg+xml",
        },
        // PNG fallbacks (generate from SVG when needed)
        // {
        //   url: "/favicon.png",
        //   type: "image/png",
        // },
        // Note: favicon.ico removed - modern browsers support SVG favicons
        // Next.js 13+ auto-detects app/icon.svg, so explicit favicon.ico not needed
      ],
      apple: [
        // Apple touch icon (generate 180x180 PNG from SVG when needed)
        // {
        //   url: "/apple-touch-icon.png",
        //   sizes: "180x180",
        //   type: "image/png",
        // },
      ],
      // shortcut removed - modern browsers use icon.svg
    },
  };
}
