/**
 * @fileoverview User Service Keys Sync API
 *
 * @module UserKeysSyncAPI
 * @description
 * Secure sync endpoint for dev environment key synchronization.
 * Returns decrypted keys for syncing to local .env (requires special auth).
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import {
  getUserKeys,
  getUserKey,
  type ServiceType,
} from "@/lib/services/user-keys";

/**
 * POST /api/user-keys/sync
 * Get all user keys for syncing to local .env (decrypted)
 * Only works in development mode or with special dev token
 */
export async function POST(request: NextRequest) {
  try {
    // In production, require special dev token
    const devToken = request.headers.get("x-dev-sync-token");
    const expectedToken = process.env.DEV_SYNC_TOKEN;

    if (process.env.NODE_ENV === "production" && devToken !== expectedToken) {
      return NextResponse.json(
        { error: "Dev sync not allowed in production without token" },
        { status: 403 },
      );
    }

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
    const { userId } = body;

    // Verify user owns the account
    if (userId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Get all user keys (decrypted)
    const serviceTypes: ServiceType[] = [
      "ai_gateway",
      "openai",
      "v0",
      "anthropic",
      "firecrawl",
      "exa",
    ];

    const keys = await Promise.all(
      serviceTypes.map(async (serviceType) => {
        const key =
          (await getUserKey(userId, serviceType, "local")) ||
          (await getUserKey(userId, serviceType, "production"));

        return {
          serviceType,
          key: key || null,
          environment: key ? "local" : "production",
        };
      }),
    );

    return NextResponse.json({
      success: true,
      keys,
    });
  } catch (error) {
    console.error("[UserKeys Sync API] Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to sync keys",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
