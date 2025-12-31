/**
 * @fileoverview No CSS page - Pure HTML defaults
 */

import { IdeAIPageTemplate } from "@repo/ui/components/ideai-page-template";
import { IdeAIHTMLTest } from "@repo/ui/components/ideai-html-test";
import { IdeaIButton } from "@repo/ui/components/ideai-button";

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
        <IdeAIHTMLTest />
      </div>
    </IdeAIPageTemplate>
  );
}
