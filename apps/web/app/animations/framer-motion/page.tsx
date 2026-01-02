/**
 * @fileoverview Framer Motion Animation Demo Page
 * 
 * @module FramerMotionPage
 * @description
 * Page route for Framer Motion animation demonstrations.
 * Uses lazy loading for optimal performance.
 * 
 * Route: /animations/framer-motion
 */

import { lazy, Suspense } from "react";

// Lazy load the demo component for code splitting
const FramerMotionDemo = lazy(() =>
  import("@repo/ui/components/animations/framer-motion-demo").then(
    (module) => ({ default: module.FramerMotionDemo })
  )
);

export default function FramerMotionPage() {
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
      <FramerMotionDemo />
    </Suspense>
  );
}

