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
};

export default withWorkflow(nextConfig);
