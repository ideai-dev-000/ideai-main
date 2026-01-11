/**
 * Step input enricher - adds API keys and credentials to step inputs
 * For test runs: uses user's stored credentials
 * For production: uses system environment variables
 */

export type CredentialSource = "user" | "system";

export type EnvVarConfig = {
  LINEAR_API_KEY?: string;
  LINEAR_TEAM_ID?: string;
  RESEND_API_KEY?: string;
  RESEND_FROM_EMAIL?: string;
  SLACK_API_KEY?: string;
  OPENAI_API_KEY?: string;
  AI_GATEWAY_API_KEY?: string;
  DATABASE_URL?: string;
  FIRECRAWL_API_KEY?: string;
};

/**
 * Get credentials based on source
 * If userId provided, tries to fetch from user_service_keys first, then falls back to env vars
 */
export async function getCredentials(
  source: CredentialSource,
  userEnvVars?: EnvVarConfig,
  userId?: string,
): Promise<EnvVarConfig> {
  if (source === "user" && userEnvVars) {
    return userEnvVars;
  }

  // Base config from environment variables
  const baseConfig: EnvVarConfig = {
    LINEAR_API_KEY: process.env.LINEAR_API_KEY,
    LINEAR_TEAM_ID: process.env.LINEAR_TEAM_ID,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    RESEND_FROM_EMAIL: process.env.RESEND_FROM_EMAIL,
    SLACK_API_KEY: process.env.SLACK_API_KEY,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    AI_GATEWAY_API_KEY: process.env.AI_GATEWAY_API_KEY,
    DATABASE_URL: process.env.DATABASE_URL,
    FIRECRAWL_API_KEY: process.env.FIRECRAWL_API_KEY,
  };

  // If userId provided, try to get user keys first (overrides env vars)
  if (userId && source === "user") {
    try {
      const { getUserKey } = await import("@/lib/services/user-keys");
      const userAiGateway = await getUserKey(
        userId,
        "ai_gateway",
        "production",
      );
      const userOpenai = await getUserKey(userId, "openai", "production");
      const userFirecrawl = await getUserKey(userId, "firecrawl", "production");

      if (userAiGateway) baseConfig.AI_GATEWAY_API_KEY = userAiGateway;
      if (userOpenai) baseConfig.OPENAI_API_KEY = userOpenai;
      if (userFirecrawl) baseConfig.FIRECRAWL_API_KEY = userFirecrawl;
    } catch (error) {
      console.error("[getCredentials] Failed to load user keys:", error);
      // Continue with env vars as fallback
    }
  }

  return baseConfig;
}

/**
 * Enrich step input with necessary credentials based on action type
 */
export function enrichStepInput(
  actionType: string,
  input: Record<string, unknown>,
  credentials: EnvVarConfig,
): Record<string, unknown> {
  const enrichedInput = { ...input };

  const actionHandlers: Record<string, () => void> = {
    "Create Ticket": () => enrichLinearCredentials(enrichedInput, credentials),
    "Find Issues": () => enrichLinearCredentials(enrichedInput, credentials),
    "Send Email": () => enrichResendCredentials(enrichedInput, credentials),
    "Send Slack Message": () =>
      enrichSlackCredentials(enrichedInput, credentials),
    "Generate Text": () => enrichAICredentials(enrichedInput, credentials),
    "Generate Image": () => enrichAICredentials(enrichedInput, credentials),
    "Database Query": () =>
      enrichDatabaseCredentials(enrichedInput, credentials),
    Scrape: () => enrichFirecrawlCredentials(enrichedInput, credentials),
    Search: () => enrichFirecrawlCredentials(enrichedInput, credentials),
  };

  const handler = actionHandlers[actionType];
  if (handler) {
    handler();
  }

  return enrichedInput;
}

function enrichLinearCredentials(
  input: Record<string, unknown>,
  credentials: EnvVarConfig,
): void {
  if (credentials.LINEAR_API_KEY) {
    input.apiKey = credentials.LINEAR_API_KEY;
  }
  if (credentials.LINEAR_TEAM_ID) {
    input.teamId = credentials.LINEAR_TEAM_ID;
  }
}

function enrichResendCredentials(
  input: Record<string, unknown>,
  credentials: EnvVarConfig,
): void {
  if (credentials.RESEND_API_KEY) {
    input.apiKey = credentials.RESEND_API_KEY;
  }
  if (credentials.RESEND_FROM_EMAIL) {
    input.fromEmail = credentials.RESEND_FROM_EMAIL;
  }
}

function enrichSlackCredentials(
  input: Record<string, unknown>,
  credentials: EnvVarConfig,
): void {
  if (credentials.SLACK_API_KEY) {
    input.apiKey = credentials.SLACK_API_KEY;
  }
}

function enrichAICredentials(
  input: Record<string, unknown>,
  credentials: EnvVarConfig,
): void {
  if (credentials.AI_GATEWAY_API_KEY) {
    input.apiKey = credentials.AI_GATEWAY_API_KEY;
  }
}

function enrichDatabaseCredentials(
  input: Record<string, unknown>,
  credentials: EnvVarConfig,
): void {
  if (credentials.DATABASE_URL) {
    input.databaseUrl = credentials.DATABASE_URL;
  }
}

function enrichFirecrawlCredentials(
  input: Record<string, unknown>,
  credentials: EnvVarConfig,
): void {
  if (credentials.FIRECRAWL_API_KEY) {
    input.apiKey = credentials.FIRECRAWL_API_KEY;
  }
}
