/**
 * @fileoverview Requirement Taker Step
 *
 * @module RequirementTakerStep
 * @description
 * Captures and analyzes requirements.
 * Hardcoded - no user input needed.
 */

import type { StepInput } from "@/lib/steps/step-handler";

export async function requirementTakerStep(input: StepInput) {
  // Get previous output if available (from trigger)
  const previousData = input as Record<string, unknown>;

  // Hardcoded requirement analysis
  const requirements = {
    functional: ["User authentication", "Data storage", "API integration"],
    nonFunctional: ["Performance", "Security", "Scalability"],
    constraints: ["Budget", "Timeline", "Resources"],
  };

  return {
    requirements,
    analyzedAt: new Date().toISOString(),
    message: "Requirements captured and analyzed",
    sourceWorkflow: previousData.workflowId || "static-workflow",
  };
}
