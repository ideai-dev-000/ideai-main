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

export const framerMotionExamples = framerMotionExamplesData as AnimationExample[];
export const reactSpringExamples = reactSpringExamplesData as AnimationExample[];
