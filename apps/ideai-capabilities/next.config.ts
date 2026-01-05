import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@repo/ui"],
  experimental: {
    optimizePackageImports: ["@repo/ui"],
  },
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
};

// TODO: Add workflow plugin once package exports are fixed
// For now, we'll run without the workflow Next.js plugin
// The workflow functionality will still work via API routes
export default nextConfig;
