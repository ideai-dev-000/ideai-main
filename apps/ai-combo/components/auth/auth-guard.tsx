/**
 * @fileoverview Authentication guard for IdeaI VibeCoder
 *
 * @module AuthGuard
 * @description
 * Protects all routes - requires authentication to access any part of the vibe suite.
 * Shows landing page for logged-out users with login/create account dialog.
 * Shows full vibe service once logged in.
 *
 * CRITICAL: This component ensures all vibe functionality is protected behind authentication
 * while maintaining 100% of existing functionality for authenticated users.
 */

"use client";

import { type ReactNode, useState, useEffect } from "react";
import { useSession } from "@/lib/auth-client";

interface AuthGuardProps {
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * AuthGuard - Protects all routes behind authentication
 *
 * If user is not authenticated, shows fallback (landing page).
 * If user is authenticated, shows the protected content (full vibe service).
 */
export function AuthGuard({ children, fallback }: AuthGuardProps) {
  const { data: session, isPending } = useSession();
  const [isMounted, setIsMounted] = useState(false);

  // Ensure client-side hydration
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Show loading state while checking session or until mounted
  if (isPending || !isMounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Check if user is authenticated (not anonymous and has session)
  const isAuthenticated =
    session?.user &&
    session.user.name !== "Anonymous" &&
    !session.user.email?.startsWith("temp-") &&
    !session.user.isAnonymous;

  // If not authenticated, show fallback (landing page)
  if (!isAuthenticated) {
    return <>{fallback}</>;
  }

  // User is authenticated - show protected content (full vibe service)
  return <>{children}</>;
}
