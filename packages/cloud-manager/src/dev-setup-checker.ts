/**
 * @fileoverview Dev Setup Checker
 *
 * @module DevSetupChecker
 * @description
 * Automated setup validation for new developers. Checks:
 * - Database migrations (user_service_keys table exists)
 * - Auth configuration
 * - Environment variables
 * - Key sync setup
 *
 * Reduces onboarding complexity and prevents setup issues.
 */

import "server-only";

export type SetupCheckResult = {
  check: string;
  status: "pass" | "fail" | "warning" | "skip";
  message: string;
  fixSteps?: string[];
};

export type SetupStatus = {
  allPassed: boolean;
  checks: SetupCheckResult[];
  canProceed: boolean;
};

/**
 * Check if user_service_keys table exists
 * Also checks .ideai.json for migration status
 */
async function checkDatabaseMigration(): Promise<SetupCheckResult> {
  try {
    // First check .ideai-dev.json status (developer setup file)
    try {
      const { readFile } = await import("node:fs/promises");
      const { join } = await import("node:path");
      const ideaiDevJsonPath = join(process.cwd(), ".ideai-dev.json");

      try {
        const content = await readFile(ideaiDevJsonPath, "utf-8");
        const ideaiDevJson = JSON.parse(content);

        if (ideaiDevJson.setup?.database?.migration_complete === true) {
          // Migration marked as complete in .ideai-dev.json
          // Still verify it actually works
        }
      } catch {
        // .ideai-dev.json doesn't exist or invalid, continue with DB check
      }
    } catch {
      // Can't check .ideai-dev.json (not in Node.js context), continue with DB check
    }

    // Try to import db - may fail if not configured, which is OK
    let db;
    try {
      const dbModule = await import("../../ideai-capabilities/lib/db/index");
      db = dbModule.db;
    } catch (importError) {
      return {
        check: "Database Migration",
        status: "warning",
        message: "Database module not available - using local mode",
        fixSteps: [
          "Ensure DATABASE_URL is set in .env.local",
          "Or use local mode (no database required)",
        ],
      };
    }

    // Try to query the table - if it exists, migration passed
    await db.query.userServiceKeys.findFirst({
      limit: 1,
    });

    return {
      check: "Database Migration",
      status: "pass",
      message: "user_service_keys table exists - migration complete",
    };
  } catch (error) {
    if (error instanceof Error) {
      if (
        error.message.includes("does not exist") ||
        error.message.includes("relation")
      ) {
        return {
          check: "Database Migration",
          status: "fail",
          message: "user_service_keys table missing - migration needed",
          fixSteps: [
            "Click 'Run Migration Now' button below",
            "Or run: cd apps/ideai-capabilities && pnpm db:push",
          ],
        };
      }
      if (
        error.message.includes("ECONNREFUSED") ||
        error.message.includes("connect")
      ) {
        return {
          check: "Database Migration",
          status: "warning",
          message: "Cannot connect to database - check DATABASE_URL",
          fixSteps: [
            "Ensure database is running",
            "Check DATABASE_URL in .env.local",
            "Or use local mode (no database required)",
          ],
        };
      }
    }

    // Unknown error
    return {
      check: "Database Migration",
      status: "warning",
      message: "Database check failed - may need manual verification",
      fixSteps: [
        "Run: cd apps/ideai-capabilities && pnpm db:push",
        "Verify DATABASE_URL is correct",
      ],
    };
  }
}

/**
 * Check auth configuration
 */
async function checkAuthConfig(): Promise<SetupCheckResult> {
  const requiredEnvVars = ["BETTER_AUTH_SECRET", "BETTER_AUTH_URL"];

  const missing: string[] = [];
  for (const varName of requiredEnvVars) {
    if (!process.env[varName]) {
      missing.push(varName);
    }
  }

  if (missing.length === 0) {
    return {
      check: "Auth Configuration",
      status: "pass",
      message: "All auth env vars configured",
    };
  }

  return {
    check: "Auth Configuration",
    status: "warning",
    message: `Missing: ${missing.join(", ")}`,
    fixSteps: [
      "Set BETTER_AUTH_SECRET in .env.local",
      "Set BETTER_AUTH_URL (usually http://localhost:3018)",
    ],
  };
}

/**
 * Check if user has set up any service keys
 */
async function checkServiceKeysSetup(
  userId?: string,
): Promise<SetupCheckResult> {
  if (!userId) {
    return {
      check: "Service Keys Setup",
      status: "skip",
      message: "Not authenticated - skip key check (login to configure keys)",
    };
  }

  try {
    // Try to import - may fail if db not configured
    let getUserKeys;
    try {
      const keysModule =
        await import("../../ideai-capabilities/lib/services/user-keys");
      getUserKeys = keysModule.getUserKeys;
    } catch (importError) {
      return {
        check: "Service Keys Setup",
        status: "warning",
        message: "Key service not available - database may not be configured",
      };
    }

    const keys = await getUserKeys(userId);

    if (keys.length === 0) {
      return {
        check: "Service Keys Setup",
        status: "warning",
        message: "No service keys configured",
        fixSteps: [
          "Visit /settings/service-keys",
          "Add AI Gateway or OpenAI key",
          "Keys are encrypted and stored securely",
        ],
      };
    }

    return {
      check: "Service Keys Setup",
      status: "pass",
      message: `${keys.length} service key(s) configured`,
    };
  } catch (error) {
    return {
      check: "Service Keys Setup",
      status: "warning",
      message: "Cannot check keys (database may not be ready)",
    };
  }
}

/**
 * Check environment variable fallbacks
 */
async function checkEnvVarFallbacks(): Promise<SetupCheckResult> {
  const hasAiGateway = !!process.env.AI_GATEWAY_API_KEY;
  const hasOpenai = !!process.env.OPENAI_API_KEY;

  if (hasAiGateway || hasOpenai) {
    return {
      check: "Environment Variables",
      status: "pass",
      message: "API keys found in environment (fallback available)",
    };
  }

  return {
    check: "Environment Variables",
    status: "warning",
    message: "No API keys in environment (use database keys instead)",
    fixSteps: [
      "Add keys via /settings/service-keys (recommended)",
      "Or set AI_GATEWAY_API_KEY / OPENAI_API_KEY in .env.local",
    ],
  };
}

/**
 * Check key sync CLI setup
 */
async function checkKeySyncSetup(): Promise<SetupCheckResult> {
  const hasUserId = !!process.env.IDEAI_USER_ID;

  if (hasUserId) {
    return {
      check: "Key Sync CLI Setup",
      status: "pass",
      message: "IDEAI_USER_ID configured - CLI sync ready",
    };
  }

  return {
    check: "Key Sync CLI Setup",
    status: "warning",
    message: "IDEAI_USER_ID not set - CLI sync will prompt for user ID",
    fixSteps: [
      "Add IDEAI_USER_ID=your-user-id to .env.local",
      "Or use --user=USER_ID flag with pnpm key-sync",
    ],
  };
}

/**
 * Run all setup checks
 */
export async function runSetupChecks(userId?: string): Promise<SetupStatus> {
  const checks = await Promise.all([
    checkDatabaseMigration(),
    checkAuthConfig(),
    checkServiceKeysSetup(userId),
    checkEnvVarFallbacks(),
    checkKeySyncSetup(),
  ]);

  const hasFailures = checks.some((c) => c.status === "fail");
  const canProceed = !hasFailures; // Can proceed if no failures (warnings OK)

  return {
    allPassed: checks.every((c) => c.status === "pass"),
    checks,
    canProceed,
  };
}
