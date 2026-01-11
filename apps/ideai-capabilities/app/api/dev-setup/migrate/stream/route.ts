/**
 * @fileoverview Dev Setup Migration Stream API
 *
 * @module DevSetupMigrationStreamAPI
 * @description
 * Streams migration logs in real-time using Server-Sent Events (SSE).
 * Provides immediate feedback during migration execution.
 */

import { NextRequest } from "next/server";
import { spawn } from "child_process";
import { auth } from "@/lib/auth";
import { join } from "node:path";

/**
 * POST /api/dev-setup/migrate/stream
 * Stream migration logs in real-time
 */
export async function POST(request: NextRequest) {
  const encoder = new TextEncoder();

  // Create a ReadableStream for SSE
  const stream = new ReadableStream({
    async start(controller) {
      const sendLog = (
        message: string,
        type: "log" | "error" | "success" | "step" = "log",
      ) => {
        const data = JSON.stringify({
          type,
          message,
          timestamp: new Date().toISOString(),
        });
        controller.enqueue(encoder.encode(`data: ${data}\n\n`));
      };

      try {
        const session = await auth.api.getSession({
          headers: request.headers,
        });

        if (!session?.user?.id) {
          sendLog("❌ Authentication failed", "error");
          controller.close();
          return;
        }

        sendLog("✅ Authenticated", "success");
        sendLog("🔄 Starting database migration...", "step");

        const startTime = new Date();
        sendLog(`🕐 Migration started at: ${startTime.toISOString()}`, "log");

        sendLog("📍 Step 1/5: Preparing migration...", "step");
        const capabilitiesPath = join(
          process.cwd(),
          "..",
          "..",
          "apps",
          "ideai-capabilities",
        );

        sendLog(`📁 Working directory: ${capabilitiesPath}`, "log");

        sendLog("📍 Step 2/5: Checking database connection...", "step");
        // Skip database connection check to avoid module loading issues
        // Migration will verify connection itself via drizzle-kit
        sendLog("⏭️  Skipping pre-check (will verify during migration)", "log");

        sendLog("📍 Step 3/5: Executing drizzle-kit push...", "step");
        sendLog(`📋 Command: pnpm db:push`, "log");
        sendLog(`📁 Working directory: ${capabilitiesPath}`, "log");
        sendLog(
          `🔧 Environment: ${process.env.NODE_ENV || "development"}`,
          "log",
        );
        sendLog(
          `🗄️  Database URL: ${process.env.DATABASE_URL ? process.env.DATABASE_URL.substring(0, 30) + "..." : "Not set"}`,
          "log",
        );
        sendLog(
          "⏳ Starting drizzle-kit push (this may take 30-90 seconds)...",
          "log",
        );
        sendLog("📋 Waiting for drizzle-kit output...", "log");

        return new Promise<void>((resolve, reject) => {
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
          let lastOutputTime = Date.now();
          let lineCount = 0;

          // Send heartbeat every 3 seconds to show we're alive
          const heartbeat = setInterval(() => {
            const timeSinceLastOutput = Date.now() - lastOutputTime;
            if (timeSinceLastOutput > 3000) {
              sendLog(
                `⏳ Still running... (${Math.round(timeSinceLastOutput / 1000)}s since last output, ${lineCount} lines processed)`,
                "log",
              );
            }
          }, 3000);

          const handleData = (data: Buffer, source: "stdout" | "stderr") => {
            lastOutputTime = Date.now();
            const text = data.toString();

            if (source === "stdout") {
              stdout += text;
            } else {
              stderr += text;
            }

            // Send every line immediately with verbose logging
            const lines = text.split("\n").filter(Boolean);
            for (const line of lines) {
              const trimmed = line.trim();
              if (trimmed) {
                lineCount++;

                // Parse drizzle-kit output with detailed categorization
                if (
                  trimmed.includes("Pulling schema") ||
                  trimmed.includes("Pulling schema from database")
                ) {
                  sendLog(`📥 ${trimmed}`, "step");
                } else if (trimmed.includes("Reading config")) {
                  sendLog(`📄 ${trimmed}`, "log");
                } else if (
                  trimmed.includes("Using") &&
                  trimmed.includes("driver")
                ) {
                  sendLog(`🔧 ${trimmed}`, "log");
                } else if (
                  trimmed.includes("CREATE TABLE") ||
                  trimmed.includes("CREATE TABLE")
                ) {
                  const tableMatch = trimmed.match(/CREATE TABLE\s+"?(\w+)"?/i);
                  if (tableMatch) {
                    sendLog(`🔨 Creating table: ${tableMatch[1]}`, "log");
                  }
                  sendLog(`   ${trimmed}`, "log");
                } else if (trimmed.includes("ALTER TABLE")) {
                  const tableMatch = trimmed.match(/ALTER TABLE\s+"?(\w+)"?/i);
                  if (tableMatch) {
                    sendLog(`🔧 Altering table: ${tableMatch[1]}`, "log");
                  }
                  sendLog(`   ${trimmed}`, "log");
                } else if (
                  trimmed.includes("ADD CONSTRAINT") ||
                  trimmed.includes("CONSTRAINT")
                ) {
                  sendLog(`🔗 ${trimmed}`, "log");
                } else if (
                  trimmed.includes("✓") ||
                  trimmed.includes("success") ||
                  trimmed.includes("completed")
                ) {
                  sendLog(`✅ ${trimmed}`, "success");
                } else if (
                  trimmed.includes("error") ||
                  trimmed.includes("Error") ||
                  trimmed.includes("failed")
                ) {
                  sendLog(`❌ ${trimmed}`, "error");
                } else if (
                  trimmed.includes("truncate") ||
                  trimmed.includes("❯") ||
                  (trimmed.includes("Yes") && trimmed.includes("No"))
                ) {
                  sendLog(`❓ Prompt: ${trimmed}`, "log");
                } else if (trimmed.includes("[") && trimmed.includes("]")) {
                  // Drizzle-kit spinner output
                  sendLog(
                    `⏳ ${trimmed.replace(/\[.*?\]/g, "").trim() || "Processing..."}`,
                    "log",
                  );
                } else if (trimmed.length > 0) {
                  sendLog(`📋 ${trimmed}`, "log");
                }
              }
            }

            // Check for prompts
            const combined = (stdout + stderr).toLowerCase();
            if (
              !promptAnswered &&
              (combined.includes("truncate") ||
                combined.includes("do you want") ||
                combined.includes("❯") ||
                (combined.includes("yes") && combined.includes("no")))
            ) {
              promptAnswered = true;
              sendLog(
                "📋 Interactive prompt detected - auto-answering 'No' (safe option)",
                "step",
              );

              setTimeout(() => {
                try {
                  if (child.stdin && !child.stdin.destroyed) {
                    child.stdin.write("n\n");
                    child.stdin.end();
                    sendLog("✅ Prompt answered", "success");
                  }
                } catch (err) {
                  sendLog(`⚠️ Could not write to stdin: ${err}`, "error");
                }
              }, 300);
            }
          };

          child.stdout.on("data", (data: Buffer) => handleData(data, "stdout"));
          child.stderr.on("data", (data: Buffer) => handleData(data, "stderr"));

          child.on("close", (code, signal) => {
            clearInterval(heartbeat);

            if (signal === "SIGTERM" || signal === "SIGKILL") {
              sendLog("❌ Migration timed out or was killed", "error");
              controller.close();
              reject(new Error("Migration timed out"));
              return;
            }

            sendLog("📍 Step 4/5: Analyzing migration output...", "step");

            const fullOutput = stdout + stderr;
            const outputLines = fullOutput.split("\n").filter(Boolean);

            // Extract tables
            const tables: string[] = [];
            for (const line of outputLines) {
              const createMatch = line.match(/CREATE TABLE\s+"?(\w+)"?/i);
              if (createMatch) tables.push(createMatch[1]);
              const alterMatch = line.match(/ALTER TABLE\s+"?(\w+)"?/i);
              if (alterMatch) tables.push(alterMatch[1]);
            }

            if (tables.length > 0) {
              sendLog(`📊 Tables processed: ${tables.join(", ")}`, "success");
            }

            sendLog("📍 Step 5/5: Verifying migration completion...", "step");

            if (code === 0) {
              const completionTime = new Date();
              const duration = Math.round(
                (completionTime.getTime() - startTime.getTime()) / 1000,
              );

              sendLog(
                `✅ Migration completed successfully in ${duration} seconds`,
                "success",
              );
              sendLog(
                `🕐 Completed at: ${completionTime.toISOString()}`,
                "log",
              );

              // Skip table verification to avoid module loading issues
              // Migration output already confirmed success (code === 0)
              sendLog(
                `✅ Migration completed successfully! Processed ${tables.length} table(s)`,
                "success",
              );
              sendLog(
                "📋 Table verification skipped (rely on drizzle-kit success code)",
                "log",
              );
              controller.close();
              resolve();
            } else {
              sendLog(`❌ Migration exited with code ${code}`, "error");
              sendLog(
                `📋 Error output: ${fullOutput.substring(0, 1000)}`,
                "error",
              );
              controller.close();
              reject(new Error(`Exit code ${code}`));
            }
          });

          child.on("error", (error) => {
            clearInterval(heartbeat);
            sendLog(`❌ Process error: ${error.message}`, "error");
            controller.close();
            reject(error);
          });

          // Extended timeout with progress updates
          const timeout = setTimeout(() => {
            if (!child.killed) {
              sendLog(
                "⏱️ Migration taking longer than 60s... allowing more time...",
                "log",
              );
              setTimeout(() => {
                if (!child.killed) {
                  sendLog("❌ Migration timed out after 90 seconds", "error");
                  child.kill("SIGTERM");
                  controller.close();
                  reject(new Error("Migration timed out"));
                }
              }, 30000);
            }
          }, 60000);

          child.on("close", () => clearTimeout(timeout));

          if (child.stdin) {
            child.stdin.setDefaultEncoding("utf8");
          }
        });
      } catch (error) {
        sendLog(
          `❌ Unexpected error: ${error instanceof Error ? error.message : "Unknown"}`,
          "error",
        );
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
