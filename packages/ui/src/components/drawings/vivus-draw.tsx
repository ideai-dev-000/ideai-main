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
  className?: string;
}

export function VivusDraw({
  svgId,
  type = "oneByOne",
  duration = 200,
  delay,
  start = "autostart",
  onComplete,
  className,
}: VivusDrawProps) {
  const vivusRef = useRef<any>(null);

  useEffect(() => {
    // Dynamic import for Vivus - using runtime string to prevent static analysis
    const moduleName = 'vivus';
    import(/* @vite-ignore */ moduleName)
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

        const svgElement = document.getElementById(svgId);
        if (Vivus && svgElement) {
          vivusRef.current = new Vivus(svgId, options);
        }
      })
      .catch((error) => {
        console.warn("Vivus not loaded:", error);
      });

    return () => {
      if (vivusRef.current && typeof vivusRef.current.destroy === 'function') {
        vivusRef.current.destroy();
      }
    };
  }, [svgId, type, duration, delay, start, onComplete]);

  return <div className={className} id={svgId} />;
}

