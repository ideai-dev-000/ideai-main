/**
 * @fileoverview Main landing page for the IdeaI web application
 * 
 * @module WebAppPage
 * @description
 * The home page component for the IdeaI web application.
 * Uses shared page template for perfect consistency across all pages.
 * 
 * @example
 * This page is automatically rendered at the root route (/)
 * 
 * @see {@link ../layout.tsx} - Root layout component
 * @see {@link @repo/ui/components/ideai-page-template} - Shared page template
 */

import { IdeAIPageTemplate } from "@repo/ui/components/ideai-page-template";
import { IdeAIContent } from "@repo/ui/components/ideai-content";
import { IdeAICSSSummary } from "@repo/ui/components/ideai-css-summary";
import { IdeaIButton } from "@repo/ui/components/ideai-button";
import styles from "./page.module.css";

export default function Home() {
  // Get Vercel project name from environment or default
  const vercelProjectName = process.env.NEXT_PUBLIC_VERCEL_PROJECT_NAME || "web";
  const vercelOrgId = process.env.NEXT_PUBLIC_VERCEL_ORG_ID || "team_vhjzlMi6CfNow0IfBXnv2Yn2";

  return (
    <IdeAIPageTemplate
      siteName="IdeaI"
      subtitle="Welcome to IdeaI"
      vercelProjectName={vercelProjectName}
      vercelOrgId={vercelOrgId}
      headerActions={<IdeaIButton appName="web">Open alert</IdeaIButton>}
    >
      <div className={styles.page}>
        <div className={styles.main}>
          <IdeAICSSSummary
            frameworks={["MVP.css", "Tailwind CSS", "IdeaI Design System"]}
            description="Full styling stack with semantic HTML styling, utility classes, and custom design tokens."
          />
          
          {/* UniFrame - Universal Framework Component by IdeaI */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              UniFrame by IdeaI
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              Hot-toggle between all CSS frameworks available in the IdeaI monorepo. Pure HTML with dynamic CSS injection.
              Isolated in iframe with only normalize CSS - no parent page styles interfere.
              Open the demo from the header menu.
            </p>
          </div>

          <IdeAIContent />
        </div>
      </div>
    </IdeAIPageTemplate>
  );
}
