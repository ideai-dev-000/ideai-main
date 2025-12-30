/** @type {import('next').NextConfig} */

// Routing configuration
const ROUTING_MODE = process.env.ROUTING_MODE || "folders"; // "folders" or "subdomains"

// App configuration with ports and paths
const apps = {
  web: { port: 3000, path: "/web" },
  docs: { port: 3001, path: "/docs" },
  all: { port: 3002, path: "/all" },
  nocss: { port: 3003, path: "/nocss" },
  mvp: { port: 3004, path: "/mvp" },
  tailwind: { port: 3005, path: "/tailwind" },
  allcss: { port: 3006, path: "/allcss" },
};

// Generate rewrites for folder-based routing
const generateRewrites = () => {
  if (ROUTING_MODE === "folders") {
    return Object.entries(apps)
      .filter(([key]) => key !== "landing") // Don't rewrite landing
      .map(([key, config]) => ({
        source: `${config.path}/:path*`,
        destination: `http://localhost:${config.port}${config.path}/:path*`,
      }));
  }
  return [];
};

const nextConfig = {
  async rewrites() {
    // Only apply rewrites in development for folder-based routing
    if (process.env.NODE_ENV === "development" && ROUTING_MODE === "folders") {
      return generateRewrites();
    }
    return [];
  },
};

export default nextConfig;
