/**
 * @fileoverview IdeaI App Configuration System
 *
 * @module IdeAIConfig
 * @description
 * Reads .ideai.json config file to determine app role (parent/child)
 * and configuration. Makes it easy to switch apps between parent/child roles.
 *
 * @example
 * ```json
 * {
 *   "role": "parent",
 *   "name": "IdeaI",
 *   "childApps": ["docs", "all"]
 * }
 * ```
 *
 * @example
 * ```json
 * {
 *   "role": "child",
 *   "name": "Documentation",
 *   "parentApp": "web"
 * }
 * ```
 */

export interface VercelProjectConfig {
  /** Vercel project name to use (e.g., 'ideai-main', 'web') */
  projectName: string;
  /** Project ID (optional, for explicit linking) */
  projectId?: string;
  /** Organization ID (optional, defaults to idea-i) */
  orgId?: string;
  /** Whether to fork to a new project if project doesn't exist */
  forkToNew?: boolean;
  /** New project name if forking */
  newProjectName?: string;
}

export interface IdeAIConfig {
  /** App role: "parent" or "child" */
  role: "parent" | "child";
  /** App display name */
  name: string;
  /** App description */
  description?: string;
  /** For parent apps: list of child app IDs */
  childApps?: string[];
  /** For child apps: parent app ID */
  parentApp?: string;
  /** Child app local port (for development) */
  localPort?: number;
  /** Vercel project configuration (optional) */
  vercelProject?: VercelProjectConfig;
  /** Animation libraries available in this app (e.g., ["framer-motion", "react-spring"]) */
  animationLibraries?: string[];
  /** App metadata (from legacy .ideai file - now merged into .ideai.json) */
  metadata?: {
    /** App ID (usually same as directory name) */
    id?: string;
    /** App port (same as localPort, kept for backward compatibility) */
    port?: number;
    /** CSS frameworks used */
    css?: string[];
    /** App capabilities/features */
    capabilities?: string[];
    /** App path/route */
    path?: string;
    /** App category */
    category?: string;
  };
}

/**
 * Default child app ports (development)
 */
const DEFAULT_CHILD_PORTS: Record<string, number> = {
  docs: 3001,
  all: 3002,
  nocss: 3003,
  mvp: 3004,
  "ideai-frameworks": 3016,
  "ideai-reactflow": 3017,
  "ideai-workflow": 3013,
  "lead-processing-agent": 3014,
  "ideai-builder": 3015,
};

/**
 * Read IdeaI config from .ideai.json file
 *
 * @param appName - App name (e.g., "web", "docs")
 * @returns Config object or null if not found
 */
export async function readIdeAIConfig(
  appName: string,
): Promise<IdeAIConfig | null> {
  try {
    // In Next.js, we need to read from the app directory
    const configPath = `apps/${appName}/.ideai.json`;
    const response = await fetch(`/${configPath}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    const config = await response.json();
    return config as IdeAIConfig;
  } catch {
    // If fetch fails (e.g., in Node.js), try file system
    return null;
  }
}

/**
 * Read IdeaI config synchronously
 * Works in both Node.js and browser (uses defaults in browser)
 *
 * @param appName - App name (e.g., "web", "docs")
 * @returns Config object with defaults
 */
export function readIdeAIConfigSync(appName: string): IdeAIConfig | null {
  // In browser, return defaults (config files not accessible)
  // In Node.js, try to read file
  if (typeof window === "undefined") {
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const fs = require("fs");
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const path = require("path");

      // Try to read from apps/{appName}/.ideai.json
      const configPath = path.join(
        process.cwd(),
        "apps",
        appName,
        ".ideai.json",
      );

      if (fs.existsSync(configPath)) {
        const configContent = fs.readFileSync(configPath, "utf-8");
        return JSON.parse(configContent) as IdeAIConfig;
      }
    } catch {
      // Fall through to defaults
    }
  }

  // Fallback: return defaults based on app name
  if (appName === "web") {
    return {
      role: "parent",
      name: "IdeaI",
      description: "Main IdeaI application",
      childApps: Object.keys(DEFAULT_CHILD_PORTS),
      animationLibraries: [
        "framer-motion",
        "react-spring",
        "kute",
        "motion-one",
        "tsparticles",
        "vivus",
      ],
    };
  }

  // Default to child for other apps
  return {
    role: "child",
    name: appName.charAt(0).toUpperCase() + appName.slice(1),
    parentApp: "web",
    localPort: DEFAULT_CHILD_PORTS[appName],
  };
}

/**
 * Get child app configuration
 * Works in both browser and Node.js
 *
 * @param appName - Child app name
 * @returns Child app config with port info
 */
export function getChildAppConfig(appName: string): IdeAIConfig {
  // Try to read config file (Node.js only)
  if (typeof window === "undefined") {
    const config = readIdeAIConfigSync(appName);
    if (config) {
      return config;
    }
  }

  // Default config (works in browser and Node.js)
  return {
    role: "child",
    name: appName.charAt(0).toUpperCase() + appName.slice(1),
    parentApp: "web",
    localPort: DEFAULT_CHILD_PORTS[appName] || 3000,
  };
}

/**
 * Get all child apps from parent config
 *
 * @param parentAppName - Parent app name (default: "web")
 * @returns Array of child app configs
 */
export function getChildApps(parentAppName: string = "web"): IdeAIConfig[] {
  const parentConfig = readIdeAIConfigSync(parentAppName);

  if (parentConfig?.role === "parent" && parentConfig.childApps) {
    return parentConfig.childApps.map((appName) => getChildAppConfig(appName));
  }

  // Fallback: return all known child apps
  return Object.keys(DEFAULT_CHILD_PORTS).map((appName) =>
    getChildAppConfig(appName),
  );
}

/**
 * Check if app is parent
 *
 * @param appName - App name
 * @returns true if app is parent
 */
export function isParentApp(appName: string): boolean {
  const config = readIdeAIConfigSync(appName);
  return config?.role === "parent";
}

/**
 * Check if app is child
 *
 * @param appName - App name
 * @returns true if app is child
 */
export function isChildApp(appName: string): boolean {
  const config = readIdeAIConfigSync(appName);
  return config?.role === "child";
}
