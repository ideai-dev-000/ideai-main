/**
 * @fileoverview API route to serve apps index data
 * 
 * @module AppsIndexAPI
 * @description
 * Reads all .ideai metadata files and routes registry, returns JSON with
 * app information and status. Includes both standalone apps and routes within apps.
 * 
 * CRITICAL: All new sites/routes MUST be registered in routes-registry.json
 * to appear in the index. This prevents sites from being created without
 * proper registration.
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

export type AppType = 'parent' | 'child' | 'standalone' | 'page';

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
  /** App type: parent, child, standalone, or page */
  appType: AppType;
  /** Parent app ID (for child apps and pages) */
  parentApp?: string;
  /** Child app IDs (for parent apps) */
  childApps?: string[];
  /** Related apps (for pages - shows which parent they belong to) */
  relatedTo?: string;
}

/**
 * Check if a port is in use
 * Works on both Unix (lsof) and Windows (netstat)
 */
async function isPortInUse(port: number): Promise<boolean> {
  if (!port) return false;
  try {
    const isWindows = process.platform === 'win32';
    const command = isWindows
      ? `netstat -ano | findstr ":${port}" | findstr "LISTENING"`
      : `lsof -ti:${port} 2>/dev/null || true`;
    
    // Use Promise.race to timeout after 1 second
    const checkPromise = execAsync(command, { timeout: 1000 });
    const timeoutPromise = new Promise<{ stdout: string }>((resolve) => {
      setTimeout(() => resolve({ stdout: '' }), 1000);
    });
    
    const { stdout } = await Promise.race([checkPromise, timeoutPromise]);
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
          const config = JSON.parse(content) as any;
          
          // Determine app type
          const role = config.role || (entry.name === 'web' ? 'parent' : 'child');
          const appType: AppType = role === 'parent' ? 'parent' : role === 'child' ? 'child' : 'standalone';
          
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
            appType,
            parentApp: config.parentApp || (role === 'child' ? 'web' : undefined),
            childApps: config.childApps || (role === 'parent' ? [] : undefined),
          };
        }
        
        if (metadata) {
          apps.push({
            ...metadata,
            appPath: appPath.replace(repoRoot, ""),
          });
        }
      } catch {
        // Skip if files don't exist or can't be read
      }
    }
  }
  
  // Check port status in parallel for all apps (with timeout protection)
  if (includeStatus) {
    const statusPromises = apps
      .filter(app => app.port)
      .map(async (app) => {
        try {
          // Use Promise.race to ensure we don't wait more than 1.5s per port
          const checkPromise = isPortInUse(app.port);
          const timeoutPromise = new Promise<boolean>((resolve) => {
            setTimeout(() => resolve(false), 1500);
          });
          
          const running = await Promise.race([checkPromise, timeoutPromise]);
          app.status = {
            running,
            port: app.port,
            url: running ? `http://localhost:${app.port}` : null,
          };
        } catch {
          app.status = {
            running: false,
            port: app.port,
            url: null,
          };
        }
      });
    
    // Wait for all checks with overall timeout
    await Promise.race([
      Promise.all(statusPromises),
      new Promise((resolve) => setTimeout(resolve, 5000)), // Max 5s total
    ]);
  }
  
  return apps.sort((a, b) => (a.port || 0) - (b.port || 0));
}

export const dynamic = "force-dynamic";
export const revalidate = 0;

/**
 * Read routes registry from web app
 */
async function readRoutesRegistry(repoRoot: string): Promise<AppMetadata[]> {
  const routesRegistryPath = join(repoRoot, "apps", "web", "app", "routes-registry.json");
  
  try {
    const content = await readFile(routesRegistryPath, "utf-8");
    const registry = JSON.parse(content) as { routes: Array<{
      id: string;
      name: string;
      description: string;
      path: string;
      category: string;
      css: string[];
      capabilities: string[];
    }> };
    
    // Convert routes to AppMetadata format
    // Routes are part of the web app (port 3000), so they share the same port
    // These are "page" type - routes within the parent web app
    return registry.routes.map((route) => ({
      id: route.id,
      name: route.name,
      description: route.description,
      port: 3000, // Web app port
      css: route.css,
      capabilities: route.capabilities,
      path: route.path,
      category: route.category,
      appPath: `/app${route.path}`,
      appType: 'page' as AppType,
      parentApp: 'web', // All routes belong to web app
      relatedTo: 'web', // Related to web parent
    }));
  } catch (error) {
    console.warn("Could not read routes registry:", error);
    return [];
  }
}

export async function GET(request: Request): Promise<NextResponse<AppMetadata[] | { error: string; details?: string }>> {
  try {
    // Get repo root - resolve from current working directory
    // In Next.js, process.cwd() is the app directory, so go up to repo root
    const repoRoot = resolve(process.cwd(), "../..");
    
    // Check if status checking is requested (default: false for speed)
    const url = new URL(request.url);
    const checkStatus = url.searchParams.get('status') === 'true';
    
    // Read standalone apps from .ideai.json files
    const apps = await readIdeaiMetadata(repoRoot, checkStatus);
    
    // Read routes registry (routes within apps, like /react-flow, /semantic-pipeline)
    const routes = await readRoutesRegistry(repoRoot);
    
    // Check if web app (port 3000) is running for routes (only if status checking enabled)
    let webAppRunning = false;
    if (checkStatus) {
      try {
        webAppRunning = await Promise.race([
          isPortInUse(3000),
          new Promise<boolean>((resolve) => setTimeout(() => resolve(false), 1000)),
        ]);
      } catch {
        webAppRunning = false;
      }
    }
    
    const routesWithStatus = routes.map((route) => ({
      ...route,
      status: checkStatus ? {
        running: webAppRunning,
        port: 3000,
        url: webAppRunning ? `http://localhost:3000${route.path}` : null,
      } : undefined,
    }));
    
    // Build parent-child relationships
    const appsMap = new Map<string, AppMetadata>();
    apps.forEach((app) => appsMap.set(app.id, app));
    
    // Update child apps with parent info
    apps.forEach((app) => {
      if (app.appType === 'child' && app.parentApp) {
        const parent = appsMap.get(app.parentApp);
        if (parent && parent.childApps) {
          if (!parent.childApps.includes(app.id)) {
            parent.childApps.push(app.id);
          }
        }
      }
    });
    
    // Combine apps and routes, sort by type then port then name
    const allItems = [...apps, ...routesWithStatus].sort((a, b) => {
      // Sort by type priority: parent, child, standalone, page
      const typeOrder: Record<AppType, number> = {
        parent: 0,
        child: 1,
        standalone: 2,
        page: 3,
      };
      
      if (typeOrder[a.appType] !== typeOrder[b.appType]) {
        return typeOrder[a.appType] - typeOrder[b.appType];
      }
      
      // Then by port
      if (a.port !== b.port) return (a.port || 0) - (b.port || 0);
      
      // Then by name
      return a.name.localeCompare(b.name);
    });
    
    return NextResponse.json(allItems);
  } catch (error) {
    console.error("Error reading apps index:", error);
    return NextResponse.json(
      { error: "Failed to load apps index", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

