/**
 * @fileoverview IdeaI Apps Index Page
 * 
 * @module AppsIndex
 * @description
 * Displays a card-based index of all IdeaI apps with their metadata and status.
 * Reads .ideai metadata files from each app directory.
 */

"use client";

import { useEffect, useState } from "react";
import { IdeAIPageTemplate } from "@repo/ui/components/ideai-page-template";
import { IdeaIButton } from "@repo/ui/components/ideai-button";
import {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import styles from "./page.module.css";

interface AppMetadata {
  id: string;
  name: string;
  description: string;
  port: number;
  css: string[];
  capabilities: string[];
  path: string;
  category: string;
  status?: {
    running: boolean;
    port: number;
    url: string | null;
  };
}

export default function AppsIndex() {
  const [apps, setApps] = useState<AppMetadata[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadApps() {
      try {
        const response = await fetch("/api/apps-index");
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

  const vercelProjectName = process.env.NEXT_PUBLIC_VERCEL_PROJECT_NAME || "web";
  const vercelOrgId = process.env.NEXT_PUBLIC_VERCEL_ORG_ID || "team_vhjzlMi6CfNow0IfBXnv2Yn2";

  return (
    <IdeAIPageTemplate
      siteName="IdeaI Apps Index"
      subtitle="Local Development Environment Overview"
      vercelProjectName={vercelProjectName}
      vercelOrgId={vercelOrgId}
      headerActions={<IdeaIButton appName="web">Open alert</IdeaIButton>}
    >
      <div className={styles.index}>
        <div className={styles.header}>
          <h1>IdeaI Apps Index</h1>
          <p className={styles.subtitle}>
            Overview of all apps in the IdeaI monorepo. Status updates every 5 seconds.
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
              <Card key={app.id} className={styles.card}>
                <CardHeader className={styles.cardHeader}>
                  <div className={styles.cardHeaderTop}>
                    <CardTitle className={styles.cardTitle}>{app.name}</CardTitle>
                    {app.status?.running ? (
                      <Badge variant="default" className={styles.statusBadgeRunning}>
                        🟢 Running
                      </Badge>
                    ) : (
                      <Badge variant="destructive" className={styles.statusBadgeStopped}>
                        🔴 Stopped
                      </Badge>
                    )}
                  </div>
                  <CardDescription className={styles.description}>
                    {app.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className={styles.cardContent}>
                  {/* Iframe Preview - Scaled Down */}
                  {app.status?.running && app.status.url ? (
                    <div className={styles.iframeContainer}>
                      <iframe
                        src={`${app.status.url}?i=1&h=0&f=0&n=0&c=0&u=0`}
                        className={styles.previewIframe}
                        title={`${app.name} preview`}
                        loading="lazy"
                        sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
                      />
                    </div>
                  ) : (
                    <div className={styles.iframePlaceholder}>
                      <p>Start server to see preview</p>
                    </div>
                  )}

                  {/* CSS Tags */}
                  <div className={styles.cssTags}>
                    {app.css.map((css) => (
                      <Badge key={css} variant="outline" className={styles.cssTag}>
                        {css}
                      </Badge>
                    ))}
                  </div>

                  {/* Metadata */}
                  <div className={styles.metadata}>
                    <div className={styles.metaItem}>
                      <span className={styles.metaLabel}>Port:</span>
                      <span className={styles.metaValue}>{app.port || "N/A"}</span>
                    </div>
                    <div className={styles.metaItem}>
                      <span className={styles.metaLabel}>Category:</span>
                      <span className={styles.metaValue}>{app.category}</span>
                    </div>
                  </div>
                </CardContent>

                <CardFooter className={styles.cardFooter}>
                  {app.status?.url ? (
                    <Button
                      asChild
                      variant="default"
                      size="sm"
                      className={styles.openButton}
                    >
                      <a
                        href={app.status.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Open App
                      </a>
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      disabled
                      className={styles.openButton}
                    >
                      Start server to open
                    </Button>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </IdeAIPageTemplate>
  );
}
