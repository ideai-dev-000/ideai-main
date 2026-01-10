/**
 * @fileoverview Permission service for IdeaI User Module
 *
 * @module IdeAIPermissionService
 * @description
 * Service for checking access permissions and ownership.
 * Implements standard access control patterns for capabilities.
 *
 * @example
 * ```typescript
 * import { permissionService } from "@repo/ideai-user/services/permission-service";
 *
 * const canAccess = await permissionService.canAccess(
 *   userId,
 *   resourceId,
 *   "workflows"
 * );
 * ```
 */

import { eq, and, or } from "drizzle-orm";
import { db } from "../db";
import {
  workflows,
  codeProjects,
  type WorkflowVisibility,
  type CodeProjectVisibility,
} from "../db/schema";

/**
 * Permission service class
 * Provides methods for access control
 */
export class PermissionService {
  /**
   * Check if user can access a workflow
   */
  async canAccessWorkflow(
    userId: string,
    workflowId: string,
  ): Promise<boolean> {
    const workflow = await db.query.workflows.findFirst({
      where: eq(workflows.id, workflowId),
    });

    if (!workflow) return false;

    // Owner can always access
    if (workflow.userId === userId) return true;

    // Check visibility
    if (workflow.visibility === "private") return false;
    if (workflow.visibility === "public") return true;

    // TODO: Implement team visibility check when teams are added
    return false;
  }

  /**
   * Check if user can access a code project
   */
  async canAccessCodeProject(
    userId: string,
    projectId: string,
  ): Promise<boolean> {
    const project = await db.query.codeProjects.findFirst({
      where: eq(codeProjects.id, projectId),
    });

    if (!project) return false;

    // Owner can always access
    if (project.userId === userId) return true;

    // Check visibility
    if (project.visibility === "private") return false;
    if (project.visibility === "public") return true;

    // TODO: Implement team visibility check when teams are added
    return false;
  }

  /**
   * Generic access check - tries to determine capability type
   */
  async canAccess(
    userId: string,
    resourceId: string,
    capability: "workflows" | "vibecoder",
  ): Promise<boolean> {
    if (capability === "workflows") {
      return this.canAccessWorkflow(userId, resourceId);
    }
    if (capability === "vibecoder") {
      return this.canAccessCodeProject(userId, resourceId);
    }
    return false;
  }

  /**
   * Get user's workflows with access control
   */
  async getUserWorkflows(userId: string, includePublic = false) {
    if (includePublic) {
      return db.query.workflows.findMany({
        where: or(
          eq(workflows.userId, userId),
          eq(workflows.visibility, "public"),
        ),
        orderBy: (workflows, { desc }) => [desc(workflows.createdAt)],
      });
    }

    return db.query.workflows.findMany({
      where: eq(workflows.userId, userId),
      orderBy: (workflows, { desc }) => [desc(workflows.createdAt)],
    });
  }

  /**
   * Get user's code projects with access control
   */
  async getUserCodeProjects(userId: string, includePublic = false) {
    if (includePublic) {
      return db.query.codeProjects.findMany({
        where: or(
          eq(codeProjects.userId, userId),
          eq(codeProjects.visibility, "public"),
        ),
        orderBy: (codeProjects, { desc }) => [desc(codeProjects.createdAt)],
      });
    }

    return db.query.codeProjects.findMany({
      where: eq(codeProjects.userId, userId),
      orderBy: (codeProjects, { desc }) => [desc(codeProjects.createdAt)],
    });
  }
}

/**
 * Export singleton instance
 */
export const permissionService = new PermissionService();
