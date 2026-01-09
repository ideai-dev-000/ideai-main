/**
 * @fileoverview Vercel Projects API Route
 *
 * @module VercelProjectsAPI
 * @description
 * Server-side API route to proxy Vercel API requests.
 * Keeps the Vercel token secure on the server.
 * Protected by authentication - requires valid session.
 */

import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function GET(request: Request) {
  // Check authentication
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const teamId = searchParams.get("teamId") || "team_vhjzlMi6CfNow0IfBXnv2Yn2";

  const token = process.env.VERCEL_TOKEN;
  if (!token) {
    return NextResponse.json(
      {
        error: {
          message:
            "Vercel token not configured. Set VERCEL_TOKEN environment variable.",
        },
      },
      { status: 500 },
    );
  }

  try {
    const response = await fetch(
      `https://api.vercel.com/v9/projects?teamId=${teamId}&limit=100`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        {
          error: {
            message: `Vercel API error: ${response.statusText}`,
            code: response.status.toString(),
          },
        },
        { status: response.status },
      );
    }

    const data = await response.json();
    return NextResponse.json({ data: data.projects || [] });
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
