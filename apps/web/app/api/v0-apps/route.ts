/**
 * @fileoverview API route to serve v0 apps metadata
 *
 * @module V0AppsAPI
 * @description
 * Scans the __v0 folder and returns metadata for all v0-generated Next.js apps.
 * Each app is self-contained and provides metadata from package.json and app/layout.tsx.
 */

import { NextResponse } from "next/server";
import { resolve, join } from "path";
import { readdir, readFile, stat } from "fs/promises";

export interface V0AppMetadata {
  id: string;
  name: string;
  description: string;
  version?: string;
  path: string;
  folderPath: string;
  port?: number;
  enabled?: boolean;
  category?: string;
}

/**
 * Read package.json from a directory
 */
async function readPackageJson(folderPath: string): Promise<any | null> {
  try {
    const packageJsonPath = join(folderPath, "package.json");
    const stats = await stat(packageJsonPath);
    if (stats.isFile()) {
      const content = await readFile(packageJsonPath, "utf-8");
      return JSON.parse(content);
    }
  } catch {
    // File doesn't exist or can't be read
  }
  return null;
}

/**
 * Read .v0.json config from a directory
 */
async function readV0Config(folderPath: string): Promise<any | null> {
  try {
    const configPath = join(folderPath, ".v0.json");
    const stats = await stat(configPath);
    if (stats.isFile()) {
      const content = await readFile(configPath, "utf-8");
      return JSON.parse(content);
    }
  } catch {
    // File doesn't exist or can't be read
  }
  return null;
}

/**
 * Read Next.js metadata from app/layout.tsx
 */
async function readNextMetadata(folderPath: string): Promise<{
  title?: string;
  description?: string;
} | null> {
  try {
    const layoutPath = join(folderPath, "app", "layout.tsx");
    const stats = await stat(layoutPath);
    if (stats.isFile()) {
      const content = await readFile(layoutPath, "utf-8");

      // Extract metadata.title and metadata.description using regex
      const titleMatch = content.match(/title:\s*["']([^"']+)["']/);
      const descMatch = content.match(/description:\s*["']([^"']+)["']/);

      return {
        title: titleMatch ? titleMatch[1] : undefined,
        description: descMatch ? descMatch[1] : undefined,
      };
    }
  } catch {
    // File doesn't exist or can't be read
  }
  return null;
}

/**
 * Scan __v0 folder and read all v0 apps
 */
async function scanV0Apps(repoRoot: string): Promise<V0AppMetadata[]> {
  const v0Dir = join(repoRoot, "__v0");
  const apps: V0AppMetadata[] = [];

  try {
    const entries = await readdir(v0Dir, { withFileTypes: true });

    for (const entry of entries) {
      if (entry.isDirectory()) {
        const appPath = join(v0Dir, entry.name);

        // Read package.json
        const packageJson = await readPackageJson(appPath);
        if (!packageJson) continue; // Skip if no package.json

        // Read .v0.json config (optional)
        const v0Config = await readV0Config(appPath);

        // Read Next.js metadata (optional)
        const nextMetadata = await readNextMetadata(appPath);

        // Skip if disabled in config
        if (v0Config?.enabled === false) continue;

        // Determine name (priority: Next.js metadata > package.json name > folder name)
        const name = nextMetadata?.title || packageJson.name || entry.name;

        // Determine description (priority: Next.js metadata > package.json description > default)
        const description =
          nextMetadata?.description ||
          packageJson.description ||
          "V0-generated Next.js app";

        // Extract port from dev script or config
        let port: number | undefined = v0Config?.port;
        if (!port && packageJson.scripts?.dev) {
          const portMatch = packageJson.scripts.dev.match(/--port\s+(\d+)/);
          if (portMatch) {
            port = parseInt(portMatch[1], 10);
          }
        }

        apps.push({
          id: entry.name,
          name,
          description,
          version: packageJson.version,
          path: `/v0/${entry.name}`,
          folderPath: appPath.replace(repoRoot, ""),
          port,
          enabled: v0Config?.enabled !== false,
          category: v0Config?.category,
        });
      }
    }
  } catch (error) {
    // __v0 folder doesn't exist or can't be read
    console.error("Error scanning __v0 folder:", error);
  }

  return apps.sort((a, b) => a.name.localeCompare(b.name));
}

export async function GET(): Promise<
  NextResponse<V0AppMetadata[] | { error: string; details?: string }>
> {
  try {
    // Get repo root - resolve from current working directory
    const repoRoot = resolve(process.cwd(), "../..");
    const apps = await scanV0Apps(repoRoot);
    return NextResponse.json(apps);
  } catch (error) {
    console.error("Error reading v0 apps:", error);
    return NextResponse.json(
      {
        error: "Failed to load v0 apps",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
