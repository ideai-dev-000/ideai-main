/**
 * @fileoverview Vercel deployment status API endpoint
 * 
 * @module VercelStatusAPI
 * @description
 * Returns the deployment status for all Vercel projects.
 * Uses Vercel API to fetch latest deployment info.
 * 
 * Note: Requires VERCEL_TOKEN environment variable for production.
 * In development, returns mock/unknown status.
 */

import { NextResponse } from "next/server";
import { defaultRoutingConfig } from "../../../config/routing";

/**
 * Vercel project mapping
 * Maps app IDs to Vercel project names
 */
const VERCEL_PROJECTS: Record<string, string> = {
  web: "ideai-main",
  landing: "landing",
  docs: "docs",
  all: "all",
  nocss: "nocss",
  mvp: "mvp",
  tailwind: "tailwind",
  allcss: "allcss",
};

/**
 * Fetch deployment status from Vercel API
 */
async function getVercelDeploymentStatus(
  projectName: string
): Promise<"deployed" | "building" | "failed" | "unknown"> {
  const vercelToken = process.env.VERCEL_TOKEN;
  const teamId = process.env.VERCEL_TEAM_ID || "team_vhjzlMi6CfNow0IfBXnv2Yn2";

  // In development or without token, return unknown
  if (!vercelToken || process.env.NODE_ENV === "development") {
    return "unknown";
  }

  try {
    const url = `https://api.vercel.com/v6/deployments?projectId=${projectName}&teamId=${teamId}&limit=1`;
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${vercelToken}`,
      },
    });

    if (!response.ok) {
      return "unknown";
    }

    const data = await response.json();
    const deployment = data.deployments?.[0];

    if (!deployment) {
      return "unknown";
    }

    // Map Vercel state to our status
    switch (deployment.state) {
      case "READY":
        return "deployed";
      case "BUILDING":
      case "QUEUED":
        return "building";
      case "ERROR":
      case "CANCELED":
        return "failed";
      default:
        return "unknown";
    }
  } catch (error) {
    console.error(`Error fetching Vercel status for ${projectName}:`, error);
    return "unknown";
  }
}

/**
 * GET /api/status/vercel
 * Returns Vercel deployment status for all apps
 */
export async function GET() {
  try {
    const apps = defaultRoutingConfig.apps;
    const statuses: Record<string, "deployed" | "building" | "failed" | "unknown"> = {};
    const deployments: Record<string, { url?: string; createdAt?: string }> = {};

    // Check each app's Vercel status
    for (const app of apps) {
      const projectName = VERCEL_PROJECTS[app.id];
      if (projectName) {
        const status = await getVercelDeploymentStatus(projectName);
        statuses[app.id] = status;

        // In production, we could fetch deployment URL and timestamp
        // For now, we'll use the project name to construct URLs
        if (status === "deployed") {
          deployments[app.id] = {
            url: `https://vercel.com/idea-i/${projectName}`,
          };
        }
      } else {
        statuses[app.id] = "unknown";
      }
    }

    return NextResponse.json({
      success: true,
      statuses,
      deployments,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error checking Vercel status:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to check Vercel status",
        statuses: {},
      },
      { status: 500 }
    );
  }
}

