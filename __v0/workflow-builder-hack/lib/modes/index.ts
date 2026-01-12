/**
 * Mode System - Entry Point
 *
 * Exports the appropriate node types and templates based on APP_MODE.
 * If APP_MODE is not set, defaults to workflow mode (backward compatible).
 */

import {
  architectureNodeTemplates,
  architectureNodeTypes,
} from "./architecture/nodes";
import { getAppMode } from "./config";
import { workflowNodeTemplates, workflowNodeTypes } from "./workflow/nodes";

/**
 * Get node types for the current mode
 */
export function getNodeTypes() {
  const mode = getAppMode();

  if (mode === "architecture") {
    return architectureNodeTypes;
  }

  // Default to workflow mode
  return workflowNodeTypes;
}

/**
 * Get node templates for the current mode
 */
export function getNodeTemplates() {
  const mode = getAppMode();

  if (mode === "architecture") {
    return architectureNodeTemplates;
  }

  // Default to workflow mode
  return workflowNodeTemplates;
}

export type { AppMode } from "./config";
// Re-export mode utilities
export { getAppMode, isMode } from "./config";
export type { ModeConfig } from "./mode-config";
// Re-export mode configuration
export { getModeConfig, modeConfigs } from "./mode-config";
