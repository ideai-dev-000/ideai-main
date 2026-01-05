#!/usr/bin/env node
/**
 * @fileoverview IdeaI Submodule Sync - Automatically update submodules before build/deploy
 * 
 * @module IdeAISubmoduleSync
 * @description
 * Automatically updates all Git submodules to their latest commits before build or deployment.
 * Ensures submodules are always up to date with their remote repositories.
 * 
 * Usage:
 *   node scripts/ideai-build-sync-submodules.mjs [--init] [--quiet]
 * 
 * Options:
 *   --init    Initialize submodules if not already initialized
 *   --quiet   Suppress output (for CI/CD)
 * 
 * @example
 * ```bash
 * # Update all submodules to latest
 * node scripts/ideai-build-sync-submodules.mjs
 * 
 * # Initialize and update (for fresh clones)
 * node scripts/ideai-build-sync-submodules.mjs --init
 * ```
 */

import { execSync } from "child_process";
import { existsSync, readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const REPO_ROOT = join(__dirname, "..");

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
  if (!process.argv.includes("--quiet")) {
    console.log(`${colors[color]}${message}${colors.reset}`);
  }
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
 * Get list of submodules from .gitmodules
 */
function getSubmodules() {
  const gitmodulesPath = join(REPO_ROOT, ".gitmodules");
  
  if (!existsSync(gitmodulesPath)) {
    return [];
  }

  const content = readFileSync(gitmodulesPath, "utf-8");
  const submodules = [];
  const lines = content.split("\n");
  
  let currentSubmodule = null;
  
  for (const line of lines) {
    // Handle tabs and spaces
    const trimmedLine = line.trim();
    
    if (trimmedLine.startsWith("[submodule ")) {
      const match = trimmedLine.match(/\[submodule "(.+)"\]/);
      if (match) {
        currentSubmodule = { name: match[1], path: null, url: null };
      }
    } else if (trimmedLine.startsWith("path = ") && currentSubmodule) {
      currentSubmodule.path = trimmedLine.replace("path = ", "").trim();
    } else if (trimmedLine.startsWith("url = ") && currentSubmodule) {
      currentSubmodule.url = trimmedLine.replace("url = ", "").trim();
      submodules.push(currentSubmodule);
      currentSubmodule = null;
    }
  }
  
  return submodules;
}

/**
 * Check if submodule is initialized
 */
function isSubmoduleInitialized(submodulePath) {
  const fullPath = join(REPO_ROOT, submodulePath);
  if (!existsSync(fullPath)) {
    return false;
  }
  
  // Check if it's a git repository
  try {
    execSync(`git -C "${fullPath}" rev-parse --git-dir`, { 
      stdio: "ignore",
      cwd: REPO_ROOT 
    });
    return true;
  } catch {
    return false;
  }
}

/**
 * Initialize submodule
 */
function initSubmodule(submodulePath) {
  try {
    log(`Initializing ${submodulePath}...`, "blue");
    execSync(`git submodule update --init --recursive "${submodulePath}"`, {
      stdio: "inherit",
      cwd: REPO_ROOT,
    });
    return true;
  } catch (err) {
    error(`Failed to initialize ${submodulePath}: ${err.message}`);
    return false;
  }
}

/**
 * Update submodule to latest commit
 */
function updateSubmodule(submodulePath, submoduleName) {
  try {
    log(`Updating ${submoduleName} (${submodulePath})...`, "blue");
    
    // Update submodule to latest commit from remote
    execSync(`git submodule update --remote --recursive "${submodulePath}"`, {
      stdio: "inherit",
      cwd: REPO_ROOT,
    });
    
    // Get the commit hash
    const commitHash = execSync(
      `git -C "${join(REPO_ROOT, submodulePath)}" rev-parse HEAD`,
      { encoding: "utf-8", cwd: REPO_ROOT }
    ).trim();
    
    success(`${submoduleName} updated to ${commitHash.substring(0, 7)}`);
    return { success: true, commitHash };
  } catch (err) {
    error(`Failed to update ${submoduleName}: ${err.message}`);
    return { success: false, error: err.message };
  }
}

/**
 * Main function
 */
function main() {
  const args = process.argv.slice(2);
  const shouldInit = args.includes("--init");
  const quiet = args.includes("--quiet");
  
  log("=== IdeaI Submodule Sync ===", "bright");
  log("");
  
  // Get list of submodules
  const submodules = getSubmodules();
  
  if (submodules.length === 0) {
    info("No submodules found in .gitmodules");
    return 0;
  }
  
  log(`Found ${submodules.length} submodule(s):`, "blue");
  submodules.forEach((sub) => {
    log(`  - ${sub.name} (${sub.path})`, "cyan");
  });
  log("");
  
  let allSuccess = true;
  const results = [];
  
  // Process each submodule
  for (const submodule of submodules) {
    const { path, name } = submodule;
    
    // Check if initialized
    if (!isSubmoduleInitialized(path)) {
      if (shouldInit) {
        if (!initSubmodule(path)) {
          allSuccess = false;
          results.push({ name, success: false, error: "Initialization failed" });
          continue;
        }
      } else {
        warn(`${name} not initialized. Use --init to initialize.`);
        results.push({ name, success: false, error: "Not initialized" });
        allSuccess = false;
        continue;
      }
    }
    
    // Update submodule
    const result = updateSubmodule(path, name);
    results.push({ name, ...result });
    
    if (!result.success) {
      allSuccess = false;
    }
  }
  
  log("");
  
  // Summary
  const successCount = results.filter((r) => r.success).length;
  const failCount = results.filter((r) => !r.success).length;
  
  log("");
  if (successCount > 0) {
    success(`${successCount} submodule(s) updated successfully`);
    log("");
    log("Updated submodules:", "blue");
    results.forEach((result) => {
      if (result.success) {
        log(`  ✅ ${result.name}: ${result.commitHash?.substring(0, 7)}`, "green");
      }
    });
  }
  
  if (failCount > 0) {
    warn(`${failCount} submodule(s) failed to update (may be optional)`);
    log("");
    log("Failed submodules:", "yellow");
    results.forEach((result) => {
      if (!result.success) {
        log(`  ⚠️  ${result.name}: ${result.error || "Unknown error"}`, "yellow");
      }
    });
  }
  
  // Return 0 if at least one submodule succeeded, or if all are optional
  // Return 1 only if critical submodules failed
  return allSuccess ? 0 : (successCount > 0 ? 0 : 1);
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  process.exit(main());
}

export { main as syncSubmodules, getSubmodules };

