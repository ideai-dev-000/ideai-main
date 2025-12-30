/**
 * @fileoverview Routing configuration for IdeaI monorepo
 * 
 * @module RoutingConfig
 * @description
 * Centralized routing configuration for folder-based and subdomain-based routing.
 * This config determines how apps are accessed via URLs.
 */

export type RoutingMode = "folders" | "subdomains";

export interface AppConfig {
  id: string;
  name: string;
  path: string;
  description: string;
  port: number;
  subdomain?: string;
}

export interface RoutingConfig {
  mode: RoutingMode;
  baseUrl: string;
  apps: AppConfig[];
}

/**
 * Detect if we're in production
 * In production, we use subdomains because each app is a separate Vercel project
 */
function isProduction(): boolean {
  if (typeof window === "undefined") {
    // Server-side: check environment
    return process.env.NODE_ENV === "production" || 
           process.env.VERCEL === "1" ||
           !!process.env.VERCEL_URL;
  }
  // Client-side: check hostname
  const hostname = window.location.hostname;
  return hostname !== "localhost" && 
         hostname !== "127.0.0.1" &&
         !hostname.includes("localhost");
}

/**
 * Default routing configuration
 * Can be overridden via environment variables or runtime API
 * 
 * IMPORTANT: In production, we use subdomains because each app is a separate Vercel project.
 * Folder-based routing only works in development or with a single project.
 */
export const defaultRoutingConfig: RoutingConfig = {
  mode: (process.env.ROUTING_MODE as RoutingMode) || 
        (isProduction() ? "subdomains" : "folders"),
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL || 
    (typeof window !== "undefined" ? window.location.origin : "http://localhost:3000"),
  apps: [
    {
      id: "web",
      name: "Web App",
      path: "/web",
      description: "Main IdeaI web application",
      port: 3000,
      subdomain: "web",
    },
    {
      id: "docs",
      name: "Documentation",
      path: "/docs",
      description: "IdeaI documentation site",
      port: 3001,
      subdomain: "docs",
    },
    {
      id: "all",
      name: "All Components",
      path: "/all",
      description: "Complete HTML5 test page and component showcase",
      port: 3002,
      subdomain: "all",
    },
    {
      id: "nocss",
      name: "No CSS",
      path: "/nocss",
      description: "Pure HTML browser defaults - no CSS styling",
      port: 3003,
      subdomain: "nocss",
    },
    {
      id: "mvp",
      name: "MVP.css",
      path: "/mvp",
      description: "MVP.css only - semantic HTML styling",
      port: 3004,
      subdomain: "mvp",
    },
    {
      id: "tailwind",
      name: "Tailwind CSS",
      path: "/tailwind",
      description: "Tailwind CSS only - utility-first styling",
      port: 3005,
      subdomain: "tailwind",
    },
    {
      id: "allcss",
      name: "All CSS",
      path: "/allcss",
      description: "MVP.css + Tailwind CSS - complete styling",
      port: 3006,
      subdomain: "allcss",
    },
  ],
};

/**
 * Get app URL based on routing mode
 */
export function getAppUrl(app: AppConfig, config: RoutingConfig): string {
  if (config.mode === "subdomains" && app.subdomain) {
    const baseDomain = config.baseUrl.replace(/^https?:\/\//, "").split("/")[0];
    const protocol = config.baseUrl.startsWith("https") ? "https" : "http";
    return `${protocol}://${app.subdomain}.${baseDomain}`;
  }
  
  // Folder-based routing
  return `${config.baseUrl}${app.path}`;
}

/**
 * Get app URL for iframe/popup
 * 
 * IMPORTANT: In production, each app is a separate Vercel project with its own URL.
 * We need to use subdomains or the actual Vercel deployment URL.
 * 
 * For now, we'll use subdomains in production (requires DNS setup).
 * If subdomains aren't configured, we'll need to use the actual Vercel URLs.
 */
export function getAppIframeUrl(app: AppConfig, config: RoutingConfig): string {
  // Check if we're in development (client-side check)
  const isDev = typeof window !== "undefined" && 
    (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");
  
  if (isDev) {
    // In development, each app runs on its own port at root path
    // Don't append app.path - apps are at http://localhost:PORT/
    return `http://localhost:${app.port}/`;
  }
  
  // In production, use subdomains (each app is a separate Vercel project)
  // TODO: For apps that don't have subdomains configured yet, we may need to
  // use the actual Vercel deployment URLs temporarily
  if (config.mode === "subdomains" && app.subdomain) {
    return getAppUrl(app, config);
  }
  
  // Fallback: use folder-based routing (won't work with separate projects)
  return getAppUrl(app, config);
}

