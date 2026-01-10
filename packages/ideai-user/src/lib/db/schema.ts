/**
 * @fileoverview Unified database schema for IdeaI User Module
 *
 * @module IdeAIUserSchema
 * @description
 * Centralized schema for all user, auth, and capability tables.
 * This schema supports modular capabilities (workflows, vibecoder, etc.)
 * while maintaining semantic naming conventions and consistent patterns.
 *
 * Core Tables:
 * - users: User accounts with anonymous support
 * - sessions: Authentication sessions
 * - accounts: OAuth/linked accounts (GitHub, Google, email/password)
 * - verifications: Email/phone verification codes
 * - user_preferences: User settings and preferences
 * - user_roles: Role-based access control (for future multi-tenancy)
 * - capability_registry: Dynamic capability discovery
 *
 * Capability Tables:
 * - workflows: Workflow definitions
 * - workflow_executions: Workflow execution history
 * - workflow_execution_logs: Detailed execution logs
 * - workflow_integrations: Integration credentials
 * - workflow_api_keys: API keys for webhooks
 * - code_projects: Code generation projects
 * - code_chat_ownerships: v0 SDK chat ownership tracking
 * - code_anonymous_logs: Anonymous usage tracking
 *
 * @example
 * ```typescript
 * import { db } from "@repo/ideai-user/db";
 * import { users, workflows } from "@repo/ideai-user/schema";
 *
 * const user = await db.query.users.findFirst({
 *   where: eq(users.id, userId)
 * });
 * ```
 *
 * @see ./index.ts - Database connection
 * @see ../auth.ts - Auth service using this schema
 */

import { relations } from "drizzle-orm";
import {
  boolean,
  jsonb,
  pgTable,
  text,
  timestamp,
  unique,
} from "drizzle-orm/pg-core";

/**
 * Helper function to generate unique IDs
 * Uses nanoid-like generation for consistent ID format
 */
function generateId(): string {
  return `usr_${Math.random().toString(36).substring(2, 15)}${Date.now().toString(36)}`;
}

// ============================================================================
// CORE USER TABLES
// ============================================================================

/**
 * Users table - Central user accounts for all IdeaI apps
 *
 * @description
 * Stores user account information. Supports both authenticated and anonymous users.
 * Anonymous users are temporary accounts created for "try before sign up" flows.
 *
 * All capability tables reference this table via userId.
 */
export const users = pgTable("users", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => generateId()),
  name: text("name"),
  email: text("email").unique(),
  emailVerified: boolean("email_verified").notNull().default(false),
  image: text("image"), // Profile picture URL
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  // Anonymous user tracking - enables "try before sign up" flow
  isAnonymous: boolean("is_anonymous").notNull().default(false),
});

/**
 * Sessions table - Authentication sessions
 *
 * @description
 * Stores active authentication sessions. Sessions work across all IdeaI apps
 * when using shared domain (e.g., *.myui.space subdomains).
 */
export const sessions = pgTable("sessions", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
});

/**
 * Accounts table - OAuth/linked accounts
 *
 * @description
 * Stores linked authentication accounts (GitHub, Google, email/password).
 * Users can have multiple accounts linked to their user record.
 */
export const accounts = pgTable("accounts", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(), // Provider's user ID
  providerId: text("provider_id").notNull(), // e.g., "github", "google", "credential"
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"), // Hashed password for email/password auth
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

/**
 * Verifications table - Email/phone verification codes
 *
 * @description
 * Stores verification codes for email and phone number verification.
 * Codes expire after a set time period.
 */
export const verifications = pgTable("verifications", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(), // Email or phone number
  value: text("value").notNull(), // Verification code
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at"),
});

// ============================================================================
// ENHANCED USER TABLES
// ============================================================================

/**
 * User preferences table - User settings and preferences
 *
 * @description
 * Stores user preferences like theme, language, and notification settings.
 * One-to-one relationship with users table.
 */
export const userPreferences = pgTable("user_preferences", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => generateId()),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" })
    .unique(),
  theme: text("theme")
    .notNull()
    .default("system")
    .$type<"light" | "dark" | "system">(),
  language: text("language").notNull().default("en"),
  notifications: jsonb("notifications")
    .$type<Record<string, boolean>>()
    .default({}),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

/**
 * User roles table - Role-based access control
 *
 * @description
 * Stores user roles for future RBAC implementation.
 * Supports app-specific roles (e.g., "admin" in workflows, "viewer" in vibecoder).
 */
export const userRoles = pgTable("user_roles", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => generateId()),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  role: text("role").notNull(), // e.g., "admin", "user", "viewer"
  scope: text("scope"), // App-specific scope (e.g., "workflows", "vibecoder")
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// ============================================================================
// CAPABILITY REGISTRY
// ============================================================================

/**
 * Capability registry table - Dynamic capability discovery
 *
 * @description
 * Allows IdeaI to discover and enable capabilities dynamically.
 * Capabilities register themselves with their schema definitions,
 * enabling plugin-based architecture without code changes.
 *
 * @example
 * ```typescript
 * // Register a new capability
 * await db.insert(capabilityRegistry).values({
 *   capabilityKey: "workflows",
 *   capabilityName: "Workflows",
 *   description: "Workflow automation",
 *   enabled: true,
 *   schema: {
 *     itemsTable: "workflows",
 *     executionsTable: "workflow_executions",
 *     fields: { ... }
 *   }
 * });
 * ```
 */
export const capabilityRegistry = pgTable("capability_registry", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => generateId()),
  capabilityKey: text("capability_key").notNull().unique(), // e.g., "workflows", "vibecoder"
  capabilityName: text("capability_name").notNull(), // Display name
  description: text("description").notNull(),
  enabled: boolean("enabled").notNull().default(true),
  schema: jsonb("schema").notNull().$type<{
    itemsTable: string;
    executionsTable?: string;
    logsTable?: string;
    fields: Record<string, unknown>;
  }>(),
  config: jsonb("config").$type<Record<string, unknown>>().default({}),
  version: text("version").notNull().default("1.0.0"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// ============================================================================
// CAPABILITY: WORKFLOWS
// ============================================================================

/**
 * Workflow visibility type
 */
export type WorkflowVisibility = "private" | "public" | "team";

/**
 * Workflows table - User's workflow definitions
 *
 * @description
 * Stores workflow definitions created by users. Workflows contain nodes and edges
 * that define the automation logic.
 */
export const workflows = pgTable("workflows", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => generateId()),
  name: text("name").notNull(),
  description: text("description"),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
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

/**
 * Workflow executions table - Workflow execution history
 *
 * @description
 * Tracks each time a workflow is executed, storing input, output, and status.
 */
export const workflowExecutions = pgTable("workflow_executions", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => generateId()),
  workflowId: text("workflow_id")
    .notNull()
    .references(() => workflows.id, { onDelete: "cascade" }),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
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

/**
 * Workflow execution logs table - Detailed node execution logs
 *
 * @description
 * Stores detailed logs for each node execution within a workflow run.
 * Useful for debugging and understanding execution flow.
 */
export const workflowExecutionLogs = pgTable("workflow_execution_logs", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => generateId()),
  executionId: text("execution_id")
    .notNull()
    .references(() => workflowExecutions.id, { onDelete: "cascade" }),
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

/**
 * Workflow integrations table - Integration credentials
 *
 * @description
 * Stores user's integration credentials (Slack, Linear, GitHub, etc.)
 * Credentials are encrypted before storage.
 */
export const workflowIntegrations = pgTable("workflow_integrations", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => generateId()),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(), // Display name
  type: text("type").notNull(), // e.g., "slack", "linear", "github"
  // biome-ignore lint/suspicious/noExplicitAny: JSONB type - encrypted credentials stored as JSON
  config: jsonb("config").notNull().$type<any>(),
  // Whether this integration was created via OAuth (managed by app) vs manual entry
  isManaged: boolean("is_managed").default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

/**
 * Workflow API keys table - API keys for webhook authentication
 *
 * @description
 * Stores API keys for programmatic access to workflows (e.g., webhooks).
 * Keys are hashed before storage, with a prefix stored for display.
 */
export const workflowApiKeys = pgTable("workflow_api_keys", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => generateId()),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  name: text("name"), // Optional label for the API key
  keyHash: text("key_hash").notNull(), // Store hashed version of the key
  keyPrefix: text("key_prefix").notNull(), // Store first few chars for display (e.g., "wf_abc...")
  createdAt: timestamp("created_at").notNull().defaultNow(),
  lastUsedAt: timestamp("last_used_at"),
});

// ============================================================================
// CAPABILITY: VIBECODER
// ============================================================================

/**
 * Code project visibility type
 */
export type CodeProjectVisibility = "private" | "public" | "team";

/**
 * Code projects table - Code generation projects
 *
 * @description
 * Stores user's code generation projects. Projects are created via v0 SDK
 * and contain generated code structures.
 */
export const codeProjects = pgTable("code_projects", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => generateId()),
  name: text("name").notNull(),
  description: text("description"),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  v0ChatId: text("v0_chat_id"), // v0 SDK chat ID
  // biome-ignore lint/suspicious/noExplicitAny: JSONB type - structure validated at application level
  code: jsonb("code").$type<any>(), // Generated code structure
  visibility: text("visibility")
    .notNull()
    .default("private")
    .$type<CodeProjectVisibility>(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

/**
 * Code chat ownerships table - v0 SDK chat ownership tracking
 *
 * @description
 * Tracks ownership of v0 SDK chats to associate them with user accounts.
 */
export const codeChatOwnerships = pgTable("code_chat_ownerships", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => generateId()),
  v0ChatId: text("v0_chat_id").notNull().unique(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  projectId: text("project_id").references(() => codeProjects.id, {
    onDelete: "set null",
  }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

/**
 * Code anonymous logs table - Anonymous usage tracking
 *
 * @description
 * Tracks anonymous usage for rate limiting and analytics.
 * Used to prevent abuse before users sign up.
 */
export const codeAnonymousLogs = pgTable("code_anonymous_logs", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => generateId()),
  ipAddress: text("ip_address").notNull(),
  v0ChatId: text("v0_chat_id").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// ============================================================================
// RELATIONS
// ============================================================================

/**
 * Users relations - Define relationships for Drizzle queries
 */
export const usersRelations = relations(users, ({ many, one }) => ({
  sessions: many(sessions),
  accounts: many(accounts),
  preferences: one(userPreferences),
  roles: many(userRoles),
  workflows: many(workflows),
  workflowExecutions: many(workflowExecutions),
  workflowIntegrations: many(workflowIntegrations),
  workflowApiKeys: many(workflowApiKeys),
  codeProjects: many(codeProjects),
  codeChatOwnerships: many(codeChatOwnerships),
}));

/**
 * Workflows relations
 */
export const workflowsRelations = relations(workflows, ({ one, many }) => ({
  user: one(users, {
    fields: [workflows.userId],
    references: [users.id],
  }),
  executions: many(workflowExecutions),
}));

/**
 * Workflow executions relations
 */
export const workflowExecutionsRelations = relations(
  workflowExecutions,
  ({ one, many }) => ({
    workflow: one(workflows, {
      fields: [workflowExecutions.workflowId],
      references: [workflows.id],
    }),
    user: one(users, {
      fields: [workflowExecutions.userId],
      references: [users.id],
    }),
    logs: many(workflowExecutionLogs),
  }),
);

/**
 * Code projects relations
 */
export const codeProjectsRelations = relations(
  codeProjects,
  ({ one, many }) => ({
    user: one(users, {
      fields: [codeProjects.userId],
      references: [users.id],
    }),
    chatOwnerships: many(codeChatOwnerships),
  }),
);

// ============================================================================
// TYPE EXPORTS
// ============================================================================

/**
 * TypeScript type inference from schema
 */
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Session = typeof sessions.$inferSelect;
export type NewSession = typeof sessions.$inferInsert;
export type Account = typeof accounts.$inferSelect;
export type NewAccount = typeof accounts.$inferInsert;
export type Verification = typeof verifications.$inferSelect;
export type UserPreference = typeof userPreferences.$inferSelect;
export type NewUserPreference = typeof userPreferences.$inferInsert;
export type UserRole = typeof userRoles.$inferSelect;
export type NewUserRole = typeof userRoles.$inferInsert;
export type CapabilityRegistry = typeof capabilityRegistry.$inferSelect;
export type NewCapabilityRegistry = typeof capabilityRegistry.$inferInsert;
export type Workflow = typeof workflows.$inferSelect;
export type NewWorkflow = typeof workflows.$inferInsert;
export type WorkflowExecution = typeof workflowExecutions.$inferSelect;
export type NewWorkflowExecution = typeof workflowExecutions.$inferInsert;
export type WorkflowExecutionLog = typeof workflowExecutionLogs.$inferSelect;
export type NewWorkflowExecutionLog = typeof workflowExecutionLogs.$inferInsert;
export type WorkflowIntegration = typeof workflowIntegrations.$inferSelect;
export type NewWorkflowIntegration = typeof workflowIntegrations.$inferInsert;
export type WorkflowApiKey = typeof workflowApiKeys.$inferSelect;
export type NewWorkflowApiKey = typeof workflowApiKeys.$inferInsert;
export type CodeProject = typeof codeProjects.$inferSelect;
export type NewCodeProject = typeof codeProjects.$inferInsert;
export type CodeChatOwnership = typeof codeChatOwnerships.$inferSelect;
export type NewCodeChatOwnership = typeof codeChatOwnerships.$inferInsert;
export type CodeAnonymousLog = typeof codeAnonymousLogs.$inferSelect;
export type NewCodeAnonymousLog = typeof codeAnonymousLogs.$inferInsert;
