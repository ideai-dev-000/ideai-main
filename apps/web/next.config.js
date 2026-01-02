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
  
  // Rewrites for unified mode: proxy child apps to their dev servers
  // In unified mode, child apps run on their own ports but are proxied through parent
  // Parent app embeds them as iframes at /apps/{name}
  async rewrites() {
    const isUnified = process.env.NEXT_PUBLIC_IDEAI_APP_MODE === "unified";
    
    if (isUnified && process.env.NODE_ENV === "development") {
      // In unified mode (dev), proxy child app routes to their dev servers
      // This allows child apps to be accessible on port 3000 via proxy
      // Parent app embeds them as iframes at /apps/{name}
      const childApps = {
        docs: 3001,
        all: 3002,
        nocss: 3003,
        mvp: 3004,
        tailwind: 3005,
        allcss: 3006,
        bootstrap: 3007,
        unocss: 3008,
        shadcn: 3009,
      };
      
      return Object.entries(childApps).map(([app, port]) => ({
        source: `/${app}/:path*`,
        destination: `http://localhost:${port}/:path*`,
      }));
    }
    
    return [];
  },
};

export default nextConfig;
