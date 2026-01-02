/**
 * @fileoverview IdeaI CTA Section Component - Centralized call-to-action
 * 
 * @module IdeAICTASection
 * @description
 * Centralized CTA section component for landing pages.
 * Can be used across all IdeaI apps.
 */

import { ReactNode } from "react";

export interface IdeAICTASectionProps {
  /** CTA title */
  title: string;
  /** CTA description */
  description?: string;
  /** Primary action button */
  primaryAction: ReactNode;
  /** Secondary action button (optional) */
  secondaryAction?: ReactNode;
  /** Custom className */
  className?: string;
}

/**
 * IdeaI CTA Section Component
 * 
 * Centralized call-to-action section for landing pages.
 */
export function IdeAICTASection({
  title,
  description,
  primaryAction,
  secondaryAction,
  className = "",
}: IdeAICTASectionProps) {
  return (
    <section className={`py-16 bg-slate-50 dark:bg-slate-900 rounded-lg ${className}`}>
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-4">
          {title}
        </h2>
        {description && (
          <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">
            {description}
          </p>
        )}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {primaryAction}
          {secondaryAction}
        </div>
      </div>
    </section>
  );
}


