/**
 * @fileoverview Animations Index Page
 * 
 * @module AnimationsIndexPage
 * @description
 * Index page for animation demonstrations.
 * Provides navigation to Framer Motion and React Spring demos.
 * 
 * Route: /animations
 */

import { IdeAIPageTemplate } from "@repo/ui/components/ideai-page-template";
import Link from "next/link";

export default function AnimationsPage() {
  const vercelProjectName = process.env.NEXT_PUBLIC_VERCEL_PROJECT_NAME || "web";
  const vercelOrgId = process.env.NEXT_PUBLIC_VERCEL_ORG_ID || "team_vhjzlMi6CfNow0IfBXnv2Yn2";

  return (
    <IdeAIPageTemplate
      siteName="IdeaI"
      vercelProjectName={vercelProjectName}
      vercelOrgId={vercelOrgId}
    >
      <div className="max-w-4xl mx-auto p-8 space-y-12">
        <header className="text-center space-y-4">
          <h1 className="text-4xl font-bold">Animation Demos</h1>
          <p className="text-slate-600 dark:text-slate-400">
            Explore different animation libraries and techniques
          </p>
        </header>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Framer Motion Card */}
          <Link
            href="/animations/framer-motion"
            className="group p-6 border border-slate-200 dark:border-slate-700 rounded-lg hover:border-blue-500 dark:hover:border-blue-500 transition-colors"
          >
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">🎬</span>
                </div>
                <h2 className="text-2xl font-semibold">Framer Motion</h2>
              </div>
              <p className="text-slate-600 dark:text-slate-400">
                React Fiber-based animation library with declarative animations,
                gestures, and layout animations.
              </p>
              <div className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400">
                <span>View Demo</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </div>
          </Link>

          {/* React Spring Card */}
          <Link
            href="/animations/react-spring"
            className="group p-6 border border-slate-200 dark:border-slate-700 rounded-lg hover:border-purple-500 dark:hover:border-purple-500 transition-colors"
          >
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">🌊</span>
                </div>
                <h2 className="text-2xl font-semibold">React Spring</h2>
              </div>
              <p className="text-slate-600 dark:text-slate-400">
                Physics-based animation library with spring physics,
                natural motion, and smooth transitions.
              </p>
              <div className="flex items-center gap-2 text-sm text-purple-600 dark:text-purple-400">
                <span>View Demo</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </div>
          </Link>
        </div>

        <section className="mt-12 p-6 bg-slate-50 dark:bg-slate-900 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">About These Demos</h2>
          <div className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
            <p>
              These animation demos are shared components available across all IdeaI apps.
              They are lazy-loaded for optimal performance and only load when accessed.
            </p>
            <p>
              All animations respect device performance settings and can be automatically
              disabled on low-end devices for better performance.
            </p>
          </div>
        </section>
      </div>
    </IdeAIPageTemplate>
  );
}

