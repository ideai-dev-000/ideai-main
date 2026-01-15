/**
 * @fileoverview Dev Setup Migration API
 *
 * @module DevSetupMigrationAPI
 * @description
 * API endpoint to run database migrations via the setup checker.
 * Tracks migration status, tables, timestamps, and syncs with DB Manager.
 */

import { NextRequest, NextResponse } from "next/server";
import { spawn } from "child_process";
import { auth } from "@/lib/auth";
import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

interface MigrationStatus {
  started: boolean;
  startedAt: string | null;
  completed: boolean;
  completedAt: string | null;
  tables: string[];
  error: string | null;
  lastStep: string | null;
}

/**
 * Update .ideai-dev.json with migration status
 */
async function updateIdeaiDevJson(
  status: Partial<MigrationStatus>,
  success?: boolean,
) {
  try {
    const ideaiDevJsonPath = join(process.cwd(), "..", "..", ".ideai-dev.json");
    let ideaiDevJson: any = {};

    try {
      const content = await readFile(ideaiDevJsonPath, "utf-8");
      ideaiDevJson = JSON.parse(content);
    } catch {
      ideaiDevJson = {
        setup: {
          database: { migration_complete: false, connected: false },
          auth: { configured: false },
          service_keys: { configured: false },
          environment: { variables_set: false },
          dev_ready: false,
        },
      };
    }

    // Initialize migration status if needed
    if (!ideaiDevJson.setup.database.migration) {
      ideaiDevJson.setup.database.migration = {
        started: false,
        startedAt: null,
        completed: false,
        completedAt: null,
        tables: [],
        error: null,
        lastStep: null,
      };
    }

    // Update migration status
    ideaiDevJson.setup.database.migration = {
      ...ideaiDevJson.setup.database.migration,
      ...status,
    };

    if (success !== undefined) {
      ideaiDevJson.setup.database.migration_complete = success;
      ideaiDevJson.setup.database.last_checked = new Date().toISOString();

      if (!success && status.error) {
        ideaiDevJson.setup.database.last_error = status.error;
      } else {
        delete ideaiDevJson.setup.database.last_error;
      }
    }

    // Update dev_ready status
    const allReady =
      ideaiDevJson.setup.database?.migration_complete === true &&
      ideaiDevJson.setup.auth?.configured === true &&
      (ideaiDevJson.setup.service_keys?.configured === true ||
        ideaiDevJson.setup.environment?.api_keys_available === true);
    ideaiDevJson.setup.dev_ready = allReady;
    ideaiDevJson.setup.last_full_check = new Date().toISOString();

    await writeFile(ideaiDevJsonPath, JSON.stringify(ideaiDevJson, null, 2));
  } catch (err) {
    console.error("[Update IdeaI Dev JSON] Error:", err);
  }
}

/**
 * Extract table names from migration output
 */
function extractTables(output: string): string[] {
  const tables: string[] = [];
  const lines = output.split("\n");

  for (const line of lines) {
    // Match CREATE TABLE "table_name"
    const createMatch = line.match(/CREATE TABLE\s+"?(\w+)"?/i);
    if (createMatch && createMatch[1] && !tables.includes(createMatch[1])) {
      tables.push(createMatch[1]);
    }

    // Match ALTER TABLE "table_name"
    const alterMatch = line.match(/ALTER TABLE\s+"?(\w+)"?/i);
    if (alterMatch && alterMatch[1] && !tables.includes(alterMatch[1])) {
      tables.push(alterMatch[1]);
    }
  }

  return tables;
}

/**
 * POST /api/dev-setup/migrate
 * Run database migration with full tracking
 */
export async function POST(request: NextRequest) {
  const logs: string[] = [];
  const startTime = new Date();

  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user?.id) {
      logs.push("❌ Authentication failed");
      return NextResponse.json(
        { success: false, error: "Authentication required", logs },
        { status: 401 },
      );
    }

    logs.push("✅ Authenticated");
    logs.push(`🕐 Migration started at: ${startTime.toISOString()}`);

    // Mark migration as started
    await updateIdeaiDevJson({
      started: true,
      startedAt: startTime.toISOString(),
      completed: false,
      completedAt: null,
      tables: [],
      error: null,
      lastStep: "1/5 - Starting",
    });

    logs.push("📍 Step 1/5: Preparing migration...");
    const capabilitiesPath = join(
      process.cwd(),
      "..",
      "..",
      "apps",
      "ideai-capabilities",
    );

    logs.push("📍 Step 2/5: Checking database connection...");
    await updateIdeaiDevJson({ lastStep: "2/5 - Checking connection" });

    try {
      const { db } = await import("@/lib/db/index");
      await db.query.users.findFirst();
      logs.push("✅ Database connection verified");
    } catch (dbError) {
      logs.push(
        "⚠️ Database connection check skipped (will attempt migration anyway)",
      );
    }

    logs.push(
      "📍 Step 3/5: Executing drizzle-kit push (non-interactive mode)...",
    );
    await updateIdeaiDevJson({ lastStep: "3/5 - Executing migration" });

    const output = await new Promise<string>((resolve, reject) => {
      const child = spawn("pnpm", ["db:push"], {
        cwd: capabilitiesPath,
        stdio: ["pipe", "pipe", "pipe"],
        env: {
          ...process.env,
          NODE_ENV: "development",
        },
        shell: true,
      });

      let stdout = "";
      let stderr = "";
      let promptAnswered = false;
      let buffer = "";

      const handleData = (data: Buffer, source: string) => {
        const text = data.toString();
        if (source === "stdout") {
          stdout += text;
        } else {
          stderr += text;
        }

        buffer += text;

        const lowerBuffer = buffer.toLowerCase();
        if (
          !promptAnswered &&
          (lowerBuffer.includes("truncate") ||
            lowerBuffer.includes("do you want") ||
            lowerBuffer.includes("❯") ||
            (lowerBuffer.includes("yes") &&
              lowerBuffer.includes("no") &&
              lowerBuffer.includes("table")))
        ) {
          promptAnswered = true;
          logs.push(
            "📋 Interactive prompt detected - auto-answering 'No' (safe option)",
          );

          setTimeout(() => {
            try {
              if (child.stdin && !child.stdin.destroyed) {
                child.stdin.write("n\n");
                child.stdin.end();
              }
            } catch (err) {
              logs.push(`⚠️ Could not write to stdin: ${err}`);
            }
          }, 300);
        }
      };

      child.stdout.on("data", (data: Buffer) => handleData(data, "stdout"));
      child.stderr.on("data", (data: Buffer) => handleData(data, "stderr"));

      child.on("close", (code, signal) => {
        clearTimeout(timeout);
        const fullOutput = stdout + stderr;

        if (signal === "SIGTERM" || signal === "SIGKILL") {
          reject(new Error("Migration timed out or was killed"));
          return;
        }

        if (code === 0) {
          resolve(fullOutput);
        } else {
          const errorMsg =
            fullOutput.length > 0
              ? fullOutput.substring(0, 1000)
              : `Process exited with code ${code}`;
          reject(new Error(`Exit code ${code}: ${errorMsg}`));
        }
      });

      child.on("error", (error) => {
        clearTimeout(timeout);
        reject(error);
      });

      const timeout = setTimeout(() => {
        if (!child.killed) {
          logs.push("⏱️ Migration taking longer than expected...");
          setTimeout(() => {
            if (!child.killed) {
              child.kill("SIGTERM");
              reject(new Error("Migration timed out after 90 seconds"));
            }
          }, 30000);
        }
      }, 60000);

      if (child.stdin) {
        child.stdin.setDefaultEncoding("utf8");
      }
    });

    logs.push("📍 Step 4/5: Analyzing migration output...");
    await updateIdeaiDevJson({ lastStep: "4/5 - Analyzing output" });

    const tables = extractTables(output);
    logs.push(
      `📊 Tables processed: ${tables.length > 0 ? tables.join(", ") : "none detected"}`,
    );

    const outputLines = output.split("\n").filter(Boolean);
    let hasError = false;
    let statusMessage = "";

    for (const line of outputLines) {
      const lowerLine = line.toLowerCase();
      if (lowerLine.includes("created") || lowerLine.includes("table")) {
        logs.push(`📋 ${line.trim()}`);
      } else if (lowerLine.includes("error") || lowerLine.includes("failed")) {
        if (!lowerLine.includes("no error")) {
          hasError = true;
          logs.push(`⚠️ ${line.trim()}`);
        }
      } else if (
        lowerLine.includes("pushing") ||
        lowerLine.includes("pulled")
      ) {
        logs.push(`📋 ${line.trim()}`);
      } else if (
        lowerLine.includes("no change") ||
        lowerLine.includes("already")
      ) {
        statusMessage = "No changes needed - schema is up to date";
        logs.push(`✅ ${line.trim()}`);
      }
    }

    if (
      output.toLowerCase().includes("econnrefused") ||
      output.toLowerCase().includes("connection refused")
    ) {
      const error = "Database connection refused";
      logs.push("❌ Database connection refused");
      logs.push("💡 Ensure database is running and DATABASE_URL is correct");
      await updateIdeaiDevJson(
        {
          error,
          lastStep: "3/5 - Connection failed",
        },
        false,
      );
      return NextResponse.json(
        {
          success: false,
          error: "Cannot connect to database",
          logs,
          step: "3/5 - Database connection failed",
        },
        { status: 500 },
      );
    }

    logs.push("📍 Step 5/5: Verifying migration completion...");
    await updateIdeaiDevJson({ lastStep: "5/5 - Verifying" });

    const completionTime = new Date();

    try {
      const { db } = await import("@/lib/db/index");
      await db.query.userServiceKeys.findFirst();
      logs.push("✅ user_service_keys table verified - migration successful");

      await updateIdeaiDevJson(
        {
          completed: true,
          completedAt: completionTime.toISOString(),
          tables,
          lastStep: "5/5 - Complete",
          error: null,
        },
        true,
      );

      const duration = Math.round(
        (completionTime.getTime() - startTime.getTime()) / 1000,
      );
      const finalMessage =
        statusMessage || `Migration completed successfully in ${duration}s`;
      logs.push(`✅ ${finalMessage}`);

      return NextResponse.json({
        success: true,
        message: finalMessage,
        logs,
        step: "5/5 - Complete",
        tables,
        duration,
        startedAt: startTime.toISOString(),
        completedAt: completionTime.toISOString(),
      });
    } catch (verifyError) {
      if (hasError || !statusMessage) {
        const error = "Table verification failed";
        logs.push(
          "❌ Table verification failed - migration may not have completed",
        );
        logs.push(
          `💡 Error: ${verifyError instanceof Error ? verifyError.message : "Unknown"}`,
        );
        await updateIdeaiDevJson(
          {
            completed: false,
            completedAt: null,
            error,
            lastStep: "5/5 - Verification failed",
          },
          false,
        );
        return NextResponse.json(
          {
            success: false,
            error: "Migration completed but table verification failed",
            logs,
            step: "5/5 - Verification failed",
            output: output.substring(0, 2000),
          },
          { status: 500 },
        );
      }
    }

    if (hasError && tables.length === 0 && !statusMessage) {
      const error = "Migration output contains errors";
      await updateIdeaiDevJson(
        {
          completed: false,
          error,
          lastStep: "4/5 - Output analysis failed",
        },
        false,
      );
      return NextResponse.json(
        {
          success: false,
          error: "Migration may have failed - check output",
          logs,
          step: "4/5 - Output analysis failed",
          output: output.substring(0, 2000),
        },
        { status: 500 },
      );
    }

    await updateIdeaiDevJson(
      {
        completed: true,
        completedAt: completionTime.toISOString(),
        tables,
        lastStep: "5/5 - Complete",
      },
      true,
    );

    const duration = Math.round(
      (completionTime.getTime() - startTime.getTime()) / 1000,
    );
    logs.push(`✅ Migration completed in ${duration}s`);

    return NextResponse.json({
      success: true,
      message: "Migration completed successfully",
      logs,
      step: "5/5 - Complete",
      tables,
      duration,
      startedAt: startTime.toISOString(),
      completedAt: completionTime.toISOString(),
    });
  } catch (error) {
    const errorTime = new Date();
    const errorMsg = error instanceof Error ? error.message : "Unknown error";

    logs.push(`❌ Migration failed: ${errorMsg}`);

    await updateIdeaiDevJson(
      {
        completed: false,
        completedAt: null,
        error: errorMsg,
        lastStep: "Failed",
      },
      false,
    );

    return NextResponse.json(
      {
        success: false,
        error: "Migration failed",
        details: errorMsg,
        logs,
        startedAt: startTime.toISOString(),
        failedAt: errorTime.toISOString(),
      },
      { status: 500 },
    );
  }
}
