/**
 * @fileoverview Archive Step
 *
 * @module ArchiveStep
 * @description
 * Archive phase - final step.
 * Hardcoded - no user input needed.
 */

import type { StepInput } from "@/lib/steps/step-handler";

export async function archiveStep(input: StepInput) {
  // Get maintenance output from previous step (passed via template variables)
  const inputData = input as Record<string, unknown>;
  const maintainOutput = inputData.maintain || {};

  // Hardcoded archive execution
  return {
    archived: true,
    archiveLocation: "static-workflows/archive",
    archivedAt: new Date().toISOString(),
    maintenanceInfo: maintainOutput,
    workflowComplete: true,
    message: "Workflow archived successfully",
  };
}
