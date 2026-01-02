/**
 * @fileoverview Parent app route for serving child apps at /apps/{name}
 * 
 * @module SubAppCatchAll
 * @description
 * Unified routing that serves child apps as routes within the parent app.
 * Supports two modes:
 * - Unified mode: Child apps imported as components (all on port 3000)
 * - Individual mode: Child apps on separate ports (iframes, for dev/testing)
 * 
 * Architecture:
 * - Parent app (web) at root: myui.space/
 * - Child apps at: myui.space/apps/{name}
 * - Unified: Child apps are imported components (no branding, just main content)
 * - Individual: Child apps in iframes (for development/testing)
 * 
 * Toggle mode via NEXT_PUBLIC_IDEAI_APP_MODE=unified|individual
 * 
 * @see https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes
 */

"use client";

import { use, useEffect, useState, Suspense } from "react";
import { IdeAIPageTemplate, getChildAppConfig, getAppMode } from "@repo/ui";
import { getChildAppComponent } from "../registry";
import styles from "./page.module.css";

interface PageProps {
  params: Promise<{
    app: string;
    path?: string[];
  }>;
}


function SubAppPageContent({ params }: PageProps) {
  const resolvedParams = use(params);
  const app = resolvedParams?.app || "";
  const path = resolvedParams?.path || [];
  const [appUrl, setAppUrl] = useState<string | null>(null);
  const [appConfig, setAppConfig] = useState<{ name: string; localPort?: number } | null>(null);
  const [ChildComponent, setChildComponent] = useState<React.ComponentType<any> | null>(null);
  const [mode, setMode] = useState<"unified" | "individual">("individual");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!app) return;

    const currentMode = getAppMode();
    setMode(currentMode);

    // Get child app config
    const config = getChildAppConfig(app);
    setAppConfig({
      name: config.name,
      localPort: config.localPort,
    });

    if (currentMode === "unified") {
      // Unified mode: Load child app as component from registry (synchronous)
      const Component = getChildAppComponent(app);
      setChildComponent(Component);
      setLoading(false);
    } else {
      // Individual mode: Use iframe with separate port
      // eslint-disable-next-line turbo/no-undeclared-env-vars
      if (process.env.NODE_ENV === "development" && config.localPort) {
        setAppUrl(`http://localhost:${config.localPort}`);
      }
      setLoading(false);
    }
  }, [app]);

  const pathStr = path.length > 0 ? `/${path.join("/")}` : "";

  if (!app || loading) {
    return (
      <IdeAIPageTemplate siteName="Loading...">
        <div className={styles.container}>
          <p>Loading {app || "app"}...</p>
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

  // Unified mode: All apps on port 3000, child apps embedded as iframes
  // Parent app: http://localhost:3000/ (default)
  // Child apps: http://localhost:3000/{name} (proxied via rewrites)
  // Parent embeds: http://localhost:3000/apps/{name} (shows child app in iframe)
  // Child apps detect /apps/{name} route and hide branding automatically
  if (mode === "unified") {
    // In unified mode, child apps are proxied to their root paths via Next.js rewrites
    // We use iframe pointing to child app's root (/) - rewrites handle the proxy
    // The child app will detect it's embedded via iframe detection and hide branding
    const iframeUrl = typeof window !== "undefined" 
      ? `${window.location.origin}/${app}${pathStr}?i=1&h=0&f=0&n=0`
      : null;
    
    if (iframeUrl) {
      return (
        <IdeAIPageTemplate siteName={appConfig.name}>
          <div className={styles.container}>
            <div className={styles.iframeWrapper}>
              <iframe
                src={iframeUrl}
                className={styles.appIframe}
                title={appConfig.name}
                loading="lazy"
                sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-modals"
              />
            </div>
          </div>
        </IdeAIPageTemplate>
      );
    }
    
    // Fallback
    return (
      <IdeAIPageTemplate siteName={appConfig.name}>
        <div className={styles.container}>
          <div className={styles.infoPage}>
            <h1>{appConfig.name}</h1>
            <p>Mode: Unified (all apps on port 3000)</p>
            <p>Child apps are embedded as iframes in the parent app.</p>
            <p>
              <a href="/index">← Back to Apps Index</a>
            </p>
          </div>
        </div>
      </IdeAIPageTemplate>
    );
  }

  // Individual mode: Use iframe
  const iframeUrl = appUrl ? `${appUrl}${pathStr}` : null;

  if (!iframeUrl) {
    return (
      <IdeAIPageTemplate siteName={appConfig.name}>
        <div className={styles.container}>
          <div className={styles.infoPage}>
            <h1>{appConfig.name}</h1>
            <p>Mode: Individual (separate ports)</p>
            <p>Start the development server to view this app:</p>
            <code className={styles.command}>
              pnpm --filter {app} dev
            </code>
            <p>
              <a href="/index">← Back to Apps Index</a>
            </p>
          </div>
        </div>
      </IdeAIPageTemplate>
    );
  }

  return (
    <IdeAIPageTemplate siteName={appConfig.name}>
      <div className={styles.container}>
        <div className={styles.iframeWrapper}>
          <iframe
            src={iframeUrl}
            className={styles.appIframe}
            title={appConfig.name}
            loading="lazy"
            sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-modals"
          />
        </div>
      </div>
    </IdeAIPageTemplate>
  );
}

// Export with Suspense boundary for proper error handling
export default function SubAppPage({ params }: PageProps) {
  return (
    <Suspense
      fallback={
        <IdeAIPageTemplate siteName="Loading...">
          <div className={styles.container}>
            <p>Loading app...</p>
          </div>
        </IdeAIPageTemplate>
      }
    >
      <SubAppPageContent params={params} />
    </Suspense>
  );
}
