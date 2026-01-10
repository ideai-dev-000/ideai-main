import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

// Load .env.local first, then .env (dotenv doesn't override existing vars)
config({ path: ".env.local" });
config({ path: ".env" }); // Fallback to .env if .env.local doesn't exist

export default defineConfig({
  schema: "./lib/db/schema.ts",
  out: "./lib/db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    // biome-ignore lint: Forbidden non-null assertion.
    url: process.env.POSTGRES_URL || process.env.DATABASE_URL!,
  },
});
