/**
 * @fileoverview Vercel Configuration Manager
 *
 * @module VercelConfig
 * @description
 * Utilities for managing Vercel project configurations,
 * including auto-configuration and validation.
 */

import { VercelClient } from "./vercel-client";
import type {
  VercelProjectConfig,
  VercelProjectSettings,
} from "./vercel-types";

/**
 * Auto-configure a Vercel project based on app structure
 */
export async function autoConfigureVercelProject(
  client: VercelClient,
  projectId: string,
  teamId: string,
  appName: string,
): Promise<{ success: boolean; message: string }> {
  const expectedSettings: VercelProjectSettings = {
    rootDirectory: `apps/${appName}`,
    buildCommand: "next build",
    installCommand: "pnpm install",
    outputDirectory: ".next",
    framework: "nextjs",
    includeFilesOutsideRoot: true,
  };

  // Get current settings
  const current = await client.getProjectSettings(projectId, teamId);
  if (current.error) {
    return {
      success: false,
      message: `Failed to fetch current settings: ${current.error.message}`,
    };
  }

  // Check if configuration is correct
  const needsUpdate =
    !current.data ||
    current.data.rootDirectory !== expectedSettings.rootDirectory ||
    current.data.includeFilesOutsideRoot !==
      expectedSettings.includeFilesOutsideRoot;

  if (!needsUpdate) {
    return {
      success: true,
      message: "Project is already correctly configured",
    };
  }

  // Update settings
  const update = await client.updateProjectSettings(
    projectId,
    teamId,
    expectedSettings,
  );
  if (update.error) {
    return {
      success: false,
      message: `Failed to update settings: ${update.error.message}`,
    };
  }

  return {
    success: true,
    message: "Project configuration updated successfully",
  };
}

/**
 * Validate Vercel project configuration
 */
export function validateVercelConfig(config: VercelProjectConfig): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!config.name) {
    errors.push("Project name is required");
  }

  if (!config.orgId) {
    errors.push("Organization ID is required");
  }

  if (config.rootDirectory && !config.rootDirectory.startsWith("apps/")) {
    errors.push(
      "Root directory should start with 'apps/' for monorepo structure",
    );
  }

  if (config.rootDirectory && !config.includeFilesOutsideRoot) {
    errors.push(
      "Include files outside root directory must be enabled for monorepo",
    );
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
