/**
 * @fileoverview IdeaI Docs Viewer Component
 * 
 * @module IdeAIDocsViewer
 * @description
 * Embeds and filters IdeaI documentation from the docs app.
 * Can filter by category, path, or search term.
 * 
 * @example
 * ```tsx
 * <IdeAIDocsViewer 
 *   filter={{ category: "deployment" }}
 *   docsUrl="https://docs.myui.space"
 * />
 * ```
 */

"use client";

import { useState, useEffect } from "react";
import { IdeAIPageTemplate } from "./ideai-page-template";
import { IdeaIButton } from "./ideai-button";
import styles from "./ideai-docs-viewer.module.css";

export interface IdeAIDocsViewerProps {
  /** Filter criteria for docs */
  filter?: {
    /** Filter by category (e.g., "deployment", "development") */
    category?: string;
    /** Filter by path prefix (e.g., "deployment/") */
    path?: string;
    /** Search term to filter docs */
    search?: string;
  };
  /** Base URL for docs app (defaults to /docs or docs app URL) */
  docsUrl?: string;
  /** Title for the docs viewer */
  title?: string;
  /** Show navigation sidebar */
  showNav?: boolean;
}

/**
 * IdeaI Docs Viewer Component
 * 
 * Embeds filtered documentation from the IdeaI docs app.
 */
export function IdeAIDocsViewer({
  filter = {},
  docsUrl,
  title = "IdeaI Documentation",
  showNav = true,
}: IdeAIDocsViewerProps) {
  const [currentPath, setCurrentPath] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [loading, setLoading] = useState(false);

  // Determine docs URL
  // In development, use the docs app directly (port 3001)
  // In production, use the same origin (/docs) or provided docsUrl
  const [baseDocsUrl, setBaseDocsUrl] = useState<string>("/docs");
  
  useEffect(() => {
    if (typeof window !== "undefined") {
      const url = docsUrl || 
        (process.env.NODE_ENV === "development"
          ? "http://localhost:3001"
          : `${window.location.origin}/docs`);
      setBaseDocsUrl(url);
    }
  }, [docsUrl]);

  // Build filter query string
  const filterParams = new URLSearchParams();
  if (filter.category) filterParams.set("category", filter.category);
  if (filter.path) filterParams.set("path", filter.path);
  if (filter.search) filterParams.set("search", filter.search);

  // Docs app routes are under /docs/[...slug]
  // If currentPath is empty, use root of docs app
  // If currentPath starts with /docs, use as-is
  // Otherwise, prepend /docs
  const docsPath = currentPath === "" || currentPath === "/docs"
    ? ""
    : currentPath.startsWith("/docs")
      ? currentPath
      : `/docs${currentPath}`;
  
  const iframeUrl = `${baseDocsUrl}${docsPath}${filterParams.toString() ? `?${filterParams.toString()}` : ""}`;

  useEffect(() => {
    // Set initial path based on filter
    // Paths should be relative to /docs (e.g., "deployment/overview" not "/docs/deployment/overview")
    if (filter.path) {
      // Remove leading /docs if present, we'll add it when building URL
      const cleanPath = filter.path.replace(/^\/?docs\//, "");
      setCurrentPath(`/${cleanPath}`);
      // Set active tab based on path
      if (cleanPath.startsWith("deployment")) {
        setActiveTab("deployment");
      } else if (cleanPath.startsWith("development")) {
        setActiveTab("development");
      } else if (cleanPath.startsWith("setup")) {
        setActiveTab("setup");
      } else {
        setActiveTab("overview");
      }
    } else if (filter.category) {
      // Map category to default doc path
      const categoryMap: Record<string, string> = {
        deployment: "/deployment/overview",
        development: "/development/getting-started",
        setup: "/setup/github-secrets",
      };
      setCurrentPath(categoryMap[filter.category] || `/${filter.category}`);
      setActiveTab(filter.category);
    } else {
      setCurrentPath("");
      setActiveTab("overview");
    }
    setLoading(false);
  }, [filter]);

  const vercelProjectName = process.env.NEXT_PUBLIC_VERCEL_PROJECT_NAME || "web";
  const vercelOrgId = process.env.NEXT_PUBLIC_VERCEL_ORG_ID || "team_vhjzlMi6CfNow0IfBXnv2Yn2";

  return (
    <IdeAIPageTemplate
      siteName={title}
      subtitle="IdeaI Framework Documentation"
      vercelProjectName={vercelProjectName}
      vercelOrgId={vercelOrgId}
      headerActions={<IdeaIButton appName="web">Open alert</IdeaIButton>}
    >
      <div className={styles.docsViewer}>
        {showNav && (
          <nav className={styles.nav}>
            <h3>Documentation</h3>
            <ul>
              <li>
                <a 
                  href="#" 
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentPath("/docs");
                    setActiveTab("overview");
                  }}
                  className={activeTab === "overview" ? styles.active : ""}
                >
                  Overview
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentPath("/deployment/overview");
                    setActiveTab("deployment");
                  }}
                  className={activeTab === "deployment" ? styles.active : ""}
                >
                  Deployment
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentPath("/development/getting-started");
                    setActiveTab("development");
                  }}
                  className={activeTab === "development" ? styles.active : ""}
                >
                  Development
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentPath("/setup/github-secrets");
                    setActiveTab("setup");
                  }}
                  className={activeTab === "setup" ? styles.active : ""}
                >
                  Setup
                </a>
              </li>
            </ul>
          </nav>
        )}
        
        <div className={styles.content}>
          {loading ? (
            <div className={styles.loading}>
              <p>Loading documentation...</p>
            </div>
          ) : (
            <iframe
              src={iframeUrl}
              className={styles.docsIframe}
              title={title}
              loading="lazy"
              sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-modals"
              onLoad={() => setLoading(false)}
              onError={() => setLoading(false)}
            />
          )}
        </div>
      </div>
    </IdeAIPageTemplate>
  );
}

