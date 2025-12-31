/**
 * @fileoverview GitHub branch status API endpoint
 * 
 * @module GitHubStatusAPI
 * @description
 * Returns GitHub branch information for all apps.
 * Shows last commit, branch protection status, etc.
 * 
 * Note: In development, returns mock data. In production,
 * requires GITHUB_TOKEN environment variable.
 */

import { NextResponse } from "next/server";
import { defaultRoutingConfig } from "../../../config/routing";

/**
 * GitHub branch mapping
 * Maps app IDs to branch names (defaults to main for now)
 */
const GITHUB_BRANCHES: Record<string, string> = {
  web: "main",
  landing: "main",
  docs: "main",
  all: "main",
  nocss: "main",
  mvp: "main",
  tailwind: "main",
  allcss: "main",
};

/**
 * Fetch branch info from GitHub API
 */
async function getGitHubBranchInfo(
  branch: string
): Promise<{ lastCommit?: string; protected?: boolean }> {
  const githubToken = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPO || "ideai-dev-000/ideai-main";

  // In development or without token, return mock data
  if (!githubToken || process.env.NODE_ENV === "development") {
    return {
      lastCommit: new Date().toISOString(),
      protected: false,
    };
  }

  try {
    const url = `https://api.github.com/repos/${repo}/branches/${branch}`;
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${githubToken}`,
        Accept: "application/vnd.github.v3+json",
      },
    });

    if (!response.ok) {
      return {};
    }

    const data = await response.json();
    return {
      lastCommit: data.commit?.commit?.committer?.date,
      protected: data.protected || false,
    };
  } catch (error) {
    console.error(`Error fetching GitHub branch info for ${branch}:`, error);
    return {};
  }
}

/**
 * GET /api/status/github
 * Returns GitHub branch info for all apps
 */
export async function GET() {
  try {
    const apps = defaultRoutingConfig.apps;
    const branches: Record<string, { branch: string; lastCommit?: string; protected?: boolean }> = {};

    // Check each app's GitHub branch
    for (const app of apps) {
      const branch = GITHUB_BRANCHES[app.id] || "main";
      const info = await getGitHubBranchInfo(branch);
      branches[app.id] = {
        branch,
        ...info,
      };
    }

    return NextResponse.json({
      success: true,
      branches,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error checking GitHub status:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to check GitHub status",
        branches: {},
      },
      { status: 500 }
    );
  }
}

