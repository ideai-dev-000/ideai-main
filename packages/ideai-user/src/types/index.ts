/**
 * @fileoverview Type definitions for IdeaI User Module
 *
 * @module IdeAIUserTypes
 * @description
 * Centralized type definitions for user module.
 * Re-exports types from schema and defines additional utility types.
 *
 * @see ../lib/db/schema.ts - Schema type definitions
 */

export type {
  User,
  NewUser,
  Session,
  NewSession,
  Account,
  NewAccount,
  Verification,
  UserPreference,
  NewUserPreference,
  UserRole,
  NewUserRole,
  CapabilityRegistry,
  NewCapabilityRegistry,
  Workflow,
  NewWorkflow,
  WorkflowExecution,
  NewWorkflowExecution,
  WorkflowExecutionLog,
  NewWorkflowExecutionLog,
  WorkflowIntegration,
  NewWorkflowIntegration,
  WorkflowApiKey,
  NewWorkflowApiKey,
  CodeProject,
  NewCodeProject,
  CodeChatOwnership,
  NewCodeChatOwnership,
  CodeAnonymousLog,
  NewCodeAnonymousLog,
  WorkflowVisibility,
  CodeProjectVisibility,
} from "../lib/db/schema";

/**
 * Capability key type - used for capability registry
 */
export type CapabilityKey = "workflows" | "vibecoder" | string;

/**
 * Permission type - for future RBAC
 */
export type Permission = "read" | "write" | "delete" | "admin";
