/**
 * Mode Configuration
 *
 * Centralized configuration for each mode including:
 * - Display names
 * - Descriptions
 * - Button labels
 * - Branding
 */

import type { AppMode } from "./config";

export type ModeConfig = {
  title: string;
  subtitle?: string;
  addButtonLabel: string;
  description?: string;
  branding?: {
    show?: boolean;
    text?: string;
    links?: Array<{
      label: string;
      url: string;
    }>;
  };
};

export const modeConfigs: Record<AppMode, ModeConfig> = {
  workflow: {
    title: "IdeaI Workflow",
    subtitle: "Build powerful AI-driven workflow automations",
    addButtonLabel: "Add a Step",
    description: "Create workflows with triggers, actions, and integrations",
    branding: {
      show: true,
      text: "Powered by",
      links: [
        { label: "Workflow", url: "https://useworkflow.dev/" },
        { label: "AI SDK", url: "https://ai-sdk.dev/" },
        { label: "AI Gateway", url: "https://vercel.com/ai-gateway" },
        { label: "AI Elements", url: "https://ai-sdk.dev/elements" },
      ],
    },
  },
  architecture: {
    title: "IdeaI Architecture",
    subtitle: "Design software architecture diagrams",
    addButtonLabel: "Add a Shape",
    description:
      "Create architecture diagrams with standard shapes and connectors",
    branding: {
      show: false,
    },
  },
};

/**
 * Get configuration for the current mode
 */
export function getModeConfig(): ModeConfig {
  // Import dynamically to avoid circular dependency
  const { getAppMode } = require("./config") as { getAppMode: () => AppMode };
  const mode = getAppMode();
  return modeConfigs[mode] || modeConfigs.workflow;
}
