/**
 * @fileoverview MVP.css + Tailwind CSS page - Complete styling
 */

import { IdeAIPageTemplate } from "@repo/ui/components/ideai-page-template";
import { IdeAIHTMLTest } from "@repo/ui/components/ideai-html-test";
import { IdeAICSSSummary } from "@repo/ui/components/ideai-css-summary";
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
        <IdeAICSSSummary
          frameworks={["MVP.css", "Tailwind CSS", "IdeaI Design System"]}
          description="Complete styling stack: MVP.css for semantic HTML styling, Tailwind for utility classes, and IdeaI design tokens for consistency."
        />
        <IdeAIHTMLTest />
      </div>
    </IdeAIPageTemplate>
  );
}
