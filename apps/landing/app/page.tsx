/**
 * @fileoverview Landing page showing all IdeaI apps
 * 
 * MINIMAL VERSION - All shadcn/Radix UI components disabled for memory leak investigation
 */

import { IdeAIPageTemplate } from "@repo/ui/components/ideai-page-template";
// import { IdeaIButton } from "@repo/ui/components/ideai-button"; // Disabled - may use client components
// import { TooltipProvider } from "@repo/ui";
// import { SiteCardWrapper } from "./site-card-wrapper";
// import { AppModal } from "./app-modal";
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
      // headerActions={<IdeaIButton appName="landing">Open alert</IdeaIButton>} // Disabled
    >
      <div className={styles.page}>
        <div className={styles.main}>
          <div className={styles.content}>
            <section className={styles.appsSection}>
              <h2 className={styles.sectionTitle}>Available Applications</h2>
              <p className={styles.sectionDescription}>
                Minimal version - all shadcn/Radix UI components disabled for stability testing.
              </p>
              
              {/* CARDS TEMPORARILY DISABLED - Memory leak investigation */}
              {/* <TooltipProvider delayDuration={200}>
                <div className={styles.appsGrid}>
                  {apps.map((app) => (
                    <SiteCardWrapper key={app.id} app={app} />
                  ))}
                </div>
              </TooltipProvider> */}
              
              {/* Simple list view - NO client components */}
              <div className={styles.appsList}>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  {apps.map((app) => (
                    <li key={app.id} style={{ marginBottom: '1rem', padding: '1rem', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                      <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.25rem' }}>{app.name}</h3>
                      <p style={{ margin: '0 0 0.5rem 0', color: '#64748b' }}>{app.description}</p>
                      <div style={{ fontSize: '0.875rem', color: '#94a3b8' }}>
                        <span>Port: {app.port}</span> | <span>Path: {app.path}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          </div>
        </div>
      </div>
      {/* AppModal temporarily disabled - iframe may cause memory leaks */}
      {/* <AppModal /> */}
    </IdeAIPageTemplate>
  );
}
