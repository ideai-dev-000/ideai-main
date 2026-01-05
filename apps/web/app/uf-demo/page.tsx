/**
 * @fileoverview UniFrame Demo Page - Isolated IFrame Version
 * 
 * @file uf-demo/page.tsx
 * @module UFDemoPage
 * @description
 * Standalone page for UniFrame demo that can be loaded in an iframe.
 * This page only includes normalize CSS - no additional CSS presets.
 * 
 * @author IdeaI Development Team
 * @since 2026-01-01
 * @version 1.0.0
 */

"use client";

import { UF } from "@repo/ui/components/uf";
import type { Framework } from "@repo/ui";
import { Suspense } from "react";

function UFDemoContent() {
  // Get framework from URL search params
  const searchParams = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;
  const defaultFramework = (searchParams?.get("framework") || "tailwind") as Framework;

  return (
    <div style={{ padding: "1rem", minHeight: "100vh" }}>
      <UF defaultFramework={defaultFramework} />
    </div>
  );
}

export default function UFDemoPage() {
  return (
    <Suspense fallback={<div style={{ padding: "2rem", textAlign: "center" }}>Loading UniFrame demo...</div>}>
      <UFDemoContent />
    </Suspense>
  );
}
