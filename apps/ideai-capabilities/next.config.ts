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

// Workflow plugin disabled - incompatible with Next.js 16.1.1
// Error: Cannot find module 'next/dist/lib/server-external-packages.json'
// TODO: Update workflow package or use alternative execution method
// import { withWorkflow } from "workflow/next";
// export default withWorkflow(nextConfig);

export default nextConfig;
