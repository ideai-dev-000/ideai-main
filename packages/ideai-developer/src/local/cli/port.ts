/**
 * @fileoverview Port Manager CLI
 *
 * @module PortManagerCLI
 * @description
 * CLI functions for managing dev server ports
 * Called from scripts/ideai-developer.mjs
 */

import { assertDevelopment } from "../utils/dev-check.js";
import { execSync } from "child_process";
import { join } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const REPO_ROOT = join(__dirname, "../../../../..");

/**
 * Get status of all dev ports
 */
export function getPortStatus(): Record<number, boolean> {
  assertDevelopment();

  const ports = [
    3000, 3001, 3002, 3003, 3004, 3005, 3006, 3007, 3008, 3009, 3010, 3011,
    3012,
  ];
  const status: Record<number, boolean> = {};

  for (const port of ports) {
    try {
      const result = execSync(`lsof -ti:${port} 2>/dev/null || true`, {
        encoding: "utf-8",
      });
      status[port] = result.trim().length > 0;
    } catch {
      status[port] = false;
    }
  }

  return status;
}

/**
 * Start all dev servers
 */
export async function startAllPorts(): Promise<void> {
  assertDevelopment();

  // Implementation will call pnpm dev or individual app starts
  console.log("Starting all dev servers...");
}

/**
 * Stop all dev servers
 */
export async function stopAllPorts(): Promise<void> {
  assertDevelopment();

  const ports = [
    3000, 3001, 3002, 3003, 3004, 3005, 3006, 3007, 3008, 3009, 3010, 3011,
    3012,
  ];
  const portList = ports.join(",");

  try {
    execSync(
      `lsof -ti:${portList} 2>/dev/null | xargs kill -9 2>/dev/null || true`,
    );
    console.log("All dev servers stopped");
  } catch (error) {
    console.error("Error stopping servers:", error);
  }
}


