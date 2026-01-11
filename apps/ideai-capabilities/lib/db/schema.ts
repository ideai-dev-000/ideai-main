import { relations } from "drizzle-orm";
import {
  boolean,
  jsonb,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import type { IntegrationType } from "../types/integration";
import { generateId } from "../utils/id";

// Better Auth tables
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

// Helper function for generating UUIDs
function generateUUID(): string {
  return Math.random().toString(36).substring(2, 15);
}

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

// Workflow executions table to track workflow runs
export const workflowExecutions = pgTable("workflow_executions", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => generateId()),
  workflowId: text("workflow_id")
    .notNull()
    .references(() => workflows.id),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  status: text("status")
    .notNull()
    .$type<"pending" | "running" | "success" | "error" | "cancelled">(),
  // biome-ignore lint/suspicious/noExplicitAny: JSONB type - structure validated at application level
  input: jsonb("input").$type<Record<string, any>>(),
  // biome-ignore lint/suspicious/noExplicitAny: JSONB type - structure validated at application level
  output: jsonb("output").$type<any>(),
  error: text("error"),
  startedAt: timestamp("started_at").notNull().defaultNow(),
  completedAt: timestamp("completed_at"),
  duration: text("duration"), // Duration in milliseconds
});

// Workflow execution logs to track individual node executions
export const workflowExecutionLogs = pgTable("workflow_execution_logs", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => generateId()),
  executionId: text("execution_id")
    .notNull()
    .references(() => workflowExecutions.id),
  nodeId: text("node_id").notNull(),
  nodeName: text("node_name").notNull(),
  nodeType: text("node_type").notNull(),
  status: text("status")
    .notNull()
    .$type<"pending" | "running" | "success" | "error">(),
  // biome-ignore lint/suspicious/noExplicitAny: JSONB type - structure validated at application level
  input: jsonb("input").$type<any>(),
  // biome-ignore lint/suspicious/noExplicitAny: JSONB type - structure validated at application level
  output: jsonb("output").$type<any>(),
  error: text("error"),
  startedAt: timestamp("started_at").notNull().defaultNow(),
  completedAt: timestamp("completed_at"),
  duration: text("duration"), // Duration in milliseconds
  timestamp: timestamp("timestamp").notNull().defaultNow(),
});

// API Keys table for webhook authentication
export const apiKeys = pgTable("api_keys", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => generateId()),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  name: text("name"), // Optional label for the API key
  keyHash: text("key_hash").notNull(), // Store hashed version of the key
  keyPrefix: text("key_prefix").notNull(), // Store first few chars for display (e.g., "wf_abc...")
  createdAt: timestamp("created_at").notNull().defaultNow(),
  lastUsedAt: timestamp("last_used_at"),
});

// User Service Keys table for storing encrypted API keys (AI Gateway, OpenAI, etc.)
export const userServiceKeys = pgTable(
  "user_service_keys",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => generateId()),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    serviceType: text("service_type").notNull(), // 'ai_gateway', 'openai', 'v0', etc.
    encryptedKey: text("encrypted_key").notNull(), // Encrypted value using INTEGRATION_ENCRYPTION_KEY
    keyPrefix: text("key_prefix"), // Last 4-6 chars for display (e.g., "...xyz")
    environment: text("environment").default("production"), // 'local', 'production', 'preview'
    vercelProjectId: text("vercel_project_id"), // If synced to Vercel project
    vercelTeamId: text("vercel_team_id"),
    vercelEnvId: text("vercel_env_id"), // Vercel env var ID if synced
    isActive: boolean("is_active").default(true),
    lastUsedAt: timestamp("last_used_at"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => ({
    // Unique constraint: one key per user/service/environment
    userServiceEnvironmentIdx: uniqueIndex("user_service_environment_idx").on(
      table.userId,
      table.serviceType,
      table.environment,
    ),
  }),
);

// Relations
export const workflowExecutionsRelations = relations(
  workflowExecutions,
  ({ one }) => ({
    workflow: one(workflows, {
      fields: [workflowExecutions.workflowId],
      references: [workflows.id],
    }),
  }),
);

export type User = typeof users.$inferSelect;
export type Session = typeof sessions.$inferSelect;
export type ChatOwnership = typeof chat_ownerships.$inferSelect;
export type AnonymousChatLog = typeof anonymous_chat_logs.$inferSelect;
export type Workflow = typeof workflows.$inferSelect;
export type NewWorkflow = typeof workflows.$inferInsert;
export type Integration = typeof integrations.$inferSelect;
export type NewIntegration = typeof integrations.$inferInsert;
export type WorkflowExecution = typeof workflowExecutions.$inferSelect;
export type NewWorkflowExecution = typeof workflowExecutions.$inferInsert;
export type WorkflowExecutionLog = typeof workflowExecutionLogs.$inferSelect;
export type NewWorkflowExecutionLog = typeof workflowExecutionLogs.$inferInsert;
export type ApiKey = typeof apiKeys.$inferSelect;
export type NewApiKey = typeof apiKeys.$inferInsert;
