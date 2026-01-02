/**
 * @fileoverview React Spring Animation Demo Page
 * 
 * @module ReactSpringPage
 * @description
 * Page route for React Spring physics-based animation demonstrations.
 * Uses lazy loading for optimal performance.
 * 
 * Route: /animations/react-spring
 */

import { lazy, Suspense } from "react";

// Lazy load the demo component for code splitting
const ReactSpringDemo = lazy(() =>
  import("@repo/ui/components/animations/react-spring-demo").then(
    (module) => ({ default: module.ReactSpringDemo })
  )
);

export default function ReactSpringPage() {
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
      <ReactSpringDemo />
    </Suspense>
  );
}

