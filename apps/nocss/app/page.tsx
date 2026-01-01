/**
 * @fileoverview No CSS page - Pure HTML defaults
 */

import { IdeAIPageTemplate } from "@repo/ui/components/ideai-page-template";
import { IdeAIHTMLTest } from "@repo/ui/components/ideai-html-test";
import { IdeAICSSSummary } from "@repo/ui/components/ideai-css-summary";
import { IdeaIButton } from "@repo/ui/components/ideai-button";
import { UniFrame } from "@repo/ui/components/uniframe";

export default function Home() {
  const vercelProjectName = process.env.NEXT_PUBLIC_VERCEL_PROJECT_NAME || "nocss";
  const vercelOrgId = process.env.NEXT_PUBLIC_VERCEL_ORG_ID || "team_vhjzlMi6CfNow0IfBXnv2Yn2";

  return (
    <IdeAIPageTemplate
      siteName="IdeaI /nocss"
      subtitle="No CSS - Pure HTML Browser Defaults"
      vercelProjectName={vercelProjectName}
      vercelOrgId={vercelOrgId}
      headerActions={<IdeaIButton appName="nocss">Open alert</IdeaIButton>}
    >
      <div>
        <IdeAICSSSummary
          frameworks={["Browser Defaults Only"]}
          description="No CSS frameworks or styling - pure HTML with browser default styles. Used as a baseline for comparison."
        />
        
        {/* UniFrame - Universal Framework Component by IdeaI */}
        <div className="mb-12 mt-8">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            UniFrame by IdeaI
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            Hot-toggle between all CSS frameworks available in the IdeaI monorepo. Pure HTML with dynamic CSS injection.
          </p>
          <UniFrame defaultFramework="nocss" />
        </div>

        <IdeAIHTMLTest />
      </div>
    </IdeAIPageTemplate>
  );
}
