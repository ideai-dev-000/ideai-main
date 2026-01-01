/**
 * @fileoverview Universal Framework Card Demo Page
 * 
 * @module FrameworkCardDemo
 * @description
 * Demo page showcasing the Universal Framework Card component that can
 * dynamically switch between different CSS frameworks at runtime.
 */

import { IdeAIPageTemplate } from "@repo/ui/components/ideai-page-template";
import { UniversalFrameworkCard } from "@repo/ui/components/universal-framework-card";
import { IdeaIButton } from "@repo/ui/components/ideai-button";

export default function FrameworkCardPage() {
  const vercelProjectName = process.env.NEXT_PUBLIC_VERCEL_PROJECT_NAME || "web";
  const vercelOrgId = process.env.NEXT_PUBLIC_VERCEL_ORG_ID || "team_vhjzlMi6CfNow0IfBXnv2Yn2";

  return (
    <IdeAIPageTemplate
      siteName="IdeaI /framework-card"
      subtitle="Universal Framework Card - Runtime Framework Switching"
      vercelProjectName={vercelProjectName}
      vercelOrgId={vercelOrgId}
      headerActions={<IdeaIButton appName="web">Open alert</IdeaIButton>}
    >
      <div className="max-w-6xl mx-auto p-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            Universal Framework Card
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 mb-6">
            A single React component that dynamically switches between different CSS frameworks
            at runtime. Uses secure class injection based on Tailwind and shadcn best practices.
          </p>
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
            <h2 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">
              How it works:
            </h2>
            <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1 list-disc list-inside">
              <li>Framework classes are predefined in a secure configuration object</li>
              <li>React state manages framework selection (no template engine needed)</li>
              <li>All class strings are validated and XSS-safe</li>
              <li>CSS frameworks load on-demand when needed</li>
              <li>Follows 2026 best practices: React hooks, TypeScript, Tailwind + shadcn patterns</li>
            </ul>
          </div>
        </div>

        <UniversalFrameworkCard />
      </div>
    </IdeAIPageTemplate>
  );
}

