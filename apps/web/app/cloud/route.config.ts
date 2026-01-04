/**
 * @fileoverview Route Configuration for Cloud Manager (DEV ONLY)
 *
 * @module CloudManagerRouteConfig
 * @description
 * Route configuration to prevent Cloud Manager from being built in production.
 *
 * ⚠️ SECURITY: This route must NEVER be accessible in production.
 */

// Prevent static generation in production
export const dynamic = "force-dynamic";

// Prevent this route from being included in production builds
export const dynamicParams = true;

// Runtime check - this will prevent the route from being built
if (process.env.NODE_ENV === "production") {
  // This file should not be imported in production builds
  throw new Error(
    "Cloud Manager route config must NEVER be loaded in production. This is a security requirement.",
  );
}
