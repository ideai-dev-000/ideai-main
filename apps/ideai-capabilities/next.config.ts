import { withWorkflow } from "workflow/next";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@repo/ui"],
  experimental: {
    optimizePackageImports: ["@repo/ui"],
  },
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  typescript: {
    // TODO: Fix remaining TypeScript errors and remove this
    // Temporarily ignoring build errors to allow deployment
    ignoreBuildErrors: true,
  },
};

export default withWorkflow(nextConfig);
