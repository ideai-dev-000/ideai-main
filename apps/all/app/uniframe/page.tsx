/**
 * @fileoverview UF Showcase Page
 *
 * @module UniFrameShowcasePage
 * @description
 * Demo page showcasing the UF Showcase component that can
 * dynamically switch between different CSS frameworks at runtime.
 *
 * UF is a framework card system that allows runtime switching
 * between CSS frameworks with secure class injection.
 *
 * @author IdeaI Development Team
 * @since 2026-01-01
 * @version 1.0.0
 *
 * @see {@link @repo/ui/components/uf-showcase} - Main UF component
 */

import { IdeAIPageTemplate } from "@repo/ui/components/ideai-page-template";
import { UniFrameShowcase } from "@repo/ui/components/uf-showcase";
import { IdeaIButton } from "@repo/ui/components/ideai-button";

export default function UniFramePage() {
  const vercelProjectName =
    process.env.NEXT_PUBLIC_VERCEL_PROJECT_NAME || "all";
  const vercelOrgId =
    process.env.NEXT_PUBLIC_VERCEL_ORG_ID || "team_vhjzlMi6CfNow0IfBXnv2Yn2";

  return (
    <IdeAIPageTemplate
      siteName="IdeaI /uniframe"
      subtitle="UF Showcase - Runtime Framework Switching"
      vercelProjectName={vercelProjectName}
      vercelOrgId={vercelOrgId}
    >
      <div className="max-w-6xl mx-auto p-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            UF Showcase
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 mb-6">
            A single React component that dynamically switches between different
            CSS frameworks at runtime. Uses secure class injection based on
            Tailwind and shadcn best practices. Built with UF structure: card
            wrapper, header, body, footer, and UI elements.
          </p>
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
            <h2 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">
              How UF works:
            </h2>
            <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1 list-disc list-inside">
              <li>
                Framework classes are predefined in a secure configuration
                object
              </li>
              <li>
                React state manages framework selection (no template engine
                needed)
              </li>
              <li>All class strings are validated and XSS-safe</li>
              <li>CSS frameworks load on-demand when needed</li>
              <li>
                Follows 2026 best practices: React hooks, TypeScript, Tailwind +
                shadcn patterns
              </li>
              <li>
                UF structure: card wrapper, header, body, footer, UI elements
              </li>
            </ul>
          </div>
        </div>

        <UniFrameShowcase />
      </div>
    </IdeAIPageTemplate>
  );
}
