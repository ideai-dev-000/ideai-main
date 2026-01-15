/**
 * @fileoverview Data Step
 *
 * @module DataStep
 * @description
 * Data phase action.
 * Hardcoded - no user input needed.
 */

import type { StepInput } from "@/lib/steps/step-handler";

export async function dataStep(input: StepInput) {
  // Get tasks from previous step (passed via template variables in real workflow)
  const inputData = input as Record<string, unknown>;
  const tasks = ((inputData.tasks as Record<string, unknown>)
    ?.data as string[]) || ["Default data task"];

  // Hardcoded data execution
  return {
    completedTasks: tasks,
    schemaDesigned: true,
    pipelinesConfigured: true,
    storageReady: true,
    completedAt: new Date().toISOString(),
    message: "Data phase completed",
  };
}
