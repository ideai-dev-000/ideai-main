import postgres from 'postgres';
import { config } from 'dotenv';
import { readFileSync } from 'fs';

config({ path: '.env.local' });
config({ path: '.env' });

const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;

if (!connectionString) {
  console.error('No DATABASE_URL found');
  process.exit(1);
}

const sql = postgres(connectionString, {
  ssl: 'require',
  max: 1,
});

const createTableSQL = `
CREATE TABLE IF NOT EXISTS "chat_ownerships" (
  "id" TEXT PRIMARY KEY,
  "v0_chat_id" TEXT NOT NULL UNIQUE,
  "user_id" TEXT NOT NULL,
  "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
  CONSTRAINT "chat_ownerships_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id")
);

CREATE INDEX IF NOT EXISTS "chat_ownerships_user_id_idx" ON "chat_ownerships"("user_id");
CREATE INDEX IF NOT EXISTS "chat_ownerships_v0_chat_id_idx" ON "chat_ownerships"("v0_chat_id");
`;

try {
  console.log('Creating chat_ownerships table...');
  await sql.unsafe(createTableSQL);
  console.log('✅ Table created successfully!');
  await sql.end();
  process.exit(0);
} catch (error) {
  console.error('❌ Error:', error.message);
  await sql.end();
  process.exit(1);
}
