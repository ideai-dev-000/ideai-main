import { config } from "dotenv";
import type { Config } from "drizzle-kit";

/**
 * Load environment variables for database connection
 *
 * Priority:
 * 1. .env.local - Local development database URL (not committed to git)
 * 2. .env - Fallback if .env.local doesn't exist
 *
 * This ensures local DATABASE_URL from .env.local is always used when present,
 * which is critical for Drizzle Studio to connect to the correct database.
 */
config({ path: ".env.local" }); // Load .env.local first (local dev settings)
config(); // Fallback to .env if .env.local doesn't exist

export default {
  schema: "./lib/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL || "postgres://localhost:5432/workflow",
  },
} satisfies Config;
