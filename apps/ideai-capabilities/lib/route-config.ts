/**
 * @fileoverview Route Configuration for IdeaI Capabilities
 *
 * @module RouteConfig
 * @description
 * Centralized configuration for route behavior, including side menu visibility.
 * Each route can be configured to show/hide the side menu.
 * This makes it easy to maintain and extend.
 */

/**
 * Route configuration for side menu and other route-specific behaviors
 */
export interface RouteConfig {
  /** Whether to show the side menu on this route */
  showSideMenu: boolean;
  /** Tool context for this route (used by side menu to show relevant content) */
  toolContext?: "workflow" | "vibe" | "app-builder" | "lead-agent" | "other";
  /** Human-readable description */
  description?: string;
}

/**
 * Route configuration map
 * Add new routes here to control side menu visibility
 */
export const ROUTE_CONFIG: Record<string, RouteConfig> = {
  // Workflow routes - show side menu (ONLY workflows and vibe have sidebar)
  "/workflow": {
    showSideMenu: true,
    toolContext: "workflow",
    description: "Workflow builder - main workflow page",
  },
  "/workflows": {
    showSideMenu: true,
    toolContext: "workflow",
    description: "Workflows list page",
  },

  // Vibe routes - show side menu (ONLY workflows and vibe have sidebar)
  "/vibe": {
    showSideMenu: true,
    toolContext: "vibe",
    description: "Vibe coding tool",
  },

  // App Builder routes - NO side menu (only vibe and workflows have sidebar)
  "/app-builder": {
    showSideMenu: false,
    toolContext: "app-builder",
    description: "App builder tool - no sidebar",
  },

  // Lead Agent routes - NO side menu (only vibe and workflows have sidebar)
  "/lead-agent": {
    showSideMenu: false,
    toolContext: "lead-agent",
    description: "Lead processing agent - no sidebar",
  },

  // Landing page - NO side menu
  "/": {
    showSideMenu: false,
    description: "Landing page - no side menu",
  },

  // Settings pages - NO side menu
  "/settings": {
    showSideMenu: false,
    description: "Settings page - no sidebar",
  },

  // Dev setup - NO side menu
  "/dev-setup": {
    showSideMenu: false,
    description: "Developer setup page - no sidebar",
  },
};

/**
 * Get route configuration for a given pathname
 * Matches exact routes first, then checks for route prefixes
 */
export function getRouteConfig(pathname: string | null): RouteConfig {
  if (!pathname) {
    return { showSideMenu: false };
  }

  // Exact match first
  if (ROUTE_CONFIG[pathname]) {
    return ROUTE_CONFIG[pathname];
  }

  // Check for route prefixes (e.g., /workflow/workflows/123)
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

  // Default: no side menu
  return { showSideMenu: false };
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
