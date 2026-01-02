/**
 * @fileoverview Animations Showcase Page for Docs App
 * 
 * @module AnimationsPage
 * @description
 * Unified animations showcase page for the docs app.
 * Shows all available animation libraries.
 */

import { lazy, Suspense } from "react";

// Lazy load the showcase component for code splitting
const AnimationsShowcase = lazy(() =>
  import("@repo/ui/components/animations/animations-showcase").then(
    (module) => ({ default: module.AnimationsShowcase })
  )
);

export default function AnimationsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
            <p className="text-slate-600 dark:text-slate-400">Loading animations...</p>
          </div>
        </div>
      }
    >
      <AnimationsShowcase />
    </Suspense>
  );
}

