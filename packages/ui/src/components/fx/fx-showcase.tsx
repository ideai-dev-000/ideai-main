/**
 * @fileoverview FX Showcase - Combined Animations and Drawings
 *
 * @module FXShowcase
 * @description
 * Unified page showcasing all animation and drawing libraries with filtering.
 * Combines AnimationsShowcase and DrawingsShowcase into a single FX showcase.
 * Users can filter by type (animations vs drawings) and by library.
 *
 * @example
 * ```tsx
 * <FXShowcase />
 * ```
 */

"use client";

import { useState, useMemo } from "react";
import { IdeAIPageTemplate } from "../ideai-page-template";
import { AnimationCard } from "../animations/ideai-animations/animation-card";
import { VivusDraw } from "../drawings/vivus-draw";
import { SVGArtistaDraw } from "../drawings/svg-artista-draw";
import {
  framerMotionExamples,
  reactSpringExamples,
  kuteExamples,
  motionOneExamples,
  tsparticlesExamples,
  vivusExamples,
} from "../animations/ideai-animations/index";
import type { AnimationExample } from "../animations/ideai-animations/types";
import { useIdeAIAnimations } from "../../lib/ideai-animations";
import { readIdeAIConfigSync } from "../../lib/ideai-config";
import { Button } from "../ui/button";
import { Sparkles, Zap, Play } from "lucide-react";
import { IdeaIButton } from "../ideai-button";

interface DrawingExample {
  id: string;
  title: string;
  description: string;
  library: string;
  category: string;
  tags: string[];
  type: string;
  duration?: number;
  delay?: number;
}

// Drawing examples data (from drawings-showcase)
const vivusDrawingExamples: DrawingExample[] = [
  {
    id: "vivus-sync",
    title: "Sync Animation",
    description: "Draw all paths simultaneously",
    library: "Vivus",
    category: "Sync",
    tags: ["vivus", "sync", "drawing"],
    type: "sync",
    duration: 2,
  },
  {
    id: "vivus-delayed",
    title: "Delayed Animation",
    description: "Draw paths one after another with delay",
    library: "Vivus",
    category: "Delayed",
    tags: ["vivus", "delayed", "drawing"],
    type: "delayed",
    duration: 2,
    delay: 100,
  },
  {
    id: "vivus-one-by-one",
    title: "One By One",
    description: "Draw paths sequentially",
    library: "Vivus",
    category: "Sequential",
    tags: ["vivus", "sequential", "drawing"],
    type: "oneByOne",
    duration: 2,
  },
];

const svgArtistaDrawingExamples: DrawingExample[] = [
  {
    id: "svg-artista-stroke",
    title: "Stroke Animation",
    description: "Animate SVG stroke drawing using CSS",
    library: "SVG Artista",
    category: "Stroke",
    tags: ["stroke", "css", "drawing"],
    type: "stroke",
    duration: 2,
  },
  {
    id: "svg-artista-fill",
    title: "Fill Animation",
    description: "Animate SVG fill appearance using CSS",
    library: "SVG Artista",
    category: "Fill",
    tags: ["fill", "css", "drawing"],
    type: "fill",
    duration: 2,
  },
  {
    id: "svg-artista-both",
    title: "Both Stroke & Fill",
    description: "Animate both stroke and fill simultaneously",
    library: "SVG Artista",
    category: "Combined",
    tags: ["stroke", "fill", "css", "drawing"],
    type: "both",
    duration: 2,
  },
];

type FXType = "animation" | "drawing";

interface FXExample {
  type: FXType;
  libraryId: string;
  id: string;
  title: string;
  description: string;
  category: string;
  animationExample?: AnimationExample;
  drawingExample?: DrawingExample;
}

/**
 * Drawing Card Component with Play Button
 */
function DrawingCard({
  example,
}: {
  example: DrawingExample & { libraryId: string };
}) {
  const [animationKey, setAnimationKey] = useState(0);

  const sampleSVG = `
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <circle cx="100" cy="100" r="80" fill="none" stroke="currentColor" stroke-width="4"/>
      <path d="M 60 100 L 100 60 L 140 100 L 100 140 Z" fill="none" stroke="currentColor" stroke-width="3"/>
    </svg>
  `;

  return (
    <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-4 bg-white dark:bg-slate-800">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-1">
            {example.title}
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
            {example.description}
          </p>
          <div className="flex gap-2 flex-wrap">
            <span className="px-2 py-0.5 rounded text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300">
              {example.library}
            </span>
            <span className="px-2 py-0.5 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
              {example.category}
            </span>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setAnimationKey((prev) => prev + 1)}
          className="ml-2"
        >
          <Play className="h-4 w-4 mr-1" />
          Play
        </Button>
      </div>
      <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-700 flex items-center justify-center min-h-[200px]">
        {example.libraryId === "vivus" ? (
          <VivusDraw
            key={animationKey}
            svgContent={sampleSVG}
            type={example.type as any}
            duration={example.duration || 2}
            delay={example.delay}
          />
        ) : (
          <SVGArtistaDraw
            key={animationKey}
            svgContent={sampleSVG}
            animationType={example.type as any}
            duration={example.duration || 2}
            delay={example.delay}
          />
        )}
      </div>
    </div>
  );
}

/**
 * Unified FX Showcase Component
 *
 * Combines animations and drawings into a single showcase with filtering.
 */
export function FXShowcase() {
  const { animationsEnabled } = useIdeAIAnimations();

  // Get app name from environment or default to "web"
  const appName =
    process.env.NEXT_PUBLIC_VERCEL_PROJECT_NAME ||
    (typeof window !== "undefined"
      ? window.location.pathname.split("/")[1]
      : "web") ||
    "web";

  // Default to all libraries
  const defaultLibraryIds = [
    "framer-motion",
    "react-spring",
    "kute",
    "motion-one",
    "tsparticles",
    "vivus",
    "svg-artista",
  ];

  // Read config
  const config = readIdeAIConfigSync(appName);
  const availableLibraryIds = config?.animationLibraries || defaultLibraryIds;

  // Build available libraries
  const animationLibraries = [
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
  ];

  const drawingLibraries = [
    { id: "vivus", name: "Vivus", count: vivusDrawingExamples.length },
    {
      id: "svg-artista",
      name: "SVG Artista",
      count: svgArtistaDrawingExamples.length,
    },
  ];

  // Note: Vivus appears in both animations and drawings - separate them
  const allLibraries = [
    ...animationLibraries,
    ...drawingLibraries.filter((lib) => lib.id !== "vivus"), // Avoid duplicate vivus
  ];

  // State for filtering
  const [selectedFXTypes, setSelectedFXTypes] = useState<Set<FXType>>(
    new Set(["animation", "drawing"]),
  );
  const [selectedLibraries, setSelectedLibraries] = useState<Set<string>>(
    new Set(availableLibraryIds),
  );

  // Combine all animation examples
  const allAnimationExamples: (AnimationExample & { libraryId: string })[] =
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
      // Only include vivus in animations if it's not being treated as drawing-only
      if (availableLibraryIds.includes("vivus")) {
        examples.push(
          ...vivusExamples.map((ex) => ({ ...ex, libraryId: "vivus" })),
        );
      }
      return examples;
    }, [availableLibraryIds]);

  // Combine all drawing examples
  const allDrawingExamples: (DrawingExample & { libraryId: string })[] =
    useMemo(() => {
      const examples: (DrawingExample & { libraryId: string })[] = [];
      if (availableLibraryIds.includes("vivus")) {
        examples.push(
          ...vivusDrawingExamples.map((ex) => ({ ...ex, libraryId: "vivus" })),
        );
      }
      if (availableLibraryIds.includes("svg-artista")) {
        examples.push(
          ...svgArtistaDrawingExamples.map((ex) => ({
            ...ex,
            libraryId: "svg-artista",
          })),
        );
      }
      return examples;
    }, [availableLibraryIds]);

  // Combine all examples into unified FX format
  const allFXExamples: FXExample[] = useMemo(() => {
    const examples: FXExample[] = [];

    // Add animation examples
    allAnimationExamples.forEach((ex) => {
      examples.push({
        type: "animation",
        libraryId: ex.libraryId,
        id: ex.id,
        title: ex.title,
        description: ex.description,
        category: ex.category,
        animationExample: ex,
      });
    });

    // Add drawing examples
    allDrawingExamples.forEach((ex) => {
      examples.push({
        type: "drawing",
        libraryId: ex.libraryId,
        id: ex.id,
        title: ex.title,
        description: ex.description,
        category: ex.category,
        drawingExample: ex,
      });
    });

    return examples;
  }, [allAnimationExamples, allDrawingExamples]);

  // Filter examples
  const filteredExamples = useMemo(() => {
    return allFXExamples.filter((example) => {
      // Filter by FX type
      if (!selectedFXTypes.has(example.type)) {
        return false;
      }
      // Filter by library
      if (!selectedLibraries.has(example.libraryId)) {
        return false;
      }
      return true;
    });
  }, [allFXExamples, selectedFXTypes, selectedLibraries]);

  const toggleFXType = (type: FXType) => {
    setSelectedFXTypes((prev) => {
      const next = new Set(prev);
      if (next.has(type)) {
        next.delete(type);
      } else {
        next.add(type);
      }
      // Ensure at least one type is selected
      if (next.size === 0) {
        next.add(type);
      }
      return next;
    });
  };

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

  const vercelProjectName =
    process.env.NEXT_PUBLIC_VERCEL_PROJECT_NAME || "web";
  const vercelOrgId =
    process.env.NEXT_PUBLIC_VERCEL_ORG_ID || "team_vhjzlMi6CfNow0IfBXnv2Yn2";

  return (
    <IdeAIPageTemplate
      siteName="IdeaI FX"
      vercelProjectName={vercelProjectName}
      vercelOrgId={vercelOrgId}
    >
      <div className="max-w-7xl mx-auto p-8 space-y-8">
        <header className="text-center space-y-4">
          <h1 className="text-4xl font-bold">FX Showcase</h1>
          <p className="text-slate-600 dark:text-slate-400">
            Explore all animations and drawings available in IdeaI
          </p>
          <div className="flex items-center justify-center gap-2 text-sm flex-wrap">
            <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800">
              Animations: {animationsEnabled ? "Enabled" : "Disabled"}
            </span>
            <span className="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300">
              {filteredExamples.length} Examples
            </span>
            <span className="px-3 py-1 rounded-full bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300">
              {allLibraries.length} Libraries
            </span>
          </div>
        </header>

        {/* Filter Toggle Groups */}
        <div className="space-y-4">
          {/* FX Type Filter */}
          <div className="border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-900 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                Filter by Type
              </h2>
            </div>
            <div className="flex gap-2">
              <Button
                variant={
                  selectedFXTypes.has("animation") ? "default" : "outline"
                }
                size="sm"
                onClick={() => toggleFXType("animation")}
                aria-pressed={selectedFXTypes.has("animation")}
                className="gap-2"
              >
                <Sparkles className="h-4 w-4" />
                <span>Animations</span>
                <span className="px-1.5 py-0.5 rounded text-xs bg-slate-200 dark:bg-slate-700">
                  {allAnimationExamples.length}
                </span>
              </Button>
              <Button
                variant={selectedFXTypes.has("drawing") ? "default" : "outline"}
                size="sm"
                onClick={() => toggleFXType("drawing")}
                aria-pressed={selectedFXTypes.has("drawing")}
                className="gap-2"
              >
                <Zap className="h-4 w-4" />
                <span>Drawings</span>
                <span className="px-1.5 py-0.5 rounded text-xs bg-slate-200 dark:bg-slate-700">
                  {allDrawingExamples.length}
                </span>
              </Button>
            </div>
          </div>

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
                  if (selectedLibraries.size === allLibraries.length) {
                    setSelectedLibraries(new Set());
                  } else {
                    setSelectedLibraries(
                      new Set(allLibraries.map((lib) => lib.id)),
                    );
                  }
                }}
              >
                {selectedLibraries.size === allLibraries.length
                  ? "Deselect All"
                  : "Select All"}
              </Button>
            </div>
            <div className="flex gap-2 flex-wrap">
              {allLibraries.map((library) => {
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
        </div>

        {/* Examples Grid */}
        {filteredExamples.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredExamples.map((example) => (
              <div key={`${example.type}-${example.id}`}>
                {example.type === "animation" && example.animationExample ? (
                  <AnimationCard
                    example={example.animationExample}
                    library={example.libraryId as any}
                  />
                ) : example.type === "drawing" && example.drawingExample ? (
                  <DrawingCard example={example.drawingExample} />
                ) : null}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-slate-500 dark:text-slate-400">
            <p>No examples match the current filters.</p>
            <p className="text-sm mt-2">
              Try adjusting your filter selections above.
            </p>
          </div>
        )}
      </div>
    </IdeAIPageTemplate>
  );
}
