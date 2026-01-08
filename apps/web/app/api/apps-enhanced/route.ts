/**
 * @fileoverview Enhanced Apps API with Vercel project and domain info
 *
 * @module AppsEnhancedAPI
 * @description
 * Merges app metadata from .ideai.json files with Vercel project and domain information.
 * Provides unified data for app cards on landing page and cloud manager.
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

export interface VercelProject {
  id: string;
  name: string;
  updatedAt?: number;
}

export interface VercelDomain {
  domain: string;
  verified: boolean;
}

export interface EnhancedAppMetadata extends AppMetadata {
  vercelProject?: VercelProject;
  vercelDomains?: VercelDomain[];
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
  includeStatus = false,
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

        const stats = await stat(ideaiJsonPath);
        if (stats.isFile()) {
          const content = await readFile(ideaiJsonPath, "utf-8");
          const config = JSON.parse(content) as {
            name?: string;
            description?: string;
            localPort?: number;
            metadata?: {
              id?: string;
              port?: number;
              css?: string[];
              capabilities?: string[];
              path?: string;
              category?: string;
            };
          };

          metadata = {
            id: (config.metadata?.id as string | undefined) || entry.name,
            name: (config.name as string | undefined) || entry.name,
            description: (config.description as string | undefined) || "",
            port: config.metadata?.port || config.localPort || 0,
            css: (config.metadata?.css as string[] | undefined) || [],
            capabilities:
              (config.metadata?.capabilities as string[] | undefined) || [],
            path:
              (config.metadata?.path as string | undefined) || `/${entry.name}`,
            category:
              (config.metadata?.category as string | undefined) ||
              "development",
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

  const seenIds = new Set<string>();
  const uniqueApps = apps.filter((app) => {
    if (seenIds.has(app.id)) {
      console.warn(`Duplicate app id detected: ${app.id}. Skipping duplicate.`);
      return false;
    }
    seenIds.add(app.id);
    return true;
  });

  // Sort apps: web first, ideai-capabilities second, then by port, metaframework last
  return uniqueApps.sort((a, b) => {
    if (a.id === "web") return -1;
    if (b.id === "web") return 1;
    if (a.id === "ideai-capabilities") return -1;
    if (b.id === "ideai-capabilities") return 1;
    if (a.id === "metaframework") return 1;
    if (b.id === "metaframework") return -1;
    return (a.port || 0) - (b.port || 0);
  });
}

/**
 * Fetch Vercel projects
 */
async function fetchVercelProjects(): Promise<VercelProject[]> {
  const token = process.env.VERCEL_TOKEN;
  if (!token) return [];

  try {
    const teamId =
      process.env.NEXT_PUBLIC_VERCEL_ORG_ID || "team_vhjzlMi6CfNow0IfBXnv2Yn2";
    const response = await fetch(
      `https://api.vercel.com/v9/projects?teamId=${teamId}&limit=100`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) return [];

    const data = await response.json();
    return data.projects || [];
  } catch {
    return [];
  }
}

/**
 * Fetch domains for a Vercel project
 */
async function fetchVercelDomains(projectId: string): Promise<VercelDomain[]> {
  const token = process.env.VERCEL_TOKEN;
  if (!token) return [];

  try {
    const teamId =
      process.env.NEXT_PUBLIC_VERCEL_ORG_ID || "team_vhjzlMi6CfNow0IfBXnv2Yn2";
    const response = await fetch(
      `https://api.vercel.com/v9/projects/${projectId}/domains?teamId=${teamId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) return [];

    const data = await response.json();
    return (data.domains || []).map(
      (d: { name: string; verified?: boolean }) => ({
        domain: d.name,
        verified: d.verified ?? false,
      }),
    );
  } catch {
    return [];
  }
}

/**
 * Enhanced apps endpoint - merges metadata with Vercel info
 */
export async function GET(): Promise<
  NextResponse<EnhancedAppMetadata[] | { error: string; details?: string }>
> {
  try {
    const repoRoot = resolve(process.cwd(), "../..");
    const apps = await readIdeaiMetadata(repoRoot, true);

    // Fetch Vercel projects if token is available
    const vercelProjects = await fetchVercelProjects();
    const projectMap = new Map<string, VercelProject>();
    vercelProjects.forEach((project) => {
      projectMap.set(project.name, project);
    });

    // Enhance apps with Vercel data
    const enhancedApps: EnhancedAppMetadata[] = await Promise.all(
      apps.map(async (app) => {
        const vercelProject =
          projectMap.get(app.id) || projectMap.get(app.name);
        let vercelDomains: VercelDomain[] = [];

        if (vercelProject) {
          vercelDomains = await fetchVercelDomains(vercelProject.id);
        }

        return {
          ...app,
          vercelProject,
          vercelDomains,
        };
      }),
    );

    return NextResponse.json(enhancedApps);
  } catch (error) {
    console.error("Error loading enhanced apps:", error);
    return NextResponse.json(
      {
        error: "Failed to load apps",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
