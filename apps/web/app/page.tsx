/**
 * @fileoverview Main landing page for the IdeaI web application
 * 
 * @module WebAppPage
 * @description
 * The home page component for the IdeaI web application.
 * Uses shared header and footer components for perfect consistency.
 * 
 * @example
 * This page is automatically rendered at the root route (/)
 * 
 * @see {@link ../layout.tsx} - Root layout component
 * @see {@link @repo/ui/button} - Shared Button component
 * @see {@link @repo/ui/components/ideai-header} - Shared header component
 * @see {@link @repo/ui/components/ideai-footer} - Shared footer component
 */

import { IdeaIHeader } from "@repo/ui/components/ideai-header";
import { IdeAIFooter } from "@repo/ui/components/ideai-footer";
import { IdeAIContent } from "@repo/ui/components/ideai-content";
import { IdeaIButton } from "@repo/ui/components/ideai-button";
import styles from "./page.module.css";

export default function Home() {
  // Get Vercel project name from environment or default
  const vercelProjectName = process.env.NEXT_PUBLIC_VERCEL_PROJECT_NAME || "ideai-main";
  
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <IdeaIHeader 
          siteName="IdeaI" 
          subtitle="Welcome to IdeaI"
          vercelProjectName={vercelProjectName}
        >
          <IdeaIButton appName="web">Open alert</IdeaIButton>
        </IdeaIHeader>
        <IdeAIContent />
      </main>
      <IdeAIFooter />
    </div>
  );
}
