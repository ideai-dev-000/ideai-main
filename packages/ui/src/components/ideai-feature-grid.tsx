/**
 * @fileoverview IdeaI Feature Grid Component - Centralized feature grid
 * 
 * @module IdeAIFeatureGrid
 * @description
 * Centralized feature grid component for landing pages.
 * Can be used across all IdeaI apps.
 */

import { ReactNode } from "react";

export interface Feature {
  /** Feature title */
  title: string;
  /** Feature description */
  description: string;
  /** Optional icon or visual element */
  icon?: ReactNode;
}

export interface IdeAIFeatureGridProps {
  /** Grid title */
  title?: string;
  /** Features to display */
  features: Feature[];
  /** Number of columns (default: 3) */
  columns?: 2 | 3 | 4;
  /** Custom className */
  className?: string;
}

/**
 * IdeaI Feature Grid Component
 * 
 * Centralized feature grid for landing pages.
 */
export function IdeAIFeatureGrid({
  title,
  features,
  columns = 3,
  className = "",
}: IdeAIFeatureGridProps) {
  const gridCols = {
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
  };

  return (
    <section className={`py-16 ${className}`}>
      {title && (
        <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-12 text-center">
          {title}
        </h2>
      )}
      <div className={`grid ${gridCols[columns]} gap-8`}>
        {features.map((feature, index) => (
          <div
            key={index}
            className="p-6 border border-slate-200 dark:border-slate-700 rounded-lg hover:border-slate-300 dark:hover:border-slate-600 transition-colors"
          >
            {feature.icon && (
              <div className="mb-4 text-4xl">{feature.icon}</div>
            )}
            <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
              {feature.title}
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

