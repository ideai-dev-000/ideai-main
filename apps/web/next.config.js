/**
 * @fileoverview Next.js configuration for the main web application
 * 
 * @module WebNextConfig
 * @description
 * Next.js configuration for the main IdeaI web app.
 * Supports catch-all routing for sub-apps at /apps/{name}.
 * 
 * Architecture:
 * - Main app at root: myui.space/
 * - Sub-apps at: myui.space/apps/{name}
 * - Apps can be served directly or as standalone deployments
 */

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Catch-all routes are handled by app/apps/[app]/[[...path]]/page.tsx
  // This allows serving sub-apps at /apps/{name}
  
  // Optional: Add rewrites for development if needed
  async rewrites() {
    // In development, we could proxy to local dev servers
    // In production, sub-apps are either served directly or redirect to standalone URLs
    return [];
  },
};

export default nextConfig;
