/**
 * @fileoverview API route to start a specific app dev server
 *
 * @module StartAppAPI
 * @description
 * Starts a development server for a specific app using pnpm --filter.
 * Dev only - never exposed in production.
 */

import { NextResponse } from "next/server";
import { resolve } from "path";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ appId: string }> },
) {
  // Dev only
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json(
      { error: "Not available in production" },
      { status: 403 },
    );
  }

  const { appId } = await params;

  try {
    // Start app in background using pnpm --filter
    const repoRoot = resolve(process.cwd(), "../..");
    const command = `cd ${repoRoot} && pnpm --filter ${appId} dev > /dev/null 2>&1 &`;

    // Use spawn for proper background execution
    const { spawn } = await import("child_process");
    const child = spawn("sh", ["-c", command], {
      detached: true,
      stdio: "ignore",
    });
    child.unref();

    // Return immediately (app starts in background)
    return NextResponse.json({
      success: true,
      message: `Starting ${appId}...`,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to start app",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
