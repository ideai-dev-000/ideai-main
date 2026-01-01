/**
 * @fileoverview Tailwind CSS page - Utility-first styling only
 */

import { IdeAIPageTemplate } from "@repo/ui/components/ideai-page-template";
import { IdeAIHTMLTest } from "@repo/ui/components/ideai-html-test";
import { IdeAICSSSummary } from "@repo/ui/components/ideai-css-summary";
import { IdeaIButton } from "@repo/ui/components/ideai-button";
import { UF } from "@repo/ui/components/uf";

export default function Home() {
  const vercelProjectName = process.env.NEXT_PUBLIC_VERCEL_PROJECT_NAME || "tailwind";
  const vercelOrgId = process.env.NEXT_PUBLIC_VERCEL_ORG_ID || "team_vhjzlMi6CfNow0IfBXnv2Yn2";

  return (
    <IdeAIPageTemplate
      siteName="IdeaI /tailwind"
      subtitle="Tailwind CSS Only - Utility-First Styling"
      vercelProjectName={vercelProjectName}
      vercelOrgId={vercelOrgId}
      headerActions={<IdeaIButton appName="tailwind">Open alert</IdeaIButton>}
    >
      <div>
        <IdeAICSSSummary
          frameworks={["Tailwind CSS"]}
          description="Utility-first CSS framework. No MVP.css, no semantic HTML styling - just Tailwind utility classes."
        />
        
        {/* UF - Universal Framework Component by IdeaI */}
        <div className="mb-12 mt-8">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            UF by IdeaI
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            Hot-toggle between all CSS frameworks available in the IdeaI monorepo. Pure HTML with dynamic CSS injection.
          </p>
          <UF defaultFramework="tailwind" />
        </div>

        <IdeAIHTMLTest />
      </div>
    </IdeAIPageTemplate>
  );
}
