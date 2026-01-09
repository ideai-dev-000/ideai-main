/**
 * @fileoverview App Builder page for Capabilities site
 *
 * @module AppBuilderPage
 * @description
 * App Builder page using Cloud Manager UI for Vercel project management.
 * Protected by authentication - redirects anonymous users to landing page.
 */

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { CloudManagerUI } from "@repo/cloud-manager/components/cloud-manager-ui";

export default function AppBuilderPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  // Check if user is authenticated (not anonymous)
  const isAnonymous =
    !session?.user ||
    session.user.name === "Anonymous" ||
    session.user.email?.startsWith("temp-");

  // Show loading state while checking session
  if (isPending) {
    return (
      <div className="pointer-events-auto flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-slate-300 border-t-slate-600 mx-auto" />
          <p className="text-slate-600 dark:text-slate-400">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to landing page if not authenticated
  useEffect(() => {
    if (!isPending && isAnonymous) {
      router.replace("/");
    }
  }, [isPending, isAnonymous, router]);

  // Don't render anything if anonymous (redirect is in progress)
  if (isAnonymous) {
    return null;
  }

  return (
    <div className="pointer-events-auto min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">App Builder</h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400">
            Manage your Vercel projects and cloud deployments.
          </p>
        </div>
        <CloudManagerUI />
      </div>
    </div>
  );
}
