/**
 * @fileoverview IdeaI Card Button Component
 * 
 * @module IdeAICardButton
 * @description
 * Button component that adapts styling based on framework configuration.
 * Part of the IdeaI framework card system.
 * 
 * @example
 * ```tsx
 * <IdeAICardButton
 *   framework="tailwind"
 *   onClick={handleClick}
 *   disabled={isLoading}
 * >
 *   Click me
 * </IdeAICardButton>
 * ```
 */

import { ReactNode, ButtonHTMLAttributes } from "react";
import { cn } from "../../../lib/utils";
import type { Framework } from "./ideai-card-types";

interface IdeAICardButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Framework to use for styling */
  framework: Framework;
  /** Button content */
  children: ReactNode;
  /** Additional CSS classes */
  className?: string;
  /** Variant style */
  variant?: "primary" | "secondary" | "outline" | "ghost";
}

const frameworkButtonClasses: Record<Framework, Record<string, string>> = {
  tailwind: {
    primary: "px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors",
    secondary: "px-4 py-2 bg-slate-600 text-white rounded-md hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 transition-colors",
    outline: "px-4 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors",
    ghost: "px-4 py-2 text-slate-700 rounded-md hover:bg-slate-100 focus:outline-none transition-colors",
  },
  bootstrap: {
    primary: "btn btn-primary",
    secondary: "btn btn-secondary",
    outline: "btn btn-outline-primary",
    ghost: "btn btn-link",
  },
  material: {
    primary: "px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors shadow-sm",
    secondary: "px-4 py-2 bg-slate-600 text-white rounded-md hover:bg-slate-700 transition-colors shadow-sm",
    outline: "px-4 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 transition-colors",
    ghost: "px-4 py-2 text-slate-700 rounded-md hover:bg-slate-100 transition-colors",
  },
  chakra: {
    primary: "px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all",
    secondary: "px-4 py-2 bg-slate-500 text-white rounded-md hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-500 transition-all",
    outline: "px-4 py-2 border border-blue-500 text-blue-500 rounded-md hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all",
    ghost: "px-4 py-2 text-slate-700 rounded-md hover:bg-slate-100 focus:outline-none transition-all",
  },
  radix: {
    primary: "px-4 py-2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-md hover:bg-slate-800 dark:hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-500 transition-colors",
    secondary: "px-4 py-2 bg-slate-600 text-white rounded-md hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500 transition-colors",
    outline: "px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-500 transition-colors",
    ghost: "px-4 py-2 text-slate-700 dark:text-slate-300 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none transition-colors",
  },
  shadcn: {
    primary: "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-slate-900 text-slate-50 hover:bg-slate-900/90 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-50/90 h-10 px-4 py-2",
    secondary: "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-slate-100 text-slate-900 hover:bg-slate-100/80 dark:bg-slate-800 dark:text-slate-50 dark:hover:bg-slate-800/80 h-10 px-4 py-2",
    outline: "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-slate-200 bg-white hover:bg-slate-100 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-950 dark:hover:bg-slate-800 dark:hover:text-slate-50 h-10 px-4 py-2",
    ghost: "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-slate-50 h-10 px-4 py-2",
  },
};

/**
 * IdeaI Card Button Component
 * 
 * A semantic button element that adapts its styling based on the selected framework.
 * Uses proper HTML semantics and accessibility attributes.
 */
export const IdeAICardButton = ({
  framework,
  children,
  className,
  variant = "primary",
  disabled,
  ...props
}: IdeAICardButtonProps) => {
  const baseClasses = frameworkButtonClasses[framework]?.[variant] || frameworkButtonClasses.tailwind.primary;

  return (
    <button
      type="button"
      className={cn(baseClasses, disabled && "opacity-50 cursor-not-allowed", className)}
      disabled={disabled}
      aria-disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};


