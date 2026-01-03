#!/usr/bin/env node
/**
 * @fileoverview IdeaI Developer - Single entry point for all developer tools
 * 
 * @module IdeAIDeveloperCLI
 * @description
 * Thin CLI wrapper that routes to @repo/ideai-developer package functions.
 * This ensures tight coupling between scripts and package implementation.
 * 
 * All actual logic lives in packages/ideai-developer/
 * This script is just the entry point.
 * 
 * Usage:
 *   node scripts/ideai-developer.mjs ui [--mode=build|boot|develop]
 *   node scripts/ideai-developer.mjs port status
 *   node scripts/ideai-developer.mjs port start
 *   node scripts/ideai-developer.mjs port stop
 *   node scripts/ideai-developer.mjs script build verify
 *   node scripts/ideai-developer.mjs build status
 */

import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { createRequire } from "module";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const REPO_ROOT = join(__dirname, "..");

// Use createRequire to import from package (works with ES modules)
const require = createRequire(import.meta.url);

// Import from package - this ensures tight coupling
// All CLI functions are in .mjs files for direct import
let developerPackage;
try {
  const packageCliPath = join(REPO_ROOT, "packages", "ideai-developer", "src", "local", "cli");
  
  // Import individual CLI modules directly (all are .mjs files)
  const uiModule = await import(`file://${join(packageCliPath, "ui.mjs")}`);
  const portModule = await import(`file://${join(packageCliPath, "port.mjs")}`);
  const scriptModule = await import(`file://${join(packageCliPath, "script.mjs")}`);
  const buildModule = await import(`file://${join(packageCliPath, "build.mjs")}`);
  
  developerPackage = {
    startDeveloperUI: uiModule.startDeveloperUI,
    getPortStatus: portModule.getPortStatus,
    startAllPorts: portModule.startAllPorts,
    stopAllPorts: portModule.stopAllPorts,
    runBuildScript: scriptModule.runBuildScript,
    getBuildStatus: buildModule.getBuildStatus,
  };
} catch (error) {
  console.error("❌ Failed to load @repo/ideai-developer package:", error.message);
  console.error("   Make sure packages/ideai-developer/src/local/cli/*.mjs files exist");
  process.exit(1);
}

// Colors
const colors = {
  reset: "\x1b[0m",
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
  console.log(`${colors.green}✅ ${message}${colors.reset}`);
}

/**
 * Parse command line arguments
 */
function parseArgs() {
  const args = process.argv.slice(2);
  const command = args[0];
  const subcommand = args[1];
  const options = {};

  for (let i = 2; i < args.length; i++) {
    const arg = args[i];
    if (arg.startsWith("--")) {
      const key = arg.slice(2);
      const value = args[i + 1];
      if (value && !value.startsWith("--")) {
        options[key] = value;
        i++;
      } else {
        options[key] = true;
      }
    }
  }

  return { command, subcommand, options, args: args.slice(2) };
}

/**
 * Show help
 */
function showHelp() {
  log("IdeaI Developer Tools", "cyan");
  log("", "reset");
  log("Usage: node scripts/ideai-developer.mjs <command> [subcommand] [options]", "bright");
  log("", "reset");
  log("Commands:", "bright");
  log("  ui [--mode=build|boot|develop]  Start developer UI", "reset");
  log("  port <status|start|stop>        Manage dev server ports", "reset");
  log("  script <name> [args...]         Run a build script", "reset");
  log("  build <status>                  Get build status", "reset");
  log("  help                            Show this help", "reset");
  log("", "reset");
  log("Examples:", "bright");
  log("  node scripts/ideai-developer.mjs ui", "reset");
  log("  node scripts/ideai-developer.mjs port status", "reset");
  log("  node scripts/ideai-developer.mjs port start", "reset");
  log("  node scripts/ideai-developer.mjs script verify", "reset");
}

/**
 * Main CLI router
 */
async function main() {
  const { command, subcommand, options, args } = parseArgs();

  if (!command || command === "help") {
    showHelp();
    return;
  }

  try {
    switch (command) {
      case "ui":
        if (!developerPackage.startDeveloperUI) {
          error("Developer UI not available (dev-only tool)");
          process.exit(1);
        }
        await developerPackage.startDeveloperUI({
          mode: options.mode,
          port: options.port ? parseInt(options.port) : undefined,
        });
        break;

      case "port":
        if (!subcommand) {
          error("Port command requires subcommand: status, start, or stop");
          process.exit(1);
        }

        switch (subcommand) {
          case "status":
            if (!developerPackage.getPortStatus) {
              error("Port status not available (dev-only tool)");
              process.exit(1);
            }
            const status = developerPackage.getPortStatus();
            log("Port Status:", "cyan");
            for (const [port, running] of Object.entries(status)) {
              const icon = running ? "✅" : "⏳";
              const color = running ? "green" : "yellow";
              log(`  ${icon} Port ${port}: ${running ? "Running" : "Stopped"}`, color);
            }
            break;

          case "start":
            if (!developerPackage.startAllPorts) {
              error("Port manager not available (dev-only tool)");
              process.exit(1);
            }
            await developerPackage.startAllPorts();
            success("All ports started");
            break;

          case "stop":
            if (!developerPackage.stopAllPorts) {
              error("Port manager not available (dev-only tool)");
              process.exit(1);
            }
            await developerPackage.stopAllPorts();
            success("All ports stopped");
            break;

          default:
            error(`Unknown port subcommand: ${subcommand}`);
            process.exit(1);
        }
        break;

      case "script":
        if (!subcommand) {
          error("Script command requires script name");
          process.exit(1);
        }
        if (!developerPackage.runBuildScript) {
          error("Script runner not available (dev-only tool)");
          process.exit(1);
        }
        await developerPackage.runBuildScript(subcommand, args.slice(1));
        break;

      case "build":
        if (!subcommand || subcommand !== "status") {
          error("Build command requires 'status' subcommand");
          process.exit(1);
        }
        if (!developerPackage.getBuildStatus) {
          error("Build status not available (dev-only tool)");
          process.exit(1);
        }
        const buildStatus = await developerPackage.getBuildStatus();
        log("Build Status:", "cyan");
        log(`  Verified: ${buildStatus.verified ? "✅" : "❌"}`, buildStatus.verified ? "green" : "red");
        if (buildStatus.lastRun) {
          log(`  Last Run: ${buildStatus.lastRun}`, "reset");
        }
        break;

      default:
        error(`Unknown command: ${command}`);
        showHelp();
        process.exit(1);
    }
  } catch (err) {
    error(err instanceof Error ? err.message : String(err));
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    console.error("Fatal error:", error);
    process.exit(1);
  });
}

