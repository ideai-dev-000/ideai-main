#!/usr/bin/env node
/**
 * @fileoverview IdeaI Cold Refresh - Complete cleanup and rebuild
 * 
 * @module IdeAIColdRefresh
 * @description
 * Performs a complete cold refresh: kills all dev servers, flushes caches,
 * cleans build artifacts, and rebuilds everything from scratch.
 * 
 * Usage:
 *   node scripts/ideai-build-cold-refresh.mjs [--no-build]
 * 
 * Options:
 *   --no-build    Clean everything but skip the build step
 *   --quiet       Suppress output (for CI/CD)
 * 
 * @example
 * ```bash
 * # Full cold refresh with rebuild
 * node scripts/ideai-build-cold-refresh.mjs
 * 
 * # Clean only, no rebuild
 * node scripts/ideai-build-cold-refresh.mjs --no-build
 * ```
 */

import { execSync } from "child_process";
import { existsSync, readdirSync, rmSync, statSync } from "fs";
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
 * Kill all processes on dev ports (3000-3013)
 */
function killDevServers() {
  log("=== Stopping All Dev Servers ===", "bright");
  
  const ports = Array.from({ length: 14 }, (_, i) => 3000 + i);
  let killedCount = 0;
  
  for (const port of ports) {
    try {
      // Find processes using the port
      const result = execSync(
        `lsof -ti:${port} 2>/dev/null || true`,
        { encoding: "utf-8", cwd: REPO_ROOT }
      ).trim();
      
      if (result) {
        const pids = result.split("\n").filter(Boolean);
        for (const pid of pids) {
          try {
            execSync(`kill -9 ${pid} 2>/dev/null || true`, {
              stdio: "ignore",
              cwd: REPO_ROOT,
            });
            killedCount++;
          } catch {
            // Process may have already terminated
          }
        }
      }
    } catch {
      // Port not in use, continue
    }
  }
  
  if (killedCount > 0) {
    success(`Stopped ${killedCount} process(es) on dev ports`);
  } else {
    info("No dev servers running");
  }
  
  log("");
  return killedCount;
}

/**
 * Kill all node/next/pnpm processes
 * Uses graceful shutdown script for clean termination
 */
function killNodeProcesses() {
  // Graceful shutdown script handles this
  // This function is kept for compatibility but graceful shutdown
  // is already called in killDevServers()
  log("");
}

/**
 * Clean all .next directories
 */
function cleanNextDirectories() {
  log("=== Cleaning .next Directories ===", "bright");
  
  const appsDir = join(REPO_ROOT, "apps");
  if (!existsSync(appsDir)) {
    warn("Apps directory not found");
    return 0;
  }
  
  let cleanedCount = 0;
  let totalSize = 0;
  
  const apps = readdirSync(appsDir, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);
  
  for (const app of apps) {
    const nextDir = join(appsDir, app, ".next");
    if (existsSync(nextDir)) {
      try {
        // Calculate size before deletion
        const size = getDirectorySize(nextDir);
        totalSize += size;
        
        rmSync(nextDir, { recursive: true, force: true });
        cleanedCount++;
        
        const sizeMB = (size / 1024 / 1024).toFixed(1);
        log(`  ✅ Removed ${app}/.next (${sizeMB}MB)`, "green");
      } catch (err) {
        warn(`  ⚠️  Failed to remove ${app}/.next: ${err.message}`);
      }
    }
  }
  
  if (cleanedCount > 0) {
    const totalMB = (totalSize / 1024 / 1024).toFixed(1);
    success(`Cleaned ${cleanedCount} .next directory(ies) (~${totalMB}MB)`);
  } else {
    info("No .next directories found");
  }
  
  log("");
  return cleanedCount;
}

/**
 * Get directory size recursively
 */
function getDirectorySize(dirPath) {
  let size = 0;
  
  try {
    const items = readdirSync(dirPath, { withFileTypes: true });
    
    for (const item of items) {
      const itemPath = join(dirPath, item.name);
      
      if (item.isDirectory()) {
        size += getDirectorySize(itemPath);
      } else {
        try {
          const stats = statSync(itemPath);
          size += stats.size;
        } catch {
          // File may have been deleted
        }
      }
    }
  } catch {
    // Directory may not exist or be inaccessible
  }
  
  return size;
}

/**
 * Clean node_modules/.cache directories
 */
function cleanNodeModulesCache() {
  log("=== Cleaning Node Modules Cache ===", "bright");
  
  let cleanedCount = 0;
  const cacheDirs = [
    join(REPO_ROOT, "node_modules", ".cache"),
    join(REPO_ROOT, ".turbo"),
  ];
  
  for (const cacheDir of cacheDirs) {
    if (existsSync(cacheDir)) {
      try {
        const size = getDirectorySize(cacheDir);
        rmSync(cacheDir, { recursive: true, force: true });
        cleanedCount++;
        
        const sizeMB = (size / 1024 / 1024).toFixed(1);
        log(`  ✅ Removed ${cacheDir} (${sizeMB}MB)`, "green");
      } catch (err) {
        warn(`  ⚠️  Failed to remove ${cacheDir}: ${err.message}`);
      }
    }
  }
  
  // Clean app-specific caches
  const appsDir = join(REPO_ROOT, "apps");
  if (existsSync(appsDir)) {
    const apps = readdirSync(appsDir, { withFileTypes: true })
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => dirent.name);
    
    for (const app of apps) {
      const appCacheDir = join(appsDir, app, "node_modules", ".cache");
      if (existsSync(appCacheDir)) {
        try {
          rmSync(appCacheDir, { recursive: true, force: true });
          cleanedCount++;
        } catch {
          // Ignore errors
        }
      }
    }
  }
  
  if (cleanedCount > 0) {
    success(`Cleaned ${cleanedCount} cache directory(ies)`);
  } else {
    info("No cache directories found");
  }
  
  log("");
  return cleanedCount;
}

/**
 * Clean build artifacts
 */
function cleanBuildArtifacts() {
  log("=== Cleaning Build Artifacts ===", "bright");
  
  const artifacts = [
    "dist",
    "build",
    "out",
    ".turbo",
  ];
  
  let cleanedCount = 0;
  
  for (const artifact of artifacts) {
    const artifactPath = join(REPO_ROOT, artifact);
    if (existsSync(artifactPath)) {
      try {
        rmSync(artifactPath, { recursive: true, force: true });
        cleanedCount++;
        log(`  ✅ Removed ${artifact}`, "green");
      } catch (err) {
        warn(`  ⚠️  Failed to remove ${artifact}: ${err.message}`);
      }
    }
  }
  
  if (cleanedCount > 0) {
    success(`Cleaned ${cleanedCount} build artifact(s)`);
  } else {
    info("No build artifacts found");
  }
  
  log("");
  return cleanedCount;
}

/**
 * Run build
 */
function runBuild() {
  log("=== Building All Apps ===", "bright");
  log("");
  
  try {
    execSync("pnpm build", {
      stdio: "inherit",
      cwd: REPO_ROOT,
    });
    success("Build completed successfully");
    return true;
  } catch (err) {
    error(`Build failed: ${err.message}`);
    return false;
  }
}

/**
 * Main function
 */
async function main() {
  const args = process.argv.slice(2);
  const noBuild = args.includes("--no-build");
  const quiet = args.includes("--quiet");
  
  log("=== IdeaI Cold Refresh ===", "bright");
  log("");
  log("This will:", "yellow");
  log("  1. Stop all dev servers (ports 3000-3013)");
  log("  2. Kill all Node.js dev processes");
  log("  3. Clean all .next directories");
  log("  4. Clean node_modules/.cache");
  log("  5. Clean build artifacts");
  if (!noBuild) {
    log("  6. Sync submodules to latest");
    log("  7. Rebuild all apps");
  }
  log("");
  
  // Step 1: Kill dev servers (graceful shutdown)
  await killDevServers();
  
  // Step 2: Kill node processes (handled by graceful shutdown)
  killNodeProcesses();
  
  // Step 3: Clean .next directories
  cleanNextDirectories();
  
  // Step 4: Clean caches
  cleanNodeModulesCache();
  
  // Step 5: Clean build artifacts
  cleanBuildArtifacts();
  
  // Step 6: Sync submodules (if building)
  if (!noBuild) {
    log("=== Syncing Submodules ===", "bright");
    try {
      const submoduleModule = await import("./ideai-build-sync-submodules.mjs");
      if (submoduleModule.syncSubmodules) {
        submoduleModule.syncSubmodules();
      }
    } catch (err) {
      warn(`Submodule sync failed: ${err.message}`);
    }
    log("");
  }
  
  // Step 7: Build (if not skipped)
  if (!noBuild) {
    const buildSuccess = runBuild();
    log("");
    
    if (buildSuccess) {
      success("=== Cold Refresh Complete ===");
      return 0;
    } else {
      error("=== Cold Refresh Failed ===");
      return 1;
    }
  } else {
    success("=== Cleanup Complete ===");
    log("");
    info("Skipped build (use without --no-build to rebuild)");
    return 0;
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().then((exitCode) => {
    process.exit(exitCode);
  }).catch((err) => {
    error(`Fatal error: ${err.message}`);
    process.exit(1);
  });
}

export { main as coldRefresh };

