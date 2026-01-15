import { NextResponse } from "next/server";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

/**
 * GET /api/workflows/demo
 * Get demo workflow data from .ideai.json
 */
export async function GET() {
  try {
    const ideaiJsonPath = join(process.cwd(), "..", "..", ".ideai.json");
    const content = await readFile(ideaiJsonPath, "utf-8");
    const config = JSON.parse(content) as {
      demoWorkflow?: {
        nodes?: unknown[];
        edges?: unknown[];
      };
    };

    if (!config.demoWorkflow) {
      return NextResponse.json(
        { error: "No demo workflow found" },
        { status: 404 },
      );
    }

    return NextResponse.json(config.demoWorkflow);
  } catch (error) {
    console.error("[Demo Workflow] Error:", error);
    return NextResponse.json(
      {
        error: "Failed to read demo workflow",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
