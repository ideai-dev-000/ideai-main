/**
 * @fileoverview Framework Configuration
 *
 * @module Frameworks
 * @description
 * Configuration for all CSS frameworks available in the unified showcase.
 * Each framework has its own CSS loading strategy and metadata.
 */

export interface FrameworkConfig {
  id: string;
  name: string;
  description: string;
  cssType:
    | "tailwind"
    | "bootstrap"
    | "unocss"
    | "material"
    | "chakra"
    | "radix"
    | "shadcn"
    | "allcss"
    | "mvp";
  requiresPackage?: string;
  oldPort?: number; // Port from old separate app (for reference)
}

/**
 * All available frameworks in the unified showcase
 */
export const frameworks: Record<string, FrameworkConfig> = {
  tailwind: {
    id: "tailwind",
    name: "Tailwind CSS",
    description:
      "Utility-first CSS framework. No MVP.css, no semantic HTML styling - just Tailwind utility classes.",
    cssType: "tailwind",
    oldPort: 3005,
  },
  allcss: {
    id: "allcss",
    name: "All CSS",
    description:
      "Complete styling stack: MVP.css for semantic HTML styling, Tailwind for utility classes, and IdeaI design tokens for consistency.",
    cssType: "allcss",
    oldPort: 3006,
  },
  bootstrap: {
    id: "bootstrap",
    name: "Bootstrap",
    description:
      "Component-based CSS framework. No Tailwind, no MVP.css - just Bootstrap components and utilities.",
    cssType: "bootstrap",
    requiresPackage: "bootstrap",
    oldPort: 3007,
  },
  unocss: {
    id: "unocss",
    name: "UnoCSS",
    description:
      "Atomic CSS engine with on-demand generation. No Tailwind, no MVP.css - just UnoCSS for utility-first styling with instant compilation.",
    cssType: "unocss",
    oldPort: 3008,
  },
  shadcn: {
    id: "shadcn",
    name: "Shadcn/UI",
    description:
      "Shadcn/UI component library built on Radix UI primitives, styled with Tailwind CSS and IdeaI design tokens. All components from shared @repo/ui package.",
    cssType: "shadcn",
    oldPort: 3009,
  },
  material: {
    id: "material",
    name: "Material UI",
    description: "Material Design components and styling system.",
    cssType: "material",
    oldPort: 3010,
  },
  chakra: {
    id: "chakra",
    name: "Chakra UI",
    description: "Chakra UI component library with design tokens.",
    cssType: "chakra",
    oldPort: 3011,
  },
  radix: {
    id: "radix",
    name: "Radix UI",
    description: "Radix UI primitives with Tailwind CSS styling.",
    cssType: "radix",
    oldPort: 3012,
  },
};

/**
 * Get framework configuration by ID
 */
export function getFrameworkConfig(id: string): FrameworkConfig | null {
  return frameworks[id] || null;
}

/**
 * Get all framework IDs
 */
export function getAllFrameworkIds(): string[] {
  return Object.keys(frameworks);
}

/**
 * Get all framework configs
 */
export function getAllFrameworks(): FrameworkConfig[] {
  return Object.values(frameworks);
}
