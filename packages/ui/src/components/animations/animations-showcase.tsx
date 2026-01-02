/**
 * @fileoverview Unified Animations Showcase - All Animation Libraries
 *
 * @module AnimationsShowcase
 * @description
 * Unified page showcasing all animation libraries with filtering.
 * Shows all animations in one list, filterable by library/framework.
 *
 * @example
 * ```tsx
 * <AnimationsShowcase />
 * ```
 */

"use client";

import { useState, useMemo } from "react";
import { IdeAIPageTemplate } from "../ideai-page-template";
import { AnimationCard } from "./ideai-animations/animation-card";
import {
  framerMotionExamples,
  reactSpringExamples,
  kuteExamples,
  motionOneExamples,
  tsparticlesExamples,
  vivusExamples,
} from "./ideai-animations/index";
import type { AnimationExample } from "./ideai-animations/types";
import { useIdeAIAnimations } from "../../lib/ideai-animations";
import { readIdeAIConfigSync } from "../../lib/ideai-config";
import { Button } from "../ui/button";
import { Sparkles, Zap } from "lucide-react";

/**
 * Unified Animations Showcase Component
 *
 * Displays all animation examples from all libraries in a single list.
 * Filterable by library using toggle group at the top.
 */
export function AnimationsShowcase() {
  const { animationsEnabled } = useIdeAIAnimations();

  // Get app name from environment or default to "web"
  const appName =
    process.env.NEXT_PUBLIC_VERCEL_PROJECT_NAME ||
    (typeof window !== "undefined"
      ? window.location.pathname.split("/")[1]
      : "web") ||
    "web";

  // Default to all libraries - config will override if available
  const defaultLibraryIds = [
    "framer-motion",
    "react-spring",
    "kute",
    "motion-one",
    "tsparticles",
    "vivus",
  ];

  // Read config - use sync for SSR, default to all libraries
  const config = readIdeAIConfigSync(appName);
  const availableLibraryIds = config?.animationLibraries || defaultLibraryIds;

  // Build available libraries based on config
  const allLibraries = [
    {
      id: "framer-motion",
      name: "Framer Motion",
      count: framerMotionExamples.length,
    },
    {
      id: "react-spring",
      name: "React Spring",
      count: reactSpringExamples.length,
    },
    { id: "kute", name: "KUTE.js", count: kuteExamples.length },
    { id: "motion-one", name: "Motion One", count: motionOneExamples.length },
    {
      id: "tsparticles",
      name: "tsParticles",
      count: tsparticlesExamples.length,
    },
    { id: "vivus", name: "Vivus", count: vivusExamples.length },
  ];

  const availableLibraries = allLibraries.filter((lib) =>
    availableLibraryIds.includes(lib.id),
  );

  const [selectedLibraries, setSelectedLibraries] = useState<Set<string>>(
    new Set(availableLibraryIds),
  );
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(
    new Set(),
  );

  const vercelProjectName =
    process.env.NEXT_PUBLIC_VERCEL_PROJECT_NAME || "web";
  const vercelOrgId =
    process.env.NEXT_PUBLIC_VERCEL_ORG_ID || "team_vhjzlMi6CfNow0IfBXnv2Yn2";

  // Combine all examples with library metadata - only include configured libraries
  const allExamples: (AnimationExample & { libraryId: string })[] =
    useMemo(() => {
      const examples: (AnimationExample & { libraryId: string })[] = [];
      if (availableLibraryIds.includes("framer-motion")) {
        examples.push(
          ...framerMotionExamples.map((ex) => ({
            ...ex,
            libraryId: "framer-motion",
          })),
        );
      }
      if (availableLibraryIds.includes("react-spring")) {
        examples.push(
          ...reactSpringExamples.map((ex) => ({
            ...ex,
            libraryId: "react-spring",
          })),
        );
      }
      if (availableLibraryIds.includes("kute")) {
        examples.push(
          ...kuteExamples.map((ex) => ({ ...ex, libraryId: "kute" })),
        );
      }
      if (availableLibraryIds.includes("motion-one")) {
        examples.push(
          ...motionOneExamples.map((ex) => ({
            ...ex,
            libraryId: "motion-one",
          })),
        );
      }
      if (availableLibraryIds.includes("tsparticles")) {
        examples.push(
          ...tsparticlesExamples.map((ex) => ({
            ...ex,
            libraryId: "tsparticles",
          })),
        );
      }
      if (availableLibraryIds.includes("vivus")) {
        examples.push(
          ...vivusExamples.map((ex) => ({ ...ex, libraryId: "vivus" })),
        );
      }
      return examples;
    }, [availableLibraryIds]);

  // Get all unique categories from examples
  const allCategories = useMemo(() => {
    const categories = new Set<string>();
    allExamples.forEach((ex) => categories.add(ex.category));
    return Array.from(categories).sort();
  }, [allExamples]);

  // Get all unique effect types from examples
  const allEffectTypes = useMemo(() => {
    const effectTypes = new Set<string>();
    allExamples.forEach((ex) => {
      if (ex.effectType) {
        effectTypes.add(ex.effectType);
      }
    });
    return Array.from(effectTypes).sort();
  }, [allExamples]);

  const [selectedEffectTypes, setSelectedEffectTypes] = useState<Set<string>>(
    new Set(),
  );

  // Filter examples based on selected libraries, categories, and effect types
  const filteredExamples = useMemo(() => {
    let filtered = allExamples.filter((example) =>
      selectedLibraries.has(example.libraryId),
    );

    // If categories are selected, filter by category too
    if (selectedCategories.size > 0) {
      filtered = filtered.filter((example) =>
        selectedCategories.has(example.category),
      );
    }

    // If effect types are selected, filter by effect type too
    if (selectedEffectTypes.size > 0) {
      filtered = filtered.filter(
        (example) =>
          example.effectType && selectedEffectTypes.has(example.effectType),
      );
    }

    return filtered;
  }, [selectedLibraries, selectedCategories, selectedEffectTypes, allExamples]);

  const toggleLibrary = (libraryId: string) => {
    setSelectedLibraries((prev) => {
      const next = new Set(prev);
      if (next.has(libraryId)) {
        next.delete(libraryId);
      } else {
        next.add(libraryId);
      }
      // Ensure at least one library is selected
      if (next.size === 0) {
        next.add(libraryId);
      }
      return next;
    });
  };

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(category)) {
        next.delete(category);
      } else {
        next.add(category);
      }
      return next;
    });
  };

  const toggleEffectType = (effectType: string) => {
    setSelectedEffectTypes((prev) => {
      const next = new Set(prev);
      if (next.has(effectType)) {
        next.delete(effectType);
      } else {
        next.add(effectType);
      }
      return next;
    });
  };

  return (
    <IdeAIPageTemplate
      siteName="IdeaI"
      vercelProjectName={vercelProjectName}
      vercelOrgId={vercelOrgId}
    >
      <div className="max-w-7xl mx-auto p-8 space-y-8">
        <header className="text-center space-y-4">
          <h1 className="text-4xl font-bold">Animation Libraries Showcase</h1>
          <p className="text-slate-600 dark:text-slate-400">
            Explore all animation frameworks available in IdeaI with their
            default animations
          </p>
          <div className="flex items-center justify-center gap-2 text-sm flex-wrap">
            <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800">
              Animations: {animationsEnabled ? "Enabled" : "Disabled"}
            </span>
            <span className="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300">
              {filteredExamples.length} Examples
            </span>
            <span className="px-3 py-1 rounded-full bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300">
              {availableLibraries.length} Libraries
            </span>
          </div>
          <div className="pt-2">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Available: {availableLibraries.map((lib) => lib.name).join(", ")}
            </p>
          </div>
        </header>

        {/* Filter Toggle Groups */}
        <div className="space-y-4">
          {/* Library Filter */}
          <div className="border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-900 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                Filter by Library
              </h2>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  if (selectedLibraries.size === availableLibraries.length) {
                    setSelectedLibraries(new Set());
                  } else {
                    setSelectedLibraries(
                      new Set(availableLibraries.map((lib) => lib.id)),
                    );
                  }
                }}
              >
                {selectedLibraries.size === availableLibraries.length
                  ? "Deselect All"
                  : "Select All"}
              </Button>
            </div>
            <div className="flex gap-2 flex-wrap">
              {availableLibraries.map((library) => {
                const isSelected = selectedLibraries.has(library.id);
                const Icon = library.id === "framer-motion" ? Sparkles : Zap;
                return (
                  <Button
                    key={library.id}
                    variant={isSelected ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleLibrary(library.id)}
                    aria-pressed={isSelected}
                    className="gap-2"
                  >
                    <Icon className="h-4 w-4" />
                    <span>{library.name}</span>
                    <span className="px-1.5 py-0.5 rounded text-xs bg-slate-200 dark:bg-slate-700">
                      {library.count}
                    </span>
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Effect Type Filter */}
          {allEffectTypes.length > 0 && (
            <div className="border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-900 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                  Filter by Effect Type
                </h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (selectedEffectTypes.size === allEffectTypes.length) {
                      setSelectedEffectTypes(new Set());
                    } else {
                      setSelectedEffectTypes(new Set(allEffectTypes));
                    }
                  }}
                >
                  {selectedEffectTypes.size === allEffectTypes.length
                    ? "Deselect All"
                    : "Select All"}
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {allEffectTypes.map((effectType) => {
                  const isSelected = selectedEffectTypes.has(effectType);
                  return (
                    <Button
                      key={effectType}
                      variant={isSelected ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleEffectType(effectType)}
                      className="capitalize"
                    >
                      {effectType}
                    </Button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Category Filter */}
          {allCategories.length > 0 && (
            <div className="border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-900 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                  Filter by Category
                </h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (selectedCategories.size === allCategories.length) {
                      setSelectedCategories(new Set());
                    } else {
                      setSelectedCategories(new Set(allCategories));
                    }
                  }}
                >
                  {selectedCategories.size === allCategories.length
                    ? "Deselect All"
                    : "Select All"}
                </Button>
              </div>
              <div className="flex gap-2 flex-wrap">
                {allCategories.map((category) => {
                  const isSelected = selectedCategories.has(category);
                  const categoryCount = allExamples.filter(
                    (ex) =>
                      ex.category === category &&
                      selectedLibraries.has(ex.libraryId),
                  ).length;
                  return (
                    <Button
                      key={category}
                      variant={isSelected ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleCategory(category)}
                      aria-pressed={isSelected}
                      className="gap-2"
                    >
                      <span>{category}</span>
                      <span className="px-1.5 py-0.5 rounded text-xs bg-slate-200 dark:bg-slate-700">
                        {categoryCount}
                      </span>
                    </Button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Animation Examples List */}
        {filteredExamples.length > 0 ? (
          <div className="space-y-6">
            {filteredExamples.map((example) => (
              <AnimationCard
                key={`${example.libraryId}-${example.id}`}
                example={example}
                library={
                  example.libraryId as
                    | "framer-motion"
                    | "react-spring"
                    | "kute"
                    | "motion-one"
                    | "tsparticles"
                    | "vivus"
                }
              />
            ))}
          </div>
        ) : availableLibraries.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              No animation libraries configured for this app.
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-500">
              Add{" "}
              <code className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded">
                animationLibraries
              </code>{" "}
              to your{" "}
              <code className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded">
                .ideai.json
              </code>{" "}
              to enable animations.
            </p>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-slate-600 dark:text-slate-400">
              No animations selected. Choose a library above to view examples.
            </p>
          </div>
        )}
      </div>
    </IdeAIPageTemplate>
  );
}
