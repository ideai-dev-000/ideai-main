/**
 * @fileoverview API route to stop a specific app dev server
 *
 * @module StopAppAPI
 * @description
 * Stops a development server for a specific app by killing processes on its port.
 * Dev only - never exposed in production.
 */

import { NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";
import { resolve, join } from "path";
import { readFile } from "fs/promises";

const execAsync = promisify(exec);

async function getAppPort(appId: string): Promise<number | null> {
  try {
    const repoRoot = resolve(process.cwd(), "../..");
    const appPath = join(repoRoot, "apps", appId);
    const ideaiJsonPath = join(appPath, ".ideai.json");

    const content = await readFile(ideaiJsonPath, "utf-8");
    const config = JSON.parse(content) as {
      localPort?: number;
      metadata?: { port?: number };
    };

    return config.metadata?.port || config.localPort || null;
  } catch {
    return null;
  }
}

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
    const port = await getAppPort(appId);

    if (port) {
      // Kill process on port
      await execAsync(`lsof -ti:${port} | xargs kill -9 2>/dev/null || true`);
    }

    // Also kill any Next.js processes for this app
    await execAsync(
      `pkill -f "next dev.*--port.*${appId}" 2>/dev/null || true`,
    );

    return NextResponse.json({
      success: true,
      message: `Stopped ${appId}`,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to stop app",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
