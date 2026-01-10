/**
 * @fileoverview Database connection and setup for IdeaI User Module
 *
 * @module IdeAIUserDatabase
 * @description
 * Database connection using Drizzle ORM with PostgreSQL.
 * Exports database instance and schema for use throughout the module.
 *
 * @example
 * ```typescript
 * import { db } from "@repo/ideai-user/db";
 * import { users } from "@repo/ideai-user/schema";
 *
 * const user = await db.query.users.findFirst({
 *   where: eq(users.id, userId)
 * });
 * ```
 *
 * @see ./schema.ts - Database schema definitions
 */

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

/**
 * Database connection string
 * Defaults to local development database if not provided
 */
const connectionString =
  process.env.DATABASE_URL || "postgres://localhost:5432/ideai-user";

// Determine SSL config - check if connection string has sslmode or if it's a cloud DB
const needsSSL =
  connectionString.includes("sslmode=require") ||
  connectionString.includes("neon.tech") ||
  connectionString.includes("vercel-storage.com") ||
  connectionString.includes("supabase.co");

/**
 * PostgreSQL client instance
 * Connection pooling is handled automatically by postgres-js
 */
const client = postgres(connectionString, {
  max: 10, // Maximum number of connections in the pool
  ...(needsSSL && { ssl: "require" as const }),
});

/**
 * Drizzle database instance
 * Configured with schema for type-safe queries
 */
export const db = drizzle(client, { schema });

/**
 * Export schema for convenience
 */
export * from "./schema";
