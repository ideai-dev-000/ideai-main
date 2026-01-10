/**
 * @fileoverview Home page for IdeaI VibeCoder
 *
 * @module HomePage
 * @description
 * Protected home page - requires authentication to access.
 * Shows landing page for logged-out users, full vibe service for authenticated users.
 */

import { Suspense } from "react";
import { HomeClient } from "@/components/home/home-client";
import { EnvSetup } from "@/components/env-setup";
import { AuthProtectedPage } from "@/components/auth/protected-page";

function hasEnvVars(): boolean {
  try {
    const hasKey = !!process.env.V0_API_KEY;
    const hasSecret = !!process.env.AUTH_SECRET;
    const hasDb = !!process.env.POSTGRES_URL;
    return hasKey && hasSecret && hasDb;
  } catch {
    return false;
  }
}

function getMissingVars() {
  const missing: Array<{
    name: string;
    description: string;
    example: string;
    required: boolean;
  }> = [];

  if (!process.env.V0_API_KEY) {
    missing.push({
      name: "V0_API_KEY",
      description: "Your v0 API key for generating apps",
      example: "v0_sk_...",
      required: true,
    });
  }

  if (!process.env.AUTH_SECRET) {
    missing.push({
      name: "AUTH_SECRET",
      description: "Secret key for NextAuth.js authentication",
      example: "your-secret-key-here",
      required: true,
    });
  }

  if (!process.env.POSTGRES_URL) {
    missing.push({
      name: "POSTGRES_URL",
      description: "PostgreSQL database connection string",
      example: "",
      required: true,
    });
  }

  return missing;
}

export default function Home() {
  const isDevelopment = process.env.NODE_ENV === "development";
  const envVarsPresent = hasEnvVars();

  // Only show setup screen in development if environment variables are missing
  if (!envVarsPresent && isDevelopment) {
    const missingVars = getMissingVars();
    return <EnvSetup missingVars={missingVars} />;
  }

  // CRITICAL: Protect all routes - require authentication
  // Shows landing page for logged-out users, full vibe service for authenticated users
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
