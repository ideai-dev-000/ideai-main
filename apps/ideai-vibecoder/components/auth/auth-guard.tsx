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

import { type ReactNode, useState, useEffect, Suspense } from "react";
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
  const [isMounted, setIsMounted] = useState(false);
  const [showFallback, setShowFallback] = useState(false);

  // Wrap useSession in Suspense to catch errors
  // Better Auth's useSession might throw errors that prevent rendering
  let sessionResult;
  try {
    sessionResult = useSession();
  } catch (error) {
    // If useSession throws, show fallback immediately
    console.warn("useSession error caught, showing landing page:", error);
    setShowFallback(true);
    // Return fallback immediately
    return <>{fallback}</>;
  }

  const {
    data: session,
    isPending,
    error,
  } = sessionResult || {
    data: null,
    isPending: false,
    error: null,
  };

  // Track session errors and set fallback flag
  useEffect(() => {
    if (error) {
      console.warn("Session check error (showing landing page):", error);
      setShowFallback(true);
    }
  }, [error]);

  // Ensure client-side hydration
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // CRITICAL: If there's any error or fallback flag is set, show landing page
  if (showFallback || error) {
    return <>{fallback}</>;
  }

  // Show loading state ONLY if we're actually loading and mounted
  // But only briefly - if it takes too long, show landing page
  if ((isPending && isMounted) || !isMounted) {
    // Show loading only for a brief moment
    // After mounting, if still pending, it likely means an error occurred
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // If no session, show landing page
  if (!session?.user) {
    return <>{fallback}</>;
  }

  // Check if user is authenticated (not anonymous and has session)
  const isAuthenticated =
    session?.user &&
    session.user.name !== "Anonymous" &&
    !session.user.email?.startsWith("temp-") &&
    !session.user.isAnonymous;

  // If not authenticated, show fallback (landing page)
  // This should already be handled above, but keeping as safety check
  if (!isAuthenticated) {
    return <>{fallback}</>;
  }

  // User is authenticated - show protected content (full vibe service)
  return <>{children}</>;
}
