/**
 * @fileoverview Database Sync API Route
 *
 * @module DatabaseSyncAPI
 * @description
 * Server-side API route to sync database from local to production.
 * This allows testing workflows locally and then pushing them to production.
 *
 * SECURITY: Only works in development mode for safety.
 */

import { NextResponse } from "next/server";
import { execSync } from "child_process";

export async function POST(request: Request) {
  // SECURITY: Only allow in development
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json(
      { error: { message: "Database sync is only available in development" } },
      { status: 403 },
    );
  }

  const body = await request.json().catch(() => ({}));
  const {
    sourceEnv = "local",
    targetEnv = "production",
    app = "ideai-capabilities",
    sourceUrl,
    targetUrl,
  } = body;

  // Validate we're syncing to production (safety check)
  if (targetEnv !== "production" && !targetUrl) {
    return NextResponse.json(
      {
        error: {
          message: "Target must be production or provide targetUrl for safety",
        },
      },
      { status: 400 },
    );
  }

  // Get source database URL
  let sourceDatabaseUrl = sourceUrl || process.env.DATABASE_URL;
  if (!sourceDatabaseUrl && sourceEnv === "local") {
    sourceDatabaseUrl = "postgres://localhost:5432/workflow";
  }

  // Get target database URL (for production, must be provided via targetUrl)
  let targetDatabaseUrl = targetUrl;

  // Special case: If targetUrl is "USE_SAME_AS_LOCAL", use the same as source (for testing)
  if (targetDatabaseUrl === "USE_SAME_AS_LOCAL") {
    targetDatabaseUrl = sourceDatabaseUrl;
  }

  if (!targetDatabaseUrl) {
    return NextResponse.json(
      {
        error: {
          message:
            "Target DATABASE_URL required. Use 'Connect to Vercel' first to get production URL.",
        },
      },
      { status: 400 },
    );
  }

  if (!sourceDatabaseUrl) {
    return NextResponse.json(
      {
        error: {
          message: "Source DATABASE_URL required",
        },
      },
      { status: 400 },
    );
  }

  try {
    // Step 1: Dump source database
    const timestamp = Date.now();
    const dumpFile = `/tmp/db-sync-${timestamp}.sql`;

    console.log(`[DB Sync] Dumping source database...`);
    execSync(`pg_dump "${sourceDatabaseUrl}" > "${dumpFile}"`, {
      encoding: "utf-8",
      stdio: "pipe",
    });

    // Step 2: Restore to target database
    console.log(`[DB Sync] Restoring to target database...`);
    execSync(`psql "${targetDatabaseUrl}" < "${dumpFile}"`, {
      encoding: "utf-8",
      stdio: "pipe",
    });

    // Step 3: Cleanup
    try {
      execSync(`rm "${dumpFile}"`, { stdio: "ignore" });
    } catch (e) {
      // Ignore cleanup errors
    }

    return NextResponse.json({
      data: {
        success: true,
        message: `Successfully synced database from ${sourceEnv} to ${targetEnv}`,
        source: sourceEnv,
        target: targetEnv,
      },
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    const errorOutput =
      error && typeof error === "object" && "stdout" in error
        ? (error.stdout as string)
        : "";

    return NextResponse.json(
      {
        error: {
          message: `Database sync failed: ${errorMessage}`,
          output: errorOutput,
        },
      },
      { status: 500 },
    );
  }
}
