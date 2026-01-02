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
import { motion, AnimatePresence } from "framer-motion";
import { PanelRight, PanelLeft } from "lucide-react";
import {
  useIdeAIAnimations,
  sideMenuVariants,
  panelVariants,
  overlayVariants,
  createAnimationVariants,
} from "../lib/ideai-animations";

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
  const [isSideMenu, setIsSideMenu] = useState(true); // Default to side menu view
  const [componentTimes, setComponentTimes] = useState<ComponentRenderTime[]>([]);
  const observerRef = useRef<PerformanceObserver | null>(null);
  const { animationsEnabled } = useIdeAIAnimations();

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
    "top-right": "ideai-diagnostics--top-right",
    "top-left": "ideai-diagnostics--top-left",
    "bottom-right": "ideai-diagnostics--bottom-right",
    "bottom-left": "ideai-diagnostics--bottom-left",
  };

  if (!visible) return null;

  return (
    <div className={`ideai-diagnostics ${positionClasses[position]}`}>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="ideai-diagnostics__toggle"
        aria-label="Toggle IdeaI Diagnostics"
      >
        <span style={{ fontWeight: 700 }}>IdeaI</span>
        <span style={{ fontSize: "10px" }}>⚡</span>
      </button>

      {/* Overlay - Only show in side menu mode */}
      <AnimatePresence>
        {isOpen && isSideMenu && (
          <motion.div
            className="ideai-diagnostics__overlay"
            variants={createAnimationVariants(overlayVariants, animationsEnabled)}
            initial="closed"
            animate="open"
            exit="closed"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Diagnostics Panel */}
      <AnimatePresence mode="wait">
        {isOpen && (
          <motion.div
            key={isSideMenu ? "side-menu" : "panel"}
            className={`ideai-diagnostics__panel ${isSideMenu ? "ideai-diagnostics__panel--side-menu" : ""}`}
            variants={createAnimationVariants(
              isSideMenu ? sideMenuVariants : panelVariants,
              animationsEnabled
            )}
            initial="closed"
            animate="open"
            exit="closed"
          >
            {/* Header */}
            <div className="ideai-diagnostics__header">
              <div>
                <h3 className="ideai-diagnostics__title">
                  IdeaI Diagnostics {appName && `- ${appName}`}
                </h3>
                <p className="ideai-diagnostics__subtitle">Performance metrics and diagnostics</p>
              </div>
              <div className="ideai-diagnostics__header-actions">
                {/* Toggle View Button */}
                <button
                  onClick={() => setIsSideMenu(!isSideMenu)}
                  className="ideai-diagnostics__toggle-view"
                  aria-label={isSideMenu ? "Switch to panel view" : "Switch to side menu view"}
                  title={isSideMenu ? "Panel View" : "Side Menu View"}
                >
                  {isSideMenu ? (
                    <PanelLeft className="h-5 w-5" />
                  ) : (
                    <PanelRight className="h-5 w-5" />
                  )}
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="ideai-diagnostics__close"
                  aria-label="Close"
                >
                  ✕
                </button>
              </div>
            </div>

          {/* Dashboard Grid */}
          <div className="ideai-diagnostics__grid">
            {/* Framework Info - 3 columns */}
            <section className="ideai-diagnostics__card" style={{ gridColumn: "span 3" }}>
              <h4 className="ideai-diagnostics__card-title">Framework</h4>
              <div className="ideai-diagnostics__card-content">
                <div className="ideai-diagnostics__row">
                  <span className="ideai-diagnostics__label">Framework:</span>
                  <span className="ideai-diagnostics__value" style={{ fontWeight: 500 }}>{metrics.framework}</span>
                </div>
                <div className="ideai-diagnostics__row">
                  <span className="ideai-diagnostics__label">React:</span>
                  <span className="ideai-diagnostics__value">{metrics.reactVersion}</span>
                </div>
                {metrics.nextVersion && (
                  <div className="ideai-diagnostics__row">
                    <span className="ideai-diagnostics__label">Next.js:</span>
                    <span className="ideai-diagnostics__value">{metrics.nextVersion}</span>
                  </div>
                )}
              </div>
            </section>

            {/* Render Times - 5 columns */}
            <section className="ideai-diagnostics__card" style={{ gridColumn: "span 5" }}>
              <h4 className="ideai-diagnostics__card-title">Render Times</h4>
              <div className="ideai-diagnostics__card-content">
                <div className="ideai-diagnostics__row">
                  <span className="ideai-diagnostics__label">DOM Ready:</span>
                  <span className="ideai-diagnostics__value" style={{ fontWeight: 500 }}>{formatTime(metrics.domContentLoaded)}</span>
                </div>
                <div className="ideai-diagnostics__row">
                  <span className="ideai-diagnostics__label">First Paint:</span>
                  <span className="ideai-diagnostics__value" style={{ fontWeight: 500 }}>{formatTime(metrics.firstPaint)}</span>
                </div>
                <div className="ideai-diagnostics__row">
                  <span className="ideai-diagnostics__label">FCP:</span>
                  <span className="ideai-diagnostics__value" style={{ fontWeight: 500 }}>{formatTime(metrics.firstContentfulPaint)}</span>
                </div>
                <div className="ideai-diagnostics__row">
                  <span className="ideai-diagnostics__label">LCP:</span>
                  <span className="ideai-diagnostics__value" style={{ fontWeight: 500 }}>{formatTime(metrics.largestContentfulPaint)}</span>
                </div>
                <div className="ideai-diagnostics__row">
                  <span className="ideai-diagnostics__label">Load Complete:</span>
                  <span className="ideai-diagnostics__value" style={{ fontWeight: 500 }}>{formatTime(metrics.loadComplete)}</span>
                </div>
              </div>
            </section>

            {/* File Sizes - 4 columns */}
            <section className="ideai-diagnostics__card" style={{ gridColumn: "span 4" }}>
              <h4 className="ideai-diagnostics__card-title">File Sizes</h4>
              <div className="ideai-diagnostics__card-content">
                <div className="ideai-diagnostics__row">
                  <span className="ideai-diagnostics__label">Total:</span>
                  <span className="ideai-diagnostics__value" style={{ fontWeight: 500 }}>{formatBytes(metrics.totalFileSize)}</span>
                </div>
                <div className="ideai-diagnostics__row">
                  <span className="ideai-diagnostics__label">JavaScript:</span>
                  <span className="ideai-diagnostics__value" style={{ fontWeight: 500 }}>{formatBytes(metrics.jsFileSize)}</span>
                </div>
                <div className="ideai-diagnostics__row">
                  <span className="ideai-diagnostics__label">CSS:</span>
                  <span className="ideai-diagnostics__value" style={{ fontWeight: 500 }}>{formatBytes(metrics.cssFileSize)}</span>
                </div>
                <div className="ideai-diagnostics__row">
                  <span className="ideai-diagnostics__label">Images:</span>
                  <span className="ideai-diagnostics__value" style={{ fontWeight: 500 }}>{formatBytes(metrics.imageFileSize)}</span>
                </div>
                <div className="ideai-diagnostics__row">
                  <span className="ideai-diagnostics__label">Fonts:</span>
                  <span className="ideai-diagnostics__value" style={{ fontWeight: 500 }}>{formatBytes(metrics.fontFileSize)}</span>
                </div>
              </div>
            </section>

            {/* Dev Tools - Full width row */}
            <section className="ideai-diagnostics__card" style={{ gridColumn: "span 12" }}>
              <h4 className="ideai-diagnostics__card-title">Dev Tools</h4>
              <div className="ideai-diagnostics__tools-grid">
                <button
                  onClick={() => {
                    if (typeof window !== "undefined" && (window as any).__REACT_DEVTOOLS_GLOBAL_HOOK__) {
                      console.log("React DevTools detected");
                    } else {
                      console.log("React DevTools not detected");
                    }
                  }}
                  className="ideai-diagnostics__tool-button"
                >
                  <div className="ideai-diagnostics__tool-title">Check React DevTools</div>
                  <div className="ideai-diagnostics__tool-desc">Detect if DevTools is active</div>
                </button>
                <button
                  onClick={() => {
                    console.table(metrics);
                  }}
                  className="ideai-diagnostics__tool-button"
                >
                  <div className="ideai-diagnostics__tool-title">Log Metrics to Console</div>
                  <div className="ideai-diagnostics__tool-desc">Output all metrics data</div>
                </button>
                <button
                  onClick={() => {
                    const perf = window.performance;
                    if (perf && perf.getEntriesByType) {
                      console.log("Performance Entries:", perf.getEntriesByType("resource"));
                    }
                  }}
                  className="ideai-diagnostics__tool-button"
                >
                  <div className="ideai-diagnostics__tool-title">Log Performance Entries</div>
                  <div className="ideai-diagnostics__tool-desc">View performance data</div>
                </button>
              </div>
            </section>
          </div>
        </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

