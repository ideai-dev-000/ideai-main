/**
 * @fileoverview Bootstrap CSS page - Component-based styling only
 */

import { IdeAIPageTemplate } from "@repo/ui/components/ideai-page-template";
import { IdeAIHTMLTest } from "@repo/ui/components/ideai-html-test";
import { IdeAICSSSummary } from "@repo/ui/components/ideai-css-summary";
import { IdeaIButton } from "@repo/ui/components/ideai-button";
import { UniFrame } from "@repo/ui/components/uniframe";

export default function Home() {
  const vercelProjectName = process.env.NEXT_PUBLIC_VERCEL_PROJECT_NAME || "bootstrap";
  const vercelOrgId = process.env.NEXT_PUBLIC_VERCEL_ORG_ID || "team_vhjzlMi6CfNow0IfBXnv2Yn2";

  return (
    <IdeAIPageTemplate
      siteName="IdeaI /bootstrap"
      subtitle="Bootstrap CSS Only - Component-Based Styling"
      vercelProjectName={vercelProjectName}
      vercelOrgId={vercelOrgId}
      headerActions={<IdeaIButton appName="bootstrap">Open alert</IdeaIButton>}
    >
      <div>
        <IdeAICSSSummary
          frameworks={["Bootstrap CSS"]}
          description="Bootstrap CSS framework for component-based styling. No Tailwind, no MVP.css - just Bootstrap components and utilities."
        />
        
        {/* UniFrame - Universal Framework Component by IdeaI */}
        <div className="mb-12 mt-8">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            UniFrame by IdeaI
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            Hot-toggle between all CSS frameworks available in the IdeaI monorepo. Pure HTML with dynamic CSS injection.
          </p>
          <UniFrame defaultFramework="bootstrap" />
        </div>

        <IdeAIHTMLTest />
      </div>
    </IdeAIPageTemplate>
  );
}

