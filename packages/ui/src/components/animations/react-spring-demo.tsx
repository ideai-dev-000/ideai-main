/**
 * @fileoverview React Spring Physics-Based Animation Demo Page
 * 
 * @module ReactSpringDemo
 * @description
 * Comprehensive demo page showcasing React Spring physics-based animations.
 * Demonstrates spring physics, transitions, and natural motion.
 * 
 * This component is lazy-loaded for optimal performance.
 * 
 * @example
 * ```tsx
 * import { ReactSpringDemo } from "@repo/ui/components/animations/react-spring-demo";
 * 
 * <ReactSpringDemo />
 * ```
 */

"use client";

import { useState } from "react";
import { useSpring, useSprings, animated, config } from "@react-spring/web";
import { useIdeAIAnimations } from "../../lib/ideai-animations";
import { IdeAIPageTemplate } from "../ideai-page-template";
import { AnimationCard, reactSpringExamples } from "./ideai-animations";
import type { AnimationExample } from "./ideai-animations/types";

/**
 * React Spring Animation Demo Component
 * 
 * Showcases various React Spring animation patterns:
 * - Spring physics
 * - Transitions
 * - Trail animations
 * - Parallax effects
 * - Natural motion
 */
export function ReactSpringDemo() {
  const { animationsEnabled } = useIdeAIAnimations();
  const examples = reactSpringExamples as AnimationExample[];

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
          <h1 className="text-4xl font-bold">React Spring Animations</h1>
          <p className="text-slate-600 dark:text-slate-400">
            Physics-based animations with natural motion and spring physics
          </p>
          <div className="flex items-center justify-center gap-2 text-sm">
            <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800">
              Animations: {animationsEnabled ? "Enabled" : "Disabled"}
            </span>
          </div>
        </header>

        {/* Animation Examples List */}
        <div className="space-y-6">
          {examples.map((example) => (
            <AnimationCard
              key={example.id}
              example={example}
              library="react-spring"
            />
          ))}
        </div>
      </div>
    </IdeAIPageTemplate>
  );
}

