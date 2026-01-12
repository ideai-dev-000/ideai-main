/**
 * Mode Configuration
 *
 * Defines the current app mode via APP_MODE environment variable.
 * Defaults to "workflow" if not set (maintains backward compatibility).
 *
 * Modes can define:
 * - Custom node types and components
 * - Custom node templates
 * - Custom code generation
 * - Custom actions/behaviors
 */

export type AppMode = "workflow" | "architecture";

/**
 * Get the current app mode from environment variable
 * Defaults to "workflow" for backward compatibility
 */
export function getAppMode(): AppMode {
  if (typeof window !== "undefined") {
    // Client-side: check NEXT_PUBLIC_APP_MODE
    const mode = process.env.NEXT_PUBLIC_APP_MODE;
    if (mode === "architecture") return "architecture";
    return "workflow";
  }

  // Server-side: check APP_MODE
  const mode = process.env.APP_MODE;
  if (mode === "architecture") return "architecture";
  return "workflow";
}

/**
 * Check if we're in a specific mode
 */
export function isMode(mode: AppMode): boolean {
  return getAppMode() === mode;
}
