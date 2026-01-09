/**
 * Step Registry
 *
 * Provides runtime step importers and labels for workflow execution.
 * Maps action types to their step module importers and function names.
 */

import { findActionById } from "@/plugins";

/**
 * Step importer type - defines how to dynamically import a step module
 */
export type StepImporter = {
  /** Dynamic import function that returns the step module */
  importer: () => Promise<unknown>;
  /** Name of the step function to call in the imported module */
  stepFunction: string;
};

/**
 * System actions that don't have plugins - maps to module import functions
 */
const SYSTEM_STEP_IMPORTERS: Record<string, StepImporter> = {
  "Database Query": {
    // biome-ignore lint/suspicious/noExplicitAny: Dynamic module import
    importer: () => import("./steps/database-query") as Promise<any>,
    stepFunction: "databaseQueryStep",
  },
  "HTTP Request": {
    // biome-ignore lint/suspicious/noExplicitAny: Dynamic module import
    importer: () => import("./steps/http-request") as Promise<any>,
    stepFunction: "httpRequestStep",
  },
  Condition: {
    // biome-ignore lint/suspicious/noExplicitAny: Dynamic module import
    importer: () => import("./steps/condition") as Promise<any>,
    stepFunction: "conditionStep",
  },
};

/**
 * System action labels (non-plugin actions)
 */
const SYSTEM_ACTION_LABELS: Record<string, string> = {
  "HTTP Request": "HTTP Request",
  "Database Query": "Database Query",
  Condition: "Condition",
  "Execute Code": "Execute Code",
};

/**
 * Get step importer for an action type
 * Returns undefined if action is not found
 */
export function getStepImporter(actionType: string): StepImporter | undefined {
  // Check system actions first
  const systemImporter = SYSTEM_STEP_IMPORTERS[actionType];
  if (systemImporter) {
    return systemImporter;
  }

  // Look up in plugin registry
  const action = findActionById(actionType);
  if (action && action.stepImportPath && action.stepFunction) {
    return {
      // biome-ignore lint/suspicious/noExplicitAny: Dynamic module import
      importer: () =>
        import(`./steps/${action.stepImportPath}`) as Promise<any>,
      stepFunction: action.stepFunction,
    };
  }

  return undefined;
}

/**
 * Get human-readable label for an action type
 * Returns undefined if action is not found
 */
export function getActionLabel(actionType: string): string | undefined {
  // Check system actions first
  const systemLabel = SYSTEM_ACTION_LABELS[actionType];
  if (systemLabel) {
    return systemLabel;
  }

  // Look up in plugin registry
  const action = findActionById(actionType);
  if (action) {
    return action.label;
  }

  return undefined;
}
