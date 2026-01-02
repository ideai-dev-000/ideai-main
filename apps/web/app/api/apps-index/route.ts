/**
 * @fileoverview API route to serve apps index data
 * 
 * @module AppsIndexAPI
 * @description
 * Reads all .ideai metadata files and returns JSON with app information and status.
 */

import { NextResponse } from "next/server";
import { resolve, join } from "path";
import { readdir, readFile, stat } from "fs/promises";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export interface AppStatus {
  running: boolean;
  port: number;
  url: string | null;
}

export interface AppMetadata {
  id: string;
  name: string;
  description: string;
  port: number;
  css: string[];
  capabilities: string[];
  path: string;
  category: string;
  status?: AppStatus;
  appPath?: string;
}

/**
 * Check if a port is in use
 */
async function isPortInUse(port: number): Promise<boolean> {
  if (!port) return false;
  try {
    const { stdout } = await execAsync(`lsof -ti:${port} 2>/dev/null || true`);
    return stdout.trim().length > 0;
  } catch {
    return false;
  }
}

/**
 * Read all .ideai metadata files
 */
async function readIdeaiMetadata(
  repoRoot: string,
  includeStatus = false
): Promise<AppMetadata[]> {
  const appsDir = join(repoRoot, "apps");
  const entries = await readdir(appsDir, { withFileTypes: true });
  const apps: AppMetadata[] = [];
  
  for (const entry of entries) {
    if (entry.isDirectory()) {
      const appPath = join(appsDir, entry.name);
      const ideaiJsonPath = join(appPath, ".ideai.json");
      
      try {
        let metadata: AppMetadata | null = null;
        
        // Read .ideai.json (only format supported)
        const stats = await stat(ideaiJsonPath);
        if (stats.isFile()) {
          const content = await readFile(ideaiJsonPath, "utf-8");
          const config = JSON.parse(content) as Record<string, unknown>;
          
          // Extract metadata from config
          metadata = {
            id: config.metadata?.id || entry.name,
            name: config.name || entry.name,
            description: config.description || "",
            port: config.metadata?.port || config.localPort || 0,
            css: config.metadata?.css || [],
            capabilities: config.metadata?.capabilities || [],
            path: config.metadata?.path || `/${entry.name}`,
            category: config.metadata?.category || "development",
          };
        }
        
        if (metadata) {
          let status: AppStatus | undefined = undefined;
          if (includeStatus && metadata.port) {
            const running = await isPortInUse(metadata.port);
            status = {
              running,
              port: metadata.port,
              url: running ? `http://localhost:${metadata.port}` : null,
            };
          }
          
          apps.push({
            ...metadata,
            status,
            appPath: appPath.replace(repoRoot, ""),
          });
        }
      } catch {
        // Skip if files don't exist or can't be read
      }
    }
  }
  
  return apps.sort((a, b) => (a.port || 0) - (b.port || 0));
}

// Note: dynamic and revalidate removed - incompatible with cacheComponents in Next.js 16
// This route will use default caching behavior

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
