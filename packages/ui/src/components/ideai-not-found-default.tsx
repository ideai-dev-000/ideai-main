/**
 * @fileoverview Default 404 Not Found page component - zero config
 *
 * @module IdeAINotFoundDefault
 * @description
 * Default 404 component that auto-detects all settings from environment.
 * Apps can use this by simply importing and exporting as default.
 *
 * @example
 * ```tsx
 * // In apps/web/app/not-found.tsx
 * export { IdeAINotFoundDefault as default } from "@repo/ui/components/ideai-not-found-default";
 * ```
 */

"use client";

import { IdeAINotFound } from "./ideai-not-found";

/**
 * Default 404 component with zero configuration required
 * Auto-detects app name, site name, and vercel settings from environment
 */
export function IdeAINotFoundDefault() {
  return <IdeAINotFound />;
}
