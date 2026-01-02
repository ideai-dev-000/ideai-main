/**
 * @fileoverview IdeaI Vercel Project Configuration
 * 
 * @module IdeAIVercel
 * @description
 * Utilities for managing Vercel project configuration and linking.
 * Supports flexible project assignment: same project or fork to new project.
 * 
 * @example
 * ```ts
 * const config = getVercelProjectConfig('web');
 * // Returns: { projectName: 'ideai-main', forkToNew: false }
 * ```
 */

import { readIdeAIConfigSync, type VercelProjectConfig } from "./ideai-config";

export type { VercelProjectConfig };

/**
 * Get Vercel project configuration for an app
 * 
 * @param appName - App name (e.g., 'web', 'docs')
 * @returns Vercel project configuration
 */
export function getVercelProjectConfig(appName: string): VercelProjectConfig {
  const config = readIdeAIConfigSync(appName);
  
  // Check if vercelProject is specified in config
  if (config && config.vercelProject) {
    return {
      projectName: config.vercelProject.projectName || appName,
      projectId: config.vercelProject.projectId,
      orgId: config.vercelProject.orgId || "team_vhjzlMi6CfNow0IfBXnv2Yn2",
      forkToNew: config.vercelProject.forkToNew || false,
      newProjectName: config.vercelProject.newProjectName,
    };
  }
  
  // Default: use app name as project name
  return {
    projectName: appName,
    orgId: "team_vhjzlMi6CfNow0IfBXnv2Yn2",
    forkToNew: false,
  };
}

/**
 * Check if app should use existing project or fork to new
 * 
 * @param appName - App name
 * @returns True if should fork to new project
 */
export function shouldForkToNewProject(appName: string): boolean {
  const config = getVercelProjectConfig(appName);
  return config.forkToNew === true;
}

/**
 * Get target Vercel project name for an app
 * 
 * @param appName - App name
 * @returns Vercel project name to use
 */
export function getVercelProjectName(appName: string): string {
  const config = getVercelProjectConfig(appName);
  return config.projectName;
}

