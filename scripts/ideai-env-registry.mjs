#!/usr/bin/env node

/**
 * @fileoverview Environment Variable Registry
 * @module ideai-env-registry
 * @description Centralized registry of all environment variables with categorization
 * 
 * This registry defines:
 * - Shared variables (same value across apps)
 * - App-specific variables (different per app)
 * - Client-side variables (NEXT_PUBLIC_* - exposed to browser)
 * - Required vs optional status
 */

/**
 * Environment Variable Registry
 * 
 * Categories:
 * - shared: Same value should be used across multiple apps
 * - app-specific: Different value per app (e.g., ports, URLs)
 * - client-side: NEXT_PUBLIC_* - exposed to browser (safe for public access)
 * - required: Must be set for app to work
 * - optional: Nice to have, app can work without
 */
export const envVarRegistry = {
  // ============================================
  // SHARED VARIABLES (Same across apps)
  // ============================================
  DATABASE_URL: {
    category: "shared",
    clientSide: false,
    required: true,
    description: "PostgreSQL connection string - MUST be same across all apps using shared database",
    apps: ["ideai-capabilities", "ideai-workflow"],
    example: "postgresql://user:password@localhost:5432/workflow_builder",
  },
  
  AI_GATEWAY_API_KEY: {
    category: "shared",
    clientSide: false,
    required: false,
    description: "Vercel AI Gateway API key for AI workflow generation",
    apps: ["ideai-capabilities", "ideai-workflow", "lead-processing-agent"],
    example: "vck_...",
  },
  
  OPENAI_API_KEY: {
    category: "shared",
    clientSide: false,
    required: false,
    description: "OpenAI API key (fallback if AI_GATEWAY_API_KEY not set)",
    apps: ["ideai-capabilities"],
    example: "sk-...",
  },
  
  BETTER_AUTH_SECRET: {
    category: "shared",
    clientSide: false,
    required: true,
    description: "Better Auth secret - MUST be same across apps for unified auth",
    apps: ["ideai-capabilities", "ideai-workflow"],
    generateCommand: "openssl rand -base64 32",
    example: "auto-generated",
  },
  
  INTEGRATION_ENCRYPTION_KEY: {
    category: "shared",
    clientSide: false,
    required: true,
    description: "Encryption key for storing integration credentials in database",
    apps: ["ideai-capabilities", "ideai-workflow"],
    generateCommand: "node -e \"console.log(require('crypto').randomBytes(32).toString('hex'))\"",
    example: "auto-generated",
  },
  
  // Shared integration keys (can be set in UI or env)
  SLACK_API_KEY: {
    category: "shared",
    clientSide: false,
    required: false,
    description: "Slack bot token - can also be set in UI",
    apps: ["ideai-capabilities"],
    example: "xoxb-...",
  },
  
  LINEAR_API_KEY: {
    category: "shared",
    clientSide: false,
    required: false,
    description: "Linear API key - can also be set in UI",
    apps: ["ideai-capabilities"],
    example: "lin_api_...",
  },
  
  LINEAR_TEAM_ID: {
    category: "shared",
    clientSide: false,
    required: false,
    description: "Linear team ID - can also be set in UI",
    apps: ["ideai-capabilities"],
    example: "team-id",
  },
  
  RESEND_API_KEY: {
    category: "shared",
    clientSide: false,
    required: false,
    description: "Resend API key - can also be set in UI",
    apps: ["ideai-capabilities"],
    example: "re_...",
  },
  
  RESEND_FROM_EMAIL: {
    category: "shared",
    clientSide: false,
    required: false,
    description: "Resend from email - can also be set in UI",
    apps: ["ideai-capabilities"],
    example: "noreply@example.com",
  },
  
  FIRECRAWL_API_KEY: {
    category: "shared",
    clientSide: false,
    required: false,
    description: "Firecrawl API key - can also be set in UI",
    apps: ["ideai-capabilities"],
    example: "fc-...",
  },
  
  GITHUB_CLIENT_ID: {
    category: "shared",
    clientSide: false,
    required: false,
    description: "GitHub OAuth client ID (server-side)",
    apps: ["ideai-capabilities"],
    example: "Iv1.abc123...",
  },
  
  GITHUB_CLIENT_SECRET: {
    category: "shared",
    clientSide: false,
    required: false,
    description: "GitHub OAuth client secret (server-side only)",
    apps: ["ideai-capabilities"],
    example: "secret_...",
  },
  
  GOOGLE_CLIENT_ID: {
    category: "shared",
    clientSide: false,
    required: false,
    description: "Google OAuth client ID (server-side)",
    apps: ["ideai-capabilities"],
    example: "123456-abc.apps.googleusercontent.com",
  },
  
  GOOGLE_CLIENT_SECRET: {
    category: "shared",
    clientSide: false,
    required: false,
    description: "Google OAuth client secret (server-side only)",
    apps: ["ideai-capabilities"],
    example: "secret_...",
  },
  
  VERCEL_CLIENT_ID: {
    category: "shared",
    clientSide: false,
    required: false,
    description: "Vercel OAuth client ID for AI Gateway User Keys",
    apps: ["ideai-capabilities"],
    example: "client-id",
  },
  
  VERCEL_CLIENT_SECRET: {
    category: "shared",
    clientSide: false,
    required: false,
    description: "Vercel OAuth client secret",
    apps: ["ideai-capabilities"],
    example: "secret_...",
  },
  
  // ============================================
  // APP-SPECIFIC VARIABLES (Different per app)
  // ============================================
  BETTER_AUTH_URL: {
    category: "app-specific",
    clientSide: false,
    required: true,
    description: "Auth URL - app-specific (different port per app)",
    apps: {
      "ideai-capabilities": "http://localhost:3018",
      "ideai-workflow": "http://localhost:3013",
    },
  },
  
  NEXT_PUBLIC_APP_URL: {
    category: "app-specific",
    clientSide: true,
    required: false,
    description: "Public app URL - exposed to browser, app-specific",
    apps: {
      "ideai-capabilities": "http://localhost:3018",
      "ideai-workflow": "http://localhost:3013",
    },
  },
  
  // ============================================
  // CLIENT-SIDE VARIABLES (NEXT_PUBLIC_*)
  // ============================================
  NEXT_PUBLIC_AUTH_PROVIDERS: {
    category: "shared",
    clientSide: true,
    required: false,
    description: "Comma-separated list of enabled auth providers (exposed to browser)",
    apps: ["ideai-capabilities"],
    example: "github,google,vercel",
  },
  
  NEXT_PUBLIC_GITHUB_CLIENT_ID: {
    category: "shared",
    clientSide: true,
    required: false,
    description: "GitHub OAuth client ID (client-side - safe to expose)",
    apps: ["ideai-capabilities"],
    example: "Iv1.abc123...",
    note: "Can be different from server-side GITHUB_CLIENT_ID if using separate OAuth apps",
  },
  
  NEXT_PUBLIC_GOOGLE_CLIENT_ID: {
    category: "shared",
    clientSide: true,
    required: false,
    description: "Google OAuth client ID (client-side - safe to expose)",
    apps: ["ideai-capabilities"],
    example: "123456-abc.apps.googleusercontent.com",
    note: "Can be different from server-side GOOGLE_CLIENT_ID if using separate OAuth apps",
  },
  
  NEXT_PUBLIC_VERCEL_CLIENT_ID: {
    category: "shared",
    clientSide: true,
    required: false,
    description: "Vercel OAuth client ID (client-side - safe to expose)",
    apps: ["ideai-capabilities"],
    example: "client-id",
    note: "Can be different from server-side VERCEL_CLIENT_ID if using separate OAuth apps",
  },
  
  NEXT_PUBLIC_AI_GATEWAY_MANAGED_KEYS_ENABLED: {
    category: "shared",
    clientSide: true,
    required: false,
    description: "Enable AI Gateway managed keys feature (exposed to browser)",
    apps: ["ideai-capabilities"],
    example: "true",
  },
  
  // ============================================
  // APP-SPECIFIC ONLY VARIABLES
  // ============================================
  VERCEL_TOKEN: {
    category: "app-specific",
    clientSide: false,
    required: false,
    description: "Vercel API token for Cloud Manager (web app only)",
    apps: ["web"],
    example: "vercel_token_...",
  },
};

/**
 * Get variables for a specific app
 */
export function getVariablesForApp(appName) {
  const vars = {};
  
  for (const [key, config] of Object.entries(envVarRegistry)) {
    // Check if this variable applies to the app
    let appliesToApp = false;
    
    if (Array.isArray(config.apps)) {
      appliesToApp = config.apps.includes(appName);
    } else if (typeof config.apps === "object") {
      appliesToApp = appName in config.apps;
    }
    
    if (appliesToApp) {
      vars[key] = {
        ...config,
        // If app-specific object, get the value
        defaultValue: typeof config.apps === "object" ? config.apps[appName] : undefined,
      };
    }
  }
  
  return vars;
}

/**
 * Get shared variables that should be synced across apps
 */
export function getSharedVariables() {
  const shared = {};
  
  for (const [key, config] of Object.entries(envVarRegistry)) {
    if (config.category === "shared") {
      shared[key] = config;
    }
  }
  
  return shared;
}

/**
 * Get client-side variables (NEXT_PUBLIC_*)
 */
export function getClientSideVariables() {
  const clientSide = {};
  
  for (const [key, config] of Object.entries(envVarRegistry)) {
    if (config.clientSide === true) {
      clientSide[key] = config;
    }
  }
  
  return clientSide;
}


