import { relations } from "drizzle-orm";
import { boolean, jsonb, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import type { IntegrationType } from "../types/integration";
import { generateId } from "../utils/id";

// Helper function for generating UUIDs
function generateUUID(): string {
  return Math.random().toString(36).substring(2, 15);
}

// Better Auth tables - minimal schema for ideai-vibecoder
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

// Workflow visibility type
export type WorkflowVisibility = "private" | "public";

// Workflows table with user association
export const workflows = pgTable("workflows", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => generateId()),
  name: text("name").notNull(),
  description: text("description"),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  // biome-ignore lint/suspicious/noExplicitAny: JSONB type - structure validated at application level
  nodes: jsonb("nodes").notNull().$type<any[]>(),
  // biome-ignore lint/suspicious/noExplicitAny: JSONB type - structure validated at application level
  edges: jsonb("edges").notNull().$type<any[]>(),
  visibility: text("visibility")
    .notNull()
    .default("private")
    .$type<WorkflowVisibility>(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Workflow executions table
export const workflowExecutions = pgTable("workflow_executions", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => generateId()),
  workflowId: text("workflow_id")
    .notNull()
    .references(() => workflows.id, { onDelete: "cascade" }),
  userId: text("user_id").references(() => users.id),
  status: text("status")
    .notNull()
    .$type<"pending" | "running" | "completed" | "failed" | "error">(),
  startedAt: timestamp("started_at"),
  completedAt: timestamp("completed_at"),
  // biome-ignore lint/suspicious/noExplicitAny: JSONB type - execution input stored as JSON
  input: jsonb("input").$type<any>(),
  // biome-ignore lint/suspicious/noExplicitAny: JSONB type - execution results stored as JSON
  result: jsonb("result").$type<any>(),
  error: text("error"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Workflow execution logs table
export const workflowExecutionLogs = pgTable("workflow_execution_logs", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => generateId()),
  executionId: text("execution_id")
    .notNull()
    .references(() => workflowExecutions.id, { onDelete: "cascade" }),
  nodeId: text("node_id"),
  level: text("level").notNull().$type<"info" | "warning" | "error">(),
  status: text("status").$type<"pending" | "running" | "success" | "error">(),
  message: text("message").notNull(),
  // biome-ignore lint/suspicious/noExplicitAny: JSONB type - log input stored as JSON
  input: jsonb("input").$type<any>(),
  // biome-ignore lint/suspicious/noExplicitAny: JSONB type - log output stored as JSON
  output: jsonb("output").$type<any>(),
  // biome-ignore lint/suspicious/noExplicitAny: JSONB type - log data stored as JSON
  data: jsonb("data").$type<any>(),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
});

// Relations for workflow executions
export const workflowExecutionsRelations = relations(
  workflowExecutions,
  ({ one, many }) => ({
    workflow: one(workflows, {
      fields: [workflowExecutions.workflowId],
      references: [workflows.id],
    }),
    logs: many(workflowExecutionLogs),
  }),
);

// Integrations table for storing user credentials
export const integrations = pgTable("integrations", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => generateId()),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  name: text("name").notNull(),
  type: text("type").notNull().$type<IntegrationType>(),
  // biome-ignore lint/suspicious/noExplicitAny: JSONB type - encrypted credentials stored as JSON
  config: jsonb("config").notNull().$type<any>(),
  // Whether this integration was created via OAuth (managed by app) vs manual entry
  isManaged: boolean("is_managed").default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// API keys table for storing user API keys
export const apiKeys = pgTable("api_keys", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => generateId()),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  name: text("name").notNull(),
  // Encrypted API key value
  encryptedKey: text("encrypted_key").notNull(),
  // Hash of the API key for quick lookups
  keyHash: text("key_hash"),
  // Last 4 characters for display purposes
  lastFour: text("last_four"),
  // Last used timestamp for tracking API usage
  lastUsedAt: timestamp("last_used_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type User = typeof users.$inferSelect;
export type Session = typeof sessions.$inferSelect;
export type ChatOwnership = typeof chat_ownerships.$inferSelect;
export type AnonymousChatLog = typeof anonymous_chat_logs.$inferSelect;
export type Workflow = typeof workflows.$inferSelect;
export type WorkflowExecution = typeof workflowExecutions.$inferSelect;
export type WorkflowExecutionLog = typeof workflowExecutionLogs.$inferSelect;
export type Integration = typeof integrations.$inferSelect;
export type ApiKey = typeof apiKeys.$inferSelect;
