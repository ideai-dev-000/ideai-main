/**
 * @fileoverview IdeaI Card Types
 * 
 * @module IdeAICardTypes
 * @description
 * Shared TypeScript types for the IdeaI framework card system.
 * Centralized type definitions for consistency across all card components.
 */

/**
 * Supported CSS frameworks
 */
export type Framework = "tailwind" | "bootstrap" | "material" | "chakra" | "radix" | "shadcn";

/**
 * Framework configuration interface
 */
export interface FrameworkConfig {
  /** Framework display name */
  name: string;
  /** CSS classes for card container */
  cardClasses: string;
  /** CSS classes for title/heading */
  titleClasses: string;
  /** CSS classes for description text */
  descriptionClasses: string;
  /** CSS classes for body text */
  textClasses: string;
}

/**
 * Framework configurations for all supported frameworks
 */
export const frameworkConfigs: Record<Framework, FrameworkConfig> = {
  tailwind: {
    name: "Tailwind CSS",
    cardClasses: "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg shadow-md p-6",
    titleClasses: "text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2",
    descriptionClasses: "text-slate-600 dark:text-slate-400 mb-4",
    textClasses: "text-slate-700 dark:text-slate-300",
  },
  bootstrap: {
    name: "Bootstrap",
    cardClasses: "card shadow-sm",
    titleClasses: "card-title h4",
    descriptionClasses: "card-text text-muted",
    textClasses: "text-body",
  },
  material: {
    name: "Material UI",
    cardClasses: "bg-white dark:bg-slate-900 rounded-lg shadow-md p-6 border border-slate-200 dark:border-slate-700",
    titleClasses: "text-2xl font-medium text-slate-900 dark:text-slate-100 mb-2",
    descriptionClasses: "text-slate-600 dark:text-slate-400 mb-4",
    textClasses: "text-slate-700 dark:text-slate-300",
  },
  chakra: {
    name: "Chakra UI",
    cardClasses: "bg-white dark:bg-slate-900 rounded-lg shadow-md p-6 border border-slate-200 dark:border-slate-700",
    titleClasses: "text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2",
    descriptionClasses: "text-slate-600 dark:text-slate-400 mb-4",
    textClasses: "text-slate-700 dark:text-slate-300",
  },
  radix: {
    name: "Radix UI",
    cardClasses: "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm p-6",
    titleClasses: "text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-2",
    descriptionClasses: "text-slate-600 dark:text-slate-400 mb-4",
    textClasses: "text-slate-700 dark:text-slate-300",
  },
  shadcn: {
    name: "Shadcn/UI",
    cardClasses: "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm p-6",
    titleClasses: "text-2xl font-semibold leading-none tracking-tight text-slate-900 dark:text-slate-100 mb-2",
    descriptionClasses: "text-sm text-slate-500 dark:text-slate-400 mb-4",
    textClasses: "text-slate-900 dark:text-slate-100",
  },
};



