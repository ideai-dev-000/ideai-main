import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

// Load environment variables
import { config } from "dotenv";
// Load .env.local first, then .env (dotenv doesn't override existing vars)
config({ path: ".env.local" });
config(); // Fallback to .env if .env.local doesn't exist

let db: any = null;

// Only initialize database if POSTGRES_URL is available
if (process.env.POSTGRES_URL) {
  console.log("🗄️  Using PostgreSQL database");
  const client = postgres(process.env.POSTGRES_URL);
  db = drizzle(client, { schema });
}

export default db;
