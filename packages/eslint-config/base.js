/**
 * @fileoverview Base ESLint configuration shared across the monorepo
 * 
 * @module BaseESLintConfig
 * @description
 * A shared ESLint configuration that provides the foundation for all
 * ESLint configs in the monorepo. Includes TypeScript, Prettier, and
 * Turborepo-specific rules.
 * 
 * @example
 * ```js
 * import { config } from "@repo/eslint-config/base";
 * export default config;
 * ```
 * 
 * @see {@link ./next.js} - Next.js specific config
 * @see {@link ./react-internal.js} - React specific config
 */

import js from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import turboPlugin from "eslint-plugin-turbo";
import tseslint from "typescript-eslint";
import onlyWarn from "eslint-plugin-only-warn";

/**
 * @type {import("eslint").Linter.Config[]}
 */
export const config = [
  js.configs.recommended,
  eslintConfigPrettier,
  ...tseslint.configs.recommended,
  {
    plugins: {
      turbo: turboPlugin,
    },
    rules: {
      "turbo/no-undeclared-env-vars": "warn",
    },
  },
  {
    plugins: {
      onlyWarn,
    },
  },
  {
    ignores: ["dist/**"],
  },
];
