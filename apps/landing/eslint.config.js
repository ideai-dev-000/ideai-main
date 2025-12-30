/**
 * @fileoverview ESLint configuration for the web application
 * 
 * @module WebESLintConfig
 * @description
 * ESLint configuration that extends the shared Next.js ESLint config
 * from the @repo/eslint-config package. This ensures consistent
 * linting rules across the monorepo.
 * 
 * @example
 * This configuration is automatically used by Next.js and ESLint
 * 
 * @see {@link @repo/eslint-config/next-js} - Shared Next.js ESLint config
 */

import { nextJsConfig } from "@repo/eslint-config/next-js";

/** @type {import("eslint").Linter.Config[]} */
export default nextJsConfig;
