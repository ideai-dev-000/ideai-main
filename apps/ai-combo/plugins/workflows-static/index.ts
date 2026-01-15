/**
 * @fileoverview Static Workflows Plugin
 *
 * @module WorkflowsStaticPlugin
 * @description
 * Static workflow system with hardcoded actions that run as simple functions.
 * Actions are organized as semantic files/folders for easy maintenance.
 * No user input fields - just run actions as functions that always work.
 */

import type { IntegrationPlugin } from "../registry";
import { registerIntegration } from "../registry";

const integrationName = "workflows-static";

const workflowsStaticPlugin: IntegrationPlugin = {
  // Plugin metadata
  type: integrationName,
  name: "Static Workflows",
  description: "Hardcoded workflow actions that run as simple functions",
  icon: "Workflow", // Use Workflow icon from lucide-react

  // No credentials needed - all actions are hardcoded
  credentials: undefined,

  // Actions provided by this integration
  actions: [
    {
      slug: "trigger",
      label: "Trigger",
      description: "Start the static workflow",
      category: "Static Workflows",
      stepFunction: "triggerStep",
      stepImportPath: "trigger",
      configFields: [], // No config - hardcoded
    },
    {
      slug: "requirement-taker",
      label: "Requirement Taker",
      description: "Capture and analyze requirements",
      category: "Static Workflows",
      stepFunction: "requirementTakerStep",
      stepImportPath: "requirement-taker",
      configFields: [],
    },
    {
      slug: "task-generator",
      label: "Task Generator",
      description: "Generate tasks from requirements",
      category: "Static Workflows",
      stepFunction: "taskGeneratorStep",
      stepImportPath: "task-generator",
      configFields: [],
    },
    {
      slug: "development",
      label: "Development",
      description: "Development phase action",
      category: "Static Workflows",
      stepFunction: "developmentStep",
      stepImportPath: "development",
      configFields: [],
    },
    {
      slug: "design",
      label: "Design",
      description: "Design phase action",
      category: "Static Workflows",
      stepFunction: "designStep",
      stepImportPath: "design",
      configFields: [],
    },
    {
      slug: "data",
      label: "Data",
      description: "Data phase action",
      category: "Static Workflows",
      stepFunction: "dataStep",
      stepImportPath: "data",
      configFields: [],
    },
    {
      slug: "build",
      label: "Build",
      description: "Build phase - combines development, design, and data",
      category: "Static Workflows",
      stepFunction: "buildStep",
      stepImportPath: "build",
      configFields: [],
    },
    {
      slug: "qa",
      label: "QA",
      description: "Quality assurance phase",
      category: "Static Workflows",
      stepFunction: "qaStep",
      stepImportPath: "qa",
      configFields: [],
    },
    {
      slug: "deploy",
      label: "Deploy",
      description: "Deployment phase",
      category: "Static Workflows",
      stepFunction: "deployStep",
      stepImportPath: "deploy",
      configFields: [],
    },
    {
      slug: "maintain",
      label: "Maintain",
      description: "Maintenance phase",
      category: "Static Workflows",
      stepFunction: "maintainStep",
      stepImportPath: "maintain",
      configFields: [],
    },
    {
      slug: "archive",
      label: "Archive",
      description: "Archive phase - final step",
      category: "Static Workflows",
      stepFunction: "archiveStep",
      stepImportPath: "archive",
      configFields: [],
    },
  ],
};

// Auto-register on import
registerIntegration(workflowsStaticPlugin);

export default workflowsStaticPlugin;
