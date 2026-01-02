/**
 * @fileoverview IdeaI Card Footer Component
 * 
 * @module IdeAICardFooter
 * @description
 * Footer component for IdeaI framework cards.
 * Provides semantic footer structure for card metadata.
 * 
 * @example
 * ```tsx
 * <IdeAICardFooter framework="tailwind">
 *   <p>Footer content</p>
 * </IdeAICardFooter>
 * ```
 */

import { ReactNode, HTMLAttributes } from "react";
import { cn } from "../../../lib/utils";
import type { Framework } from "./ideai-card-types";
import { frameworkConfigs } from "./ideai-card-types";

interface IdeAICardFooterProps extends HTMLAttributes<HTMLElement> {
  /** Framework to use for styling */
  framework: Framework;
  /** Footer content */
  children: ReactNode;
  /** Additional CSS classes */
  className?: string;
}

/**
 * IdeaI Card Footer Component
 * 
 * Semantic footer element for card components.
 * Uses proper HTML footer element with framework-adaptive styling.
 */
export const IdeAICardFooter = ({
  framework,
  children,
  className,
  ...props
}: IdeAICardFooterProps) => {
  const config = frameworkConfigs[framework];
  const footerClasses = framework === "bootstrap"
    ? "card-footer bg-transparent border-top pt-3"
    : "pt-4 border-t border-slate-200 dark:border-slate-700";

  return (
    <footer className={cn(footerClasses, className)} {...props}>
      {children}
    </footer>
  );
};



