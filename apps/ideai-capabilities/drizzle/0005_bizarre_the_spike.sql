CREATE TABLE "anonymous_chat_logs" (
	"id" text PRIMARY KEY NOT NULL,
	"ip_address" text NOT NULL,
	"v0_chat_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "chat_ownerships" (
	"id" text PRIMARY KEY NOT NULL,
	"v0_chat_id" text NOT NULL,
	"user_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "chat_ownerships_v0_chat_id_unique" UNIQUE("v0_chat_id")
);
--> statement-breakpoint
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
);
--> statement-breakpoint
ALTER TABLE "chat_ownerships" ADD CONSTRAINT "chat_ownerships_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_service_keys" ADD CONSTRAINT "user_service_keys_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "user_service_environment_idx" ON "user_service_keys" ("user_id","service_type","environment");