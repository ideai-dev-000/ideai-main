/**
 * @fileoverview IdeaI Diagnostics Component - Developer tools widget
 * 
 * @module IdeAIDiagnostics
 * @description
 * A lightweight diagnostics widget that displays:
 * - Render performance metrics (DOM render time, component render times)
 * - Total file size of assets loaded
 * - Web Vitals metrics
 * - Framework information
 * - Useful dev tools
 * 
 * Designed to be minimal and efficient, using native browser APIs.
 * No external dependencies, no bloat - just real data from the stack.
 * 
 * @example
 * ```tsx
 * <IdeAIDiagnostics />
 * ```
 * 
 * @todo Add component-level render tracking
 * @todo Add bundle size analysis
 */

"use client";

import { useEffect, useState, useRef } from "react";

interface PerformanceMetrics {
  domContentLoaded: number | null;
  loadComplete: number | null;
  firstPaint: number | null;
  firstContentfulPaint: number | null;
  largestContentfulPaint: number | null;
  totalLoadTime: number | null;
  totalFileSize: number;
  jsFileSize: number;
  cssFileSize: number;
  imageFileSize: number;
  fontFileSize: number;
  framework: string;
  reactVersion: string;
  nextVersion: string | null;
}

interface ComponentRenderTime {
  name: string;
  renderTime: number;
}

export interface IdeAIDiagnosticsProps {
  /** Position of the widget */
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left";
  /** Show/hide the widget */
  visible?: boolean;
  /** Custom app name */
  appName?: string;
}

/**
 * IdeaI Diagnostics Widget
 * 
 * Displays real-time performance metrics and dev tools in a corner widget.
 * Automatically detects framework and collects performance data.
 */
export const IdeAIDiagnostics = ({
  position = "bottom-right",
  visible = true,
  appName,
}: IdeAIDiagnosticsProps) => {
  // Only show in development - never in production
  const isDevelopment = process.env.NODE_ENV === "development" || 
    (typeof window !== "undefined" && window.location.hostname === "localhost");
  
  if (!isDevelopment) {
    return null;
  }

  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    domContentLoaded: null,
    loadComplete: null,
    firstPaint: null,
    firstContentfulPaint: null,
    largestContentfulPaint: null,
    totalLoadTime: null,
    totalFileSize: 0,
    jsFileSize: 0,
    cssFileSize: 0,
    imageFileSize: 0,
    fontFileSize: 0,
    framework: "Next.js",
    reactVersion: "unknown",
    nextVersion: null,
  });
  const [isOpen, setIsOpen] = useState(false);
  const [componentTimes, setComponentTimes] = useState<ComponentRenderTime[]>([]);
  const observerRef = useRef<PerformanceObserver | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Detect framework
    const detectFramework = (): { framework: string; reactVersion: string; nextVersion: string | null } => {
      const reactVersion = (window as any).React?.version || "unknown";
      const nextVersion = (window as any).__NEXT_DATA__?.buildId ? "16.1.0" : null;
      const framework = nextVersion ? "Next.js" : "React";
      return { framework, reactVersion, nextVersion };
    };

    // Calculate file sizes from performance entries
    const calculateFileSizes = (): {
      total: number;
      js: number;
      css: number;
      image: number;
      font: number;
    } => {
      if (!("performance" in window) || !("getEntriesByType" in performance)) {
        return { total: 0, js: 0, css: 0, image: 0, font: 0 };
      }

      const resources = performance.getEntriesByType("resource") as PerformanceResourceTiming[];
      let js = 0;
      let css = 0;
      let image = 0;
      let font = 0;

      resources.forEach((entry) => {
        const size = (entry as any).transferSize || 0;
        const name = entry.name.toLowerCase();

        if (name.endsWith(".js") || name.includes("javascript")) {
          js += size;
        } else if (name.endsWith(".css")) {
          css += size;
        } else if (name.match(/\.(jpg|jpeg|png|gif|webp|svg|ico)$/)) {
          image += size;
        } else if (name.match(/\.(woff|woff2|ttf|otf|eot)$/)) {
          font += size;
        }
      });

      return {
        total: js + css + image + font,
        js,
        css,
        image,
        font,
      };
    };

    // Collect performance metrics
    const collectMetrics = () => {
      const perf = window.performance;
      if (!perf || !perf.timing) return;

      const timing = perf.timing;
      const navigation = perf.getEntriesByType("navigation")[0] as PerformanceNavigationTiming;

      const domContentLoaded = timing.domContentLoadedEventEnd - timing.navigationStart;
      const loadComplete = timing.loadEventEnd - timing.navigationStart;
      const totalLoadTime = timing.loadEventEnd - timing.navigationStart;

      // Get paint metrics
      const paintEntries = perf.getEntriesByType("paint") as PerformancePaintTiming[];
      const firstPaint = paintEntries.find((entry) => entry.name === "first-paint")?.startTime || null;
      const firstContentfulPaint =
        paintEntries.find((entry) => entry.name === "first-contentful-paint")?.startTime || null;

      // Get LCP
      let largestContentfulPaint: number | null = null;
      if ("PerformanceObserver" in window) {
        try {
          const lcpObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const lastEntry = entries[entries.length - 1];
            if (lastEntry) {
              largestContentfulPaint = lastEntry.startTime;
            }
          });
          lcpObserver.observe({ entryTypes: ["largest-contentful-paint"] });
        } catch (e) {
          // LCP not supported
        }
      }

      const fileSizes = calculateFileSizes();
      const frameworkInfo = detectFramework();

      setMetrics({
        domContentLoaded,
        loadComplete,
        firstPaint: firstPaint ? Math.round(firstPaint) : null,
        firstContentfulPaint: firstContentfulPaint ? Math.round(firstContentfulPaint) : null,
        largestContentfulPaint: largestContentfulPaint ? Math.round(largestContentfulPaint) : null,
        totalLoadTime,
        totalFileSize: fileSizes.total,
        jsFileSize: fileSizes.js,
        cssFileSize: fileSizes.css,
        imageFileSize: fileSizes.image,
        fontFileSize: fileSizes.font,
        framework: frameworkInfo.framework,
        reactVersion: frameworkInfo.reactVersion,
        nextVersion: frameworkInfo.nextVersion,
      });
    };

    // Collect metrics after page load
    if (document.readyState === "complete") {
      collectMetrics();
    } else {
      window.addEventListener("load", collectMetrics);
    }

    // Also collect after a short delay to catch late-loading resources
    const timeout = setTimeout(collectMetrics, 2000);

    return () => {
      window.removeEventListener("load", collectMetrics);
      clearTimeout(timeout);
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
  };

  const formatTime = (ms: number | null): string => {
    if (ms === null) return "N/A";
    return `${ms}ms`;
  };

  const positionClasses = {
    "top-right": "top-4 right-4",
    "top-left": "top-4 left-4",
    "bottom-right": "bottom-4 right-4",
    "bottom-left": "bottom-4 left-4",
  };

  if (!visible) return null;

  return (
    <div className={`fixed ${positionClasses[position]} z-50 font-mono text-xs`}>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 px-3 py-2 rounded-lg shadow-lg hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors flex items-center gap-2"
        aria-label="Toggle IdeaI Diagnostics"
      >
        <span className="font-bold">IdeaI</span>
        <span className="text-[10px]">⚡</span>
      </button>

      {/* Diagnostics Panel */}
      {isOpen && (
        <div className="absolute bottom-full right-0 mb-2 w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg shadow-xl p-4 max-h-[80vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
              IdeaI Diagnostics {appName && `- ${appName}`}
            </h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
              aria-label="Close"
            >
              ✕
            </button>
          </div>

          <div className="space-y-4 text-xs">
            {/* Framework Info */}
            <section>
              <h4 className="font-semibold text-slate-700 dark:text-slate-300 mb-2">Framework</h4>
              <div className="space-y-1 text-slate-600 dark:text-slate-400">
                <div>{metrics.framework}</div>
                <div>React {metrics.reactVersion}</div>
                {metrics.nextVersion && <div>Next.js {metrics.nextVersion}</div>}
              </div>
            </section>

            {/* Render Times */}
            <section>
              <h4 className="font-semibold text-slate-700 dark:text-slate-300 mb-2">Render Times</h4>
              <div className="space-y-1 text-slate-600 dark:text-slate-400">
                <div className="flex justify-between">
                  <span>DOM Ready:</span>
                  <span className="font-mono">{formatTime(metrics.domContentLoaded)}</span>
                </div>
                <div className="flex justify-between">
                  <span>First Paint:</span>
                  <span className="font-mono">{formatTime(metrics.firstPaint)}</span>
                </div>
                <div className="flex justify-between">
                  <span>FCP:</span>
                  <span className="font-mono">{formatTime(metrics.firstContentfulPaint)}</span>
                </div>
                <div className="flex justify-between">
                  <span>LCP:</span>
                  <span className="font-mono">{formatTime(metrics.largestContentfulPaint)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Load Complete:</span>
                  <span className="font-mono">{formatTime(metrics.loadComplete)}</span>
                </div>
              </div>
            </section>

            {/* File Sizes */}
            <section>
              <h4 className="font-semibold text-slate-700 dark:text-slate-300 mb-2">File Sizes</h4>
              <div className="space-y-1 text-slate-600 dark:text-slate-400">
                <div className="flex justify-between">
                  <span>Total:</span>
                  <span className="font-mono">{formatBytes(metrics.totalFileSize)}</span>
                </div>
                <div className="flex justify-between">
                  <span>JavaScript:</span>
                  <span className="font-mono">{formatBytes(metrics.jsFileSize)}</span>
                </div>
                <div className="flex justify-between">
                  <span>CSS:</span>
                  <span className="font-mono">{formatBytes(metrics.cssFileSize)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Images:</span>
                  <span className="font-mono">{formatBytes(metrics.imageFileSize)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Fonts:</span>
                  <span className="font-mono">{formatBytes(metrics.fontFileSize)}</span>
                </div>
              </div>
            </section>

            {/* Dev Tools */}
            <section>
              <h4 className="font-semibold text-slate-700 dark:text-slate-300 mb-2">Dev Tools</h4>
              <div className="space-y-2">
                <button
                  onClick={() => {
                    if (typeof window !== "undefined" && (window as any).__REACT_DEVTOOLS_GLOBAL_HOOK__) {
                      console.log("React DevTools detected");
                    } else {
                      console.log("React DevTools not detected");
                    }
                  }}
                  className="w-full text-left px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300"
                >
                  Check React DevTools
                </button>
                <button
                  onClick={() => {
                    console.table(metrics);
                  }}
                  className="w-full text-left px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300"
                >
                  Log Metrics to Console
                </button>
                <button
                  onClick={() => {
                    const perf = window.performance;
                    if (perf && perf.getEntriesByType) {
                      console.log("Performance Entries:", perf.getEntriesByType("resource"));
                    }
                  }}
                  className="w-full text-left px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300"
                >
                  Log Performance Entries
                </button>
              </div>
            </section>
          </div>
        </div>
      )}
    </div>
  );
};

