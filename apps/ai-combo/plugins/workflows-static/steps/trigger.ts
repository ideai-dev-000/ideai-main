/**
 * @fileoverview Trigger Step - Start the static workflow
 *
 * @module TriggerStep
 * @description
 * Hardcoded trigger action that starts the workflow.
 * No user input needed - just runs.
 */

import type { StepInput } from "@/lib/steps/step-handler";

export async function triggerStep(input: StepInput) {
  // Hardcoded trigger - always works
  const workflowId = (input._context?.nodeId || "static-workflow").replace(
    /-.*$/,
    "",
  );

  return {
    workflowId,
    timestamp: new Date().toISOString(),
    triggered: true,
    message: "Workflow triggered successfully",
  };
}
