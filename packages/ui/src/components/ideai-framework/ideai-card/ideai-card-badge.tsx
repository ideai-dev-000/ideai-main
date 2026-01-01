/**
 * @fileoverview IdeaI Card Badge Component
 * 
 * @module IdeAICardBadge
 * @description
 * Badge component that adapts styling based on framework configuration.
 * Part of the IdeaI framework card system.
 * 
 * @example
 * ```tsx
 * <IdeAICardBadge framework="tailwind">
 *   New
 * </IdeAICardBadge>
 * ```
 */

import { ReactNode, HTMLAttributes } from "react";
import { cn } from "../../../lib/utils";
import type { Framework } from "./ideai-card-types";

interface IdeAICardBadgeProps extends HTMLAttributes<HTMLSpanElement> {
  /** Framework to use for styling */
  framework: Framework;
  /** Badge content */
  children: ReactNode;
  /** Additional CSS classes */
  className?: string;
  /** Variant style */
  variant?: "default" | "secondary" | "outline";
}

const frameworkBadgeClasses: Record<Framework, Record<string, string>> = {
  tailwind: {
    default: "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    secondary: "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200",
    outline: "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border border-blue-200 text-blue-800 dark:border-blue-800 dark:text-blue-200",
  },
  bootstrap: {
    default: "badge bg-primary",
    secondary: "badge bg-secondary",
    outline: "badge border border-primary text-primary",
  },
  material: {
    default: "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800",
    secondary: "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800",
    outline: "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border border-blue-200 text-blue-800",
  },
  chakra: {
    default: "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800",
    secondary: "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-800",
    outline: "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border border-blue-200 text-blue-800",
  },
  radix: {
    default: "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200",
    secondary: "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-200 text-slate-900 dark:bg-slate-700 dark:text-slate-100",
    outline: "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border border-slate-300 text-slate-800 dark:border-slate-700 dark:text-slate-200",
  },
  shadcn: {
    default: "inline-flex items-center rounded-full border border-slate-200 bg-white px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 border-slate-950 text-slate-950 hover:bg-slate-950 hover:text-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-50 dark:hover:bg-slate-800",
    secondary: "inline-flex items-center rounded-full border border-slate-200 bg-white px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 border-slate-200 text-slate-900 hover:bg-slate-100 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-50 dark:hover:bg-slate-800",
    outline: "inline-flex items-center rounded-full border border-slate-200 bg-white px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 border-slate-200 text-slate-900 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-50",
  },
};

/**
 * IdeaI Card Badge Component
 * 
 * A semantic span element that displays a badge with framework-adaptive styling.
 */
export const IdeAICardBadge = ({
  framework,
  children,
  className,
  variant = "default",
  ...props
}: IdeAICardBadgeProps) => {
  const baseClasses = frameworkBadgeClasses[framework]?.[variant] || frameworkBadgeClasses.tailwind.default;

  return (
    <span
      className={cn(baseClasses, className)}
      role="status"
      aria-label={typeof children === "string" ? children : "Badge"}
      {...props}
    >
      {children}
    </span>
  );
};

