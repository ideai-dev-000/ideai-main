/**
 * @fileoverview User Service Key by ID API
 *
 * @module UserKeyByIdAPI
 * @description
 * API endpoints for managing individual user service keys
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { deleteUserKey, getUserKeys } from "@/lib/services/user-keys";

/**
 * DELETE /api/user-keys/[keyId]
 * Delete a user service key
 */
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ keyId: string }> },
) {
  try {
    const { keyId } = await context.params;
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 },
      );
    }

    await deleteUserKey(session.user.id, keyId);

    // Return updated list
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
        error: "Failed to delete user key",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      {
        status:
          error instanceof Error && error.message.includes("not found")
            ? 404
            : 500,
      },
    );
  }
}
