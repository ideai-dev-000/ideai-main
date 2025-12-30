/**
 * @fileoverview Main landing page for the IdeaI docs application
 * 
 * @module DocsAppPage
 * @description
 * The home page component for the IdeaI documentation site.
 * Uses shared header and footer components for perfect consistency.
 * Shows "IdeaI Docs" heading, button, and documentation index below.
 * 
 * @example
 * This page is automatically rendered at the root route (/)
 * 
 * @see {@link ./layout.tsx} - Root layout component
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
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <IdeaIHeader siteName="/docs" subtitle="Welcome to IdeaI">
          <IdeaIButton appName="docs">Open alert</IdeaIButton>
        </IdeaIHeader>
        <IdeAIContent />
      </main>
      <IdeAIFooter />
    </div>
  );
}
