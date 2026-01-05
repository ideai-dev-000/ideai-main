/**
 * @fileoverview Page Templates Module - Centralized Exports
 * 
 * @module PageTemplates
 * @description
 * Centralized exports for page templates system.
 * All templates are driven by JSON files.
 * 
 * @example
 * ```tsx
 * import { PageTemplatesShowcase, pageTemplates } from "@repo/ui/components/page-templates";
 * ```
 */

export { PageTemplatesShowcase } from "./page-templates-showcase";
export type { PageTemplate, TemplateType, PageTemplatesData } from "./types";

// Import type for use in this file
import type { PageTemplate } from "./types";

// Load templates - using dynamic import for JSON
import pageTemplatesData from "./examples/page-templates.json";

export const pageTemplates = pageTemplatesData as PageTemplate[];
