/**
 * @fileoverview Main landing page for the IdeaI docs application
 * 
 * @module DocsAppPage
 * @description
 * The home page component for the IdeaI documentation site.
 * This page serves as the entry point for the docs application.
 * 
 * @example
 * This page is automatically rendered at the root route (/)
 * 
 * @see {@link ../layout.tsx} - Root layout component
 * @see {@link @repo/ui/button} - Shared Button component
 * @todo Add actual documentation content
 */

import { Button } from "@repo/ui/button";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1>IdeaI Docs</h1>
        <p>Welcome to IdeaI</p>
        <Button appName="docs" className={styles.secondary}>
          Open alert
        </Button>
      </main>
    </div>
  );
}
