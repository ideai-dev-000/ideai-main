/**
 * @fileoverview IdeaI Hero Component - Centralized hero section
 * 
 * @module IdeAIHero
 * @description
 * Centralized hero component for landing pages.
 * Can be used across all IdeaI apps.
 */

import { ReactNode } from "react";

export interface IdeAIHeroProps {
  /** Hero title */
  title?: string;
  /** Hero subtitle/description */
  subtitle?: string;
  /** Primary action button */
  primaryAction?: ReactNode;
  /** Secondary action button */
  secondaryAction?: ReactNode;
  /** Additional content */
  children?: ReactNode;
  /** Custom className */
  className?: string;
}

/**
 * IdeaI Hero Component
 * 
 * Centralized hero section for landing pages.
 */
export function IdeAIHero({
  title = "Welcome to IdeaI",
  subtitle = "Future-focused framework for building powerful SaaS applications",
  primaryAction,
  secondaryAction,
  children,
  className = "",
}: IdeAIHeroProps) {
  return (
    <section className={`py-16 md:py-24 ${className}`}>
      <div className="max-w-4xl mx-auto text-center">
        {title && (
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-slate-100 mb-6">
            {title}
          </h1>
        )}
        {subtitle && (
          <p className="text-xl text-slate-600 dark:text-slate-400 mb-8">
            {subtitle}
          </p>
        )}
        {(primaryAction || secondaryAction) && (
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {primaryAction}
            {secondaryAction}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}


