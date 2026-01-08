/**
 * @fileoverview Database Migration API Route
 *
 * @module DatabaseMigrateAPI
 * @description
 * Server-side API route to run database migrations.
 * DEV-ONLY: Only works in development mode for security.
 */

import { NextResponse } from "next/server";
import { execSync } from "child_process";
import { join } from "path";

export async function POST(request: Request) {
  // SECURITY: Only allow in development
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json(
      { error: { message: "Database API is only available in development" } },
      { status: 403 },
    );
  }

  const body = await request.json().catch(() => ({}));
  const { env = "local", app = "ideai-capabilities", url } = body;

  let databaseUrl = url || process.env.DATABASE_URL;

  if (!databaseUrl && env === "local") {
    databaseUrl = "postgres://localhost:5432/workflow";
  }

  if (!databaseUrl) {
    return NextResponse.json(
      {
        error: {
          message: "DATABASE_URL required. Use connect endpoint first.",
        },
      },
      { status: 400 },
    );
  }

  const appDir = join(process.cwd(), "..", "apps", app);

  try {
    const output = execSync("pnpm db:migrate", {
      cwd: appDir,
      encoding: "utf-8",
      stdio: "pipe",
      env: { ...process.env, DATABASE_URL: databaseUrl },
    });

    return NextResponse.json({
      data: {
        success: true,
        output,
      },
    });
  } catch (error) {
    const errorOutput =
      error instanceof Error ? error.message : "Unknown error";
    const output =
      error && typeof error === "object" && "stdout" in error
        ? (error.stdout as string)
        : "";

    return NextResponse.json(
      {
        error: {
          message: errorOutput,
          output,
        },
      },
      { status: 500 },
    );
  }
}
