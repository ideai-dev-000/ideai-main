/**
 * @fileoverview V0 SDK Client Wrapper
 *
 * @module V0Client
 * @description
 * Composable v0 SDK client wrapper for vibe functionality.
 * Centralized client initialization with environment-aware configuration.
 */

import { createClient } from "v0-sdk";

/**
 * Create v0 SDK client with environment-aware configuration
 *
 * Uses V0_API_URL if set, otherwise uses default v0 API endpoint.
 * API key is automatically read from V0_API_KEY environment variable.
 *
 * @returns Configured v0 SDK client
 */
export function createV0Client() {
  const baseUrl = process.env.V0_API_URL
    ? { baseUrl: process.env.V0_API_URL }
    : {};

  return createClient(baseUrl);
}

/**
 * Singleton v0 client instance
 * Reused across all vibe API routes for efficiency
 */
export const v0Client = createV0Client();
