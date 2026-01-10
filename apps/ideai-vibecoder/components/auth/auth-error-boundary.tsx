/**
 * @fileoverview Error boundary for authentication errors
 *
 * @module AuthErrorBoundary
 * @description
 * Catches errors from Better Auth's useSession hook and shows landing page.
 * This ensures that session errors don't crash the app and users can still
 * access the landing page to sign in.
 */

"use client";

import { Component, type ReactNode, type ErrorInfo } from "react";

interface AuthErrorBoundaryProps {
  children: ReactNode;
  fallback: ReactNode;
}

interface AuthErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error Boundary for authentication errors
 *
 * Catches errors from Better Auth hooks and shows fallback (landing page).
 */
export class AuthErrorBoundary extends Component<
  AuthErrorBoundaryProps,
  AuthErrorBoundaryState
> {
  constructor(props: AuthErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): AuthErrorBoundaryState {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error for debugging
    console.warn("Auth error caught by boundary (showing landing page):", {
      error: error.message,
      errorInfo,
    });
  }

  render() {
    if (this.state.hasError) {
      // Render fallback UI (landing page) when error occurs
      return <>{this.props.fallback}</>;
    }

    return this.props.children;
  }
}
