/**
 * @fileoverview Route Configuration for IdeaI Capabilities
 *
 * @module RouteConfig
 * @description
 * Centralized configuration for route behavior, including side menu visibility
 * and IdeaI-level controls. Each route can be configured to show/hide the side menu
 * and whether it needs IdeaI-level controls.
 *
 * IdeaI Controls are contextual - they only appear when a page needs IdeaI-level
 * abstraction. Controls abstract app functionality into shared UI that benefits
 * from patterns, composability, and semantic parent-child couplings.
 *
 * Controls and functions are decoupled but come together per feature (e.g., workflow or vibe).
 * Each page has an ideaiControls boolean so we can control visibility even if controls exist.
 */

/**
 * Route configuration for side menu and other route-specific behaviors
 */
export interface RouteConfig {
  /** Whether to show the side menu on this route */
  showSideMenu: boolean;
  /** Whether this route needs IdeaI-level controls (contextual menu) */
  ideaiControls?: boolean;
  /** Tool context for this route (used by side menu to show relevant content) */
  toolContext?: "workflow" | "vibe" | "app-builder" | "lead-agent" | "other";
  /** Human-readable description */
  description?: string;
}

/**
 * Route configuration map
 *
 * AUTOMATIC DETECTION:
 * - Routes starting with "/workflow" → workflow controls (automatic)
 * - Routes starting with "/vibe" → vibe controls (automatic)
 * - All other routes → no left menu (controls only appear for IdeaI modules/services)
 *
 * You can override defaults by adding explicit entries below.
 */
export const ROUTE_CONFIG: Record<string, RouteConfig> = {
  // Workflow routes - automatically detected, but explicit for clarity
  "/workflow": {
    showSideMenu: true,
    ideaiControls: true, // Workflow needs IdeaI-level controls
    toolContext: "workflow",
    description: "Workflow builder - main workflow page",
  },
  "/workflows": {
    showSideMenu: true,
    ideaiControls: true, // Workflow needs IdeaI-level controls
    toolContext: "workflow",
    description: "Workflows list page",
  },

  // Vibe routes - automatically detected, but explicit for clarity
  "/vibe": {
    showSideMenu: true,
    ideaiControls: true, // Vibe needs IdeaI-level controls
    toolContext: "vibe",
    description: "Vibe coding tool",
  },

  // App Builder routes - NO IdeaI controls (no shared UI controls needed)
  "/app-builder": {
    showSideMenu: false,
    ideaiControls: false, // App builder doesn't need IdeaI controls
    toolContext: "app-builder",
    description: "App builder tool - no sidebar",
  },

  // Lead Agent routes - NO IdeaI controls
  "/lead-agent": {
    showSideMenu: false,
    ideaiControls: false, // Lead agent doesn't need IdeaI controls
    toolContext: "lead-agent",
    description: "Lead processing agent - no sidebar",
  },

  // Landing page - NO IdeaI controls
  "/": {
    showSideMenu: false,
    ideaiControls: false, // Landing page doesn't need IdeaI controls
    description: "Landing page - no side menu",
  },

  // Settings pages - NO IdeaI controls
  "/settings": {
    showSideMenu: false,
    ideaiControls: false, // Settings doesn't need IdeaI controls
    description: "Settings page - no sidebar",
  },

  // Dev setup - NO IdeaI controls
  "/dev-setup": {
    showSideMenu: false,
    ideaiControls: false, // Dev setup doesn't need IdeaI controls
    description: "Developer setup page - no sidebar",
  },
};

/**
 * Get route configuration for a given pathname
 *
 * AUTOMATIC DETECTION RULES:
 * 1. Exact match in ROUTE_CONFIG (highest priority)
 * 2. Automatic pattern matching:
 *    - /workflow* → workflow controls
 *    - /vibe* → vibe controls
 * 3. Prefix matching from ROUTE_CONFIG
 * 4. Default: no controls (regular webpage)
 */
export function getRouteConfig(pathname: string | null): RouteConfig {
  if (!pathname) {
    return { showSideMenu: false, ideaiControls: false };
  }

  // Exact match first (highest priority)
  if (ROUTE_CONFIG[pathname]) {
    return ROUTE_CONFIG[pathname];
  }

  // AUTOMATIC PATTERN DETECTION (before prefix matching)
  // These patterns automatically enable IdeaI controls for IdeaI modules/services
  if (pathname.startsWith("/workflow")) {
    return {
      showSideMenu: true,
      ideaiControls: true,
      toolContext: "workflow",
      description: "Workflow module - automatic detection",
    };
  }

  if (pathname.startsWith("/vibe")) {
    return {
      showSideMenu: true,
      ideaiControls: true,
      toolContext: "vibe",
      description: "Vibe module - automatic detection",
    };
  }

  // Check for route prefixes from ROUTE_CONFIG (e.g., /workflow/workflows/123)
  // Sort by length (longest first) to match most specific routes first
  const sortedRoutes = Object.keys(ROUTE_CONFIG).sort(
    (a, b) => b.length - a.length,
  );

  for (const route of sortedRoutes) {
    if (pathname.startsWith(route)) {
      // For prefix matches, inherit the config
      return ROUTE_CONFIG[route];
    }
  }

  // Default: no side menu, no IdeaI controls (regular webpage)
  // Left menu (controls) only appears for IdeaI modules/services
  return { showSideMenu: false, ideaiControls: false };
}

/**
 * Check if side menu should be shown for a route
 */
export function shouldShowSideMenu(pathname: string | null): boolean {
  const config = getRouteConfig(pathname);
  return config.showSideMenu;
}

/**
 * Get tool context for a route
 */
export function getToolContext(
  pathname: string | null,
): RouteConfig["toolContext"] {
  const config = getRouteConfig(pathname);
  return config.toolContext;
}

/**
 * Check if route needs IdeaI-level controls
 * Controls are contextual - only appear when page needs IdeaI-level abstraction
 */
export function needsIdeaiControls(pathname: string | null): boolean {
  const config = getRouteConfig(pathname);
  return config.ideaiControls === true;
}
