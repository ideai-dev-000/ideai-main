/**
 * @fileoverview Main landing page for the IdeaI web application
 *
 * @module WebAppPage
 * @description
 * The home page component for the IdeaI web application.
 * Shows the apps index - overview of all IdeaI apps in the monorepo.
 *
 * @example
 * This page is automatically rendered at the root route (/)
 *
 * @see {@link ../layout.tsx} - Root layout component
 * @see {@link @repo/ui/components/ideai-page-template} - Shared page template
 */

"use client";

import { useEffect, useState } from "react";
import { IdeAIPageTemplate } from "@repo/ui/components/ideai-page-template";
import { IdeAIAppCard, type EnhancedAppMetadata } from "@repo/ui";
import styles from "./page.module.css";

export default function Home() {
  const [apps, setApps] = useState<EnhancedAppMetadata[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isDevelopment = process.env.NODE_ENV === "development";

  useEffect(() => {
    async function loadApps() {
      try {
        const response = await fetch("/api/apps-enhanced");
        if (!response.ok) {
          throw new Error("Failed to load apps");
        }
        const data = await response.json();
        setApps(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    }

    loadApps();

    // Refresh status every 5 seconds
    const interval = setInterval(loadApps, 5000);
    return () => clearInterval(interval);
  }, []);

  const vercelProjectName =
    process.env.NEXT_PUBLIC_VERCEL_PROJECT_NAME || "web";
  const vercelOrgId =
    process.env.NEXT_PUBLIC_VERCEL_ORG_ID || "team_vhjzlMi6CfNow0IfBXnv2Yn2";

  return (
    <IdeAIPageTemplate
      siteName="IdeaI"
      subtitle="Local Development Environment Overview"
      vercelProjectName={vercelProjectName}
      vercelOrgId={vercelOrgId}
    >
      <div className={styles.index}>
        <div className={styles.header}>
          <h1>IdeaI Apps Index</h1>
          <p className={styles.subtitle}>
            Overview of all apps in the IdeaI monorepo. Status updates every 5
            seconds.
          </p>
        </div>

        {loading && (
          <div className={styles.loading}>
            <p>Loading apps...</p>
          </div>
        )}

        {error && (
          <div className={styles.error}>
            <p>Error: {error}</p>
          </div>
        )}

        {!loading && !error && (
          <div className={styles.grid}>
            {apps.map((app) => (
              <IdeAIAppCard
                key={app.id}
                app={app}
                vercelProject={app.vercelProject}
                vercelDomains={app.vercelDomains}
                mode="landing"
                showCloudActions={isDevelopment}
                onOpenLocal={() => {
                  if (app.status?.url) {
                    window.open(app.status.url, "_blank");
                  }
                }}
              />
            ))}
          </div>
        )}
      </div>
    </IdeAIPageTemplate>
  );
}
