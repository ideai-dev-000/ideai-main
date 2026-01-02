/**
 * @fileoverview HTML5 Test Page for the IdeaI /all demo site
 * 
 * @module AllAppPage
 * @description
 * Comprehensive HTML5 test page displaying all HTML elements.
 * Uses shared page template for perfect consistency across all pages.
 * 
 * @example
 * This page is automatically rendered at the root route (/)
 * 
 * @see {@link ../layout.tsx} - Root layout component
 * @see {@link @repo/ui/components/ideai-page-template} - Shared page template
 */

import { IdeAIPageTemplate } from "@repo/ui/components/ideai-page-template";
import { IdeAIHTMLTest } from "@repo/ui/components/ideai-html-test";
import { IdeAICSSSummary } from "@repo/ui/components/ideai-css-summary";
import { UF } from "@repo/ui/components/uf";
import { IdeaIButton } from "@repo/ui/components/ideai-button";
import styles from "./page.module.css";

export default function Home() {
  const vercelProjectName = process.env.NEXT_PUBLIC_VERCEL_PROJECT_NAME || "all";
  const vercelOrgId = process.env.NEXT_PUBLIC_VERCEL_ORG_ID || "team_vhjzlMi6CfNow0IfBXnv2Yn2";

  return (
    <IdeAIPageTemplate
      siteName="IdeaI /all"
      subtitle="Complete HTML5 Test Page and Component Showcase"
      vercelProjectName={vercelProjectName}
      vercelOrgId={vercelOrgId}
      headerActions={<IdeaIButton appName="all">Open alert</IdeaIButton>}
    >
      <div className={styles.page}>
        <div className={styles.main}>
          <IdeAICSSSummary
            frameworks={["MVP.css", "Tailwind CSS", "IdeaI Design System"]}
            description="Full styling stack with semantic HTML styling, utility classes, and custom design tokens."
          />
          
          {/* UniFrame - Second UI element */}
          <div className="mt-6">
            <UF />
          </div>

          <div className={styles.showcase}>
            <IdeAIHTMLTest />
          </div>
        </div>
      </div>
    </IdeAIPageTemplate>
  );
}
