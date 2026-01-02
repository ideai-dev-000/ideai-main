/**
 * @fileoverview IdeaI Animations Module - Centralized Exports
 * 
 * @module IdeAIAnimations
 * @description
 * Centralized exports for IdeaI animation examples and components.
 * All animations are driven by JSON files and rendered via AnimationCard.
 * No separate page components - everything is data-driven from JSON.
 * 
 * @example
 * ```tsx
 * import { AnimationCard, framerMotionExamples, reactSpringExamples } from "@repo/ui/components/animations";
 * ```
 */

export { AnimationCard } from "./ideai-animations/animation-card";
export type { AnimationExample, AnimationExamplesData } from "./ideai-animations/types";
export { AnimationsShowcase } from "./animations-showcase";

// Import type for use in this file
import type { AnimationExample } from "./ideai-animations/types";

// Load examples - using dynamic import for JSON
import framerMotionExamplesData from "./ideai-animations/examples/framer-motion.json";
import reactSpringExamplesData from "./ideai-animations/examples/react-spring.json";
import kuteExamplesData from "./ideai-animations/examples/kute.json";
import motionOneExamplesData from "./ideai-animations/examples/motion-one.json";
import tsparticlesExamplesData from "./ideai-animations/examples/tsparticles.json";
import vivusExamplesData from "./ideai-animations/examples/vivus.json";

export const framerMotionExamples = framerMotionExamplesData as AnimationExample[];
export const reactSpringExamples = reactSpringExamplesData as AnimationExample[];
export const kuteExamples = kuteExamplesData as AnimationExample[];
export const motionOneExamples = motionOneExamplesData as AnimationExample[];
export const tsparticlesExamples = tsparticlesExamplesData as AnimationExample[];
export const vivusExamples = vivusExamplesData as AnimationExample[];
