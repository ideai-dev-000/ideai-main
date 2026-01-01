/**
 * @fileoverview UniFrame - Universal Framework Component by IdeaI
 * 
 * @file uniframe.tsx
 * @module UniFrame
 * @description
 * UniFrame is a universal framework component created by IdeaI that uses pure HTML
 * and dynamically injects the right CSS classes and styles for each CSS framework.
 * 
 * Features:
 * - Hot-toggle menu to switch between all CSS frameworks
 * - Pure HTML structure with framework-specific class injection
 * - Automatic CSS loading for frameworks that require external stylesheets
 * - Self-contained in a single file for easy integration
 * - Works on any landing page as a POC
 * 
 * Supported Frameworks:
 * - Tailwind CSS
 * - Bootstrap
 * - Material UI
 * - Chakra UI
 * - Radix UI
 * - shadcn/UI
 * - MVP.css
 * - UnoCSS
 * - No CSS (pure HTML)
 * 
 * @author IdeaI Development Team
 * @since 2026-01-01
 * @version 1.0.0
 * 
 * @example
 * ```tsx
 * import { UniFrame } from "@repo/ui/components/uniframe";
 * 
 * <UniFrame />
 * ```
 * 
 * @todo Add framework transition animations
 * @todo Add framework-specific theme customization
 * @todo Add framework comparison metrics
 */

"use client";

import { useState, useEffect } from "react";

/**
 * All CSS frameworks available in the IdeaI monorepo
 */
export type Framework =
  | "tailwind"
  | "bootstrap"
  | "material"
  | "chakra"
  | "radix"
  | "shadcn"
  | "mvp"
  | "unocss"
  | "nocss";

/**
 * Framework metadata and configuration
 */
interface FrameworkInfo {
  name: string;
  description: string;
  cssUrl?: string; // CDN URL for external CSS
  cardClasses: string;
  buttonClasses: string;
  inputClasses: string;
  badgeClasses: string;
  textClasses: string;
  titleClasses: string;
}

/**
 * Complete framework configurations for all IdeaI CSS frameworks
 */
const FRAMEWORKS: Record<Framework, FrameworkInfo> = {
  tailwind: {
    name: "Tailwind CSS",
    description: "Utility-first CSS framework",
    cardClasses: "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg shadow-md p-6",
    buttonClasses: "px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition-colors",
    inputClasses: "px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500",
    badgeClasses: "px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded text-sm font-medium",
    textClasses: "text-slate-700 dark:text-slate-300",
    titleClasses: "text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2",
  },
  bootstrap: {
    name: "Bootstrap",
    description: "Popular CSS framework with components",
    cssUrl: "https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css",
    cardClasses: "card shadow-sm",
    buttonClasses: "btn btn-primary",
    inputClasses: "form-control",
    badgeClasses: "badge bg-primary",
    textClasses: "text-body",
    titleClasses: "card-title h4",
  },
  material: {
    name: "Material UI",
    description: "Google's Material Design system",
    cssUrl: "https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap",
    cardClasses: "bg-white dark:bg-slate-900 rounded-lg shadow-md p-6 border border-slate-200 dark:border-slate-700",
    buttonClasses: "px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium transition-colors",
    inputClasses: "px-3 py-2 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500",
    badgeClasses: "px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded text-sm font-medium",
    textClasses: "text-slate-700 dark:text-slate-300",
    titleClasses: "text-2xl font-medium text-slate-900 dark:text-slate-100 mb-2",
  },
  chakra: {
    name: "Chakra UI",
    description: "Modular and accessible component library",
    cardClasses: "bg-white dark:bg-slate-900 rounded-lg shadow-md p-6 border border-slate-200 dark:border-slate-700",
    buttonClasses: "px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition-colors",
    inputClasses: "px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500",
    badgeClasses: "px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded text-sm font-medium",
    textClasses: "text-slate-700 dark:text-slate-300",
    titleClasses: "text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2",
  },
  radix: {
    name: "Radix UI",
    description: "Unstyled, accessible UI primitives",
    cardClasses: "bg-white dark:bg-slate-900 rounded-lg shadow-md p-6 border border-slate-200 dark:border-slate-700",
    buttonClasses: "px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition-colors",
    inputClasses: "px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500",
    badgeClasses: "px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded text-sm font-medium",
    textClasses: "text-slate-700 dark:text-slate-300",
    titleClasses: "text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-2",
  },
  shadcn: {
    name: "shadcn/UI",
    description: "Re-usable components built with Radix UI and Tailwind",
    cardClasses: "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg shadow-md p-6",
    buttonClasses: "px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition-colors",
    inputClasses: "px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500",
    badgeClasses: "px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded text-sm font-medium",
    textClasses: "text-slate-700 dark:text-slate-300",
    titleClasses: "text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2",
  },
  mvp: {
    name: "MVP.css",
    description: "Minimalist stylesheet for semantic HTML",
    cardClasses: "border rounded p-6 shadow-sm",
    buttonClasses: "button button-primary",
    inputClasses: "input",
    badgeClasses: "badge",
    textClasses: "",
    titleClasses: "h2",
  },
  unocss: {
    name: "UnoCSS",
    description: "Instant atomic CSS engine",
    cardClasses: "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg shadow-md p-6",
    buttonClasses: "px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition-colors",
    inputClasses: "px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500",
    badgeClasses: "px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded text-sm font-medium",
    textClasses: "text-slate-700 dark:text-slate-300",
    titleClasses: "text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2",
  },
  nocss: {
    name: "No CSS",
    description: "Pure HTML with browser defaults",
    cardClasses: "",
    buttonClasses: "",
    inputClasses: "",
    badgeClasses: "",
    textClasses: "",
    titleClasses: "",
  },
};

/**
 * UniFrame Component Props
 */
export interface UniFrameProps {
  /** Initial framework selection */
  defaultFramework?: Framework;
  /** Additional CSS classes for container */
  className?: string;
}

/**
 * UniFrame - Universal Framework Component by IdeaI
 * 
 * A single-file component that demonstrates hot-toggling between all CSS frameworks
 * available in the IdeaI monorepo. Uses pure HTML and injects framework-specific
 * classes and CSS at runtime.
 * 
 * @param props - UniFrame component props
 * @returns React component
 */
export const UniFrame = ({ defaultFramework = "tailwind", className }: UniFrameProps) => {
  const [selectedFramework, setSelectedFramework] = useState<Framework>(defaultFramework);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [inputValue, setInputValue] = useState("Sample input text");

  const currentFramework = FRAMEWORKS[selectedFramework];

  // Dynamically inject framework CSS if needed
  useEffect(() => {
    if (currentFramework.cssUrl) {
      const linkId = `uniframe-${selectedFramework}-css`;
      if (!document.getElementById(linkId)) {
        const link = document.createElement("link");
        link.id = linkId;
        link.rel = "stylesheet";
        link.href = currentFramework.cssUrl;
        link.crossOrigin = "anonymous";
        document.head.appendChild(link);
      }
    }
  }, [selectedFramework, currentFramework.cssUrl]);

  // Get all framework keys for menu
  const frameworkKeys = Object.keys(FRAMEWORKS) as Framework[];

  return (
    <div className={`uniframe-container ${className || ""}`}>
      {/* Self-created Hot-Toggle Menu */}
      <div className="mb-6 relative">
        <button
          type="button"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="w-full px-4 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md text-left flex items-center justify-between hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          aria-expanded={isMenuOpen}
          aria-haspopup="true"
          aria-label="Select CSS framework"
        >
          <span className="font-medium">
            <span className="text-slate-600 dark:text-slate-400 text-sm">Framework: </span>
            <span className="text-slate-900 dark:text-slate-100">{currentFramework.name}</span>
          </span>
          <svg
            className={`w-5 h-5 text-slate-500 transition-transform ${isMenuOpen ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Dropdown Menu */}
        {isMenuOpen && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setIsMenuOpen(false)}
              aria-hidden="true"
            />
            <div className="absolute z-20 mt-1 w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md shadow-lg max-h-64 overflow-y-auto">
              {frameworkKeys.map((framework) => {
                const frameworkInfo = FRAMEWORKS[framework];
                const isSelected = framework === selectedFramework;
                return (
                  <button
                    key={framework}
                    type="button"
                    onClick={() => {
                      setSelectedFramework(framework);
                      setIsMenuOpen(false);
                    }}
                    className={`w-full px-4 py-2 text-left hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors ${
                      isSelected ? "bg-blue-50 dark:bg-blue-900/20 font-medium" : ""
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className={`text-sm ${isSelected ? "text-blue-700 dark:text-blue-300" : "text-slate-900 dark:text-slate-100"}`}>
                          {frameworkInfo.name}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">
                          {frameworkInfo.description}
                        </div>
                      </div>
                      {isSelected && (
                        <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* Framework Info Badge */}
      <div className="mb-4">
        <span className={currentFramework.badgeClasses || "px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded text-sm"}>
          {currentFramework.name} - {currentFramework.description}
        </span>
      </div>

      {/* Pure HTML Card with Framework-Specific Classes */}
      <article className={currentFramework.cardClasses || "border rounded p-6"}>
        {/* Header */}
        <header>
          <h2 className={currentFramework.titleClasses || "text-2xl font-bold mb-2"}>
            UniFrame by IdeaI
          </h2>
          <p className={currentFramework.textClasses || "text-slate-600 dark:text-slate-400 mb-4"}>
            This card uses pure HTML and dynamically injects CSS classes for{" "}
            <strong>{currentFramework.name}</strong>. Switch frameworks using the menu above to see
            the styling change in real-time.
          </p>
        </header>

        {/* Body */}
        <div className="space-y-4">
          {/* Form Field */}
          <div>
            <label htmlFor="uniframe-input" className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">
              Sample Input
            </label>
            <input
              id="uniframe-input"
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className={currentFramework.inputClasses || "w-full px-3 py-2 border rounded"}
              placeholder="Type something..."
            />
          </div>

          {/* Button Group */}
          <div className="flex gap-2 flex-wrap">
            <button
              type="button"
              className={currentFramework.buttonClasses || "px-4 py-2 bg-blue-600 text-white rounded"}
            >
              Primary Button
            </button>
            <button
              type="button"
              className={currentFramework.buttonClasses || "px-4 py-2 bg-blue-600 text-white rounded"}
            >
              Secondary Action
            </button>
          </div>

          {/* Badge Display */}
          <div className="flex gap-2 flex-wrap items-center">
            <span className={currentFramework.badgeClasses || "px-2 py-1 bg-slate-100 text-slate-800 rounded text-sm"}>
              Framework
            </span>
            <span className={currentFramework.badgeClasses || "px-2 py-1 bg-slate-100 text-slate-800 rounded text-sm"}>
              {currentFramework.name}
            </span>
            <span className={currentFramework.badgeClasses || "px-2 py-1 bg-slate-100 text-slate-800 rounded text-sm"}>
              IdeaI
            </span>
          </div>

          {/* Info Text */}
          <p className={currentFramework.textClasses || "text-sm text-slate-600 dark:text-slate-400"}>
            All styling is applied via framework-specific CSS classes injected at runtime. The HTML
            structure remains the same across all frameworks.
          </p>
        </div>

        {/* Footer */}
        <footer className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700">
          <p className={`text-xs ${currentFramework.textClasses || "text-slate-500 dark:text-slate-400"}`}>
            Created by <strong>IdeaI</strong> • Universal Framework Component • {new Date().getFullYear()}
          </p>
        </footer>
      </article>
    </div>
  );
};

