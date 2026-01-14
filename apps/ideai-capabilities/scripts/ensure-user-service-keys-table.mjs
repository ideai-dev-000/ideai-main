#!/usr/bin/env node
/**
 * Quick script to ensure user_service_keys table exists
 */
import postgres from "postgres";
import { config } from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load env vars
config({ path: join(__dirname, "../.env.local") });
config({ path: join(__dirname, "../.env") });

const connectionString =
  process.env.DATABASE_URL ||
  process.env.POSTGRES_URL ||
  "postgres://localhost:5432/workflow";

const sql = postgres(connectionString, { max: 1 });

try {
  console.log("Checking if user_service_keys table exists...");
  
  // Check if table exists
  const result = await sql`
    SELECT EXISTS (
      SELECT FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = 'user_service_keys'
    ) as exists
  `;
  
  const exists = result[0]?.exists === true;
  
  if (exists) {
    console.log("✅ user_service_keys table already exists");
  } else {
    console.log("Creating user_service_keys table...");
    
    await sql`
      CREATE TABLE "user_service_keys" (
        "id" text PRIMARY KEY NOT NULL,
        "user_id" text NOT NULL,
        "service_type" text NOT NULL,
        "encrypted_key" text NOT NULL,
        "key_prefix" text,
        "environment" text DEFAULT 'production',
        "vercel_project_id" text,
        "vercel_team_id" text,
        "vercel_env_id" text,
        "is_active" boolean DEFAULT true,
        "last_used_at" timestamp,
        "created_at" timestamp DEFAULT now() NOT NULL,
        "updated_at" timestamp DEFAULT now() NOT NULL
      )
    `;
    
    await sql`
      ALTER TABLE "user_service_keys" 
      ADD CONSTRAINT "user_service_keys_user_id_users_id_fk" 
      FOREIGN KEY ("user_id") 
      REFERENCES "public"."users"("id") 
      ON DELETE cascade 
      ON UPDATE no action
    `;
    
    await sql`
      CREATE UNIQUE INDEX "user_service_environment_idx" 
      ON "user_service_keys" ("user_id","service_type","environment")
    `;
    
    console.log("✅ user_service_keys table created successfully");
  }
  
  process.exit(0);
} catch (error) {
  console.error("❌ Error:", error.message);
  process.exit(1);
} finally {
  await sql.end();
}
