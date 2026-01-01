/**
 * @fileoverview Smart catch-all route for serving sub-apps at /apps/{name}
 * 
 * @module SubAppCatchAll
 * @description
 * Smart routing that:
 * 1. Serves apps directly via iframe when available (development or integrated mode)
 * 2. Redirects to standalone URLs when configured (standalone deployment mode)
 * 3. Shows app info page as fallback
 * 
 * Architecture:
 * - Main app (web) at root: myui.space/
 * - Sub-apps at: myui.space/apps/{name}
 * - Apps can be served directly OR deployed standalone
 * - Smart detection: checks if app exists locally, serves it, otherwise redirects
 */

"use client";

import { use, useEffect, useState } from "react";
import { IdeAIPageTemplate } from "@repo/ui/components/ideai-page-template";
import styles from "./page.module.css";

interface PageProps {
  params: Promise<{
    app: string;
    path?: string[];
  }>;
}

// App configuration - matches all apps in monorepo
const SUB_APPS = {
  docs: {
    name: "Documentation",
    description: "IdeaI documentation site",
    standaloneUrl: process.env.NEXT_PUBLIC_DOCS_URL,
    localPort: 3001,
  },
  all: {
    name: "All Components",
    description: "Complete HTML5 test page and component showcase",
    standaloneUrl: process.env.NEXT_PUBLIC_ALL_URL,
    localPort: 3002,
  },
  nocss: {
    name: "No CSS",
    description: "Pure HTML browser defaults",
    standaloneUrl: process.env.NEXT_PUBLIC_NOCSS_URL,
    localPort: 3003,
  },
  mvp: {
    name: "MVP.css",
    description: "MVP.css only - semantic HTML styling",
    standaloneUrl: process.env.NEXT_PUBLIC_MVP_URL,
    localPort: 3004,
  },
  tailwind: {
    name: "Tailwind CSS",
    description: "Tailwind CSS only - utility-first styling",
    standaloneUrl: process.env.NEXT_PUBLIC_TAILWIND_URL,
    localPort: 3005,
  },
  allcss: {
    name: "All CSS",
    description: "MVP.css + Tailwind CSS - complete styling",
    standaloneUrl: process.env.NEXT_PUBLIC_ALLCSS_URL,
    localPort: 3006,
  },
  bootstrap: {
    name: "Bootstrap",
    description: "Bootstrap CSS framework",
    standaloneUrl: process.env.NEXT_PUBLIC_BOOTSTRAP_URL,
    localPort: 3007,
  },
  unocss: {
    name: "UnoCSS",
    description: "UnoCSS utility-first CSS engine",
    standaloneUrl: process.env.NEXT_PUBLIC_UNOCSS_URL,
    localPort: 3008,
  },
  shadcn: {
    name: "Shadcn Components",
    description: "Shadcn/ui component showcase",
    standaloneUrl: process.env.NEXT_PUBLIC_SHADCN_URL,
    localPort: 3009,
  },
} as const;

type AppId = keyof typeof SUB_APPS;

export default function SubAppPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const app = resolvedParams.app;
  const path = resolvedParams.path || [];
  const [appStatus, setAppStatus] = useState<{
    running: boolean;
    url: string | null;
  } | null>(null);

  useEffect(() => {
    if (!app) return;

    const appConfig = SUB_APPS[app as AppId];
    if (!appConfig) return;

    // Check if app is running locally (development)
    async function checkAppStatus() {
      if (typeof window === "undefined") return;

      // In development, check if local server is running
      // eslint-disable-next-line turbo/no-undeclared-env-vars
      if (process.env.NODE_ENV === "development" && appConfig.localPort) {
        try {
          const localUrl = `http://localhost:${appConfig.localPort}`;
          // Use no-cors mode to check if server is running (CORS errors are expected)
          await fetch(localUrl, { 
            method: "HEAD",
            mode: "no-cors",
            cache: "no-store"
          });
          // If we can reach it (even with CORS error), it's running
          setAppStatus({
            running: true,
            url: localUrl,
          });
        } catch {
          setAppStatus({
            running: false,
            url: null,
          });
        }
      } else {
        // In production, assume app is available if no standalone URL is set
        // (meaning it should be served directly)
        if (!appConfig.standaloneUrl) {
          setAppStatus({
            running: true,
            url: null, // Will be served via iframe from same origin
          });
        } else {
          setAppStatus({
            running: false,
            url: null,
          });
        }
      }
    }

    checkAppStatus();
  }, [app]);

  // Compute values for rendering
  const appConfig = app ? SUB_APPS[app as AppId] : null;
  const pathStr = path.length > 0 ? `/${path.join("/")}` : "";
  const standaloneUrl = appConfig?.standaloneUrl 
    ? `${appConfig.standaloneUrl}${pathStr}`
    : null;

  // Strategy 1: Redirect to standalone URL (if configured and in production)
  useEffect(() => {
    // eslint-disable-next-line turbo/no-undeclared-env-vars
    if (standaloneUrl && process.env.NODE_ENV === "production" && typeof window !== "undefined") {
      window.location.href = standaloneUrl;
    }
  }, [standaloneUrl]);

  if (!app) {
    return (
      <IdeAIPageTemplate siteName="Loading...">
        <div className={styles.container}>
          <p>Loading...</p>
        </div>
      </IdeAIPageTemplate>
    );
  }

  if (!appConfig) {
    return (
      <IdeAIPageTemplate siteName="App Not Found">
        <div className={styles.container}>
          <h1>App Not Found</h1>
          <p>The app &quot;{app}&quot; does not exist.</p>
          <p>
            <a href="/index">View all apps →</a>
          </p>
        </div>
      </IdeAIPageTemplate>
    );
  }

  // eslint-disable-next-line turbo/no-undeclared-env-vars
  if (standaloneUrl && process.env.NODE_ENV === "production") {
    return (
      <IdeAIPageTemplate siteName={`Redirecting to ${appConfig.name}...`}>
        <div className={styles.container}>
          <div className={styles.infoPage}>
            <h1>Redirecting...</h1>
            <p>Redirecting to {appConfig.name}...</p>
            <p>
              If you are not redirected, <a href={standaloneUrl}>click here</a>.
            </p>
          </div>
        </div>
      </IdeAIPageTemplate>
    );
  }

  // Strategy 2: Serve directly via iframe (if app is available)
  // eslint-disable-next-line turbo/no-undeclared-env-vars
  const isProduction = process.env.NODE_ENV === "production";
  if (appStatus?.running || (!standaloneUrl && isProduction)) {
    const iframeUrl = appStatus?.url || 
      (isProduction
        ? standaloneUrl || `/${app}${pathStr}`
        : `http://localhost:${appConfig.localPort}${pathStr}`);

    return (
      <IdeAIPageTemplate siteName={appConfig.name}>
        <div className={styles.container}>
          <div className={styles.header}>
            <h1>{appConfig.name}</h1>
            <p className={styles.description}>{appConfig.description}</p>
            {standaloneUrl && (
              <p className={styles.standaloneLink}>
                <a
                  href={standaloneUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Open as standalone app →
                </a>
              </p>
            )}
          </div>
          <div className={styles.iframeWrapper}>
            <iframe
              src={iframeUrl}
              className={styles.appIframe}
              title={`${appConfig.name} - ${app}`}
              loading="lazy"
              sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-modals"
            />
          </div>
        </div>
      </IdeAIPageTemplate>
    );
  }

  // Strategy 3: Show info page (fallback)
  return (
    <IdeAIPageTemplate siteName={appConfig.name}>
      <div className={styles.container}>
        <div className={styles.infoPage}>
          <h1>{appConfig.name}</h1>
          <p className={styles.description}>{appConfig.description}</p>
          <div className={styles.info}>
            <p>
              <strong>Path:</strong> /apps/{app}
              {path.length > 0 && `/${path.join("/")}`}
            </p>
            {appConfig.localPort && (
              <p>
                <strong>Local Port:</strong> {appConfig.localPort}
              </p>
            )}
            {standaloneUrl && (
              <p>
                <strong>Standalone URL:</strong>{" "}
                <a
                  href={standaloneUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {standaloneUrl}
                </a>
              </p>
            )}
          </div>
          {standaloneUrl ? (
            <div className={styles.actions}>
              <a
                href={standaloneUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.button}
              >
                Open Standalone App
              </a>
            </div>
          ) : (
            <div className={styles.actions}>
              <p className={styles.hint}>
                Start the development server to view this app:
              </p>
              <code className={styles.command}>
                pnpm --filter {app} dev
              </code>
            </div>
          )}
          <div className={styles.backLink}>
            <a href="/index">← Back to Apps Index</a>
          </div>
        </div>
      </div>
    </IdeAIPageTemplate>
  );
}
