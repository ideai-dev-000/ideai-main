/**
 * @fileoverview User Service Keys Hashes API
 *
 * @module UserKeysHashesAPI
 * @description
 * Returns key hashes (not keys) for validation without exposing keys.
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getUserKey, type ServiceType } from "@/lib/services/user-keys";
import { createHash } from "node:crypto";

/**
 * Generate hash/fingerprint of a key
 */
function hashKey(key: string): string {
  return createHash("sha256").update(key).digest("hex").slice(0, 16);
}

/**
 * GET /api/user-keys/hashes
 * Get key hashes for validation (doesn't expose actual keys)
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

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId") || session.user.id;

    // Verify user owns the account
    if (userId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const serviceTypes: ServiceType[] = [
      "ai_gateway",
      "openai",
      "v0",
      "anthropic",
      "firecrawl",
      "exa",
    ];

    const hashes = await Promise.all(
      serviceTypes.map(async (serviceType) => {
        // Try local first, then production
        const key =
          (await getUserKey(userId, serviceType, "local")) ||
          (await getUserKey(userId, serviceType, "production"));

        return {
          serviceType,
          hash: key ? hashKey(key) : null,
          environment: key ? "local" : null,
        };
      }),
    );

    return NextResponse.json({
      success: true,
      hashes: hashes.filter((h) => h.hash !== null),
    });
  } catch (error) {
    console.error("[UserKeys Hashes API] Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to get key hashes",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
