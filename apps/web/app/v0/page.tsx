/**
 * @fileoverview V0 Apps landing page
 *
 * @module V0AppsPage
 * @description
 * Landing page for v0-generated Next.js apps. Displays all apps from __v0 folder
 * in a grid of cards with metadata.
 */

"use client";

import { useEffect, useState } from "react";
import { IdeAIPageTemplate } from "@repo/ui/components/ideai-page-template";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/ui/card";
import { Button } from "@repo/ui/components/ui/button";
import { Badge } from "@repo/ui/components/ui/badge";
import { ExternalLink, Code } from "lucide-react";
import styles from "./page.module.css";

interface V0AppMetadata {
  id: string;
  name: string;
  description: string;
  version?: string;
  path: string;
  folderPath: string;
  port?: number;
  enabled?: boolean;
  category?: string;
}

export default function V0AppsPage() {
  const [apps, setApps] = useState<V0AppMetadata[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadApps = async () => {
      try {
        setError(null);
        const response = await fetch("/api/v0-apps");
        if (!response.ok) {
          throw new Error("Failed to load v0 apps");
        }
        const data = await response.json();
        setApps(Array.isArray(data) ? data : []);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Unknown error";
        setError(errorMessage);
        console.error("Failed to load v0 apps:", err);
      } finally {
        setLoading(false);
      }
    };

    loadApps();
  }, []);

  const vercelProjectName =
    process.env.NEXT_PUBLIC_VERCEL_PROJECT_NAME || "web";
  const vercelOrgId =
    process.env.NEXT_PUBLIC_VERCEL_ORG_ID || "team_vhjzlMi6CfNow0IfBXnv2Yn2";

  return (
    <IdeAIPageTemplate
      siteName="IdeaI /v0"
      subtitle="V0-Generated Apps"
      vercelProjectName={vercelProjectName}
      vercelOrgId={vercelOrgId}
    >
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>V0 Apps</h1>
          <p className={styles.subtitle}>
            Self-contained v0-generated Next.js apps. Each app runs
            independently with its own dependencies.
          </p>
        </div>

        {loading && (
          <div className={styles.loading}>
            <p>Loading v0 apps...</p>
          </div>
        )}

        {error && (
          <div className={styles.error}>
            <p>Error: {error}</p>
          </div>
        )}

        {!loading && !error && (
          <>
            {apps.length === 0 ? (
              <div className={styles.empty}>
                <p>
                  No v0 apps found. Add apps to the __v0 folder to get started.
                </p>
              </div>
            ) : (
              <div className={styles.grid}>
                {apps.map((app) => (
                  <Card key={app.id} className={styles.card}>
                    <CardHeader>
                      <div className={styles.cardHeader}>
                        <CardTitle>{app.name}</CardTitle>
                        {app.version && (
                          <Badge
                            variant="outline"
                            className={styles.versionBadge}
                          >
                            v{app.version}
                          </Badge>
                        )}
                      </div>
                      <CardDescription>{app.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className={styles.metadata}>
                        {app.category && (
                          <div className={styles.metaItem}>
                            <span className={styles.metaLabel}>Category:</span>
                            <span className={styles.metaValue}>
                              {app.category}
                            </span>
                          </div>
                        )}
                        {app.port && (
                          <div className={styles.metaItem}>
                            <span className={styles.metaLabel}>Port:</span>
                            <span className={styles.metaValue}>{app.port}</span>
                          </div>
                        )}
                        <div className={styles.metaItem}>
                          <span className={styles.metaLabel}>Folder:</span>
                          <span className={styles.metaValue}>
                            {app.folderPath}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className={styles.cardFooter}>
                      {app.port ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            window.open(
                              `http://localhost:${app.port}`,
                              "_blank",
                            );
                          }}
                          className={styles.openButton}
                        >
                          <ExternalLink className="h-3 w-3 mr-1" />
                          Open App
                        </Button>
                      ) : (
                        <Button variant="outline" size="sm" disabled>
                          <Code className="h-3 w-3 mr-1" />
                          No Port
                        </Button>
                      )}
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </IdeAIPageTemplate>
  );
}
