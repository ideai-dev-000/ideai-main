/**
 * @fileoverview Test endpoint for debugging auth configuration
 *
 * @module AuthTest
 * @description
 * Temporary endpoint to test if auth is working correctly.
 * Remove after debugging.
 */

import { NextResponse } from "next/server";
import { auth } from "@repo/ideai-user/auth";

export async function GET() {
  try {
    // Test if auth instance is initialized
    const baseURL =
      process.env.BETTER_AUTH_URL ||
      process.env.NEXT_PUBLIC_APP_URL ||
      "http://localhost:3020";
    const hasSecret = !!(
      process.env.BETTER_AUTH_SECRET || process.env.AUTH_SECRET
    );
    const hasDb = !!(process.env.DATABASE_URL || process.env.POSTGRES_URL);

    // Try to connect to database
    let dbConnection = false;
    try {
      // Just test if we can import and access the db
      const { db } = await import("@repo/ideai-user/db");
      dbConnection = !!db;
    } catch (dbError) {
      console.error("DB connection test failed:", dbError);
    }

    return NextResponse.json({
      status: "ok",
      auth: {
        baseURL,
        hasSecret,
        secretPreview: hasSecret ? "***" : "missing",
      },
      database: {
        hasConnection: hasDb,
        connectionTest: dbConnection,
        url: hasDb ? "configured" : "missing",
      },
      env: {
        BETTER_AUTH_URL: process.env.BETTER_AUTH_URL || "not set",
        NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || "not set",
        BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET ? "set" : "not set",
        AUTH_SECRET: process.env.AUTH_SECRET ? "set" : "not set",
        DATABASE_URL: process.env.DATABASE_URL ? "set" : "not set",
        POSTGRES_URL: process.env.POSTGRES_URL ? "set" : "not set",
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        error: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 },
    );
  }
}
