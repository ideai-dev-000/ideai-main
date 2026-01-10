/**
 * @fileoverview Shared authentication dialog for IdeaI apps
 *
 * @module IdeAIAuthDialog
 * @description
 * Flexible authentication dialog component that works with any UI library.
 * Supports email/password, GitHub OAuth, Google OAuth, and Vercel OAuth.
 * Accepts UI components as props for maximum flexibility.
 *
 * @example
 * ```tsx
 * import { AuthDialog } from "@repo/ideai-user/components/auth/auth-dialog";
 * import { Button, Dialog } from "@/components/ui";
 *
 * <AuthDialog
 *   Button={Button}
 *   Dialog={Dialog}
 *   Input={Input}
 *   Label={Label}
 * >
 *   <Button>Sign In</Button>
 * </AuthDialog>
 * ```
 *
 * @see ../lib/auth-client - Auth client for sign in/up
 * @see ../lib/auth-providers - Provider detection utilities
 */

"use client";

import React, { type ReactNode, useState } from "react";
import { AlertCircle } from "lucide-react";
import { signIn, signUp } from "../../lib/auth-client";
import {
  getEnabledAuthProviders,
  getSingleProvider,
} from "../../lib/auth-providers";

// Type for UI components that can be passed as props
export type UIComponent = React.ComponentType<any>;

export interface AuthDialogProps {
  children?: ReactNode;
  // UI component props - apps can pass their own components
  Button?: UIComponent;
  Dialog?: UIComponent;
  DialogContent?: UIComponent;
  DialogDescription?: UIComponent;
  DialogHeader?: UIComponent;
  DialogTitle?: UIComponent;
  DialogTrigger?: UIComponent;
  Input?: UIComponent;
  Label?: UIComponent;
  Separator?: UIComponent;
  Spinner?: UIComponent;
  // Toast function for success/error messages
  toast?: {
    success: (message: string) => void;
    error: (message: string) => void;
  };
  // Initial mode: "signin" or "signup"
  initialMode?: "signin" | "signup";
}

// Provider icons - can be customized by apps
const VercelIcon = ({ className = "mr-2 h-3 w-3" }: { className?: string }) => (
  <svg
    aria-label="Vercel"
    className={className}
    fill="currentColor"
    role="img"
    viewBox="0 0 76 65"
  >
    <title>Vercel</title>
    <path d="M37.5274 0L75.0548 65H0L37.5274 0Z" />
  </svg>
);

const GitHubIcon = () => (
  <svg
    aria-label="GitHub"
    className="mr-2 h-4 w-4"
    fill="currentColor"
    role="img"
    viewBox="0 0 24 24"
  >
    <title>GitHub</title>
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
  </svg>
);

const GoogleIcon = () => (
  <svg
    aria-label="Google"
    className="mr-2 h-4 w-4"
    role="img"
    viewBox="0 0 24 24"
  >
    <title>Google</title>
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="currentColor"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="currentColor"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      fill="currentColor"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="currentColor"
    />
  </svg>
);

const EmailIcon = () => (
  <svg
    aria-label="Email"
    className="mr-2 h-4 w-4"
    fill="none"
    role="img"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <title>Email</title>
    <path
      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
    />
  </svg>
);

type Provider = "email" | "github" | "google" | "vercel";

const getProviderIcon = (provider: Provider) => {
  switch (provider) {
    case "vercel":
      return <VercelIcon />;
    case "github":
      return <GitHubIcon />;
    case "google":
      return <GoogleIcon />;
    case "email":
      return <EmailIcon />;
    default:
      return <EmailIcon />;
  }
};

const getProviderLabel = (provider: Provider) => {
  switch (provider) {
    case "vercel":
      return "Vercel";
    case "github":
      return "GitHub";
    case "google":
      return "Google";
    case "email":
      return "Email";
    default:
      return "Email";
  }
};

// Module-level flag to persist sign-in loading state
let singleProviderSignInInitiated = false;

export const isSingleProviderSignInInitiated = () =>
  singleProviderSignInInitiated;

/**
 * AuthDialog - Shared authentication dialog component
 *
 * This component provides a flexible authentication dialog that works with
 * any UI library. Apps should pass their UI components as props.
 */
export const AuthDialog = ({
  children,
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Input,
  Label,
  Separator,
  Spinner,
  toast,
  initialMode = "signin",
}: AuthDialogProps) => {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"signin" | "signup">(initialMode);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingProvider, setLoadingProvider] = useState<
    "github" | "google" | "vercel" | null
  >(null);

  const enabledProviders = getEnabledAuthProviders();
  const singleProvider = getSingleProvider();

  // Default toast implementation (uses console if not provided)
  const defaultToast = {
    success: (msg: string) => {
      if (toast) toast.success(msg);
      else console.log(`✅ ${msg}`);
    },
    error: (msg: string) => {
      if (toast) toast.error(msg);
      else console.error(`❌ ${msg}`);
    },
  };

  const handleSocialSignIn = async (
    provider: "github" | "google" | "vercel",
  ) => {
    try {
      setLoadingProvider(provider);
      singleProviderSignInInitiated = true;
      await signIn.social({
        provider,
        callbackURL:
          typeof window !== "undefined" ? window.location.pathname : "/",
      });
    } catch {
      defaultToast.error(
        `Failed to sign in with ${getProviderLabel(provider)}`,
      );
      setLoadingProvider(null);
      singleProviderSignInInitiated = false;
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (mode === "signup") {
        const signUpResponse = await signUp.email({
          email,
          password,
          name,
        });
        if (signUpResponse.error) {
          setError(signUpResponse.error.message || "Sign up failed");
          setLoading(false);
          return;
        }

        const signInResponse = await signIn.email({
          email,
          password,
        });
        if (signInResponse.error) {
          setError(signInResponse.error.message || "Sign in failed");
          setLoading(false);
          return;
        }

        defaultToast.success("Account created and signed in successfully!");
      } else {
        const response = await signIn.email({
          email,
          password,
        });
        if (response.error) {
          setError(response.error.message || "Sign in failed");
          setLoading(false);
          return;
        }

        defaultToast.success("Signed in successfully!");
      }
      setOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setMode(mode === "signin" ? "signup" : "signin");
    setError("");
  };

  // Reset mode when dialog opens to ensure initialMode is used
  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (newOpen) {
      setMode(initialMode);
      setError("");
      setName("");
      setEmail("");
      setPassword("");
    }
  };

  // If no UI components provided, return a basic implementation
  if (!Dialog || !Button) {
    return (
      <div>
        {children || (
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Sign In
          </button>
        )}
        {open && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
              <h2 className="mb-4 text-xl font-bold">
                {mode === "signin" ? "Sign In" : "Create Account"}
              </h2>
              <form onSubmit={handleEmailAuth} className="space-y-4">
                {mode === "signup" && (
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium">
                      Name
                    </label>
                    <input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="mt-1 block w-full rounded border border-gray-300 px-3 py-2"
                      required
                    />
                  </div>
                )}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1 block w-full rounded border border-gray-300 px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium"
                  >
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mt-1 block w-full rounded border border-gray-300 px-3 py-2"
                    required
                  />
                </div>
                {error && (
                  <div className="rounded-md border border-red-500/50 bg-red-500/10 p-3 flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 text-red-500 dark:text-red-400 mt-0.5 shrink-0" />
                    <p className="text-sm text-red-700 dark:text-red-300">
                      {error}
                    </p>
                  </div>
                )}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading
                    ? "Loading..."
                    : mode === "signup"
                      ? "Sign Up"
                      : "Sign In"}
                </button>
              </form>
              <button
                type="button"
                onClick={toggleMode}
                className="mt-4 text-sm text-blue-600 hover:underline"
              >
                {mode === "signin"
                  ? "Don't have an account? Sign up"
                  : "Already have an account? Sign in"}
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="mt-2 text-sm text-gray-600 hover:underline"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Full implementation with provided UI components
  const DialogComp = Dialog as any;
  const DialogContentComp = DialogContent || Dialog;
  const DialogHeaderComp = DialogHeader || "div";
  const DialogTitleComp = DialogTitle || "h2";
  const DialogDescriptionComp = DialogDescription || "p";
  const DialogTriggerComp = DialogTrigger || Button;
  const ButtonComp = Button as any;
  const InputComp = Input as any;
  const LabelComp = Label as any;
  const SeparatorComp = Separator || "hr";
  const SpinnerComp = Spinner as any;

  // Single provider button (no dialog needed)
  if (singleProvider && singleProvider !== "email") {
    const isLoading =
      loadingProvider === singleProvider || singleProviderSignInInitiated;

    return (
      <ButtonComp
        className="h-9 gap-1.5 px-2 disabled:opacity-100 sm:px-3"
        disabled={isLoading}
        onClick={() =>
          handleSocialSignIn(singleProvider as "github" | "google" | "vercel")
        }
        size="sm"
        variant="default"
      >
        {isLoading ? (
          SpinnerComp ? (
            <SpinnerComp className="size-3.5" />
          ) : (
            "Loading..."
          )
        ) : (
          getProviderIcon(singleProvider)
        )}
        <span className="text-sm">Sign In</span>
      </ButtonComp>
    );
  }

  // Email-only or multi-provider dialog
  const hasSocialProviders =
    enabledProviders.vercel ||
    enabledProviders.github ||
    enabledProviders.google;

  // Render trigger - only use asChild if DialogTrigger is provided
  // CRITICAL: asChild requires a single React element, not fragments or arrays
  const renderTrigger = () => {
    // Default trigger
    const defaultButton = (
      <ButtonComp size="sm" variant="default">
        Sign In
      </ButtonComp>
    );

    if (!children) {
      // No children provided, use default
      if (DialogTrigger) {
        return <DialogTriggerComp asChild>{defaultButton}</DialogTriggerComp>;
      }
      return defaultButton;
    }

    // Check if children is a single valid React element
    // React.Children.count returns 1 for a single element, even if it's wrapped
    const childCount = React.Children.count(children);

    if (childCount === 0) {
      // Empty children, use default
      if (DialogTrigger) {
        return <DialogTriggerComp asChild>{defaultButton}</DialogTriggerComp>;
      }
      return defaultButton;
    }

    if (childCount === 1) {
      // Single child - check if it's a valid element
      const child = React.Children.only(children);

      if (React.isValidElement(child)) {
        // If DialogTrigger is provided, use asChild pattern
        if (DialogTrigger) {
          return <DialogTriggerComp asChild>{child}</DialogTriggerComp>;
        }
        // Otherwise, render child directly
        return child;
      }
    }

    // Multiple children or invalid child - wrap in default button
    // This shouldn't happen in normal usage, but handle gracefully
    if (DialogTrigger) {
      return <DialogTriggerComp asChild>{defaultButton}</DialogTriggerComp>;
    }
    return defaultButton;
  };

  return (
    <DialogComp open={open} onOpenChange={handleOpenChange}>
      {renderTrigger()}
      {DialogContentComp && (
        <DialogContentComp className="max-w-md mx-auto">
          {DialogHeaderComp && (
            <DialogHeaderComp>
              {DialogTitleComp && (
                <DialogTitleComp>
                  {mode === "signin" ? "Sign In" : "Create Account"}
                </DialogTitleComp>
              )}
              {DialogDescriptionComp && (
                <DialogDescriptionComp>
                  {mode === "signin"
                    ? hasSocialProviders
                      ? "Choose how you want to sign in to continue"
                      : "Sign in to your account to continue"
                    : "Create a new account to get started"}
                </DialogDescriptionComp>
              )}
            </DialogHeaderComp>
          )}

          <div className="space-y-4">
            {/* Social providers */}
            {hasSocialProviders && (
              <div className="flex flex-col gap-2">
                {enabledProviders.vercel && (
                  <ButtonComp
                    className="w-full"
                    disabled={loadingProvider !== null}
                    onClick={() => handleSocialSignIn("vercel")}
                    type="button"
                    variant="outline"
                  >
                    <VercelIcon />
                    {loadingProvider === "vercel"
                      ? "Loading..."
                      : "Sign In with Vercel"}
                  </ButtonComp>
                )}
                {enabledProviders.github && (
                  <ButtonComp
                    className="w-full"
                    disabled={loadingProvider !== null}
                    onClick={() => handleSocialSignIn("github")}
                    type="button"
                    variant="outline"
                  >
                    <GitHubIcon />
                    {loadingProvider === "github"
                      ? "Loading..."
                      : "Sign In with GitHub"}
                  </ButtonComp>
                )}
                {enabledProviders.google && (
                  <ButtonComp
                    className="w-full"
                    disabled={loadingProvider !== null}
                    onClick={() => handleSocialSignIn("google")}
                    type="button"
                    variant="outline"
                  >
                    <GoogleIcon />
                    {loadingProvider === "google"
                      ? "Loading..."
                      : "Sign In with Google"}
                  </ButtonComp>
                )}
              </div>
            )}

            {/* Separator */}
            {enabledProviders.email && hasSocialProviders && (
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <SeparatorComp />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Or Sign In with email
                  </span>
                </div>
              </div>
            )}

            {/* Email form */}
            {enabledProviders.email && (
              <form className="space-y-4" onSubmit={handleEmailAuth}>
                {mode === "signup" && LabelComp && InputComp && (
                  <div className="space-y-2">
                    <LabelComp className="ml-1" htmlFor="name">
                      Name
                    </LabelComp>
                    <InputComp
                      id="name"
                      onChange={(e: any) => setName(e.target.value)}
                      placeholder="John Doe"
                      required
                      type="text"
                      value={name}
                    />
                  </div>
                )}
                {LabelComp && InputComp && (
                  <>
                    <div className="space-y-2">
                      <LabelComp className="ml-1" htmlFor="email">
                        Email
                      </LabelComp>
                      <InputComp
                        id="email"
                        onChange={(e: any) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        required
                        type="email"
                        value={email}
                      />
                    </div>
                    <div className="space-y-2">
                      <LabelComp className="ml-1" htmlFor="password">
                        Password
                      </LabelComp>
                      <InputComp
                        id="password"
                        onChange={(e: any) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        type="password"
                        value={password}
                      />
                    </div>
                  </>
                )}
                {error && (
                  <div className="rounded-md border border-red-500/50 bg-red-500/10 p-3 flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 text-red-500 dark:text-red-400 mt-0.5 shrink-0" />
                    <p className="text-sm text-red-700 dark:text-red-300">
                      {error}
                    </p>
                  </div>
                )}
                <ButtonComp className="w-full" disabled={loading} type="submit">
                  {loading
                    ? "Loading..."
                    : mode === "signup"
                      ? "Sign Up"
                      : "Sign In"}
                </ButtonComp>
              </form>
            )}

            {/* Toggle mode */}
            {enabledProviders.email && (
              <div className="flex justify-center">
                <button
                  className="text-muted-foreground text-sm hover:text-foreground"
                  onClick={toggleMode}
                  type="button"
                >
                  {mode === "signin"
                    ? "Don't have an account? Sign up"
                    : "Already have an account? Sign in"}
                </button>
              </div>
            )}
          </div>
        </DialogContentComp>
      )}
    </DialogComp>
  );
};
