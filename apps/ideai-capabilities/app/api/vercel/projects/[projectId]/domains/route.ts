/**
 * @fileoverview Vercel Project Domains API Route
 *
 * @module VercelProjectDomainsAPI
 * @description
 * Server-side API route to get Vercel project domains.
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
      `https://api.vercel.com/v9/projects/${projectId}/domains?teamId=${teamId}`,
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
            message: `Failed to fetch domains: ${response.statusText}`,
            code: response.status.toString(),
          },
        },
        { status: response.status },
      );
    }

    const data = await response.json();
    // Map Vercel API response to our format (name -> domain)
    const domains = (data.domains || []).map(
      (d: { name: string; verified?: boolean }) => ({
        domain: d.name,
        verified: d.verified ?? false,
      }),
    );
    return NextResponse.json({
      data: domains,
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
