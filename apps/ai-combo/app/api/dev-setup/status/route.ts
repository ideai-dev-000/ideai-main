/**
 * @fileoverview Dev Setup Status API
 *
 * @module DevSetupStatusAPI
 * @description
 * API endpoint to get setup status from .ideai-dev.json file.
 * This is the developer's personal setup file (not .ideai.json which is product config).
 * Returns current requirements checklist status.
 */

import { NextRequest, NextResponse } from "next/server";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

/**
 * GET /api/dev-setup/status
 * Get setup status from .ideai-dev.json (developer setup file)
 */
export async function GET(request: NextRequest) {
  try {
    const ideaiDevJsonPath = join(process.cwd(), "..", "..", ".ideai-dev.json");

    let ideaiDevJson: any = null;
    try {
      const content = await readFile(ideaiDevJsonPath, "utf-8");
      ideaiDevJson = JSON.parse(content);
    } catch (error) {
      // File doesn't exist or invalid JSON - use defaults
      return NextResponse.json({
        success: true,
        status: {
          setup: {
            database: { migration_complete: false, connected: false },
            auth: { configured: false },
            service_keys: { configured: false },
            environment: { variables_set: false },
            dev_ready: false,
          },
        },
        fileExists: false,
      });
    }

    return NextResponse.json({
      success: true,
      status: ideaiDevJson,
      fileExists: true,
    });
  } catch (error) {
    console.error("[Dev Setup Status] Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to read setup status",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
