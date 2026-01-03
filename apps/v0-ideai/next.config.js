/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@repo/ui"],
  experimental: {
    optimizePackageImports: [
      "@repo/ui",
      "lucide-react",
    ],
  },
  turbopack: {},
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  typescript: {
    ignoreBuildErrors: false,
  },
};

export default nextConfig;

