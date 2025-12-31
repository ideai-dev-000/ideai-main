/**
 * @fileoverview Catch-all route for serving sub-apps at /apps/{name}
 * 
 * @module SubAppCatchAll
 * @description
 * This catch-all route allows the main web app to serve sub-apps at /apps/{name}.
 * In production, this can proxy to standalone deployed apps or serve them directly.
 * 
 * Architecture:
 * - Main app (web) at root: myui.space/
 * - Sub-apps at: myui.space/apps/{name}
 * - Apps can also be deployed standalone
 */

import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{
    app: string;
    path?: string[];
  }>;
}

// App configuration - matches routing config
const SUB_APPS = {
  docs: {
    name: "Documentation",
    description: "IdeaI documentation site",
    // In production, this could be a standalone URL or served directly
    standaloneUrl: process.env.NEXT_PUBLIC_DOCS_URL,
  },
  landing: {
    name: "Landing Page",
    description: "Monorepo landing page with app showcase",
    standaloneUrl: process.env.NEXT_PUBLIC_LANDING_URL,
  },
  all: {
    name: "All Components",
    description: "Complete HTML5 test page and component showcase",
    standaloneUrl: process.env.NEXT_PUBLIC_ALL_URL,
  },
  nocss: {
    name: "No CSS",
    description: "Pure HTML browser defaults",
    standaloneUrl: process.env.NEXT_PUBLIC_NOCSS_URL,
  },
  mvp: {
    name: "MVP.css",
    description: "MVP.css only - semantic HTML styling",
    standaloneUrl: process.env.NEXT_PUBLIC_MVP_URL,
  },
  tailwind: {
    name: "Tailwind CSS",
    description: "Tailwind CSS only - utility-first styling",
    standaloneUrl: process.env.NEXT_PUBLIC_TAILWIND_URL,
  },
  allcss: {
    name: "All CSS",
    description: "MVP.css + Tailwind CSS - complete styling",
    standaloneUrl: process.env.NEXT_PUBLIC_ALLCSS_URL,
  },
} as const;

export default async function SubAppPage({ params }: PageProps) {
  const { app, path } = await params;
  
  // Check if app exists
  const appConfig = SUB_APPS[app as keyof typeof SUB_APPS];
  if (!appConfig) {
    notFound();
  }

  // In production with standalone deployments, redirect to standalone URL
  if (appConfig.standaloneUrl && process.env.NODE_ENV === "production") {
    const pathStr = path ? `/${path.join("/")}` : "";
    const redirectUrl = `${appConfig.standaloneUrl}${pathStr}`;
    
    // Redirect to standalone app
    return (
      <html>
        <head>
          <meta httpEquiv="refresh" content={`0;url=${redirectUrl}`} />
          <script dangerouslySetInnerHTML={{
            __html: `window.location.href = ${JSON.stringify(redirectUrl)};`
          }} />
        </head>
        <body>
          <p>Redirecting to {appConfig.name}...</p>
          <p>If you are not redirected, <a href={redirectUrl}>click here</a>.</p>
        </body>
      </html>
    );
  }

  // In development or when serving directly, show app info
  // TODO: In the future, this could serve the app directly via iframe or proxy
  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h1>{appConfig.name}</h1>
      <p>{appConfig.description}</p>
      <p>
        <strong>Path:</strong> /apps/{app}
        {path && path.length > 0 && `/${path.join("/")}`}
      </p>
      {appConfig.standaloneUrl && (
        <p>
          <a href={appConfig.standaloneUrl} target="_blank" rel="noopener noreferrer">
            Open as standalone app →
          </a>
        </p>
      )}
      <p style={{ marginTop: "2rem", color: "#666" }}>
        This app can be served directly or accessed as a standalone deployment.
      </p>
    </div>
  );
}

