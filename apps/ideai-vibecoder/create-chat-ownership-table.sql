-- Create chat_ownerships table for vibecoder
CREATE TABLE IF NOT EXISTS "chat_ownerships" (
  "id" TEXT PRIMARY KEY,
  "v0_chat_id" TEXT NOT NULL UNIQUE,
  "user_id" TEXT NOT NULL,
  "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
  CONSTRAINT "chat_ownerships_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id")
);

CREATE INDEX IF NOT EXISTS "chat_ownerships_user_id_idx" ON "chat_ownerships"("user_id");
CREATE INDEX IF NOT EXISTS "chat_ownerships_v0_chat_id_idx" ON "chat_ownerships"("v0_chat_id");
