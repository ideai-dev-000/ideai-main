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
 * Uses the same DATABASE_URL/POSTGRES_URL as the consuming app to ensure
 * sessions and users are stored in the same database.
 *
 * CRITICAL: This MUST match the app's database connection for auth to work.
 * If the app uses a different database, auth sessions won't be found.
 *
 * Priority:
 * 1. DATABASE_URL (standard)
 * 2. POSTGRES_URL (some apps use this)
 * 3. Fallback to local development database
 */
const connectionString =
  process.env.DATABASE_URL ||
  process.env.POSTGRES_URL ||
  "postgres://localhost:5432/ideai";

/**
 * PostgreSQL client instance
 * Connection pooling is handled automatically by postgres-js
 */
const client = postgres(connectionString, {
  max: 10, // Maximum number of connections in the pool
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
