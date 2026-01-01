/**
 * @fileoverview UniFrame IFrame Wrapper Component
 * 
 * @file uf-iframe-wrapper.tsx
 * @module UFIFrameWrapper
 * @description
 * Wraps the UniFrame component in an iframe to ensure complete CSS isolation.
 * The iframe only includes normalize CSS - no additional CSS presets from the parent page.
 * 
 * This ensures the UniFrame demo shows only the framework-specific CSS without
 * any interference from parent page styles.
 * 
 * @author IdeaI Development Team
 * @since 2026-01-01
 * @version 1.0.0
 * 
 * @example
 * ```tsx
 * import { UFIFrameWrapper } from "@repo/ui/components/uf-iframe-wrapper";
 * 
 * <UFIFrameWrapper />
 * ```
 * 
 * @see {@link ./uf.tsx} - Main UniFrame component
 */

"use client";

import { useState, useEffect, useRef } from "react";

/**
 * UniFrame IFrame Wrapper Component Props
 */
export interface UFIFrameWrapperProps {
  /** Initial framework selection */
  defaultFramework?: string;
  /** IFrame height */
  height?: string;
  /** Additional CSS classes for container */
  className?: string;
}

/**
 * UniFrame IFrame Wrapper Component
 * 
 * Creates an isolated iframe that loads the UF component with only normalize CSS.
 * This ensures no parent page styles interfere with the framework-specific styling.
 */
export const UFIFrameWrapper = ({
  defaultFramework = "tailwind",
  height = "800px",
  className,
}: UFIFrameWrapperProps) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [iframeUrl, setIframeUrl] = useState<string>("");

  // Set iframe URL only on client to avoid hydration mismatch
  useEffect(() => {
    if (typeof window !== "undefined") {
      const baseUrl = window.location.origin;
      setIframeUrl(`${baseUrl}/uf-demo?framework=${defaultFramework}`);
    }
  }, [defaultFramework]);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const handleLoad = () => {
      setIsLoaded(true);
    };

    iframe.addEventListener("load", handleLoad);
    return () => iframe.removeEventListener("load", handleLoad);
  }, []);

  return (
    <div className={`uf-iframe-wrapper relative ${className || ""}`}>
      {iframeUrl && (
        <iframe
          ref={iframeRef}
          src={iframeUrl}
          style={{
            width: "100%",
            height: height,
            border: "1px solid #e2e8f0",
            borderRadius: "0.5rem",
            backgroundColor: "white",
          }}
          className="dark:border-slate-700"
          title="UniFrame Demo - Isolated CSS"
          sandbox="allow-scripts allow-same-origin allow-forms"
          loading="lazy"
        />
      )}
      {(!isLoaded || !iframeUrl) && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-50 dark:bg-slate-900 rounded-lg">
          <p className="text-slate-600 dark:text-slate-400">Loading UniFrame demo...</p>
        </div>
      )}
    </div>
  );
};

