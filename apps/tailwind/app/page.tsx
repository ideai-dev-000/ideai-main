/**
 * @fileoverview Tailwind CSS page - Utility-first styling only
 */

import { IdeaIHeader } from "@repo/ui/components/ideai-header";
import { IdeAIFooter } from "@repo/ui/components/ideai-footer";
import { IdeaIButton } from "@repo/ui/components/ideai-button";
import { IdeAIHTMLTest } from "@repo/ui/components/ideai-html-test";

export default function Home() {
  return (
    <div>
      <main>
        <IdeaIHeader siteName="/tailwind" subtitle="Tailwind CSS Only - Utility-First Styling">
          <IdeaIButton appName="tailwind">Open alert</IdeaIButton>
        </IdeaIHeader>
        
        <div>
          <IdeAIHTMLTest />
        </div>
      </main>
      <IdeAIFooter />
    </div>
  );
}

