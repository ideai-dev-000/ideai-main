import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  experimental: {
    // Enable React Compiler for automatic memoization
    reactCompiler: true,

    // Enable Partial Prerendering for better performance
    ppr: true,

    // Optimize package imports to reduce bundle size
    optimizePackageImports: ["@repo/ui", "lucide-react", "@radix-ui/react-dialog", "@radix-ui/react-tooltip"],

    // Enable cache components (Next.js 16 feature)
    cacheComponents: true,
  },

  transpilePackages: ["@repo/ui"],

  turbo: {
    resolveAlias: {
      "@repo/ui": "../packages/ui/src",
    },
  },

  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  output: "standalone",

  reactStrictMode: true,

  poweredByHeader: false,
  compress: true,

  typescript: {
    ignoreBuildErrors: false,
  },

  eslint: {
    ignoreDuringBuilds: false,
  },
}

export default nextConfig
