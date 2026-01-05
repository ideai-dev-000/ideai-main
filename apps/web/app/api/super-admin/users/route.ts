/**
 * @fileoverview Super Admin Users API Route
 *
 * @module SuperAdminUsersAPI
 * @description
 * API route for fetching and managing users in the super admin panel.
 *
 * ⚠️ CRITICAL: This route is DEV-ONLY and includes production guards.
 */

import { NextRequest, NextResponse } from "next/server";

// Import dev-check from package (will throw in production)
let assertSuperAdminEnabled: () => void;
let isSafeEnvironment: () => boolean;

try {
  const superAdmin = require("@repo/ideai-db-manager");
  assertSuperAdminEnabled = superAdmin.isSuperAdminEnabled
    ? () => {
        if (!superAdmin.isSuperAdminEnabled()) {
          throw new Error("Super Admin is DEV-ONLY");
        }
      }
    : () => {};
  isSafeEnvironment =
    superAdmin.isSafeEnvironment ||
    (() => process.env.NODE_ENV === "development");
} catch {
  // Package not available - block access
  assertSuperAdminEnabled = () => {
    throw new Error("Super Admin package not available");
  };
  isSafeEnvironment = () => false;
}

/**
 * GET /api/super-admin/users
 *
 * Returns list of all users (dev-only)
 */
export async function GET(request: NextRequest) {
  try {
    // Runtime check - block in production
    if (!isSafeEnvironment()) {
      return NextResponse.json(
        { error: "IdeaI DB Manager is only available in development mode" },
        { status: 403 },
      );
    }

    // Verify password from request (simplified - in real implementation, use session)
    const authHeader = request.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // TODO: Implement proper session-based authentication
    // For now, this is a placeholder that requires the API route to be called
    // from the authenticated super admin panel

    // Import database connection from capabilities app (shared database)
    // Note: This uses the same database as ideai-capabilities
    const { db } = await import("../../../../ideai-capabilities/lib/db");
    const { users } =
      await import("../../../../ideai-capabilities/lib/db/schema");

    const allUsers = await db.select().from(users);

    return NextResponse.json({
      users: allUsers.map((user) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        emailVerified: user.emailVerified,
        image: user.image,
        isAnonymous: user.isAnonymous ?? false,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      })),
    });
  } catch (error) {
    console.error("IdeaI DB Manager API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
