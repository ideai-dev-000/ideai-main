/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@repo/ui", "vivus"],
  experimental: {
    optimizePackageImports: ["@repo/ui"],
  },
};

export default nextConfig;
