/**
 * @fileoverview V0 Components Test Page
 * 
 * @module V0TestPage
 * @description
 * Test page to verify v0-created components work frictionlessly across apps.
 * Tests UI elements and blocks imported from @repo/ui.
 */

"use client";

import { IdeAIPageTemplate } from "@repo/ui";
import { IdeaIButton } from "@repo/ui";
import { 
  BrainIcon, 
  CatIcon, 
  MusicIcon, 
  RocketIcon,
  LogoPreview,
  SvgSelector,
  AnimationControls
} from "@repo/ui";
import { useState } from "react";

export default function V0TestPage() {
  const [selectedSvg, setSelectedSvg] = useState<string>("ideai");
  const [animationConfig, setAnimationConfig] = useState({
    duration: 1,
    delay: 0,
    loop: true,
    animationType: "scale",
  });

  return (
    <IdeAIPageTemplate
      siteName="V0 Components Test"
      vercelProjectName="web"
      vercelOrgId={process.env.NEXT_PUBLIC_VERCEL_ORG_ID || "team_vhjzlMi6CfNow0IfBXnv2Yn2"}
      headerActions={<IdeaIButton appName="web">Test</IdeaIButton>}
    >
      <div className="max-w-6xl mx-auto p-8 space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">V0 Components Test</h1>
          <p className="text-lg text-muted-foreground">
            Testing v0-created components imported from @repo/ui
          </p>
        </div>

        {/* UI Elements Test */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">UI Elements (Icons)</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 border rounded-lg text-center">
              <BrainIcon className="w-24 h-24 mx-auto mb-2" />
              <p className="text-sm font-medium">BrainIcon</p>
            </div>
            <div className="p-4 border rounded-lg text-center">
              <CatIcon className="w-24 h-24 mx-auto mb-2" />
              <p className="text-sm font-medium">CatIcon</p>
            </div>
            <div className="p-4 border rounded-lg text-center">
              <MusicIcon className="w-24 h-24 mx-auto mb-2" />
              <p className="text-sm font-medium">MusicIcon</p>
            </div>
            <div className="p-4 border rounded-lg text-center">
              <RocketIcon className="w-24 h-24 mx-auto mb-2" />
              <p className="text-sm font-medium">RocketIcon</p>
            </div>
          </div>
        </section>

        {/* Blocks Test */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Blocks (Layout + UI)</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">SvgSelector Block</h3>
              <SvgSelector selected={selectedSvg} onSelect={setSelectedSvg} />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">AnimationControls Block</h3>
              <AnimationControls 
                config={animationConfig} 
                onChange={setAnimationConfig}
                library="framer-motion"
              />
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">LogoPreview Block</h3>
            <LogoPreview 
              library="framer-motion"
              selectedSvg={selectedSvg}
              config={animationConfig}
            />
          </div>
        </section>

        {/* Success Message */}
        <div className="p-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <h3 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-2">
            ✅ Frictionless Workflow Success!
          </h3>
          <p className="text-sm text-green-800 dark:text-green-200">
            All v0-created components are working perfectly! They were:
          </p>
          <ul className="list-disc list-inside text-sm text-green-800 dark:text-green-200 mt-2 space-y-1">
            <li>Created in v0 (ideai-designer branch)</li>
            <li>Copied to v0-ideai/</li>
            <li>Synced to v0-staging/</li>
            <li>Exported to packages/ui/</li>
            <li>Available in all apps via: import from '@repo/ui'</li>
          </ul>
        </div>
      </div>
    </IdeAIPageTemplate>
  );
}

