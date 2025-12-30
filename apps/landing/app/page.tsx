/**
 * @fileoverview Landing page showing all IdeaI apps
 */

import { IdeaIHeader } from "@repo/ui/components/ideai-header";
import { IdeAIFooter } from "@repo/ui/components/ideai-footer";
import { IdeaIButton } from "@repo/ui/components/ideai-button";
import { AppCard } from "./app-card";
import { AppModal } from "./app-modal";
import { defaultRoutingConfig } from "./config/routing";
import styles from "./page.module.css";

// Use centralized routing config
// In production, this could be fetched from /api/apps for runtime discovery
const apps = defaultRoutingConfig.apps;

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <IdeaIHeader siteName="IdeaI" subtitle="Monorepo Landing - All Applications">
          <IdeaIButton appName="landing">Open alert</IdeaIButton>
        </IdeaIHeader>
        
        <div className={styles.content}>
          <section className={styles.appsSection}>
            <h2 className={styles.sectionTitle}>Available Applications</h2>
            <p className={styles.sectionDescription}>
              Click on any app card to view it in a popup, or navigate directly via the folder path.
            </p>
            
            <div className={styles.appsGrid}>
              {apps.map((app) => (
                <AppCard key={app.id} app={app} />
              ))}
            </div>
          </section>
        </div>
      </main>
      <IdeAIFooter />
      <AppModal />
    </div>
  );
}

