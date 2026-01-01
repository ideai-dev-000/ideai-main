/**
 * @fileoverview MVP.css + Tailwind CSS page - Complete styling
 */

import { IdeAIPageTemplate } from "@repo/ui/components/ideai-page-template";
import { IdeAIHTMLTest } from "@repo/ui/components/ideai-html-test";
import { IdeAICSSSummary } from "@repo/ui/components/ideai-css-summary";
import { IdeaIButton } from "@repo/ui/components/ideai-button";
import { UniFrame } from "@repo/ui/components/uniframe";

export default function Home() {
  const vercelProjectName = process.env.NEXT_PUBLIC_VERCEL_PROJECT_NAME || "allcss";
  const vercelOrgId = process.env.NEXT_PUBLIC_VERCEL_ORG_ID || "team_vhjzlMi6CfNow0IfBXnv2Yn2";

  return (
    <IdeAIPageTemplate
      siteName="IdeaI /allcss"
      subtitle="MVP.css + Tailwind CSS - Complete Styling"
      vercelProjectName={vercelProjectName}
      vercelOrgId={vercelOrgId}
      headerActions={<IdeaIButton appName="allcss">Open alert</IdeaIButton>}
    >
      <div>
        <IdeAICSSSummary
          frameworks={["MVP.css", "Tailwind CSS", "IdeaI Design System"]}
          description="Complete styling stack: MVP.css for semantic HTML styling, Tailwind for utility classes, and IdeaI design tokens for consistency."
        />
        
        {/* UniFrame - Universal Framework Component by IdeaI */}
        <div className="mb-12 mt-8">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            UniFrame by IdeaI
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            Hot-toggle between all CSS frameworks available in the IdeaI monorepo. Pure HTML with dynamic CSS injection.
          </p>
          <UniFrame defaultFramework="tailwind" />
        </div>

        <IdeAIHTMLTest />
      </div>
    </IdeAIPageTemplate>
  );
}
