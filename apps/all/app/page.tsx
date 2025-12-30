/**
 * @fileoverview HTML5 Test Page for the IdeaI /all demo site
 * 
 * @module AllAppPage
 * @description
 * Comprehensive HTML5 test page displaying all HTML elements.
 * Uses the shared IdeAIHTMLTest component for consistency testing.
 * 
 * @example
 * This page is automatically rendered at the root route (/)
 * 
 * @see {@link ../layout.tsx} - Root layout component
 * @see {@link @repo/ui/components/ideai-html-test} - Shared HTML test component
 */

import { IdeaIHeader } from "@repo/ui/components/ideai-header";
import { IdeAIFooter } from "@repo/ui/components/ideai-footer";
import { IdeaIButton } from "@repo/ui/components/ideai-button";
import { IdeAIHTMLTest } from "@repo/ui/components/ideai-html-test";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <IdeaIHeader siteName="/all" subtitle="HTML5 Test Page - Complete Element Showcase">
          <IdeaIButton appName="all">Open alert</IdeaIButton>
        </IdeaIHeader>
        
        <div className={styles.showcase}>
          <IdeAIHTMLTest />
        </div>
      </main>
      <IdeAIFooter />
    </div>
  );
}
