"use client";
/**
 * @fileoverview Bootstrap CSS page - Component-based styling only
 */

import { IdeAIPageTemplate } from "@repo/ui/components/ideai-page-template";
import { IdeAIHTMLTest } from "@repo/ui/components/ideai-html-test";
import { IdeAICSSSummary } from "@repo/ui/components/ideai-css-summary";
import { UF } from "@repo/ui/components/uf";
import { IdeaIButton } from "@repo/ui/components/ideai-button";
import { useIFrameContext } from "@repo/ui";

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
        
        {/* UniFrame - Second UI element */}
        <div className="mt-6">
          <UF />
        </div>

        <IdeAIHTMLTest />
      </div>
    </IdeAIPageTemplate>
  );
}

