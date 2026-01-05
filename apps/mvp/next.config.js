/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@repo/ui", "vivus"],
  experimental: {
    optimizePackageImports: ["@repo/ui"],
  },
  turbopack: {},
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
};

export default nextConfig;
