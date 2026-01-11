import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import {
  accounts,
  anonymous_chat_logs,
  chat_ownerships,
  sessions,
  users,
  verifications,
} from "./schema";

// Construct schema object for drizzle
const schema = {
  users,
  sessions,
  accounts,
  verifications,
  chat_ownerships,
  anonymous_chat_logs,
};

// Unified database connection - same as capabilities app
// This enables shared user accounts and sessions across IdeaI apps
const connectionString =
  process.env.DATABASE_URL ||
  process.env.POSTGRES_URL ||
  "postgres://localhost:5432/ideai";

// Determine SSL config - check if connection string has sslmode or if it's a cloud DB
const needsSSL =
  connectionString.includes("sslmode=require") ||
  connectionString.includes("neon.tech") ||
  connectionString.includes("vercel-storage.com") ||
  connectionString.includes("supabase.co");

const postgresConfig = {
  max: 10,
  connect_timeout: 5, // 5 second connection timeout
  idle_timeout: 30, // 30 second idle timeout
  ...(needsSSL && { ssl: "require" as const }),
};

// For migrations
export const migrationClient = postgres(connectionString, {
  max: 1,
  connect_timeout: 5, // 5 second connection timeout
  ...(needsSSL && { ssl: "require" as const }),
});

// Use global singleton to prevent connection exhaustion during HMR
const globalForDb = globalThis as unknown as {
  queryClient: ReturnType<typeof postgres> | undefined;
  db: PostgresJsDatabase<typeof schema> | undefined;
};

// For queries - reuse connection in development
const queryClient =
  globalForDb.queryClient ?? postgres(connectionString, postgresConfig);
export const db = globalForDb.db ?? drizzle(queryClient, { schema });

if (process.env.NODE_ENV !== "production") {
  globalForDb.queryClient = queryClient;
  globalForDb.db = db;
}
