/**
 * @fileoverview IdeaI Universal Framework Card Component
 * 
 * @module IdeAIUniversalFrameworkCard
 * @description
 * Main IdeaI component that provides a universal card with framework switching capability.
 * Built using atomic design principles for infinite composability and extensibility.
 * 
 * Architecture:
 * - Atoms: Button, Input, Badge (smallest building blocks)
 * - Molecules: FormField, ButtonGroup (combinations of atoms)
 * - Organisms: FrameworkCard (complete card component)
 * - Template: UniversalFrameworkCard (this component - full page/component)
 * 
 * Security: All class strings are predefined in configuration objects (XSS-safe).
 * Uses React's className prop (not innerHTML) for secure class injection.
 * 
 * @example
 * ```tsx
 * <IdeAIUniversalFrameworkCard />
 * ```
 * 
 * @see {@link ./atoms/ideai-framework-button.tsx} - Button atom
 * @see {@link ./atoms/ideai-framework-input.tsx} - Input atom
 * @see {@link ./atoms/ideai-framework-badge.tsx} - Badge atom
 * @see {@link ./molecules/ideai-framework-form-field.tsx} - Form field molecule
 * @see {@link ./molecules/ideai-framework-button-group.tsx} - Button group molecule
 * @see {@link ./organisms/ideai-framework-card.tsx} - Card organism
 */

"use client";

import { useState, useEffect } from "react";
import { IdeAIFrameworkCard } from "./organisms/ideai-framework-card";
import type { Framework } from "./organisms/ideai-framework-card-types";

interface IdeAIUniversalFrameworkCardProps {
  /** Initial framework selection */
  defaultFramework?: Framework;
  /** Additional CSS classes for container */
  className?: string;
}

/**
 * IdeaI Universal Framework Card Component
 * 
 * A complete, composable component system that demonstrates runtime framework switching.
 * Built with atomic design principles for maximum extensibility and reusability.
 * 
 * Features:
 * - Semantic HTML (article, header, footer, label, input, button)
 * - Accessible (ARIA labels, proper form associations)
 * - Composable (atoms → molecules → organisms → template)
 * - Extensible (easy to add new frameworks or components)
 * - Secure (predefined class strings, no XSS risk)
 */
export const IdeAIUniversalFrameworkCard = ({
  defaultFramework = "tailwind",
  className,
}: IdeAIUniversalFrameworkCardProps) => {
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
          htmlFor="ideai-framework-select"
          className="block text-sm font-medium text-slate-700 dark:text-slate-300"
        >
          Select Framework:
        </label>
        <select
          id="ideai-framework-select"
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

      {/* Universal Framework Card Organism */}
      <IdeAIFrameworkCard
        framework={selectedFramework}
        title="Universal Framework Card"
        description="This card dynamically adapts its styling based on the selected framework. All UI elements use framework-specific classes injected at runtime. Built with atomic design principles for infinite composability."
        inputValue={inputValue}
        onInputChange={setInputValue}
        inputLabel="Input Field:"
        inputId="ideai-framework-card-input"
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
          This is sample text content that adapts to the selected framework's typography system.
          The card demonstrates how a single component can render with different visual styles
          based on runtime framework selection.
        </p>
      </IdeAIFrameworkCard>

      {/* Framework Info Section */}
      <aside className="mt-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-2">
          Architecture & Best Practices:
        </h3>
        <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1 list-disc list-inside">
          <li>
            <strong>Atomic Design:</strong> Atoms → Molecules → Organisms → Templates
          </li>
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
            <strong>Composability:</strong> Each component can be used independently or combined
          </li>
          <li>
            <strong>Extensibility:</strong> Easy to add new frameworks or components
          </li>
          <li>
            <strong>Type Safety:</strong> Full TypeScript support with strict types
          </li>
        </ul>
      </aside>
    </section>
  );
};

