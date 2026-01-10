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
  const isDevelopment = process.env.NODE_ENV === "development";
  const envVarsPresent = hasEnvVars();

  // Only show setup screen in development if environment variables are missing
  if (!envVarsPresent && isDevelopment) {
    const missingVars = getMissingVars();
    return <EnvSetup missingVars={missingVars} />;
  }

  // Protected page - shows landing for logged-out, full vibe service for authenticated
  return (
    <AuthProtectedPage>
      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <p className="text-gray-600">Loading...</p>
            </div>
          </div>
        }
      >
        <HomeClient />
      </Suspense>
    </AuthProtectedPage>
  );
}
