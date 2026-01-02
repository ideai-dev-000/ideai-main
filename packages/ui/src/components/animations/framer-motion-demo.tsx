/**
 * @fileoverview Framer Motion Animation Demo Page
 * 
 * @module FramerMotionDemo
 * @description
 * Comprehensive demo page showcasing Framer Motion animations.
 * Demonstrates various animation patterns, transitions, and effects.
 * 
 * This component is lazy-loaded for optimal performance.
 * 
 * @example
 * ```tsx
 * import { FramerMotionDemo } from "@repo/ui/components/animations/framer-motion-demo";
 * 
 * <FramerMotionDemo />
 * ```
 */

"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useIdeAIAnimations } from "../../lib/ideai-animations";
import { IdeAIPageTemplate } from "../ideai-page-template";
import { AnimationCard, framerMotionExamples } from "./ideai-animations";
import type { AnimationExample } from "./ideai-animations/types";

/**
 * Framer Motion Animation Demo Component
 * 
 * Showcases various Framer Motion animation patterns:
 * - Basic animations
 * - Gestures
 * - Layout animations
 * - Shared layout animations
 * - Scroll-triggered animations
 */
export function FramerMotionDemo() {
  const { animationsEnabled } = useIdeAIAnimations();
  const examples = framerMotionExamples as AnimationExample[];

  const vercelProjectName = process.env.NEXT_PUBLIC_VERCEL_PROJECT_NAME || "web";
  const vercelOrgId = process.env.NEXT_PUBLIC_VERCEL_ORG_ID || "team_vhjzlMi6CfNow0IfBXnv2Yn2";

  return (
    <IdeAIPageTemplate
      siteName="IdeaI"
      vercelProjectName={vercelProjectName}
      vercelOrgId={vercelOrgId}
    >
      <div className="max-w-6xl mx-auto p-8 space-y-12">
        <header className="text-center space-y-4">
          <h1 className="text-4xl font-bold">Framer Motion Animations</h1>
          <p className="text-slate-600 dark:text-slate-400">
            Comprehensive demo of Framer Motion animation capabilities from official docs and community
          </p>
          <div className="flex items-center justify-center gap-2 text-sm">
            <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800">
              Animations: {animationsEnabled ? "Enabled" : "Disabled"}
            </span>
            <span className="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300">
              {examples.length} Examples
            </span>
          </div>
        </header>

        {/* Animation Examples List */}
        <div className="space-y-6">
          {examples.map((example) => (
            <AnimationCard
              key={example.id}
              example={example}
              library="framer-motion"
            />
          ))}
        </div>
      </div>
    </IdeAIPageTemplate>
  );
}

