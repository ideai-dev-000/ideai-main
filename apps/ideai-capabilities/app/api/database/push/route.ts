/**
 * @fileoverview Database Push API
 *
 * @module DatabasePushAPI
 * @description
 * Push database schema changes using drizzle-kit push.
 * Part of DB Manager integration.
 */

import { NextRequest, NextResponse } from "next/server";
import { spawn } from "child_process";
import { auth } from "@/lib/auth";
import { join } from "node:path";

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 },
      );
    }

    const body = await request.json().catch(() => ({}));
    const { app = "ideai-capabilities", env = "local" } = body;

    if (env === "production") {
      return NextResponse.json(
        {
          success: false,
          error: "db:push not allowed in production. Use migrations instead.",
        },
        { status: 400 },
      );
    }

    const appPath = join(process.cwd(), "..", "..", "apps", app);
    const startTime = new Date();

    const output = await new Promise<string>((resolve, reject) => {
      const child = spawn("pnpm", ["db:push"], {
        cwd: appPath,
        stdio: ["pipe", "pipe", "pipe"],
        env: { ...process.env, NODE_ENV: "development" },
        shell: true,
      });

      let stdout = "";
      let stderr = "";
      let promptAnswered = false;
      let buffer = "";

      const handleData = (data: Buffer) => {
        const text = data.toString();
        stdout += text;
        buffer += text;

        if (
          !promptAnswered &&
          (buffer.toLowerCase().includes("truncate") || buffer.includes("❯"))
        ) {
          promptAnswered = true;
          setTimeout(() => {
            if (child.stdin && !child.stdin.destroyed) {
              child.stdin.write("n\n");
              child.stdin.end();
            }
          }, 300);
        }
      };

      child.stdout.on("data", handleData);
      child.stderr.on("data", (data: Buffer) => {
        stderr += data.toString();
      });

      child.on("close", (code) => {
        if (code === 0) {
          resolve(stdout + stderr);
        } else {
          reject(new Error(`Exit code ${code}: ${stdout + stderr}`));
        }
      });

      child.on("error", reject);

      const timeout = setTimeout(() => {
        if (!child.killed) {
          child.kill("SIGTERM");
          reject(new Error("Timeout after 90 seconds"));
        }
      }, 90000);

      child.on("close", () => clearTimeout(timeout));

      if (child.stdin) {
        child.stdin.setDefaultEncoding("utf8");
      }
    });

    const duration = Math.round(
      (new Date().getTime() - startTime.getTime()) / 1000,
    );

    return NextResponse.json({
      success: true,
      message: "Schema pushed successfully",
      output: output.substring(0, 5000),
      duration,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Failed to push schema",
        details: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    );
  }
}
