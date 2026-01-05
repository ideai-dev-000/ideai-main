/**
 * @fileoverview Super Admin User Update API Route
 *
 * @module SuperAdminUserUpdateAPI
 * @description
 * API route for updating user data in the super admin panel.
 *
 * ⚠️ CRITICAL: This route is DEV-ONLY and includes production guards.
 */

import { NextRequest, NextResponse } from "next/server";

// Import dev-check from package (will throw in production)
let isSafeEnvironment: () => boolean;

try {
  const superAdmin = require("@repo/ideai-db-manager");
  isSafeEnvironment =
    superAdmin.isSafeEnvironment ||
    (() => process.env.NODE_ENV === "development");
} catch {
  isSafeEnvironment = () => false;
}

/**
 * PATCH /api/super-admin/users/:id
 *
 * Updates a user (dev-only)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    // Runtime check - block in production
    if (!isSafeEnvironment()) {
      return NextResponse.json(
        { error: "IdeaI DB Manager is only available in development mode" },
        { status: 403 },
      );
    }

    const { id } = params;
    const body = await request.json();

    // Import database connection from capabilities app (shared database)
    const { db } = await import("../../../../../ideai-capabilities/lib/db");
    const { users } =
      await import("../../../../../ideai-capabilities/lib/db/schema");
    const { eq } = await import("drizzle-orm");

    // Update user
    await db
      .update(users)
      .set({
        name: body.name ?? null,
        email: body.email ?? null,
        updatedAt: new Date(),
      })
      .where(eq(users.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("IdeaI DB Manager update error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
