/**
 * @fileoverview Main landing page for the IDEAI web application
 * 
 * @module WebAppPage
 * @description
 * The home page component for the IDEAI web application.
 * This is a clean starting point for building out the application.
 * 
 * @example
 * This page is automatically rendered at the root route (/)
 * 
 * @see {@link ../layout.tsx} - Root layout component
 * @see {@link @repo/ui/button} - Shared Button component
 * @todo Add actual application content and features
 */

import { Button } from "@repo/ui/button";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1>IDEAI</h1>
        <p>Welcome to IDEAI</p>
        <Button appName="web" className={styles.secondary}>
          Open alert
        </Button>
      </main>
    </div>
  );
}
