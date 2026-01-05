/** @type {import('next').NextConfig} */
const nextConfig = {
  // SECURITY NOTE: Cloud Manager route (/cloud) is protected at the page level
  // It returns 404 (notFound()) in production via runtime NODE_ENV check
  // Navigation link is also hidden in production
  transpilePackages: ["@repo/ui", "@motionone/dom", "vivus"],
  experimental: {
    // Optimize package imports to reduce bundle size
    optimizePackageImports: [
      "@repo/ui",
      "lucide-react",
      "@radix-ui/react-dialog",
      "@radix-ui/react-tooltip",
    ],

    // Enable cache components (Next.js 16 feature - includes PPR)
    // Note: Temporarily disabled due to ThemeProvider compatibility issues
    // cacheComponents: true,
  },

  // Turbopack config (Next.js 16 uses Turbopack by default)
  turbopack: {},

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

  // Unified mode: Proxy child apps to their ports
  // ⚠️ DEVELOPMENT ONLY: These rewrites are for local development testing
  // In production, child apps should be imported as components or deployed separately
  // TODO: Implement true unified mode with component imports (see TODOS.md)
  async rewrites() {
    // Only apply rewrites in development and unified mode
    // NOTE: This is a temporary solution - child apps still run on separate ports
    // For production, we need true unified mode with component imports
    if (
      process.env.NODE_ENV === "development" &&
      process.env.NEXT_PUBLIC_IDEAI_APP_MODE === "unified"
    ) {
      const childApps = [
        { name: "docs", port: 3001 },
        { name: "all", port: 3002 },
        { name: "nocss", port: 3003 },
        { name: "mvp", port: 3004 },
        { name: "tailwind", port: 3005 },
        { name: "allcss", port: 3006 },
        { name: "bootstrap", port: 3007 },
        { name: "unocss", port: 3008 },
        { name: "shadcn", port: 3009 },
        { name: "material", port: 3010 },
        { name: "chakra", port: 3011 },
        { name: "radix", port: 3012 },
        { name: "ideai-workflow", port: 3013 },
        { name: "lead-processing-agent", port: 3014 },
        { name: "ideai-builder", port: 3015 },
      ];

      return childApps.map((app) => ({
        source: `/${app.name}/:path*`,
        destination: `http://localhost:${app.port}/:path*`,
      }));
    }
    return [];
  },
};

export default nextConfig;
