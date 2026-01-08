/**
 * @fileoverview Database Connection API Route
 *
 * @module DatabaseConnectAPI
 * @description
 * Server-side API route to get DATABASE_URL from Vercel.
 * DEV-ONLY: Only works in development mode for security.
 */

import { NextResponse } from "next/server";
import { execSync } from "child_process";
import { existsSync } from "fs";
import { readFileSync, unlinkSync } from "fs";
import { join } from "path";

export async function GET(request: Request) {
  // SECURITY: Only allow in development
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json(
      { error: { message: "Database API is only available in development" } },
      { status: 403 },
    );
  }

  const { searchParams } = new URL(request.url);
  const env = searchParams.get("env") || "production";
  const app = searchParams.get("app") || "ideai-capabilities";

  // Map app names to Vercel project names
  const projectMap: Record<string, string> = {
    "ideai-capabilities": "ideai-capabilities",
    "ideai-workflow": "ideai-workflow",
  };

  const projectName = projectMap[app] || app;

  try {
    // Check if Vercel CLI is available
    try {
      execSync("vercel --version", { stdio: "pipe" });
    } catch (e) {
      return NextResponse.json(
        {
          error: {
            message: "Vercel CLI not found. Install it: npm i -g vercel",
          },
        },
        { status: 500 },
      );
    }

    // Pull environment variables
    const envFile = join(process.cwd(), `.env.production.${Date.now()}`);
    try {
      execSync(`vercel env pull ${envFile} --environment ${env} --yes`, {
        stdio: "pipe",
        env: { ...process.env, VERCEL_PROJECT_NAME: projectName },
      });

      // Read DATABASE_URL
      if (existsSync(envFile)) {
        const content = readFileSync(envFile, "utf-8");
        const match = content.match(/^DATABASE_URL=(.+)$/m);

        // Clean up temp file
        try {
          unlinkSync(envFile);
        } catch (e) {
          // Ignore cleanup errors
        }

        if (match) {
          const url = match[1].replace(/^["']|["']$/g, "");
          return NextResponse.json({
            data: {
              url,
              displayUrl: url.replace(/:([^:@]+)@/, ":****@"),
              env,
              app,
              project: projectName,
            },
          });
        }
      }

      return NextResponse.json(
        {
          error: {
            message: "DATABASE_URL not found in Vercel environment variables",
          },
        },
        { status: 404 },
      );
    } catch (e) {
      // Clean up temp file if exists
      if (existsSync(envFile)) {
        try {
          unlinkSync(envFile);
        } catch (cleanupError) {
          // Ignore cleanup errors
        }
      }

      const errorMessage = e instanceof Error ? e.message : "Unknown error";
      if (errorMessage.includes("not logged in")) {
        return NextResponse.json(
          {
            error: {
              message: "Not logged into Vercel CLI. Run: vercel login",
            },
          },
          { status: 401 },
        );
      }

      return NextResponse.json(
        {
          error: {
            message: `Failed to fetch from Vercel: ${errorMessage}`,
          },
        },
        { status: 500 },
      );
    }
  } catch (error) {
    return NextResponse.json(
      {
        error: {
          message: error instanceof Error ? error.message : "Unknown error",
        },
      },
      { status: 500 },
    );
  }
}
