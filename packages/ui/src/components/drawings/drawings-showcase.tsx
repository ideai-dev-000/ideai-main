/**
 * @fileoverview Drawings Showcase - SVG Drawing Animations
 * 
 * @module DrawingsShowcase
 * @description
 * Showcase page for SVG drawing animations using Vivus and SVG Artista patterns.
 * 
 * @example
 * ```tsx
 * <DrawingsShowcase />
 * ```
 */

"use client";

import { IdeAIPageTemplate } from "../ideai-page-template";
import { VivusDraw } from "./vivus-draw";
import { SVGArtistaDraw } from "./svg-artista-draw";

export function DrawingsShowcase() {
  const vercelProjectName = process.env.NEXT_PUBLIC_VERCEL_PROJECT_NAME || "web";
  const vercelOrgId = process.env.NEXT_PUBLIC_VERCEL_ORG_ID || "team_vhjzlMi6CfNow0IfBXnv2Yn2";

  const sampleSVG = `
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <circle cx="100" cy="100" r="80" fill="none" stroke="#3b82f6" stroke-width="4"/>
      <path d="M 50 100 L 100 50 L 150 100 L 100 150 Z" fill="none" stroke="#3b82f6" stroke-width="4"/>
    </svg>
  `;

  return (
    <IdeAIPageTemplate
      siteName="IdeaI"
      vercelProjectName={vercelProjectName}
      vercelOrgId={vercelOrgId}
    >
      <div className="max-w-7xl mx-auto p-8 space-y-12">
        <header className="text-center space-y-4">
          <h1 className="text-4xl font-bold">SVG Drawing Animations</h1>
          <p className="text-slate-600 dark:text-slate-400">
            Explore SVG drawing animations with Vivus and SVG Artista patterns
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Vivus Examples */}
          <section className="space-y-6">
            <h2 className="text-2xl font-semibold">Vivus Animations</h2>
            
            <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-6 space-y-4">
              <h3 className="font-medium">One By One</h3>
              <div className="flex items-center justify-center h-48 bg-slate-50 dark:bg-slate-900 rounded">
                <svg id="vivus-onebyone" width="120" height="120" viewBox="0 0 200 200" style={{ stroke: "#3b82f6", strokeWidth: 4, fill: "none" }}>
                  <circle cx="100" cy="100" r="80" />
                  <path d="M 50 100 L 100 50 L 150 100 L 100 150 Z" />
                </svg>
                <VivusDraw svgId="vivus-onebyone" type="oneByOne" duration={200} />
              </div>
            </div>

            <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-6 space-y-4">
              <h3 className="font-medium">Delayed</h3>
              <div className="flex items-center justify-center h-48 bg-slate-50 dark:bg-slate-900 rounded">
                <svg id="vivus-delayed" width="120" height="120" viewBox="0 0 200 200" style={{ stroke: "#3b82f6", strokeWidth: 4, fill: "none" }}>
                  <circle cx="100" cy="100" r="80" />
                  <path d="M 50 100 L 100 50 L 150 100 L 100 150 Z" />
                </svg>
                <VivusDraw svgId="vivus-delayed" type="delayed" duration={200} delay={50} />
              </div>
            </div>

            <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-6 space-y-4">
              <h3 className="font-medium">Sync</h3>
              <div className="flex items-center justify-center h-48 bg-slate-50 dark:bg-slate-900 rounded">
                <svg id="vivus-sync" width="120" height="120" viewBox="0 0 200 200" style={{ stroke: "#3b82f6", strokeWidth: 4, fill: "none" }}>
                  <circle cx="100" cy="100" r="80" />
                  <path d="M 50 100 L 100 50 L 150 100 L 100 150 Z" />
                </svg>
                <VivusDraw svgId="vivus-sync" type="sync" duration={200} />
              </div>
            </div>
          </section>

          {/* SVG Artista Examples */}
          <section className="space-y-6">
            <h2 className="text-2xl font-semibold">SVG Artista Patterns</h2>
            
            <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-6 space-y-4">
              <h3 className="font-medium">Stroke Animation</h3>
              <div className="flex items-center justify-center h-48 bg-slate-50 dark:bg-slate-900 rounded">
                <SVGArtistaDraw
                  svgContent={sampleSVG}
                  animationType="stroke"
                  duration={2}
                />
              </div>
            </div>

            <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-6 space-y-4">
              <h3 className="font-medium">Fill Animation</h3>
              <div className="flex items-center justify-center h-48 bg-slate-50 dark:bg-slate-900 rounded">
                <SVGArtistaDraw
                  svgContent={sampleSVG}
                  animationType="fill"
                  duration={2}
                />
              </div>
            </div>

            <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-6 space-y-4">
              <h3 className="font-medium">Both Stroke & Fill</h3>
              <div className="flex items-center justify-center h-48 bg-slate-50 dark:bg-slate-900 rounded">
                <SVGArtistaDraw
                  svgContent={sampleSVG}
                  animationType="both"
                  duration={2}
                />
              </div>
            </div>
          </section>
        </div>
      </div>
    </IdeAIPageTemplate>
  );
}

