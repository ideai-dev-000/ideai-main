/**
 * @fileoverview MVP.css page - Semantic HTML styling only
 */

import { IdeAIPageTemplate } from "@repo/ui/components/ideai-page-template";
import { IdeAIHTMLTest } from "@repo/ui/components/ideai-html-test";
import { IdeAICSSSummary } from "@repo/ui/components/ideai-css-summary";
import { IdeaIButton } from "@repo/ui/components/ideai-button";

export default function Home() {
  const vercelProjectName = process.env.NEXT_PUBLIC_VERCEL_PROJECT_NAME || "mvp";
  const vercelOrgId = process.env.NEXT_PUBLIC_VERCEL_ORG_ID || "team_vhjzlMi6CfNow0IfBXnv2Yn2";

  return (
    <IdeAIPageTemplate
      siteName="IdeaI /mvp"
      subtitle="MVP.css Only - Semantic HTML Styling"
      vercelProjectName={vercelProjectName}
      vercelOrgId={vercelOrgId}
      headerActions={<IdeaIButton appName="mvp">Open alert</IdeaIButton>}
    >
      <div>
        <IdeAICSSSummary
          frameworks={["MVP.css"]}
          description="Minimalist stylesheet (~10KB) that styles semantic HTML elements. No utility classes, no Tailwind - just clean semantic styling."
        />
        
        {/* UF - Universal Framework Component by IdeaI */}
        <div className="mb-12 mt-8">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            UniFrame by IdeaI
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            Hot-toggle between all CSS frameworks available in the IdeaI monorepo. Pure HTML with dynamic CSS injection.
          </p>
        </div>

        <IdeAIHTMLTest />
      </div>
    </IdeAIPageTemplate>
  );
}
