/**
 * @fileoverview Drawings Showcase - SVG Drawing Animations
 *
 * @module DrawingsShowcase
 * @description
 * Unified page showcasing SVG drawing animation libraries with filtering.
 * Shows all drawing examples in one list, filterable by library.
 * Matches the structure and format of the animations showcase with play buttons.
 *
 * @example
 * ```tsx
 * <DrawingsShowcase />
 * ```
 */

"use client";

import { useState, useMemo } from "react";
import { IdeAIPageTemplate } from "../ideai-page-template";
import { VivusDraw } from "./vivus-draw";
import { SVGArtistaDraw } from "./svg-artista-draw";
import { Button } from "../ui/button";
import { Sparkles, Zap, Play } from "lucide-react";

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

// Drawing examples data
const vivusExamples: DrawingExample[] = [
  {
    id: "vivus-onebyone",
    title: "One By One",
    description: "Draw SVG paths sequentially, one after another",
    library: "Vivus",
    category: "Sequential",
    tags: ["sequential", "path", "drawing"],
    type: "oneByOne",
    duration: 200,
  },
  {
    id: "vivus-delayed",
    title: "Delayed",
    description: "Draw paths with a delay between each path",
    library: "Vivus",
    category: "Delayed",
    tags: ["delayed", "path", "drawing"],
    type: "delayed",
    duration: 200,
    delay: 50,
  },
  {
    id: "vivus-sync",
    title: "Sync",
    description: "Draw all paths simultaneously",
    library: "Vivus",
    category: "Synchronized",
    tags: ["sync", "path", "drawing"],
    type: "sync",
    duration: 200,
  },
];

const svgArtistaExamples: DrawingExample[] = [
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

const allDrawingLibraries = [
  { id: "vivus", name: "Vivus", count: vivusExamples.length },
  { id: "svg-artista", name: "SVG Artista", count: svgArtistaExamples.length },
];

// Drawing Card Component with Play Button
function DrawingCard({
  example,
}: {
  example: DrawingExample & { libraryId: string };
}) {
  const [animationKey, setAnimationKey] = useState(0);

  const sampleSVG = `
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <circle cx="100" cy="100" r="80" fill="none" stroke="#3b82f6" stroke-width="4"/>
      <path d="M 50 100 L 100 50 L 150 100 L 100 150 Z" fill="none" stroke="#3b82f6" stroke-width="4"/>
    </svg>
  `;

  const handlePlay = () => {
    setAnimationKey((prev) => prev + 1);
  };

  return (
    <div className="border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
        {/* Left: Description */}
        <div className="space-y-4">
          <div>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
              {example.title}
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              {example.description}
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2 py-1 rounded text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300">
              {example.library}
            </span>
            <span className="px-2 py-1 rounded text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
              {example.category}
            </span>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {example.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Right: Demo */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Play className="h-4 w-4" />
              <span className="text-sm font-medium">Live Demo</span>
              {example.libraryId === "vivus" ? (
                <Sparkles className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
              ) : (
                <Zap className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
              )}
            </div>
            <button
              onClick={handlePlay}
              className="px-3 py-1.5 rounded-md text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white transition-colors flex items-center gap-1.5"
              aria-label="Play animation"
              title="Play animation"
            >
              <Play className="h-3.5 w-3.5" />
              <span>Play</span>
            </button>
          </div>
          <div
            className="flex items-center justify-center h-48 bg-slate-50 dark:bg-slate-900 rounded"
            key={animationKey}
          >
            {example.libraryId === "vivus" ? (
              <div className="relative">
                <svg
                  id={`${example.id}-${animationKey}`}
                  width="120"
                  height="120"
                  viewBox="0 0 200 200"
                  style={{ stroke: "#3b82f6", strokeWidth: 4, fill: "none" }}
                >
                  <circle cx="100" cy="100" r="80" />
                  <path d="M 50 100 L 100 50 L 150 100 L 100 150 Z" />
                </svg>
                <VivusDraw
                  key={`vivus-${example.id}-${animationKey}`}
                  svgId={`${example.id}-${animationKey}`}
                  type={example.type as "oneByOne" | "delayed" | "sync"}
                  duration={example.duration || 200}
                  delay={example.delay}
                  start="autostart"
                />
              </div>
            ) : (
              <SVGArtistaDraw
                key={`artista-${example.id}-${animationKey}`}
                svgContent={sampleSVG}
                animationType={example.type as "stroke" | "fill" | "both"}
                duration={example.duration || 2}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function DrawingsShowcase() {
  const vercelProjectName =
    process.env.NEXT_PUBLIC_VERCEL_PROJECT_NAME || "web";
  const vercelOrgId =
    process.env.NEXT_PUBLIC_VERCEL_ORG_ID || "team_vhjzlMi6CfNow0IfBXnv2Yn2";

  const [selectedLibraries, setSelectedLibraries] = useState<Set<string>>(
    new Set(["vivus", "svg-artista"]),
  );

  // Combine all examples with library metadata
  const allExamples: (DrawingExample & { libraryId: string })[] =
    useMemo(() => {
      const examples: (DrawingExample & { libraryId: string })[] = [];
      examples.push(
        ...vivusExamples.map((ex) => ({ ...ex, libraryId: "vivus" })),
      );
      examples.push(
        ...svgArtistaExamples.map((ex) => ({
          ...ex,
          libraryId: "svg-artista",
        })),
      );
      return examples;
    }, []);

  // Filter examples based on selected libraries
  const filteredExamples = useMemo(() => {
    return allExamples.filter((example) =>
      selectedLibraries.has(example.libraryId),
    );
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
          <h1 className="text-4xl font-bold">Drawing Libraries Showcase</h1>
          <p className="text-slate-600 dark:text-slate-400">
            Explore SVG drawing animation frameworks available in IdeaI
          </p>
          <div className="flex items-center justify-center gap-2 text-sm flex-wrap">
            <span className="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300">
              {filteredExamples.length} Examples
            </span>
            <span className="px-3 py-1 rounded-full bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300">
              {allDrawingLibraries.length} Libraries
            </span>
          </div>
          <div className="pt-2">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Available: {allDrawingLibraries.map((lib) => lib.name).join(", ")}
            </p>
          </div>
        </header>

        {/* Filter Toggle Group */}
        <div className="border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-900 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              Filter by Library
            </h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (selectedLibraries.size === allDrawingLibraries.length) {
                  setSelectedLibraries(new Set());
                } else {
                  setSelectedLibraries(
                    new Set(allDrawingLibraries.map((lib) => lib.id)),
                  );
                }
              }}
            >
              {selectedLibraries.size === allDrawingLibraries.length
                ? "Deselect All"
                : "Select All"}
            </Button>
          </div>
          <div className="flex gap-2 flex-wrap">
            {allDrawingLibraries.map((library) => {
              const isSelected = selectedLibraries.has(library.id);
              const Icon = library.id === "vivus" ? Sparkles : Zap;
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

        {/* Drawing Examples List */}
        {filteredExamples.length > 0 ? (
          <div className="space-y-6">
            {filteredExamples.map((example) => (
              <DrawingCard
                key={`${example.libraryId}-${example.id}`}
                example={example}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-slate-600 dark:text-slate-400">
              No drawings selected. Choose a library above to view examples.
            </p>
          </div>
        )}
      </div>
    </IdeAIPageTemplate>
  );
}
