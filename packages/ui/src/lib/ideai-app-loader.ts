/**
 * @fileoverview IdeaI App Loader - Dynamic child app page loader
 * 
 * @module IdeAIAppLoader
 * @description
 * Loads child app pages dynamically for unified mode.
 * Supports both unified (all on one port) and individual (separate ports) modes.
 * 
 * Architecture:
 * - Unified mode: Child apps imported as components, all on port 3000
 * - Individual mode: Child apps on separate ports (iframes)
 * 
 * @example
 * ```tsx
 * const ChildAppPage = await loadChildAppPage('docs');
 * return <ChildAppPage />;
 * ```
 */

import type { ComponentType } from "react";

export type AppMode = "unified" | "individual";

/**
 * Get current app mode from environment
 * 
 * @returns "unified" or "individual"
 */
export function getAppMode(): AppMode {
  // Check environment variable
  if (typeof process !== "undefined" && process.env) {
    const mode = process.env.NEXT_PUBLIC_IDEAI_APP_MODE;
    if (mode === "unified" || mode === "individual") {
      return mode;
    }
  }
  
  // Default: unified in production, individual in development
  if (typeof process !== "undefined" && process.env?.NODE_ENV === "production") {
    return "unified";
  }
  
  // Development default: can be toggled
  return "individual";
}

/**
 * Load child app page component dynamically
 * 
 * Note: Dynamic imports from relative paths don't work in Next.js.
 * For unified mode, we need to import child apps at build time.
 * This function returns a component loader that can be used.
 * 
 * @param appName - Child app name (e.g., "docs")
 * @returns Promise resolving to child app page component or null
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function loadChildAppPage(_appName: string): Promise<ComponentType<Record<string, unknown>> | null> {
  const mode = getAppMode();
  
  if (mode === "individual") {
    // Individual mode: return null (use iframe)
    return null;
  }
  
  // Unified mode: Try to import child app page
  // Note: This requires child apps to be built into parent
  // For now, we'll use a registry approach (see apps/web/app/apps/[app]/registry.ts)
  // NOTE: This import is commented out because it's outside the package rootDir.
  // The registry should be accessed from the parent app, not from this shared package.
  // TODO: Implement proper registry pattern that works within package boundaries
  // try {
  //   // Try importing from a registry that maps app names to components
  //   // This registry should be created at build time
  //   const registry = await import("../../../../apps/web/app/apps/[app]/registry.js");
  //   const loader = registry.getChildAppComponent;
  //   if (loader) {
  //     return await loader(appName);
  //   }
  // } catch (error) {
  //   // Registry not found - fall back to iframe or placeholder
  //   console.warn(`Child app registry not found for ${appName}, using fallback`);
  // }
  
  return null;
}

/**
 * Check if app should use unified mode
 */
export function shouldUseUnifiedMode(): boolean {
  return getAppMode() === "unified";
}

