/**
 * @fileoverview Vibe page for IdeaI Capabilities - AI-powered component generation
 *
 * @module VibePage
 * @description
 * Vibe coding page using v0 SDK - Generate React components with beautiful UIs
 * through natural conversation. Part of unified IdeaI Capabilities platform.
 */

import { Suspense } from "react";
import { HomeClient } from "@/components/home/home-client";
import { EnvSetup } from "@/components/env-setup";
import { AuthProtectedPage } from "@/components/auth/protected-page";

export default function VibePage() {
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
      <div className="pointer-events-auto flex min-h-screen items-center justify-center pt-16">
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

  // Protected page - shows vibe service for authenticated users
  return (
    <div className="pointer-events-auto min-h-screen">
      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center pt-16">
            <div className="text-center">
              <p className="text-gray-600">Loading...</p>
            </div>
          </div>
        }
      >
        <HomeClient />
      </Suspense>
    </div>
  );
}
