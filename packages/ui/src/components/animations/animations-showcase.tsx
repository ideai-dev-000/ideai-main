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
import { framerMotionExamples, reactSpringExamples } from "./ideai-animations/index";
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
  const appName = process.env.NEXT_PUBLIC_VERCEL_PROJECT_NAME || 
                  (typeof window !== "undefined" ? window.location.pathname.split("/")[1] : "web") ||
                  "web";
  
  // Read config to determine available animation libraries
  const config = readIdeAIConfigSync(appName);
  const availableLibraryIds = config?.animationLibraries || ["framer-motion", "react-spring"];
  
  // Build available libraries based on config
  const allLibraries = [
    { id: "framer-motion", name: "Framer Motion", count: framerMotionExamples.length },
    { id: "react-spring", name: "React Spring", count: reactSpringExamples.length },
  ];
  
  const availableLibraries = allLibraries.filter((lib) => 
    availableLibraryIds.includes(lib.id)
  );
  
  const [selectedLibraries, setSelectedLibraries] = useState<Set<string>>(
    new Set(availableLibraryIds)
  );

  const vercelProjectName = process.env.NEXT_PUBLIC_VERCEL_PROJECT_NAME || "web";
  const vercelOrgId = process.env.NEXT_PUBLIC_VERCEL_ORG_ID || "team_vhjzlMi6CfNow0IfBXnv2Yn2";

  // Combine all examples with library metadata - only include configured libraries
  const allExamples: (AnimationExample & { libraryId: string })[] = useMemo(() => {
    const examples: (AnimationExample & { libraryId: string })[] = [];
    if (availableLibraryIds.includes("framer-motion")) {
      examples.push(...framerMotionExamples.map((ex) => ({ ...ex, libraryId: "framer-motion" })));
    }
    if (availableLibraryIds.includes("react-spring")) {
      examples.push(...reactSpringExamples.map((ex) => ({ ...ex, libraryId: "react-spring" })));
    }
    return examples;
  }, [availableLibraryIds]);

  // Filter examples based on selected libraries
  const filteredExamples = useMemo(() => {
    return allExamples.filter((example) => selectedLibraries.has(example.libraryId));
  }, [selectedLibraries, allExamples]);

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
            Explore all animation frameworks available in IdeaI with their default animations
          </p>
          <div className="flex items-center justify-center gap-2 text-sm">
            <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800">
              Animations: {animationsEnabled ? "Enabled" : "Disabled"}
            </span>
            <span className="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300">
              {filteredExamples.length} Examples
            </span>
          </div>
        </header>

        {/* Filter Toggle Group */}
        <div className="border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-900 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Filter by Library</h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (selectedLibraries.size === availableLibraries.length) {
                  setSelectedLibraries(new Set());
                } else {
                  setSelectedLibraries(new Set(availableLibraries.map((lib) => lib.id)));
                }
              }}
            >
              {selectedLibraries.size === availableLibraries.length ? "Deselect All" : "Select All"}
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

        {/* Animation Examples List */}
        {filteredExamples.length > 0 ? (
          <div className="space-y-6">
            {filteredExamples.map((example) => (
              <AnimationCard
                key={`${example.libraryId}-${example.id}`}
                example={example}
                library={example.libraryId as "framer-motion" | "react-spring"}
              />
            ))}
          </div>
        ) : availableLibraries.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              No animation libraries configured for this app.
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-500">
              Add <code className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded">animationLibraries</code> to your <code className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded">.ideai.json</code> to enable animations.
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

