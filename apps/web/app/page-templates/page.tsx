/**
 * @fileoverview Page Templates Showcase Page
 * 
 * @module PageTemplatesPage
 * @description
 * Unified page showing all page templates with filtering.
 * Uses lazy loading for optimal performance.
 * 
 * Route: /page-templates
 */

import { lazy, Suspense } from "react";

// Lazy load the showcase component for code splitting
const PageTemplatesShowcase = lazy(() =>
  import("@repo/ui/components/page-templates/page-templates-showcase").then(
    (module) => ({ default: module.PageTemplatesShowcase })
  )
);

export default function PageTemplatesPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
            <p className="text-slate-600 dark:text-slate-400">Loading templates...</p>
          </div>
        </div>
      }
    >
      <PageTemplatesShowcase />
    </Suspense>
  );
}

