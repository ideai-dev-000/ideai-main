#!/usr/bin/env node
/**
 * @fileoverview V0 Promote - Move components from v0-staging to production
 * 
 * @module IdeAIV0Promote
 * @description
 * Promotes approved components from apps/web/components/v0-staging/ to production locations.
 * 
 * Usage:
 *   node scripts/ideai-v0-promote.mjs <path> --to <location> [--force]
 * 
 * Options:
 *   <path>      - Path relative to v0-staging (e.g., "components/ui/button.tsx")
 *   --to        - Production location: "shared" | "app" | "ui"
 *   --force     - Force overwrite if exists
 * 
 * Production Locations:
 *   --to shared → packages/ui/src/components/ (shared across all apps)
 *   --to app    → apps/web/components/ (app-specific)
 *   --to ui     → apps/web/components/ui/ (shadcn components)
 * 
 * @example
 * ```bash
 * # Promote to shared components
 * pnpm v0:promote components/ui/button.tsx --to shared
 * 
 * # Promote to app components
 * pnpm v0:promote components/dashboard-card.tsx --to app
 * 
 * # Promote to UI components
 * pnpm v0:promote components/ui/dialog.tsx --to ui
 * ```
 */

import { existsSync, readFileSync, writeFileSync, copyFileSync, mkdirSync, unlinkSync } from "fs";
import { join, dirname, relative, basename } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const REPO_ROOT = join(__dirname, "..");

const V0_STAGING = join(REPO_ROOT, "apps/web/components/v0-staging");
const WEB_COMPONENTS = join(REPO_ROOT, "apps/web/components");
const WEB_UI = join(WEB_COMPONENTS, "ui");
const SHARED_COMPONENTS = join(REPO_ROOT, "packages/ui/src/components");

// Colors for output
const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  red: "\x1b[31m",
  cyan: "\x1b[36m",
};

function log(message, color = "reset") {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function error(message) {
  console.error(`${colors.red}❌ ${message}${colors.reset}`);
}

function success(message) {
  log(`✅ ${message}`, "green");
}

function info(message) {
  log(`ℹ️  ${message}`, "blue");
}

function warn(message) {
  log(`⚠️  ${message}`, "yellow");
}

/**
 * Get production destination based on --to option
 */
function getProductionDestination(filePath, toLocation) {
  const fileName = basename(filePath);
  
  switch (toLocation) {
    case "shared":
      // packages/ui/src/components/
      return join(SHARED_COMPONENTS, fileName);
    
    case "app":
      // apps/web/components/
      return join(WEB_COMPONENTS, fileName);
    
    case "ui":
      // apps/web/components/ui/
      return join(WEB_UI, fileName);
    
    default:
      throw new Error(`Unknown location: ${toLocation}. Use: shared, app, or ui`);
  }
}

/**
 * Promote a file from v0-staging to production
 */
function promoteFile(stagingPath, toLocation, force = false) {
  const sourcePath = join(V0_STAGING, stagingPath);
  
  if (!existsSync(sourcePath)) {
    error(`File not found in staging: ${stagingPath}`);
    error(`Expected: ${relative(REPO_ROOT, sourcePath)}`);
    process.exit(1);
  }

  const destPath = getProductionDestination(stagingPath, toLocation);
  const destExists = existsSync(destPath);

  if (destExists && !force) {
    error(`Destination exists: ${relative(REPO_ROOT, destPath)}`);
    error(`Use --force to overwrite, or choose different location.`);
    process.exit(1);
  }

  try {
    // Ensure destination directory exists
    const destDir = dirname(destPath);
    if (!existsSync(destDir)) {
      mkdirSync(destDir, { recursive: true });
    }

    // Copy file to production
    copyFileSync(sourcePath, destPath);
    
    success(`Promoted: ${stagingPath} → ${relative(REPO_ROOT, destPath)}`);
    info(`Location: ${toLocation}`);
    
    return { promoted: true, source: stagingPath, dest: destPath };
  } catch (err) {
    error(`Failed to promote ${stagingPath}: ${err.message}`);
    process.exit(1);
  }
}

/**
 * Main entry point
 */
function main() {
  const args = process.argv.slice(2);
  
  if (args.length < 3 || !args.includes("--to")) {
    error("Usage: pnpm v0:promote <path> --to <location> [--force]");
    log("");
    info("Examples:");
    log("  pnpm v0:promote components/ui/button.tsx --to ui");
    log("  pnpm v0:promote components/dashboard-card.tsx --to app");
    log("  pnpm v0:promote components/shared-header.tsx --to shared");
    log("");
    info("Locations:");
    log("  --to shared → packages/ui/src/components/ (shared across apps)");
    log("  --to app    → apps/web/components/ (app-specific)");
    log("  --to ui     → apps/web/components/ui/ (shadcn components)");
    process.exit(1);
  }

  const filePath = args[0];
  const toIndex = args.indexOf("--to");
  const toLocation = args[toIndex + 1];
  const force = args.includes("--force");

  if (!filePath) {
    error("File path required");
    process.exit(1);
  }

  if (!toLocation || !["shared", "app", "ui"].includes(toLocation)) {
    error(`Invalid location: ${toLocation}`);
    error("Use: shared, app, or ui");
    process.exit(1);
  }

  log("🚀 V0 Promote - Staging → Production", "cyan");
  log("");

  promoteFile(filePath, toLocation, force);
  
  log("");
  success("Promotion complete!");
  info("Review the promoted file and commit when ready.");
}

main();

