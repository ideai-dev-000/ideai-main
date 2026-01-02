/**
 * @fileoverview IdeaI Framework Input Atom
 * 
 * @module IdeAIFrameworkInput
 * @description
 * Atomic input component that adapts styling based on framework configuration.
 * Uses semantic HTML input element with proper accessibility.
 * 
 * @example
 * ```tsx
 * <IdeAIFrameworkInput
 *   framework="tailwind"
 *   id="email"
 *   type="email"
 *   value={email}
 *   onChange={(e) => setEmail(e.target.value)}
 * />
 * ```
 */

import { InputHTMLAttributes } from "react";
import { cn } from "../../lib/utils";
import type { Framework } from "../organisms/ideai-framework-card-types";

interface IdeAIFrameworkInputProps extends InputHTMLAttributes<HTMLInputElement> {
  /** Framework to use for styling */
  framework: Framework;
  /** Additional CSS classes */
  className?: string;
}

const frameworkInputClasses: Record<Framework, string> = {
  tailwind: "w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
  bootstrap: "form-control",
  material: "w-full px-3 py-2 border-b-2 border-blue-600 bg-transparent text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-800",
  chakra: "w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500",
  radix: "w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-500",
  shadcn: "flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:ring-offset-slate-950 dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-300",
};

/**
 * IdeaI Framework Input Atom
 * 
 * A semantic input element that adapts its styling based on the selected framework.
 */
export const IdeAIFrameworkInput = ({
  framework,
  className,
  ...props
}: IdeAIFrameworkInputProps) => {
  const baseClasses = frameworkInputClasses[framework] || frameworkInputClasses.tailwind;

  return (
    <input
      className={cn(baseClasses, className)}
      {...props}
    />
  );
};








