/**
 * @fileoverview Vivus SVG Drawing Component
 *
 * @module VivusDraw
 * @description
 * React component wrapper for Vivus.js SVG drawing animations.
 * Perfect for logo animations and illustration reveals.
 *
 * @example
 * ```tsx
 * <VivusDraw
 *   svgId="my-logo"
 *   type="oneByOne"
 *   duration={200}
 *   onComplete={() => console.log('Done!')}
 * />
 * ```
 */

"use client";

import { useEffect, useRef } from "react";

interface VivusDrawProps {
  svgId: string;
  type?: "delayed" | "sync" | "oneByOne" | "scenario" | "scenario-sync";
  duration?: number;
  delay?: number;
  start?: "manual" | "autostart" | "inViewport";
  onComplete?: () => void;
  onVivusReady?: (vivus: any) => void;
  className?: string;
}

export function VivusDraw({
  svgId,
  type = "oneByOne",
  duration = 200,
  delay,
  start = "autostart",
  onComplete,
  onVivusReady,
  className,
}: VivusDrawProps) {
  const vivusRef = useRef<any>(null);

  useEffect(() => {
    // Wait for SVG to be in DOM
    const checkAndInit = () => {
      const svgElement = document.getElementById(svgId);
      if (!svgElement) {
        // Retry after a short delay
        setTimeout(checkAndInit, 100);
        return;
      }

      // Dynamic import for Vivus
      import("vivus")
        .then((VivusModule) => {
          const Vivus = VivusModule.default || (VivusModule as any);
          const options: any = {
            type,
            duration,
            start,
          };

          if (delay !== undefined) {
            options.delay = delay;
          }

          if (onComplete) {
            options.callback = onComplete;
          }

          const svgEl = document.getElementById(svgId);
          if (Vivus && svgEl) {
            // Destroy previous instance if exists
            if (
              vivusRef.current &&
              typeof vivusRef.current.destroy === "function"
            ) {
              vivusRef.current.destroy();
            }

            // Reset SVG paths - clear any existing stroke-dasharray/dashoffset
            const paths = svgEl.querySelectorAll(
              "path, circle, rect, line, polyline, polygon",
            );
            paths.forEach((path) => {
              const p = path as SVGElement;
              p.style.strokeDasharray = "";
              p.style.strokeDashoffset = "";
              p.style.opacity = "1";
            });

            // Create new instance
            vivusRef.current = new Vivus(svgId, options);

            // Notify parent component
            if (onVivusReady) {
              onVivusReady(vivusRef.current);
            }
          }
        })
        .catch((error) => {
          console.warn("Vivus not loaded:", error);
        });
    };

    // Start checking
    checkAndInit();

    return () => {
      if (vivusRef.current && typeof vivusRef.current.destroy === "function") {
        vivusRef.current.destroy();
      }
    };
  }, [svgId, type, duration, delay, start, onComplete, onVivusReady]);

  return <div className={className} />; // SVG is rendered separately in parent, this is just a placeholder
}
