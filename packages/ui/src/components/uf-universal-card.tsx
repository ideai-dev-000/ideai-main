/**
 * @fileoverview UniFrame Universal Card Component - Main Component with Framework Selector
 * 
 * @file uf-universal-card.tsx
 * @module UniFrameUniversalCard
 * @description
 * Main UniFrame component that provides a universal card with runtime framework switching.
 * Includes a dropdown selector to switch between CSS frameworks at runtime.
 * 
 * UniFrame Architecture:
 * - Card wrapper: Semantic article element with framework-adaptive styling
 * - Header: Title and description section
 * - Body: Main content area (Bootstrap-specific structure)
 * - Footer: Metadata and framework information
 * - UI Elements: Button, Input, Badge, FormField, ButtonGroup
 * 
 * Security: All class strings are predefined in configuration objects (XSS-safe).
 * Uses React's className prop (not innerHTML) for secure class injection.
 * 
 * @author IdeaI Development Team
 * @since 2026-01-01
 * @version 1.0.0
 * 
 * @example
 * ```tsx
 * import { UniFrameUniversalCard } from "@repo/ui/components/uf-universal-card";
 * 
 * <UniFrameUniversalCard />
 * ```
 * 
 * @see {@link ./uniframe/uf-card/uf-card.tsx} - Card wrapper component
 * @see {@link ./uniframe/uf-card/uf-header.tsx} - Card header component
 * @see {@link ./uniframe/uf-card/uf-body.tsx} - Card body component
 * @see {@link ./uniframe/uf-card/uf-footer.tsx} - Card footer component
 * @see {@link ./uniframe/uf-card/uf-button.tsx} - Button UI element
 * @see {@link ./uniframe/uf-card/uf-input.tsx} - Input UI element
 * @see {@link ./uniframe/uf-card/uf-badge.tsx} - Badge UI element
 * @see {@link ./uniframe/uf-card/uf-form-field.tsx} - Form field component
 * @see {@link ./uniframe/uf-card/uf-button-group.tsx} - Button group component
 * @see {@link ./uniframe/uf-card/uf-card-types.ts} - TypeScript type definitions
 * 
 * @todo Add framework transition animations
 * @todo Add framework-specific theme customization
 * @todo Add framework comparison mode
 */

"use client";

import { useState, useEffect } from "react";
import { UniFrameCard } from "./uniframe/uf-card/uf-card";
import type { Framework } from "./uniframe/uf-card/uf-card-types";

interface UniFrameUniversalCardProps {
  /** Initial framework selection */
  defaultFramework?: Framework;
  /** Additional CSS classes for container */
  className?: string;
}

/**
 * UniFrame Universal Card Component
 * 
 * A complete, composable component system that demonstrates runtime framework switching.
 * Built with UniFrame structure: card wrapper, header, body, footer, and UI elements.
 * 
 * Features:
 * - Semantic HTML (article, header, footer, label, input, button)
 * - Accessible (ARIA labels, proper form associations)
 * - Runtime framework switching via dropdown
 * - Composable (card wrapper, header, body, footer, UI elements)
 * - Extensible (easy to add new frameworks or components)
 * - Secure (predefined class strings, no XSS risk)
 * - Framework CSS injection (Bootstrap loads on-demand)
 * 
 * @param props - UniFrame universal card component props
 * @returns React component
 */
export const UniFrameUniversalCard = ({
  defaultFramework = "tailwind",
  className,
}: UniFrameUniversalCardProps) => {
  const [selectedFramework, setSelectedFramework] = useState<Framework>(defaultFramework);
  const [inputValue, setInputValue] = useState("Sample input text");
  const [isLoading, setIsLoading] = useState(false);

  // Dynamically inject framework-specific CSS if needed
  useEffect(() => {
    if (selectedFramework === "bootstrap") {
      // Inject Bootstrap CSS if not already loaded
      if (!document.getElementById("bootstrap-css")) {
        const link = document.createElement("link");
        link.id = "bootstrap-css";
        link.rel = "stylesheet";
        link.href = "https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css";
        link.crossOrigin = "anonymous";
        document.head.appendChild(link);
      }
    }
  }, [selectedFramework]);

  const handlePrimaryAction = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      alert(`Primary action executed with ${selectedFramework} styling!`);
    }, 500);
  };

  const handleSecondaryAction = () => {
    setInputValue("");
  };

  const frameworks: Framework[] = ["tailwind", "bootstrap", "material", "chakra", "radix", "shadcn"];

  return (
    <section className={`w-full max-w-4xl mx-auto p-6 space-y-6 ${className || ""}`}>
      {/* Framework Selector */}
      <div className="space-y-2">
        <label
          htmlFor="uniframe-framework-select"
          className="block text-sm font-medium text-slate-700 dark:text-slate-300"
        >
          Select Framework:
        </label>
        <select
          id="uniframe-framework-select"
          value={selectedFramework}
          onChange={(e) => setSelectedFramework(e.target.value as Framework)}
          className="w-full max-w-xs px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          aria-label="Select CSS framework"
        >
          {frameworks.map((framework) => (
            <option key={framework} value={framework}>
              {framework.charAt(0).toUpperCase() + framework.slice(1)}
            </option>
          ))}
        </select>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Current framework: <span className="font-semibold">{selectedFramework}</span>
        </p>
      </div>

      {/* UniFrame Card */}
      <UniFrameCard
        framework={selectedFramework}
        title="UniFrame Universal Card"
        description="This card dynamically adapts its styling based on the selected framework. All UI elements use framework-specific classes injected at runtime. Built with UniFrame structure: card wrapper, header, body, footer, and UI elements for infinite composability."
        inputValue={inputValue}
        onInputChange={setInputValue}
        inputLabel="Input Field:"
        inputId="uniframe-card-input"
        primaryActionText="Primary Action"
        onPrimaryAction={handlePrimaryAction}
        secondaryActionText="Clear Input"
        onSecondaryAction={handleSecondaryAction}
        badges={[
          { label: selectedFramework, variant: "default" },
          { label: "Active", variant: "secondary" },
        ]}
        isLoading={isLoading}
      >
        <p className="text-slate-700 dark:text-slate-300">
          This is sample text content that adapts to the selected framework&apos;s typography system.
          The card demonstrates how a single component can render with different visual styles
          based on runtime framework selection.
        </p>
      </UniFrameCard>

      {/* Framework Info Section */}
      <aside className="mt-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-2">
          UniFrame Architecture & Best Practices:
        </h3>
        <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1 list-disc list-inside">
          <li>
            <strong>Semantic HTML:</strong> Uses article, header, footer, label, input, button elements
          </li>
          <li>
            <strong>Accessibility:</strong> ARIA labels, proper form associations, keyboard navigation
          </li>
          <li>
            <strong>Security:</strong> Predefined class strings (XSS-safe), React className prop
          </li>
          <li>
            <strong>Composability:</strong> Card wrapper with header, body, footer, and UI elements
          </li>
          <li>
            <strong>Extensibility:</strong> Easy to add new frameworks or components
          </li>
          <li>
            <strong>Type Safety:</strong> Full TypeScript support with strict types
          </li>
          <li>
            <strong>UniFrame Structure:</strong> Organized in uniframe/uf-card folder
          </li>
        </ul>
      </aside>
    </section>
  );
};
