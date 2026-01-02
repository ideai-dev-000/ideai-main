/**
 * @fileoverview IdeaI Animations Module - Centralized Exports
 * 
 * @module IdeAIAnimations
 * @description
 * Centralized exports for IdeaI animation examples and components
 */

export { AnimationCard } from "./animation-card";
export type { AnimationExample, AnimationExamplesData } from "./types";

// Load examples - using dynamic import for JSON
import framerMotionExamplesData from "./examples/framer-motion.json";
import reactSpringExamplesData from "./examples/react-spring.json";

export const framerMotionExamples = framerMotionExamplesData as AnimationExample[];
export const reactSpringExamples = reactSpringExamplesData as AnimationExample[];

