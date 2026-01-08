/**
 * @fileoverview Database Connection API Route
 *
 * @module DatabaseConnectAPI
 * @description
 * Server-side API route to get DATABASE_URL from Vercel using Vercel API.
 * DEV-ONLY: Only works in development mode for security.
 */

import { NextResponse } from "next/server";

export async function GET(request: Request) {
  // SECURITY: Only allow in development
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json(
      { error: { message: "Database API is only available in development" } },
      { status: 403 },
    );
  }

  const { searchParams } = new URL(request.url);
  const env = searchParams.get("env") || "production";
  const app = searchParams.get("app") || "ideai-capabilities";
  const teamId = searchParams.get("teamId") || "team_vhjzlMi6CfNow0IfBXnv2Yn2";

  // Map app names to Vercel project names
  const projectMap: Record<string, string> = {
    "ideai-capabilities": "ideai-capabilities",
    "ideai-workflow": "ideai-workflow",
  };

  const projectName = projectMap[app] || app;

  const token = process.env.VERCEL_TOKEN;
  if (!token) {
    return NextResponse.json(
      {
        error: {
          message:
            "Vercel token not configured. Set VERCEL_TOKEN in .env.local",
        },
      },
      { status: 500 },
    );
  }

  try {
    // First, get project ID from project name
    const projectsResponse = await fetch(
      `https://api.vercel.com/v9/projects?teamId=${teamId}&limit=100`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );

    if (!projectsResponse.ok) {
      return NextResponse.json(
        {
          error: {
            message: `Failed to fetch projects: ${projectsResponse.statusText}`,
          },
        },
        { status: projectsResponse.status },
      );
    }

    const projectsData = await projectsResponse.json();
    const project = projectsData.projects?.find(
      (p: { name: string }) => p.name === projectName,
    );

    if (!project) {
      return NextResponse.json(
        {
          error: {
            message: `Project "${projectName}" not found in Vercel`,
          },
        },
        { status: 404 },
      );
    }

    // Get environment variables for the project
    const envResponse = await fetch(
      `https://api.vercel.com/v9/projects/${project.id}/env?teamId=${teamId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );

    if (!envResponse.ok) {
      return NextResponse.json(
        {
          error: {
            message: `Failed to fetch environment variables: ${envResponse.statusText}`,
          },
        },
        { status: envResponse.status },
      );
    }

    const envData = await envResponse.json();
    const envVars = envData.envs || [];

    // Filter by environment and find DATABASE_URL
    const databaseUrlVar = envVars.find(
      (envVar: { key: string; target?: string[] }) => {
        if (envVar.key !== "DATABASE_URL") return false;
        if (!envVar.target) return true; // All environments
        return envVar.target.includes(
          env as "production" | "preview" | "development",
        );
      },
    );

    if (!databaseUrlVar || !databaseUrlVar.value) {
      // Try to decrypt if it's encrypted
      if (databaseUrlVar?.type === "encrypted" && !databaseUrlVar.value) {
        return NextResponse.json(
          {
            error: {
              message:
                "DATABASE_URL is encrypted and cannot be retrieved via API. Please set it manually or use Vercel CLI.",
            },
          },
          { status: 404 },
        );
      }

      return NextResponse.json(
        {
          error: {
            message: `DATABASE_URL not found for "${projectName}" in ${env} environment. Please set it in Vercel dashboard.`,
          },
        },
        { status: 404 },
      );
    }

    // Decrypt if needed (Vercel API should return decrypted values for our own token)
    const url = databaseUrlVar.value;

    return NextResponse.json({
      data: {
        url,
        displayUrl: url.replace(/:([^:@]+)@/, ":****@"),
        env,
        app,
        project: projectName,
        projectId: project.id,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: {
          message: error instanceof Error ? error.message : "Unknown error",
        },
      },
      { status: 500 },
    );
  }
}
