#!/usr/bin/env node
/**
 * @fileoverview IdeaI Graceful Shutdown - Cleanly stop all dev servers
 * 
 * @module IdeAIGracefulShutdown
 * @description
 * Gracefully shuts down all IdeaI dev servers by sending SIGTERM first,
 * then SIGKILL if needed. Ensures clean shutdown without data loss.
 * 
 * Usage:
 *   node scripts/ideai-develop-graceful-shutdown.mjs [--force] [--quiet]
 * 
 * Options:
 *   --force    Skip graceful shutdown, kill immediately
 *   --quiet    Suppress output (for CI/CD)
 * 
 * @example
 * ```bash
 * # Graceful shutdown (default)
 * node scripts/ideai-develop-graceful-shutdown.mjs
 * 
 * # Force kill
 * node scripts/ideai-develop-graceful-shutdown.mjs --force
 * ```
 */

import { execSync } from "child_process";
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
 * Get PIDs for processes on a port
 */
function getPidsOnPort(port) {
  try {
    const result = execSync(
      `lsof -ti:${port} 2>/dev/null || true`,
      { encoding: "utf-8", cwd: REPO_ROOT }
    ).trim();
    
    if (result) {
      return result.split("\n").filter(Boolean).map(Number);
    }
  } catch {
    // Port not in use
  }
  
  return [];
}

/**
 * Get PIDs for processes matching pattern
 */
function getPidsForPattern(pattern) {
  try {
    const result = execSync(
      `pgrep -f "${pattern}" 2>/dev/null || true`,
      { encoding: "utf-8", cwd: REPO_ROOT }
    ).trim();
    
    if (result) {
      return result.split("\n").filter(Boolean).map(Number);
    }
  } catch {
    // No processes found
  }
  
  return [];
}

/**
 * Check if process is still running
 */
function isProcessRunning(pid) {
  try {
    execSync(`kill -0 ${pid} 2>/dev/null`, { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

/**
 * Gracefully kill a process
 */
function gracefulKill(pid, signal = "SIGTERM") {
  try {
    execSync(`kill -${signal} ${pid} 2>/dev/null || true`, {
      stdio: "ignore",
      cwd: REPO_ROOT,
    });
    return true;
  } catch {
    return false;
  }
}

/**
 * Stop processes on dev ports (3000-3013)
 */
function stopDevPorts(force = false) {
  log("=== Stopping Dev Servers (Ports 3000-3013) ===", "bright");
  
  const ports = Array.from({ length: 14 }, (_, i) => 3000 + i);
  let stoppedCount = 0;
  const pidsToKill = [];
  
  // Collect all PIDs
  for (const port of ports) {
    const pids = getPidsOnPort(port);
    pidsToKill.push(...pids.map(pid => ({ pid, port, type: "port" })));
  }
  
  if (pidsToKill.length === 0) {
    info("No dev servers running on ports 3000-3013");
    log("");
    return 0;
  }
  
  // Send SIGTERM first (graceful)
  if (!force) {
    log("Sending graceful shutdown signal (SIGTERM)...", "blue");
    for (const { pid, port } of pidsToKill) {
      gracefulKill(pid, "SIGTERM");
      log(`  → Sent SIGTERM to PID ${pid} (port ${port})`, "cyan");
    }
    
    // Wait for processes to exit
    log("Waiting for graceful shutdown (5 seconds)...", "blue");
    const startTime = Date.now();
    const maxWait = 5000; // 5 seconds
    const checkInterval = 100; // Check every 100ms
    
    while (Date.now() - startTime < maxWait) {
      const stillRunning = pidsToKill.filter(({ pid }) => isProcessRunning(pid));
      if (stillRunning.length === 0) {
        break;
      }
      // Sleep
      Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, checkInterval);
    }
    
    // Check which processes are still running
    const stillRunning = pidsToKill.filter(({ pid }) => isProcessRunning(pid));
    
    if (stillRunning.length > 0) {
      warn(`${stillRunning.length} process(es) did not exit gracefully`);
      log("Sending SIGKILL to remaining processes...", "yellow");
      
      for (const { pid, port } of stillRunning) {
        gracefulKill(pid, "SIGKILL");
        log(`  → Sent SIGKILL to PID ${pid} (port ${port})`, "yellow");
      }
      
      // Wait a bit more
      Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 1000);
    }
  } else {
    // Force kill immediately
    log("Force killing all processes...", "yellow");
    for (const { pid, port } of pidsToKill) {
      gracefulKill(pid, "SIGKILL");
      log(`  → Killed PID ${pid} (port ${port})`, "yellow");
    }
  }
  
  // Verify all are stopped
  const finalCheck = pidsToKill.filter(({ pid }) => isProcessRunning(pid));
  stoppedCount = pidsToKill.length - finalCheck.length;
  
  if (finalCheck.length === 0) {
    success(`Stopped ${stoppedCount} dev server process(es)`);
  } else {
    warn(`${finalCheck.length} process(es) still running after kill`);
  }
  
  log("");
  return stoppedCount;
}

/**
 * Stop Node.js dev processes
 */
function stopNodeProcesses(force = false) {
  log("=== Stopping Node.js Dev Processes ===", "bright");
  
  const patterns = [
    "pnpm.*dev",
    "next dev",
    "turbo.*dev",
  ];
  
  const allPids = [];
  for (const pattern of patterns) {
    const pids = getPidsForPattern(pattern);
    allPids.push(...pids.map(pid => ({ pid, pattern })));
  }
  
  // Remove duplicates
  const uniquePids = Array.from(
    new Map(allPids.map(item => [item.pid, item])).values()
  );
  
  if (uniquePids.length === 0) {
    info("No Node.js dev processes found");
    log("");
    return 0;
  }
  
  // Send SIGTERM first (graceful)
  if (!force) {
    log("Sending graceful shutdown signal (SIGTERM)...", "blue");
    for (const { pid, pattern } of uniquePids) {
      gracefulKill(pid, "SIGTERM");
      log(`  → Sent SIGTERM to PID ${pid} (${pattern})`, "cyan");
    }
    
    // Wait for processes to exit
    log("Waiting for graceful shutdown (3 seconds)...", "blue");
    Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 3000);
    
    // Check which are still running
    const stillRunning = uniquePids.filter(({ pid }) => isProcessRunning(pid));
    
    if (stillRunning.length > 0) {
      warn(`${stillRunning.length} process(es) did not exit gracefully`);
      log("Sending SIGKILL to remaining processes...", "yellow");
      
      for (const { pid, pattern } of stillRunning) {
        gracefulKill(pid, "SIGKILL");
        log(`  → Sent SIGKILL to PID ${pid} (${pattern})`, "yellow");
      }
      
      Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 1000);
    }
  } else {
    // Force kill immediately
    log("Force killing all processes...", "yellow");
    for (const { pid, pattern } of uniquePids) {
      gracefulKill(pid, "SIGKILL");
      log(`  → Killed PID ${pid} (${pattern})`, "yellow");
    }
    Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 1000);
  }
  
  // Verify all are stopped
  const finalCheck = uniquePids.filter(({ pid }) => isProcessRunning(pid));
  const stoppedCount = uniquePids.length - finalCheck.length;
  
  if (finalCheck.length === 0) {
    success(`Stopped ${stoppedCount} Node.js process(es)`);
  } else {
    warn(`${finalCheck.length} process(es) still running after kill`);
  }
  
  log("");
  return stoppedCount;
}

/**
 * Main function
 */
function main() {
  const args = process.argv.slice(2);
  const force = args.includes("--force");
  const quiet = args.includes("--quiet");
  
  log("=== IdeaI Graceful Shutdown ===", "bright");
  log("");
  
  if (force) {
    warn("Force mode: Processes will be killed immediately");
    log("");
  } else {
    log("Graceful mode: Sending SIGTERM first, then SIGKILL if needed", "blue");
    log("");
  }
  
  // Step 1: Stop dev ports
  const portsStopped = stopDevPorts(force);
  
  // Step 2: Stop node processes
  const nodesStopped = stopNodeProcesses(force);
  
  // Summary
  log("");
  if (portsStopped > 0 || nodesStopped > 0) {
    success("=== Shutdown Complete ===");
    log(`  Stopped ${portsStopped} dev server(s)`);
    log(`  Stopped ${nodesStopped} Node.js process(es)`);
    return 0;
  } else {
    info("=== No Processes to Stop ===");
    log("  All dev servers already stopped");
    return 0;
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  process.exit(main());
}

export { main as gracefulShutdown };

