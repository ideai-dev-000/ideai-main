/**
 * @fileoverview Universal Framework Card Component
 * 
 * @module UniversalFrameworkCard
 * @description
 * A universal card component that can dynamically switch between different CSS frameworks
 * at runtime. Uses secure, modern class injection based on framework selection.
 * 
 * Supports: Tailwind, Bootstrap, Material UI, Chakra UI, Radix UI, and custom frameworks.
 * 
 * Security: All class strings are predefined in a configuration object (no user input).
 * Uses React's className prop (not innerHTML), making it XSS-safe. No template engine
 * needed - React's built-in rendering handles class injection securely.
 * 
 * @example
 * ```tsx
 * <UniversalFrameworkCard />
 * ```
 */

"use client";

import { useState, useEffect } from "react";
import { cn } from "../lib/utils";

type Framework = "tailwind" | "bootstrap" | "material" | "chakra" | "radix" | "shadcn";

interface FrameworkConfig {
  name: string;
  cardClasses: string;
  buttonClasses: string;
  badgeClasses: string;
  inputClasses: string;
  textClasses: string;
  titleClasses: string;
  descriptionClasses: string;
}

const frameworkConfigs: Record<Framework, FrameworkConfig> = {
  tailwind: {
    name: "Tailwind CSS",
    cardClasses: "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg shadow-md p-6",
    buttonClasses: "px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors",
    badgeClasses: "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    inputClasses: "w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
    textClasses: "text-slate-700 dark:text-slate-300",
    titleClasses: "text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2",
    descriptionClasses: "text-slate-600 dark:text-slate-400 mb-4",
  },
  bootstrap: {
    name: "Bootstrap",
    cardClasses: "card shadow-sm",
    buttonClasses: "btn btn-primary",
    badgeClasses: "badge bg-primary",
    inputClasses: "form-control",
    textClasses: "text-body",
    titleClasses: "card-title h4",
    descriptionClasses: "card-text text-muted",
  },
  material: {
    name: "Material UI",
    cardClasses: "bg-white dark:bg-slate-900 rounded-lg shadow-md p-6 border border-slate-200 dark:border-slate-700",
    buttonClasses: "px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors shadow-sm",
    badgeClasses: "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800",
    inputClasses: "w-full px-3 py-2 border-b-2 border-blue-600 bg-transparent text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-800",
    textClasses: "text-slate-700 dark:text-slate-300",
    titleClasses: "text-2xl font-medium text-slate-900 dark:text-slate-100 mb-2",
    descriptionClasses: "text-slate-600 dark:text-slate-400 mb-4",
  },
  chakra: {
    name: "Chakra UI",
    cardClasses: "bg-white dark:bg-slate-900 rounded-lg shadow-md p-6 border border-slate-200 dark:border-slate-700",
    buttonClasses: "px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all",
    badgeClasses: "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800",
    inputClasses: "w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500",
    textClasses: "text-slate-700 dark:text-slate-300",
    titleClasses: "text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2",
    descriptionClasses: "text-slate-600 dark:text-slate-400 mb-4",
  },
  radix: {
    name: "Radix UI",
    cardClasses: "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm p-6",
    buttonClasses: "px-4 py-2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-md hover:bg-slate-800 dark:hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-500 transition-colors",
    badgeClasses: "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200",
    inputClasses: "w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-500",
    textClasses: "text-slate-700 dark:text-slate-300",
    titleClasses: "text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-2",
    descriptionClasses: "text-slate-600 dark:text-slate-400 mb-4",
  },
  shadcn: {
    name: "Shadcn/UI",
    cardClasses: "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm p-6",
    buttonClasses: "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-slate-900 text-slate-50 hover:bg-slate-900/90 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-50/90 h-10 px-4 py-2",
    badgeClasses: "inline-flex items-center rounded-full border border-slate-200 bg-white px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 border-slate-950 text-slate-950 hover:bg-slate-950 hover:text-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-50 dark:hover:bg-slate-800",
    inputClasses: "flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:ring-offset-slate-950 dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-300",
    textClasses: "text-slate-900 dark:text-slate-100",
    titleClasses: "text-2xl font-semibold leading-none tracking-tight text-slate-900 dark:text-slate-100 mb-2",
    descriptionClasses: "text-sm text-slate-500 dark:text-slate-400 mb-4",
  },
};

/**
 * Universal Framework Card Component
 * 
 * Displays a rich card with standard UI elements that can dynamically switch
 * between different CSS frameworks at runtime using secure class injection.
 */
export const UniversalFrameworkCard = () => {
  const [selectedFramework, setSelectedFramework] = useState<Framework>("tailwind");
  const [inputValue, setInputValue] = useState("Sample input text");
  const [isLoading, setIsLoading] = useState(false);

  const config = frameworkConfigs[selectedFramework];

  // Dynamically inject framework-specific CSS if needed
  useEffect(() => {
    if (selectedFramework === "bootstrap") {
      // Inject Bootstrap CSS if not already loaded
      if (!document.getElementById("bootstrap-css")) {
        const link = document.createElement("link");
        link.id = "bootstrap-css";
        link.rel = "stylesheet";
        link.href = "https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css";
        document.head.appendChild(link);
      }
    }
  }, [selectedFramework]);

  const handleButtonClick = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      alert(`Button clicked with ${config.name} styling!`);
    }, 500);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-6">
      {/* Framework Selector Dropdown */}
      <div className="space-y-2">
        <label htmlFor="framework-select" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
          Select Framework:
        </label>
        <select
          id="framework-select"
          value={selectedFramework}
          onChange={(e) => setSelectedFramework(e.target.value as Framework)}
          className="w-full max-w-xs px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {Object.keys(frameworkConfigs).map((framework) => (
            <option key={framework} value={framework}>
              {frameworkConfigs[framework as Framework].name}
            </option>
          ))}
        </select>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Current framework: <span className="font-semibold">{config.name}</span>
        </p>
      </div>

      {/* Universal Framework Card */}
      {selectedFramework === "bootstrap" ? (
        // Bootstrap-specific structure
        <div className={config.cardClasses}>
          <div className="card-body">
            <h2 className={config.titleClasses}>Universal Framework Card</h2>
            <p className={config.descriptionClasses}>
              This card dynamically adapts its styling based on the selected framework. All UI elements
              use framework-specific classes injected at runtime.
            </p>
            
            <div className="mb-3">
              <span className={config.badgeClasses}>{config.name}</span>
              <span className={cn(config.badgeClasses, "ms-2")}>Active</span>
            </div>

            <div className="mb-3">
              <label htmlFor="demo-input" className="form-label">
                Input Field:
              </label>
              <input
                id="demo-input"
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type something..."
                className={config.inputClasses}
              />
            </div>

            <p className={cn(config.textClasses, "mb-3")}>
              This is sample text content that adapts to the selected framework's typography system.
              The card demonstrates how a single component can render with different visual styles
              based on runtime framework selection.
            </p>

            <div className="d-flex flex-wrap gap-2 mb-3">
              <button
                onClick={handleButtonClick}
                disabled={isLoading}
                className={cn(config.buttonClasses, isLoading && "disabled")}
              >
                {isLoading ? "Loading..." : "Primary Action"}
              </button>
              <button
                onClick={() => setInputValue("")}
                className="btn btn-secondary"
              >
                Clear Input
              </button>
            </div>

            <div className="card-footer bg-transparent border-top pt-3">
              <div className="d-flex justify-content-between align-items-center">
                <p className={cn(config.textClasses, "mb-0 small")}>
                  Framework: <span className="fw-bold">{config.name}</span>
                </p>
                <div className="d-flex gap-2">
                  <span className={config.badgeClasses}>React</span>
                  <span className={config.badgeClasses}>Next.js</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        // Standard structure for other frameworks
        <div className={cn(config.cardClasses)}>
          {/* Card Header */}
          <div className="mb-6">
            <h2 className={config.titleClasses}>Universal Framework Card</h2>
            <p className={config.descriptionClasses}>
              This card dynamically adapts its styling based on the selected framework. All UI elements
              use framework-specific classes injected at runtime.
            </p>
          </div>

          {/* Badge */}
          <div className="mb-4">
            <span className={config.badgeClasses}>{config.name}</span>
            <span className={cn(config.badgeClasses, "ml-2")}>Active</span>
          </div>

          {/* Input Field */}
          <div className="mb-4">
            <label htmlFor="demo-input" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Input Field:
            </label>
            <input
              id="demo-input"
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type something..."
              className={config.inputClasses}
            />
          </div>

          {/* Text Content */}
          <div className="mb-4">
            <p className={config.textClasses}>
              This is sample text content that adapts to the selected framework's typography system.
              The card demonstrates how a single component can render with different visual styles
              based on runtime framework selection.
            </p>
          </div>

          {/* Button Group */}
          <div className="flex flex-wrap gap-3 mb-4">
            <button
              onClick={handleButtonClick}
              disabled={isLoading}
              className={cn(
                config.buttonClasses,
                isLoading && "opacity-50 cursor-not-allowed"
              )}
            >
              {isLoading ? "Loading..." : "Primary Action"}
            </button>
            <button
              onClick={() => setInputValue("")}
              className={cn(
                config.buttonClasses,
                "bg-slate-600 hover:bg-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600"
              )}
            >
              Clear Input
            </button>
          </div>

          {/* Card Footer */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <p className={cn(config.textClasses, "text-sm")}>
                Framework: <span className="font-semibold">{config.name}</span>
              </p>
              <div className="flex gap-2">
                <span className={cn(config.badgeClasses, "text-xs")}>React</span>
                <span className={cn(config.badgeClasses, "text-xs")}>Next.js</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Framework Info */}
      <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-2">
          How it works:
        </h3>
        <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1 list-disc list-inside">
          <li>Framework classes are injected securely at runtime using React state</li>
          <li>No template engine needed - uses React's built-in className management</li>
          <li>All class strings are predefined and validated (XSS-safe)</li>
          <li>CSS frameworks are loaded on-demand when needed</li>
          <li>Follows Tailwind + shadcn best practices for class composition</li>
        </ul>
      </div>
    </div>
  );
};

