/**
 * @fileoverview Local dev server status API endpoint
 * 
 * @module LocalStatusAPI
 * @description
 * Returns the status of all local development servers by checking
 * if their ports are in use. Uses the same logic as dev-manager.mjs
 */

import { NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";
import { defaultRoutingConfig } from "../../../config/routing";

const execAsync = promisify(exec);

/**
 * Check if a port is in use
 */
async function isPortInUse(port: number): Promise<boolean> {
  try {
    const { stdout } = await execAsync(`lsof -ti:${port} 2>/dev/null || true`);
    return stdout.trim().length > 0;
  } catch {
    return false;
  }
}

/**
 * GET /api/status/local
 * Returns status of all local dev servers
 */
export async function GET() {
  try {
    const apps = defaultRoutingConfig.apps;
    const statuses: Record<string, "running" | "stopped" | "unknown"> = {};

    // Check each app's port
    for (const app of apps) {
      if (app.port) {
        const running = await isPortInUse(app.port);
        statuses[app.id] = running ? "running" : "stopped";
      } else {
        statuses[app.id] = "unknown";
      }
    }

    return NextResponse.json({
      success: true,
      statuses,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error checking local status:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to check local status",
        statuses: {},
      },
      { status: 500 }
    );
  }
}

