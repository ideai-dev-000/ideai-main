/**
 * @fileoverview User Service Keys API
 *
 * @module UserKeysAPI
 * @description
 * API endpoints for managing user service API keys (AI Gateway, OpenAI, etc.)
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import {
  saveUserKey,
  getUserKeys,
  deleteUserKey,
  getUserKeyInfo,
  type ServiceType,
  type Environment,
} from "@/lib/services/user-keys";

/**
 * GET /api/user-keys
 * List all user's service keys
 */
export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 },
      );
    }

    const keys = await getUserKeys(session.user.id);

    return NextResponse.json({
      success: true,
      keys,
    });
  } catch (error) {
    console.error("[UserKeys API] Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch user keys",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

/**
 * POST /api/user-keys
 * Create or update a user service key
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 },
      );
    }

    const body = await request.json();
    const {
      serviceType,
      key,
      environment,
      vercelProjectId,
      vercelTeamId,
      copyFrom,
    } = body;

    if (!serviceType) {
      return NextResponse.json(
        { error: "serviceType is required" },
        { status: 400 },
      );
    }

    // Handle copying from another environment
    let actualKey = key;
    if (copyFrom && !key) {
      const { getUserKey } = await import("@/lib/services/user-keys");
      const sourceKey = await getUserKey(
        session.user.id,
        serviceType,
        copyFrom as Environment,
      );
      if (!sourceKey) {
        return NextResponse.json(
          { error: `No key found in ${copyFrom} environment to copy` },
          { status: 404 },
        );
      }
      actualKey = sourceKey;
    }

    if (!actualKey) {
      return NextResponse.json(
        {
          error:
            "key is required (or use copyFrom to copy from another environment)",
        },
        { status: 400 },
      );
    }

    // Validate service type
    const validServiceTypes: ServiceType[] = [
      "ai_gateway",
      "openai",
      "v0",
      "anthropic",
      "firecrawl",
      "exa",
    ];
    if (!validServiceTypes.includes(serviceType)) {
      return NextResponse.json(
        {
          error: `Invalid service type. Must be one of: ${validServiceTypes.join(", ")}`,
        },
        { status: 400 },
      );
    }

    // Validate environment
    const validEnvironments: Environment[] = ["local", "production", "preview"];
    const env =
      environment && validEnvironments.includes(environment)
        ? environment
        : "production";

    // Save key
    await saveUserKey({
      userId: session.user.id,
      serviceType,
      key: actualKey,
      environment: env,
      vercelProjectId,
      vercelTeamId,
    });

    // Return updated key info
    const keyInfo = await getUserKeyInfo(session.user.id, serviceType, env);

    return NextResponse.json({
      success: true,
      key: keyInfo,
    });
  } catch (error) {
    console.error("[UserKeys API] Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to save user key",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
