/**
 * @fileoverview Drizzle ORM configuration for IdeaI User Module
 *
 * @module DrizzleConfig
 * @description
 * Configuration for database migrations and schema management.
 * Uses PostgreSQL with Drizzle Kit for schema generation and migrations.
 *
 * @see https://orm.drizzle.team/docs/kit-docs/overview
 */

import type { Config } from "drizzle-kit";

export default {
  schema: "./src/lib/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL || "postgres://localhost:5432/ideai-user",
  },
} satisfies Config;
