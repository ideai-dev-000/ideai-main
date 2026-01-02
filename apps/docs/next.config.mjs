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
};

export default withContentlayer(nextConfig);
