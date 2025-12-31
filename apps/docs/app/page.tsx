/**
 * @fileoverview Main landing page for the IdeaI docs application
 * 
 * @module DocsAppPage
 * @description
 * The home page component for the IdeaI documentation site.
 * Uses shared page template for perfect consistency across all pages.
 * 
 * @example
 * This page is automatically rendered at the root route (/)
 * 
 * @see {@link ./layout.tsx} - Root layout component
 * @see {@link @repo/ui/components/ideai-page-template} - Shared page template
 */

import { IdeAIPageTemplate } from "@repo/ui/components/ideai-page-template";
import { IdeAIContent } from "@repo/ui/components/ideai-content";
import { IdeaIButton } from "@repo/ui/components/ideai-button";
import styles from "./page.module.css";

export default function Home() {
  // Get Vercel project name from environment or default
  const vercelProjectName = process.env.NEXT_PUBLIC_VERCEL_PROJECT_NAME || "docs";
  const vercelOrgId = process.env.NEXT_PUBLIC_VERCEL_ORG_ID || "team_vhjzlMi6CfNow0IfBXnv2Yn2";

  return (
    <IdeAIPageTemplate
      siteName="IdeaI /docs"
      subtitle="Welcome to IdeaI"
      vercelProjectName={vercelProjectName}
      vercelOrgId={vercelOrgId}
      headerActions={<IdeaIButton appName="docs">Open alert</IdeaIButton>}
    >
      <div className={styles.page}>
        <div className={styles.main}>
          <IdeAIContent />
        </div>
      </div>
    </IdeAIPageTemplate>
  );
}
