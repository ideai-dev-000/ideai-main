/**
 * @fileoverview Protected page wrapper with auth guard
 *
 * @module ProtectedPage
 * @description
 * Wrapper component that ensures authentication is required.
 * Shows landing page for logged-out users, protected content for authenticated users.
 */

"use client";

import { type ReactNode } from "react";
import { AuthGuard } from "./auth-guard";
import { AuthErrorBoundary } from "./auth-error-boundary";
import { LandingPage } from "./landing-page";

interface ProtectedPageProps {
  children: ReactNode;
}

/**
 * AuthProtectedPage - Wraps content with auth protection
 *
 * CRITICAL: This component ensures that:
 * 1. Logged-out users see ONLY the landing page
 * 2. Authenticated users see the protected content (full vibe service)
 * 3. All existing vibe functionality is preserved for authenticated users
 * 4. Errors from auth hooks are caught and landing page is shown
 */
export function AuthProtectedPage({ children }: ProtectedPageProps) {
  return (
    <AuthErrorBoundary fallback={<LandingPage />}>
      <AuthGuard fallback={<LandingPage />}>{children}</AuthGuard>
    </AuthErrorBoundary>
  );
}
