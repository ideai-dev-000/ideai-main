/**
 * @fileoverview Next.js configuration for the IdeaI docs application
 *
 * @module DocsNextConfig
 * @description
 * Next.js configuration for documentation site with Contentlayer integration.
 * Provides type-safe content access and SEO optimization.
 *
 * @see https://contentlayer.dev/docs
 */

import { withContentlayer } from "next-contentlayer";

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Contentlayer handles content processing
  // Turbopack config to avoid webpack conflict
  turbopack: {},

  webpack: (config, { isServer }) => {
    // Mark optional animation libraries as external to prevent build errors
    // These are dynamically imported and may not be installed
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        "kute.js": false,
        "@motionone/dom": false,
        "@tsparticles/react": false,
        "@tsparticles/slim": false,
        "@tsparticles/engine": false,
        vivus: false,
      };
    }
    return config;
  },
};

export default withContentlayer(nextConfig);
