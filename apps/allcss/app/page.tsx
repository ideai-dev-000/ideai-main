/**
 * @fileoverview MVP.css + Tailwind CSS page - Complete styling
 */

import { IdeaIHeader } from "@repo/ui/components/ideai-header";
import { IdeAIFooter } from "@repo/ui/components/ideai-footer";
import { IdeaIButton } from "@repo/ui/components/ideai-button";
import { IdeAIHTMLTest } from "@repo/ui/components/ideai-html-test";

export default function Home() {
  return (
    <div>
      <main>
        <IdeaIHeader siteName="/allcss" subtitle="MVP.css + Tailwind CSS - Complete Styling">
          <IdeaIButton appName="allcss">Open alert</IdeaIButton>
        </IdeaIHeader>
        
        <div>
          <IdeAIHTMLTest />
        </div>
      </main>
      <IdeAIFooter />
    </div>
  );
}

