import { resolve } from "node:path";
import { config } from "dotenv";
import type { Config } from "drizzle-kit";

// Load .env.local first (Next.js convention), then .env
config({ path: resolve(process.cwd(), ".env.local") });
config(); // Also load .env if it exists

// Support multiple database URLs with easy toggling
// Priority: DATABASE_URL > DATABASE_LOCAL_URL/DATABASE_CLOUD_URL (based on USE_CLOUD_DB)
function getDatabaseUrl(): string {
  // If DATABASE_URL is explicitly set, use it (highest priority)
  if (process.env.DATABASE_URL) {
    return process.env.DATABASE_URL;
  }

  // Check if we should use cloud database
  const useCloudDb = process.env.USE_CLOUD_DB === "true";

  if (useCloudDb && process.env.DATABASE_CLOUD_URL) {
    return process.env.DATABASE_CLOUD_URL;
  }

  if (process.env.DATABASE_LOCAL_URL) {
    return process.env.DATABASE_LOCAL_URL;
  }

  // Fallback to default local database
  return "postgres://localhost:5432/workflow";
}

export default {
  schema: "./lib/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: getDatabaseUrl(),
  },
} satisfies Config;
