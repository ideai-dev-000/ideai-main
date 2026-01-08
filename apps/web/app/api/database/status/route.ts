/**
 * @fileoverview Database Status API Route
 *
 * @module DatabaseStatusAPI
 * @description
 * Server-side API route to get database connection status and info.
 * DEV-ONLY: Only works in development mode for security.
 */

import { NextResponse } from "next/server";
import { execSync } from "child_process";

export async function GET(request: Request) {
  // SECURITY: Only allow in development
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json(
      { error: { message: "Database API is only available in development" } },
      { status: 403 },
    );
  }

  const { searchParams } = new URL(request.url);
  const env = searchParams.get("env") || "local";
  const app = searchParams.get("app") || "ideai-capabilities";

  let databaseUrl = process.env.DATABASE_URL;

  // For production, user must provide URL via query param (not stored server-side)
  if (env === "production" || env === "preview") {
    const url = searchParams.get("url");
    if (!url) {
      return NextResponse.json(
        {
          error: {
            message:
              "DATABASE_URL required for production. Use connect endpoint first.",
          },
        },
        { status: 400 },
      );
    }
    databaseUrl = url;
  }

  if (!databaseUrl) {
    databaseUrl = "postgres://localhost:5432/workflow";
  }

  try {
    // Test connection
    const versionResult = execSync(
      `psql "${databaseUrl}" -c "SELECT version();" -t`,
      { encoding: "utf-8", stdio: "pipe" },
    );

    const version = versionResult.trim().split("\n")[0];

    // Get database name
    const dbNameMatch = databaseUrl.match(/\/([^?\/]+)(?:\?|$)/);
    const dbName = dbNameMatch ? dbNameMatch[1] : "unknown";

    // Count tables
    let tableCount = 0;
    try {
      const tablesResult = execSync(
        `psql "${databaseUrl}" -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';" -t`,
        { encoding: "utf-8", stdio: "pipe" },
      );
      tableCount = parseInt(tablesResult.trim()) || 0;
    } catch (e) {
      // Ignore table count errors
    }

    // Hide password in URL for response
    const displayUrl = databaseUrl.replace(/:([^:@]+)@/, ":****@");

    return NextResponse.json({
      data: {
        connected: true,
        version,
        database: dbName,
        tableCount,
        displayUrl,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: {
          message: error instanceof Error ? error.message : "Connection failed",
        },
      },
      { status: 500 },
    );
  }
}
