/**
 * @fileoverview Drawings Showcase Page for Web App
 * 
 * @module DrawingsPage
 * @description
 * SVG drawing animations showcase page for the web app.
 * Shows Vivus and SVG Artista drawing animations.
 */

import { lazy, Suspense } from "react";

// Lazy load the showcase component for code splitting
const DrawingsShowcase = lazy(() =>
  import("@repo/ui/components/drawings/drawings-showcase").then(
    (module) => ({ default: module.DrawingsShowcase })
  )
);

export default function DrawingsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
            <p className="text-slate-600 dark:text-slate-400">Loading drawings...</p>
          </div>
        </div>
      }
    >
      <DrawingsShowcase />
    </Suspense>
  );
}

