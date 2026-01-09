/**
 * Plugins Index
 *
 * This is a minimal stub for the plugins system.
 * TODO: Set up full plugin discovery system similar to ideai-capabilities
 */

export type {
  ActionConfigField,
  ActionConfigFieldBase,
  ActionConfigFieldGroup,
  ActionWithFullId,
  IntegrationPlugin,
  PluginAction,
} from "./registry";

export {
  computeActionId,
  findActionById,
  flattenConfigFields,
  generateAIActionPrompts,
  getActionsByCategory,
  getAllActions,
  getAllDependencies,
  getAllEnvVars,
  getAllIntegrations,
  getCredentialMapping,
  getDependenciesForActions,
  getIntegration,
  getIntegrationLabels,
  getIntegrationTypes,
  getPluginEnvVars,
  getSortedIntegrationTypes,
  isFieldGroup,
  parseActionId,
  registerIntegration,
} from "./registry";

// Also export getIntegrationDescriptions which some files import
export { getIntegrationDescriptions } from "./registry";
