/**
 * @fileoverview IdeaI DB Manager authentication hook
 *
 * @module use-super-admin-auth
 * @description
 * React hook for managing IdeaI DB Manager authentication state.
 * Includes dev-only checks and password verification.
 */

"use client";

import { useState, useEffect, useCallback } from "react";
import { assertSuperAdminEnabled, isSafeEnvironment } from "../utils/dev-check";
import { verifyPassword, hashPassword } from "../utils/password-creation";

const SUPER_USER_NAME = "ideai-super-user";

/**
 * Super admin authentication state
 */
export interface SuperAdminAuthState {
  isAuthenticated: boolean;
  isChecking: boolean;
  error: string | null;
}

/**
 * Hook for super admin authentication
 *
 * @returns Authentication state and methods
 */
export function useSuperAdminAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check if super admin is enabled (dev-only)
  useEffect(() => {
    if (!isSafeEnvironment()) {
      setError("Super Admin is only available in development mode");
      setIsChecking(false);
      return;
    }
    setIsChecking(false);
  }, []);

  /**
   * Verify super admin password
   */
  const verifySuperAdminPassword = useCallback((password: string): boolean => {
    try {
      assertSuperAdminEnabled();

      // Get stored hash from environment (client-side via API route)
      const storedHash = process.env.NEXT_PUBLIC_SUPER_ADMIN_PASSWORD_HASH;

      if (!storedHash) {
        setError(
          "Super admin password not configured. Run password creation script.",
        );
        return false;
      }

      // Verify password
      const isValid = verifyPassword(password, storedHash);

      if (isValid) {
        setIsAuthenticated(true);
        setError(null);
        // Store in sessionStorage (dev-only, cleared on close)
        if (typeof window !== "undefined") {
          sessionStorage.setItem("super-admin-authenticated", "true");
        }
      } else {
        setError("Invalid password");
        setIsAuthenticated(false);
      }

      return isValid;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Authentication failed";
      setError(message);
      setIsAuthenticated(false);
      return false;
    }
  }, []);

  /**
   * Check if already authenticated (from sessionStorage)
   */
  useEffect(() => {
    if (!isChecking && isSafeEnvironment()) {
      const stored =
        typeof window !== "undefined"
          ? sessionStorage.getItem("super-admin-authenticated")
          : null;

      if (stored === "true") {
        setIsAuthenticated(true);
      }
    }
  }, [isChecking]);

  /**
   * Logout from super admin
   */
  const logout = useCallback(() => {
    setIsAuthenticated(false);
    setError(null);
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("super-admin-authenticated");
    }
  }, []);

  return {
    isAuthenticated,
    isChecking,
    error,
    verifyPassword: verifySuperAdminPassword,
    logout,
    superUserName: SUPER_USER_NAME,
  };
}
