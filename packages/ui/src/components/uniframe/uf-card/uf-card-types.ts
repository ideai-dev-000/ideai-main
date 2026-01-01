/**
 * @fileoverview UniFrame Card Types - TypeScript Type Definitions
 * 
 * @file uf-card-types.ts
 * @module UniFrameCardTypes
 * @description
 * Shared TypeScript types and configurations for the UniFrame card system.
 * Centralized type definitions ensure consistency across all UniFrame card components.
 * 
 * UniFrame is a universal framework card system that allows runtime switching
 * between different CSS frameworks (Tailwind, Bootstrap, Material UI, Chakra UI,
 * Radix UI, Shadcn/UI) with secure class injection.
 * 
 * @author IdeaI Development Team
 * @since 2026-01-01
 * @version 1.0.0
 * 
 * @example
 * ```tsx
 * import type { Framework, FrameworkConfig } from "./uf-card-types";
 * 
 * const framework: Framework = "tailwind";
 * const config: FrameworkConfig = frameworkConfigs[framework];
 * ```
 * 
 * @see {@link ./uf-card.tsx} - Main card wrapper component
 * @see {@link ./uf-header.tsx} - Card header component
 * @see {@link ./uf-body.tsx} - Card body component
 * @see {@link ./uf-footer.tsx} - Card footer component
 * 
 * @todo Add support for additional frameworks (Ant Design, Mantine, etc.)
 * @todo Add theme customization options
 * @todo Add framework-specific animation configurations
 */

/**
 * Supported CSS frameworks for UniFrame
 * 
 * Each framework provides a complete set of styling classes for:
 * - Card container
 * - Typography (title, description, body text)
 * - UI elements (buttons, inputs, badges)
 * 
 * @public
 */
export type Framework = "tailwind" | "bootstrap" | "material" | "chakra" | "radix" | "shadcn";

/**
 * Framework configuration interface
 * 
 * Defines the styling classes for each framework's card system.
 * All class strings are predefined and XSS-safe.
 * 
 * @public
 */
export interface FrameworkConfig {
  /** Framework display name */
  name: string;
  /** CSS classes for card container (article element) */
  cardClasses: string;
  /** CSS classes for title/heading (h2 element) */
  titleClasses: string;
  /** CSS classes for description text (p element) */
  descriptionClasses: string;
  /** CSS classes for body text (p element) */
  textClasses: string;
}

/**
 * Framework configurations for all supported frameworks
 * 
 * Predefined class strings for each framework ensure:
 * - XSS security (no user input in class strings)
 * - Consistent styling across framework switches
 * - Easy extensibility for new frameworks
 * 
 * @public
 * @constant
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
