/**
 * @fileoverview Scroll to Top Component
 *
 * @module ScrollToTop
 * @description
 * Ensures page scrolls to top on route changes and initial load
 */

"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Scroll to Top Component
 * Scrolls page to top on route changes and initial load
 */
export function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    // Scroll to top on route change
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);

  useEffect(() => {
    // Also ensure we're at top on initial mount
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }
  }, []);

  return null;
}
