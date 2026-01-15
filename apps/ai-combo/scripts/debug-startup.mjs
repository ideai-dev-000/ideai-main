#!/usr/bin/env node
/**
 * @fileoverview Debug script to identify where app startup hangs
 * 
 * Usage: node scripts/debug-startup.mjs
 * 
 * This script will trace each step of the startup process and identify
 * where it hangs or takes too long.
 */

import { spawn } from "child_process";
import { performance } from "perf_hooks";

const TIMEOUT_MS = 60000; // 60 seconds timeout
const CHECK_INTERVAL_MS = 100; // Check every 100ms

function log(message) {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${message}`);
}

async function checkPort(port) {
  return new Promise((resolve) => {
    const net = require("net");
    const socket = new net.Socket();
    
    socket.setTimeout(100);
    socket.on("connect", () => {
      socket.destroy();
      resolve(true);
    });
    socket.on("timeout", () => {
      socket.destroy();
      resolve(false);
    });
    socket.on("error", () => {
      resolve(false);
    });
    
    socket.connect(port, "localhost");
  });
}

async function waitForPort(port, timeoutMs) {
  const startTime = performance.now();
  
  while (true) {
    const elapsed = performance.now() - startTime;
    
    if (elapsed > timeoutMs) {
      return false;
    }
    
    if (await checkPort(port)) {
      return true;
    }
    
    await new Promise(resolve => setTimeout(resolve, CHECK_INTERVAL_MS));
  }
}

async function runCommand(command, args, label) {
  log(`\n=== ${label} ===`);
  log(`Running: ${command} ${args.join(" ")}`);
  
  const startTime = performance.now();
  let hasOutput = false;
  let lastOutputTime = startTime;
  
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: process.cwd(),
      shell: true,
      stdio: ["ignore", "pipe", "pipe"],
    });
    
    let stdout = "";
    let stderr = "";
    
    // Monitor for hanging (no output for 30 seconds)
    const hangCheckInterval = setInterval(() => {
      const now = performance.now();
      const timeSinceLastOutput = now - lastOutputTime;
      
      if (hasOutput && timeSinceLastOutput > 30000) {
        log(`⚠️  WARNING: No output for ${Math.round(timeSinceLastOutput / 1000)}s - possible hang detected!`);
        log(`   Last output was: ${stdout.slice(-100)}`);
      }
    }, 5000);
    
    child.stdout.on("data", (data) => {
      const text = data.toString();
      stdout += text;
      hasOutput = true;
      lastOutputTime = performance.now();
      
      // Log key events
      if (text.includes("Ready") || text.includes("compiled") || text.includes("Local:")) {
        log(`✅ ${text.trim()}`);
      } else if (text.includes("error") || text.includes("Error") || text.includes("Failed")) {
        log(`❌ ${text.trim()}`);
      }
    });
    
    child.stderr.on("data", (data) => {
      const text = data.toString();
      stderr += text;
      hasOutput = true;
      lastOutputTime = performance.now();
      
      if (text.includes("error") || text.includes("Error") || text.includes("Failed")) {
        log(`❌ ERROR: ${text.trim()}`);
      }
    });
    
    child.on("close", (code) => {
      clearInterval(hangCheckInterval);
      const elapsed = performance.now() - startTime;
      
      if (code === 0) {
        log(`✅ Completed in ${Math.round(elapsed)}ms`);
        resolve({ success: true, stdout, stderr, elapsed });
      } else {
        log(`❌ Failed with code ${code} after ${Math.round(elapsed)}ms`);
        resolve({ success: false, stdout, stderr, elapsed, code });
      }
    });
    
    child.on("error", (error) => {
      clearInterval(hangCheckInterval);
      log(`❌ Process error: ${error.message}`);
      reject(error);
    });
    
    // Timeout after TIMEOUT_MS
    setTimeout(() => {
      clearInterval(hangCheckInterval);
      child.kill("SIGTERM");
      log(`⏱️  TIMEOUT after ${TIMEOUT_MS}ms - killing process`);
      resolve({ 
        success: false, 
        stdout, 
        stderr, 
        elapsed: TIMEOUT_MS,
        timeout: true 
      });
    }, TIMEOUT_MS);
  });
}

async function main() {
  log("🔍 IdeaI Capabilities Startup Debug Script");
  log("This will trace startup to identify hanging points\n");
  
  // Step 1: Check if discover-plugins hangs
  log("\n📋 Step 1: Running discover-plugins...");
  const discoverResult = await runCommand(
    "pnpm",
    ["discover-plugins"],
    "Plugin Discovery"
  );
  
  if (discoverResult.timeout) {
    log("\n⚠️  ISSUE FOUND: discover-plugins script is hanging!");
    log("   This is likely due to:");
    log("   - Dynamic imports of plugins (await import('@/plugins/index'))");
    log("   - TypeScript compilation during import");
    log("   - Circular dependencies in plugin registry");
    log("\n   See apps/ideai-capabilities/scripts/discover-plugins.ts:163");
    process.exit(1);
  }
  
  if (!discoverResult.success) {
    log("\n❌ discover-plugins failed - check errors above");
    process.exit(1);
  }
  
  // Step 2: Start dev server and monitor
  log("\n📋 Step 2: Starting Next.js dev server...");
  log("   Monitoring for compilation hangs...\n");
  
  const devResult = await runCommand(
    "pnpm",
    ["next", "dev", "--port", "3022"],
    "Next.js Dev Server"
  );
  
  if (devResult.timeout) {
    log("\n⚠️  ISSUE FOUND: Next.js dev server is hanging!");
    log("   Common causes:");
    log("   - Turbopack compilation stuck on large files");
    log("   - Circular dependencies");
    log("   - Heavy imports in root layout/page");
    log("   - TypeScript type checking issues");
    process.exit(1);
  }
  
  // Step 3: Check if port is responding
  log("\n📋 Step 3: Checking if server is responding...");
  const portReady = await waitForPort(3022, 10000);
  
  if (!portReady) {
    log("❌ Server is not responding on port 3022");
    process.exit(1);
  }
  
  log("✅ Server is responding on port 3022");
  log("\n✅ All checks passed! App should be working.");
}

main().catch((error) => {
  log(`\n❌ Fatal error: ${error.message}`);
  console.error(error);
  process.exit(1);
});
