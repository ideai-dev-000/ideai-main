/**
 * @fileoverview Vercel API Client
 *
 * @module VercelClient
 * @description
 * Client for interacting with Vercel API to manage projects,
 * deployments, and configurations.
 */

import type {
  VercelProjectSettings,
  VercelDeployment,
  VercelApiResponse,
} from "./vercel-types";

/**
 * Vercel API Client
 *
 * Handles all interactions with Vercel API
 */
export class VercelClient {
  private apiToken: string;
  private baseUrl = "https://api.vercel.com";

  constructor(apiToken?: string) {
    // Try multiple sources for the token
    this.apiToken =
      apiToken ||
      (typeof window !== "undefined"
        ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (window as any).__VERCEL_TOKEN__
        : undefined) ||
      process.env.NEXT_PUBLIC_VERCEL_TOKEN ||
      process.env.VERCEL_TOKEN ||
      "";
    if (!this.apiToken) {
      console.warn(
        "Vercel API token not provided. Some features may not work.",
      );
    }
  }

  /**
   * Get project settings
   */
  async getProjectSettings(
    projectId: string,
    teamId: string,
  ): Promise<VercelApiResponse<VercelProjectSettings>> {
    try {
      const response = await fetch(
        `${this.baseUrl}/v9/projects/${projectId}?teamId=${teamId}`,
        {
          headers: {
            Authorization: `Bearer ${this.apiToken}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (!response.ok) {
        return {
          error: {
            message: `Failed to fetch project settings: ${response.statusText}`,
            code: response.status.toString(),
          },
        };
      }

      const data = await response.json();
      return {
        data: {
          rootDirectory: data.rootDirectory || null,
          buildCommand: data.buildCommand || null,
          installCommand: data.installCommand || null,
          outputDirectory: data.outputDirectory || null,
          framework: data.framework || null,
          includeFilesOutsideRoot: data.includeFilesOutsideRoot || false,
        },
      };
    } catch (error) {
      return {
        error: {
          message: error instanceof Error ? error.message : "Unknown error",
        },
      };
    }
  }

  /**
   * Update project settings
   */
  async updateProjectSettings(
    projectId: string,
    teamId: string,
    settings: Partial<VercelProjectSettings>,
  ): Promise<VercelApiResponse<VercelProjectSettings>> {
    try {
      const response = await fetch(
        `${this.baseUrl}/v9/projects/${projectId}?teamId=${teamId}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${this.apiToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(settings),
        },
      );

      if (!response.ok) {
        return {
          error: {
            message: `Failed to update project settings: ${response.statusText}`,
            code: response.status.toString(),
          },
        };
      }

      const data = await response.json();
      return {
        data: {
          rootDirectory: data.rootDirectory || null,
          buildCommand: data.buildCommand || null,
          installCommand: data.installCommand || null,
          outputDirectory: data.outputDirectory || null,
          framework: data.framework || null,
          includeFilesOutsideRoot: data.includeFilesOutsideRoot || false,
        },
      };
    } catch (error) {
      return {
        error: {
          message: error instanceof Error ? error.message : "Unknown error",
        },
      };
    }
  }

  /**
   * List all projects
   */
  async listProjects(
    teamId: string,
  ): Promise<VercelApiResponse<Array<{ id: string; name: string }>>> {
    try {
      const response = await fetch(
        `${this.baseUrl}/v9/projects?teamId=${teamId}&limit=100`,
        {
          headers: {
            Authorization: `Bearer ${this.apiToken}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (!response.ok) {
        return {
          error: {
            message: `Failed to list projects: ${response.statusText}`,
            code: response.status.toString(),
          },
        };
      }

      const data = await response.json();
      return {
        data: data.projects || [],
      };
    } catch (error) {
      return {
        error: {
          message: error instanceof Error ? error.message : "Unknown error",
        },
      };
    }
  }

  /**
   * Get project deployments
   */
  async getDeployments(
    projectId: string,
    teamId: string,
  ): Promise<VercelApiResponse<VercelDeployment[]>> {
    try {
      const response = await fetch(
        `${this.baseUrl}/v6/deployments?projectId=${projectId}&teamId=${teamId}&limit=10`,
        {
          headers: {
            Authorization: `Bearer ${this.apiToken}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (!response.ok) {
        return {
          error: {
            message: `Failed to fetch deployments: ${response.statusText}`,
            code: response.status.toString(),
          },
        };
      }

      const data = await response.json();
      return {
        data: data.deployments || [],
      };
    } catch (error) {
      return {
        error: {
          message: error instanceof Error ? error.message : "Unknown error",
        },
      };
    }
  }
}
