/**
 * @fileoverview API route to serve apps index data
 * 
 * @module AppsIndexAPI
 * @description
 * Reads all .ideai metadata files and returns JSON with app information and status.
 */

import { NextResponse } from "next/server";
import { readIdeaiMetadata, type AppMetadata } from "../../../../../scripts/read-ideai-metadata";
import { resolve } from "path";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(): Promise<NextResponse<AppMetadata[] | { error: string; details?: string }>> {
  try {
    // Get repo root - resolve from current working directory
    // In Next.js, process.cwd() is the app directory, so go up to repo root
    const repoRoot = resolve(process.cwd(), "../..");
    const apps = await readIdeaiMetadata(repoRoot, true);
    return NextResponse.json(apps);
  } catch (error) {
    console.error("Error reading apps index:", error);
    return NextResponse.json(
      { error: "Failed to load apps index", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

