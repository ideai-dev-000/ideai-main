/**
 * @fileoverview IdeaI Animations Module - Internal Exports
 * 
 * @module IdeAIAnimationsInternal
 * @description
 * Internal exports for IdeaI animation examples and components.
 * This module is used internally by the animations showcase.
 * 
 * For public API, use @repo/ui/components/animations instead.
 */

export { AnimationCard } from "./animation-card";
export type { AnimationExample, AnimationExamplesData } from "./types";

// Import type for use in this file
import type { AnimationExample } from "./types";

// Load examples - using dynamic import for JSON
import framerMotionExamplesData from "./examples/framer-motion.json";
import reactSpringExamplesData from "./examples/react-spring.json";
import kuteExamplesData from "./examples/kute.json";
import motionOneExamplesData from "./examples/motion-one.json";
import tsparticlesExamplesData from "./examples/tsparticles.json";
import vivusExamplesData from "./examples/vivus.json";

export const framerMotionExamples = framerMotionExamplesData as AnimationExample[];
export const reactSpringExamples = reactSpringExamplesData as AnimationExample[];
export const kuteExamples = kuteExamplesData as AnimationExample[];
export const motionOneExamples = motionOneExamplesData as AnimationExample[];
export const tsparticlesExamples = tsparticlesExamplesData as AnimationExample[];
export const vivusExamples = vivusExamplesData as AnimationExample[];
