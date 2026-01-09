import { boolean, pgTable, text, timestamp } from "drizzle-orm/pg-core";

// Helper function for generating UUIDs (must be defined before use)
function generateUUID(): string {
  return Math.random().toString(36).substring(2, 15);
}

// Better Auth tables - minimal schema for app-builder
export const users = pgTable("users", {
  id: text("id").primaryKey(),
  name: text("name"),
  email: text("email").unique(),
  emailVerified: boolean("email_verified").notNull().default(false),
  image: text("image"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  // Anonymous user tracking
  isAnonymous: boolean("is_anonymous").default(false),
});

export const sessions = pgTable("sessions", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
});

export const accounts = pgTable("accounts", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const verifications = pgTable("verifications", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at"),
});

// Chat ownership tracking (for v0 SDK integration)
export const chat_ownerships = pgTable("chat_ownerships", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => generateUUID()),
  v0_chat_id: text("v0_chat_id").notNull().unique(),
  user_id: text("user_id")
    .notNull()
    .references(() => users.id),
  created_at: timestamp("created_at").notNull().defaultNow(),
});

// Anonymous chat logging (for rate limiting)
export const anonymous_chat_logs = pgTable("anonymous_chat_logs", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => generateUUID()),
  ip_address: text("ip_address").notNull(),
  v0_chat_id: text("v0_chat_id").notNull(),
  created_at: timestamp("created_at").notNull().defaultNow(),
});

export type User = typeof users.$inferSelect;
export type Session = typeof sessions.$inferSelect;
export type ChatOwnership = typeof chat_ownerships.$inferSelect;
export type AnonymousChatLog = typeof anonymous_chat_logs.$inferSelect;
