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
 * Default routing configuration
 * Can be overridden via environment variables or runtime API
 */
export const defaultRoutingConfig: RoutingConfig = {
  mode: (process.env.ROUTING_MODE as RoutingMode) || "folders",
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
 * Get app URL for iframe/popup (always uses current origin in production)
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
  
  // In production, use folder or subdomain based on config
  return getAppUrl(app, config);
}

