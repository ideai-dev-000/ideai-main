/**
 * @fileoverview Dev Setup Check API
 *
 * @module DevSetupCheckAPI
 * @description
 * API endpoint for automated dev setup validation.
 * Part of cloud manager onboarding flow.
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
// Use direct import path to avoid export chain issues
import { runSetupChecks } from "../../../../../../packages/cloud-manager/src/dev-setup-checker";

/**
 * GET /api/dev-setup/check
 * Run setup checks and return status
 */
export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    const userId = session?.user?.id;
    const status = await runSetupChecks(userId);

    return NextResponse.json({
      success: true,
      ...status,
    });
  } catch (error) {
    console.error("[Dev Setup Check] Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to run setup checks",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
