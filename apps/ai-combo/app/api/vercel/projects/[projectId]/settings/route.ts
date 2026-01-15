/**
 * @fileoverview Vercel Project Settings API Route
 *
 * @module VercelProjectSettingsAPI
 * @description
 * Server-side API route to get/update Vercel project settings.
 * Protected by authentication - requires valid session.
 */

import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ projectId: string }> },
) {
  // Check authentication
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { projectId } = await params;
  const { searchParams } = new URL(request.url);
  const teamId = searchParams.get("teamId") || "team_vhjzlMi6CfNow0IfBXnv2Yn2";

  const token = process.env.VERCEL_TOKEN;
  if (!token) {
    return NextResponse.json(
      { error: { message: "Vercel token not configured" } },
      { status: 500 },
    );
  }

  try {
    const response = await fetch(
      `https://api.vercel.com/v9/projects/${projectId}?teamId=${teamId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      return NextResponse.json(
        {
          error: {
            message: `Failed to fetch settings: ${response.statusText}`,
            code: response.status.toString(),
          },
        },
        { status: response.status },
      );
    }

    const data = await response.json();
    return NextResponse.json({
      data: {
        rootDirectory: data.rootDirectory || null,
        buildCommand: data.buildCommand || null,
        installCommand: data.installCommand || null,
        outputDirectory: data.outputDirectory || null,
        framework: data.framework || null,
        includeFilesOutsideRoot:
          data.sourceFilesOutsideRootDirectory ||
          data.includeFilesOutsideRoot ||
          false,
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

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ projectId: string }> },
) {
  // Check authentication
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { projectId } = await params;
  const { searchParams } = new URL(request.url);
  const teamId = searchParams.get("teamId") || "team_vhjzlMi6CfNow0IfBXnv2Yn2";
  const body = await request.json();

  const token = process.env.VERCEL_TOKEN;
  if (!token) {
    return NextResponse.json(
      { error: { message: "Vercel token not configured" } },
      { status: 500 },
    );
  }

  try {
    const response = await fetch(
      `https://api.vercel.com/v9/projects/${projectId}?teamId=${teamId}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      },
    );

    const responseText = await response.text();
    let responseData;

    try {
      responseData = JSON.parse(responseText);
    } catch {
      responseData = { error: responseText };
    }

    if (!response.ok) {
      return NextResponse.json(
        {
          error: {
            message:
              responseData.error?.message ||
              responseData.message ||
              `Failed to update settings: ${response.statusText}`,
            code: response.status.toString(),
            details: responseData,
          },
        },
        { status: response.status },
      );
    }

    return NextResponse.json({
      data: {
        rootDirectory: responseData.rootDirectory || null,
        buildCommand: responseData.buildCommand || null,
        installCommand: responseData.installCommand || null,
        outputDirectory: responseData.outputDirectory || null,
        framework: responseData.framework || null,
        includeFilesOutsideRoot:
          responseData.sourceFilesOutsideRootDirectory ||
          responseData.includeFilesOutsideRoot ||
          false,
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
