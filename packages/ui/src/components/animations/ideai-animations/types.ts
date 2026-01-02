/**
 * @fileoverview Type definitions for IdeaI Animation Examples
 *
 * @module AnimationTypes
 * @description
 * TypeScript types for animation example data structure
 */

export interface AnimationVariant {
  name: string;
  description?: string;
  code: string;
  config: Record<string, any>;
}

export interface AnimationExample {
  id: string;
  title: string;
  description: string;
  library: string;
  category: string;
  tags: string[];
  source: string;
  code: string;
  config: Record<string, any>;
  effectType?:
    | "drawing"
    | "coloring"
    | "animating"
    | "morphing"
    | "transforming"
    | "particles"
    | "other";
  variants?: AnimationVariant[];
}

export interface AnimationExamplesData {
  "framer-motion": AnimationExample[];
  "react-spring": AnimationExample[];
  kute: AnimationExample[];
  "motion-one": AnimationExample[];
  tsparticles: AnimationExample[];
  vivus: AnimationExample[];
}
