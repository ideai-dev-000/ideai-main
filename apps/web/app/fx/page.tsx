/**
 * @fileoverview FX Showcase Page - Combined Animations and Drawings
 *
 * @module FXPage
 * @description
 * Unified page showcasing all animation and drawing libraries with filtering.
 * Combines animations and drawings into a single FX showcase.
 *
 * Route: /fx
 */

import { lazy, Suspense } from "react";

// Lazy load the showcase component for code splitting
const FXShowcase = lazy(() =>
  import("@repo/ui/components/fx/fx-showcase").then((module) => ({
    default: module.FXShowcase,
  })),
);

export default function FXPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
            <p className="text-slate-600 dark:text-slate-400">
              Loading FX showcase...
            </p>
          </div>
        </div>
      }
    >
      <FXShowcase />
    </Suspense>
  );
}
