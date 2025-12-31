/**
 * @fileoverview Landing page showing all IdeaI apps
 */

import { IdeAIPageTemplate } from "@repo/ui/components/ideai-page-template";
import { IdeaIButton } from "@repo/ui/components/ideai-button";
import { AppCard } from "./app-card";
import { AppModal } from "./app-modal";
import { defaultRoutingConfig } from "./config/routing";
import styles from "./page.module.css";

// Use centralized routing config
// In production, this could be fetched from /api/apps for runtime discovery
const apps = defaultRoutingConfig.apps;

export default function Home() {
  // Get Vercel project name from environment or default
  const vercelProjectName = process.env.NEXT_PUBLIC_VERCEL_PROJECT_NAME || "landing";
  const vercelOrgId = process.env.NEXT_PUBLIC_VERCEL_ORG_ID || "team_vhjzlMi6CfNow0IfBXnv2Yn2";

  return (
    <IdeAIPageTemplate
      siteName="IdeaI"
      subtitle="Monorepo Landing - All Applications"
      vercelProjectName={vercelProjectName}
      vercelOrgId={vercelOrgId}
      headerActions={<IdeaIButton appName="landing">Open alert</IdeaIButton>}
    >
      <div className={styles.page}>
        <div className={styles.main}>
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
        </div>
      </div>
      <AppModal />
    </IdeAIPageTemplate>
  );
}
