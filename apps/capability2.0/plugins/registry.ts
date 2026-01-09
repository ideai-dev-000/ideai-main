/**
 * Plugin Registry
 *
 * Minimal stub implementation for capability2.0
 * TODO: Implement full plugin system similar to ideai-capabilities
 */

import React from "react";
import type { IntegrationType } from "@/lib/types/integration";

// Legacy action mappings (empty for now)
export const LEGACY_ACTION_MAPPINGS: Record<string, string> = {};

/**
 * Select Option
 * Used for select/dropdown fields
 */
export type SelectOption = {
  value: string;
  label: string;
};

/**
 * Base Action Config Field
 */
export type ActionConfigFieldBase = {
  key: string;
  label: string;
  type:
    | "template-input"
    | "template-textarea"
    | "text"
    | "number"
    | "select"
    | "schema-builder";
  placeholder?: string;
  defaultValue?: string;
  example?: string;
  options?: SelectOption[];
  rows?: number;
  min?: number;
  required?: boolean;
  showWhen?: {
    field: string;
    equals: string;
  };
};

/**
 * Config Field Group
 */
export type ActionConfigFieldGroup = {
  label: string;
  type: "group";
  fields: ActionConfigFieldBase[];
  defaultExpanded?: boolean;
};

/**
 * Action Config Field
 */
export type ActionConfigField = ActionConfigFieldBase | ActionConfigFieldGroup;

/**
 * Output Field Definition
 */
export type OutputField = {
  field: string;
  description: string;
};

/**
 * Output Display Config
 */
export type OutputDisplayConfig = {
  type: "image" | "video" | "url";
  field: string;
};

/**
 * Plugin Action Definition
 */
export type PluginAction = {
  slug: string;
  label: string;
  description: string;
  category?: string;
  configFields: ActionConfigField[];
  outputFields: OutputField[];
  outputConfig?: OutputDisplayConfig;
  codegenTemplate?: string;
};

/**
 * Integration Plugin Definition
 */
export type IntegrationPlugin = {
  type: IntegrationType;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  formFields: Array<{
    id: string;
    label: string;
    type: "text" | "password" | "url";
    placeholder?: string;
    helpText?: string;
    helpLink?: { text: string; url: string };
    configKey: string;
    envVar?: string;
  }>;
  testConfig?: {
    getTestFunction: () => Promise<
      (credentials: Record<string, string>) => Promise<{
        success: boolean;
        error?: string;
      }>
    >;
  };
  dependencies?: Record<string, string>;
  actions: PluginAction[];
};

/**
 * Action with full ID
 */
export type ActionWithFullId = PluginAction & {
  id: string;
  integration: IntegrationType;
};

/**
 * Integration Registry
 */
const integrationRegistry = new Map<IntegrationType, IntegrationPlugin>();

/**
 * Compute full action ID from integration type and action slug
 */
export function computeActionId(
  integrationType: IntegrationType,
  actionSlug: string,
): string {
  return `${integrationType}/${actionSlug}`;
}

/**
 * Parse a full action ID into integration type and action slug
 */
export function parseActionId(actionId: string | undefined | null): {
  integration: string;
  slug: string;
} | null {
  if (!actionId || typeof actionId !== "string") {
    return null;
  }
  const parts = actionId.split("/");
  if (parts.length !== 2 || !parts[0] || !parts[1]) {
    return null;
  }
  return { integration: parts[0], slug: parts[1] };
}

/**
 * Register an integration plugin
 */
export function registerIntegration(plugin: IntegrationPlugin) {
  integrationRegistry.set(plugin.type, plugin);
}

/**
 * Get an integration plugin
 */
export function getIntegration(
  type: IntegrationType,
): IntegrationPlugin | undefined {
  return integrationRegistry.get(type);
}

/**
 * Get all registered integrations
 */
export function getAllIntegrations(): IntegrationPlugin[] {
  return Array.from(integrationRegistry.values());
}

/**
 * Get all integration types
 */
export function getIntegrationTypes(): IntegrationType[] {
  return Array.from(integrationRegistry.keys());
}

/**
 * Get all actions across all integrations with full IDs
 */
export function getAllActions(): ActionWithFullId[] {
  const actions: ActionWithFullId[] = [];
  for (const plugin of integrationRegistry.values()) {
    for (const action of plugin.actions) {
      actions.push({
        ...action,
        id: computeActionId(plugin.type, action.slug),
        integration: plugin.type,
      });
    }
  }
  return actions;
}

/**
 * Get actions by category
 */
export function getActionsByCategory(): Record<string, ActionWithFullId[]> {
  const categories: Record<string, ActionWithFullId[]> = {};
  for (const plugin of integrationRegistry.values()) {
    for (const action of plugin.actions) {
      const category = action.category;
      if (!category) continue;
      if (!categories[category]) {
        categories[category] = [];
      }
      categories[category].push({
        ...action,
        id: computeActionId(plugin.type, action.slug),
        integration: plugin.type,
      });
    }
  }
  return categories;
}

/**
 * Find an action by full ID
 */
export function findActionById(
  actionId: string | undefined | null,
): ActionWithFullId | undefined {
  if (!actionId) {
    return undefined;
  }

  const parsed = parseActionId(actionId);
  if (parsed) {
    const plugin = integrationRegistry.get(
      parsed.integration as IntegrationType,
    );
    if (plugin) {
      const action = plugin.actions.find((a) => a.slug === parsed.slug);
      if (action) {
        return {
          ...action,
          id: actionId,
          integration: plugin.type,
        };
      }
    }
  }

  const mappedId = LEGACY_ACTION_MAPPINGS[actionId];
  if (mappedId) {
    return findActionById(mappedId);
  }

  for (const plugin of integrationRegistry.values()) {
    const action = plugin.actions.find((a) => a.label === actionId);
    if (action) {
      return {
        ...action,
        id: computeActionId(plugin.type, action.slug),
        integration: plugin.type,
      };
    }
  }

  return undefined;
}

/**
 * Get integration labels map
 */
export function getIntegrationLabels(): Record<IntegrationType, string> {
  const labels: Record<string, string> = {};
  for (const plugin of integrationRegistry.values()) {
    labels[plugin.type] = plugin.label;
  }
  return labels as Record<IntegrationType, string>;
}

/**
 * Get integration descriptions map
 */
export function getIntegrationDescriptions(): Record<IntegrationType, string> {
  const descriptions: Record<string, string> = {};
  for (const plugin of integrationRegistry.values()) {
    descriptions[plugin.type] = plugin.description;
  }
  return descriptions as Record<IntegrationType, string>;
}

/**
 * Get sorted integration types for dropdowns
 */
export function getSortedIntegrationTypes(): IntegrationType[] {
  return Array.from(integrationRegistry.keys()).sort();
}

/**
 * Get all NPM dependencies across all integrations
 */
export function getAllDependencies(): Record<string, string> {
  const deps: Record<string, string> = {};
  for (const plugin of integrationRegistry.values()) {
    if (plugin.dependencies) {
      Object.assign(deps, plugin.dependencies);
    }
  }
  return deps;
}

/**
 * Get NPM dependencies for specific action IDs
 */
export function getDependenciesForActions(
  actionIds: string[],
): Record<string, string> {
  const deps: Record<string, string> = {};
  const integrations = new Set<IntegrationType>();

  for (const actionId of actionIds) {
    const action = findActionById(actionId);
    if (action) {
      integrations.add(action.integration);
    }
  }

  for (const integrationType of integrations) {
    const plugin = integrationRegistry.get(integrationType);
    if (plugin?.dependencies) {
      Object.assign(deps, plugin.dependencies);
    }
  }

  return deps;
}

/**
 * Get environment variables for a single plugin
 */
export function getPluginEnvVars(
  plugin: IntegrationPlugin,
): Array<{ name: string; description: string }> {
  const envVars: Array<{ name: string; description: string }> = [];
  for (const field of plugin.formFields) {
    if (field.envVar) {
      envVars.push({
        name: field.envVar,
        description: field.helpText || field.label,
      });
    }
  }
  return envVars;
}

/**
 * Get all environment variables across all integrations
 */
export function getAllEnvVars(): Array<{ name: string; description: string }> {
  const envVars: Array<{ name: string; description: string }> = [];
  for (const plugin of integrationRegistry.values()) {
    envVars.push(...getPluginEnvVars(plugin));
  }
  return envVars;
}

/**
 * Get credential mapping for a plugin
 */
export function getCredentialMapping(
  plugin: IntegrationPlugin,
  config: Record<string, unknown>,
): Record<string, string> {
  const creds: Record<string, string> = {};
  for (const field of plugin.formFields) {
    if (field.envVar && config[field.configKey]) {
      creds[field.envVar] = String(config[field.configKey]);
    }
  }
  return creds;
}

/**
 * Type guard to check if a field is a group
 */
export function isFieldGroup(
  field: ActionConfigField,
): field is ActionConfigFieldGroup {
  return field.type === "group";
}

/**
 * Flatten config fields, extracting fields from groups
 */
export function flattenConfigFields(
  fields: ActionConfigField[],
): ActionConfigFieldBase[] {
  const result: ActionConfigFieldBase[] = [];
  for (const field of fields) {
    if (isFieldGroup(field)) {
      result.push(...field.fields);
    } else {
      result.push(field);
    }
  }
  return result;
}

/**
 * Generate AI prompt section for all available actions
 */
export function generateAIActionPrompts(): string {
  const lines: string[] = [];
  for (const plugin of integrationRegistry.values()) {
    for (const action of plugin.actions) {
      const fullId = computeActionId(plugin.type, action.slug);
      const exampleConfig: Record<string, string | number> = {
        actionType: fullId,
      };
      const flatFields = flattenConfigFields(action.configFields);
      for (const field of flatFields) {
        if (field.showWhen) continue;
        if (field.example !== undefined) {
          exampleConfig[field.key] = field.example;
        } else if (field.defaultValue !== undefined) {
          exampleConfig[field.key] = field.defaultValue;
        } else if (field.type === "number") {
          exampleConfig[field.key] = 10;
        } else if (field.type === "select" && field.options?.[0]) {
          exampleConfig[field.key] = field.options[0].value;
        } else {
          exampleConfig[field.key] = `Your ${field.label.toLowerCase()}`;
        }
      }
      lines.push(
        `- ${action.label} (${fullId}): ${JSON.stringify(exampleConfig)}`,
      );
    }
  }
  return lines.join("\n");
}
