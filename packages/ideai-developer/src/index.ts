/**
 * @fileoverview IdeaI Developer Package - Main exports
 *
 * @module IdeAIDeveloper
 * @description
 * Centralized developer tools package.
 * All exports are dev-only and will return null/empty in production.
 *
 * Structure:
 * - local/ - Dev-only tools (never in prod)
 * - CLI functions - Called from scripts/ideai-developer.mjs
 * - Components - React components for web UI (TypeScript)
 *
 * Note: CLI functions are in .mjs files for direct Node.js import.
 * Components remain in TypeScript for type safety.
 */

// Note: This index.ts is for TypeScript consumers (React components)
// For Node.js scripts, import directly from .mjs files:
// import { getPortStatus } from "@repo/ideai-developer/local/cli/port.mjs"

// Always export dev check utilities (they're safe)
export {
  isDevelopment,
  assertDevelopment,
  devOnly,
} from "./local/utils/dev-check.mjs";

// Components will be exported here when created (TypeScript)
// export { IdeAIDevTools } from "./local/components/ideai-dev-tools.tsx";
