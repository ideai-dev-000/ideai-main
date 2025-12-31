/**
 * @fileoverview MVP.css + Tailwind CSS page - Complete styling
 */

import { IdeAIPageTemplate } from "@repo/ui/components/ideai-page-template";
import { IdeAIHTMLTest } from "@repo/ui/components/ideai-html-test";
import { IdeaIButton } from "@repo/ui/components/ideai-button";

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
        <IdeAIHTMLTest />
      </div>
    </IdeAIPageTemplate>
  );
}
