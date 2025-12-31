/**
 * @fileoverview No CSS page - Pure HTML defaults
 */

import { IdeaIHeader } from "@repo/ui/components/ideai-header";
import { IdeAIFooter } from "@repo/ui/components/ideai-footer";
import { IdeaIButton } from "@repo/ui/components/ideai-button";
import { IdeAIHTMLTest } from "@repo/ui/components/ideai-html-test";

export default function Home() {
  const vercelProjectName = process.env.NEXT_PUBLIC_VERCEL_PROJECT_NAME || "nocss";
  
  return (
    <div>
      <main>
        <IdeaIHeader 
          siteName="/nocss" 
          subtitle="No CSS - Pure HTML Browser Defaults"
          vercelProjectName={vercelProjectName}
        >
          <IdeaIButton appName="nocss">Open alert</IdeaIButton>
        </IdeaIHeader>
        
        <div>
          <IdeAIHTMLTest />
        </div>
      </main>
      <IdeAIFooter />
    </div>
  );
}

