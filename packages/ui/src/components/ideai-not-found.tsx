/**
 * @fileoverview Centralized 404 Not Found component for all IdeaI apps
 *
 * @module IdeAINotFound
 * @description
 * Shared 404 page component with consistent styling and proper mobile centering.
 * Auto-detects app context from environment variables for zero-config usage.
 * Ensures button is centered on all screen sizes.
 *
 * @example
 * ```tsx
 * // Minimal usage - auto-detects from env
 * <IdeAINotFound />
 *
 * // Or with custom props
 * <IdeAINotFound
 *   siteName="IdeaI /custom"
 *   appName="custom"
 *   homeLabel="Go Home"
 *   message="The page you're looking for doesn't exist."
 * />
 * ```
 *
 * @see {@link ./ideai-page-template.tsx} - Page template component
 */

"use client";

import Link from "next/link";
import { IdeAIPageTemplate } from "./ideai-page-template";
import { IdeaIButton } from "./ideai-button";

interface IdeAINotFoundProps {
  siteName?: string;
  appName?: string;
  homeLabel?: string;
  message?: string;
  vercelProjectName?: string;
  vercelOrgId?: string;
}

export const IdeAINotFound = ({
  siteName,
  appName,
  homeLabel = "Go Home",
  message = "The page you're looking for doesn't exist.",
  vercelProjectName,
  vercelOrgId,
}: IdeAINotFoundProps = {}) => {
  // Auto-detect app context from environment variables
  const detectedAppName =
    appName || process.env.NEXT_PUBLIC_VERCEL_PROJECT_NAME || "web";
  const detectedSiteName =
    siteName ||
    `IdeaI${detectedAppName !== "web" ? ` /${detectedAppName}` : ""}`;
  const detectedVercelProjectName = vercelProjectName || detectedAppName;
  const detectedVercelOrgId =
    vercelOrgId ||
    process.env.NEXT_PUBLIC_VERCEL_ORG_ID ||
    "team_vhjzlMi6CfNow0IfBXnv2Yn2";
  return (
    <IdeAIPageTemplate
      siteName={detectedSiteName}
      subtitle="Page Not Found"
      vercelProjectName={detectedVercelProjectName}
      vercelOrgId={detectedVercelOrgId}
    >
      <div
        style={{
          textAlign: "center",
          padding: "40px 20px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "50vh",
        }}
      >
        <h1
          style={{
            fontSize: "4rem",
            marginBottom: "1rem",
            lineHeight: "1.2",
          }}
        >
          404
        </h1>
        <h2
          style={{
            fontSize: "2rem",
            marginBottom: "1rem",
            lineHeight: "1.3",
          }}
        >
          Page Not Found
        </h2>
        <p
          style={{
            fontSize: "1.2rem",
            marginBottom: "2rem",
            color: "rgb(100 116 139)",
            maxWidth: "600px",
            lineHeight: "1.5",
          }}
        >
          {message}
        </p>
        <div
          style={{ display: "flex", justifyContent: "center", width: "100%" }}
        >
          <Link
            href="/"
            style={{ textDecoration: "none", display: "inline-block" }}
          >
            <IdeaIButton
              appName={detectedAppName}
              onClick={() => {}}
              className="ideai-not-found-button"
            >
              {homeLabel}
            </IdeaIButton>
          </Link>
        </div>
      </div>
    </IdeAIPageTemplate>
  );
};
