#!/usr/bin/env node
/**
 * @fileoverview Cleanup .next build directories to free disk space
 * 
 * @module CleanupNext
 * @description
 * Removes all .next directories from apps to free up disk space.
 * Useful when running all 13 apps simultaneously and disk space is limited.
 * 
 * @example
 * # Clean all .next directories
 * node scripts/ideai-develop-cleanup-next.mjs
 * 
 * # Dry run (show what would be deleted)
 * node scripts/ideai-develop-cleanup-next.mjs --dry-run
 */

import { execSync } from "child_process";
import { existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const REPO_ROOT = join(__dirname, "..");

const DRY_RUN = process.argv.includes("--dry-run");

function getNextDirs() {
  const apps = [
    "web", "docs", "all", "nocss", "mvp", "tailwind", "allcss",
    "bootstrap", "unocss", "shadcn", "material", "chakra", "radix"
  ];
  
  return apps
    .map(app => join(REPO_ROOT, "apps", app, ".next"))
    .filter(dir => existsSync(dir));
}

function getDirSize(dir) {
  try {
    const output = execSync(`du -sh "${dir}" 2>/dev/null`, { encoding: "utf-8" });
    return output.split("\t")[0];
  } catch {
    return "unknown";
  }
}

function main() {
  console.log("=== IdeaI .next Cleanup ===\n");
  
  const nextDirs = getNextDirs();
  
  if (nextDirs.length === 0) {
    console.log("✅ No .next directories found");
    return;
  }
  
  console.log(`Found ${nextDirs.length} .next directories:\n`);
  
  let totalSize = 0;
  for (const dir of nextDirs) {
    const size = getDirSize(dir);
    const appName = dir.split("/").slice(-2, -1)[0];
    console.log(`  ${appName}: ${size}`);
    totalSize += parseFloat(size) || 0;
  }
  
  console.log(`\nTotal: ~${totalSize.toFixed(1)}GB\n`);
  
  if (DRY_RUN) {
    console.log("🔍 DRY RUN - No files deleted");
    console.log("Run without --dry-run to actually delete");
    return;
  }
  
  console.log("⚠️  This will delete all .next directories");
  console.log("⚠️  Dev servers must be stopped first\n");
  
  for (const dir of nextDirs) {
    const appName = dir.split("/").slice(-2, -1)[0];
    try {
      execSync(`rm -rf "${dir}"`, { stdio: "ignore" });
      console.log(`✅ Removed ${appName}/.next`);
    } catch (error) {
      console.error(`❌ Failed to remove ${appName}/.next: ${error.message}`);
    }
  }
  
  console.log("\n✅ Cleanup complete!");
  console.log("💡 Restart dev servers to rebuild");
}

main();

