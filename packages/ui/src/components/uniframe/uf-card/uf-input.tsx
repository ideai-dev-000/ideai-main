/**
 * @fileoverview UniFrame Card Input Component - Form Input Element
 * 
 * @file uf-input.tsx
 * @module UniFrameCardInput
 * @description
 * Input component for UniFrame framework cards.
 * Provides semantic input element that adapts styling based on framework
 * configuration with secure class injection.
 * 
 * Part of the UniFrame card system UI elements:
 * - Button (uf-button.tsx)
 * - Input (this component)
 * - Badge (uf-badge.tsx)
 * - FormField (uf-form-field.tsx)
 * - ButtonGroup (uf-button-group.tsx)
 * 
 * @author IdeaI Development Team
 * @since 2026-01-01
 * @version 1.0.0
 * 
 * @example
 * ```tsx
 * import { UniFrameCardInput } from "@repo/ui/components/uniframe/uf-card/uf-input";
 * 
 * <UniFrameCardInput
 *   framework="tailwind"
 *   id="email"
 *   type="email"
 *   value={email}
 *   onChange={(e) => setEmail(e.target.value)}
 * />
 * ```
 * 
 * @see {@link ./uf-card.tsx} - Main card wrapper component
 * @see {@link ./uf-card-types.ts} - TypeScript type definitions
 * @see {@link ./uf-form-field.tsx} - Form field component (combines label + input)
 * @see {@link ./uf-button.tsx} - Button element
 * 
 * @todo Add validation state styling
 * @todo Add input size variants
 * @todo Add icon support (leading/trailing icons)
 */

import { InputHTMLAttributes } from "react";
import { cn } from "../../../lib/utils";
import type { Framework } from "./uf-card-types";

interface UniFrameCardInputProps extends InputHTMLAttributes<HTMLInputElement> {
  /** Framework to use for styling */
  framework: Framework;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Framework-specific input class configurations
 * 
 * All class strings are predefined and XSS-safe.
 * Each framework provides complete styling for input elements.
 * 
 * @private
 */
const frameworkInputClasses: Record<Framework, string> = {
  tailwind: "w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
  bootstrap: "form-control",
  material: "w-full px-3 py-2 border-b-2 border-blue-600 bg-transparent text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-800",
  chakra: "w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500",
  radix: "w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-500",
  shadcn: "flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:ring-offset-slate-950 dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-300",
};

/**
 * UniFrame Card Input Component
 * 
 * A semantic input element that adapts its styling based on the selected framework.
 * 
 * Features:
 * - Semantic HTML (input element)
 * - Framework-adaptive styling
 * - Accessible (supports all standard input attributes)
 * - Dark mode support
 * - Focus states
 * 
 * @param props - UniFrame card input component props
 * @returns React component
 */
export const UniFrameCardInput = ({
  framework,
  className,
  ...props
}: UniFrameCardInputProps) => {
  const baseClasses = frameworkInputClasses[framework] || frameworkInputClasses.tailwind;

  return (
    <input
      className={cn(baseClasses, className)}
      {...props}
    />
  );
};
