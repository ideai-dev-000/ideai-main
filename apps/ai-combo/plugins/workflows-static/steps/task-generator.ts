/**
 * @fileoverview Task Generator Step
 *
 * @module TaskGeneratorStep
 * @description
 * Generates tasks from requirements.
 * Hardcoded - no user input needed.
 */

import type { StepInput } from "@/lib/steps/step-handler";

export async function taskGeneratorStep(input: StepInput) {
  // Get requirements from previous step (passed via template variables in real workflow)
  // For static workflow, we'll use hardcoded requirements
  const inputData = input as Record<string, unknown>;
  const requirements = (inputData.requirements as Record<string, unknown>) || {
    functional: ["Default tasks"],
  };

  // Hardcoded task generation
  const tasks = {
    development: [
      "Set up development environment",
      "Implement core features",
      "Write unit tests",
    ],
    design: ["Create UI mockups", "Design user flows", "Prepare design system"],
    data: [
      "Design database schema",
      "Set up data pipelines",
      "Configure data storage",
    ],
  };

  return {
    tasks,
    generatedAt: new Date().toISOString(),
    sourceRequirements: requirements,
    message: "Tasks generated from requirements",
  };
}
