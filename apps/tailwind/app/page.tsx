"use client";
/**
 * @fileoverview Tailwind CSS page - Utility-first styling only
 */

import { IdeAIPageTemplate } from "@repo/ui/components/ideai-page-template";
import { IdeAIHTMLTest } from "@repo/ui/components/ideai-html-test";
import { IdeAICSSSummary } from "@repo/ui/components/ideai-css-summary";
import { UF } from "@repo/ui/components/uf";
import { IdeaIButton } from "@repo/ui/components/ideai-button";
import { useIFrameContext } from "@repo/ui";

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
        
        {/* UniFrame - Second UI element */}
        <div className="mt-6">
          <UF />
        </div>

        <IdeAIHTMLTest />
      </div>
    </IdeAIPageTemplate>
  );
}
