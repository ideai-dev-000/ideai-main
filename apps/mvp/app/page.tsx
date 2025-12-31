/**
 * @fileoverview MVP.css page - Semantic HTML styling only
 */

import { IdeaIHeader } from "@repo/ui/components/ideai-header";
import { IdeAIFooter } from "@repo/ui/components/ideai-footer";
import { IdeaIButton } from "@repo/ui/components/ideai-button";
import { IdeAIHTMLTest } from "@repo/ui/components/ideai-html-test";

export default function Home() {
  const vercelProjectName = process.env.NEXT_PUBLIC_VERCEL_PROJECT_NAME || "mvp";
  
  return (
    <div>
      <main>
        <IdeaIHeader 
          siteName="/mvp" 
          subtitle="MVP.css Only - Semantic HTML Styling"
          vercelProjectName={vercelProjectName}
        >
          <IdeaIButton appName="mvp">Open alert</IdeaIButton>
        </IdeaIHeader>
        
        <div>
          <IdeAIHTMLTest />
        </div>
      </main>
      <IdeAIFooter />
    </div>
  );
}

