/**
 * @fileoverview Sign In page for IdeaI web app
 *
 * @module SignInPage
 * @description
 * Sign-in page using shared IdeaI authentication system.
 * Users can sign in with email/password or social providers.
 */

"use client";

import { IdeAIPageTemplate } from "@repo/ui/components/ideai-page-template";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import { signIn, signUp } from "@repo/ideai-auth/client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSession } from "@repo/ideai-auth/client";

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

function getEnabledAuthProviders(): Array<
  "email" | "github" | "google" | "vercel"
> {
  const providers: Array<"email" | "github" | "google" | "vercel"> = ["email"];

  if (process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID) {
    providers.push("github");
  }
  if (process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID) {
    providers.push("google");
  }
  if (process.env.NEXT_PUBLIC_VERCEL_CLIENT_ID) {
    providers.push("vercel");
  }

  return providers;
}

export default function SignInPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingProvider, setLoadingProvider] = useState<
    "github" | "google" | "vercel" | null
  >(null);

  // Redirect if already signed in
  useEffect(() => {
    if (!isPending && session?.user) {
      router.push("/");
    }
  }, [session, isPending, router]);

  const enabledProviders = getEnabledAuthProviders();

  const handleSocialSignIn = async (
    provider: "github" | "google" | "vercel",
  ) => {
    try {
      setLoadingProvider(provider);
      await signIn.social({ provider, callbackURL: "/" });
    } catch {
      toast.error(`Failed to sign in with ${provider}`);
      setLoadingProvider(null);
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
          return;
        }

        const signInResponse = await signIn.email({
          email,
          password,
        });
        if (signInResponse.error) {
          setError(signInResponse.error.message || "Sign in failed");
          return;
        }

        toast.success("Account created and signed in successfully!");
        router.push("/");
      } else {
        const response = await signIn.email({
          email,
          password,
        });
        if (response.error) {
          setError(response.error.message || "Sign in failed");
          return;
        }

        toast.success("Signed in successfully!");
        router.push("/");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  const vercelProjectName =
    process.env.NEXT_PUBLIC_VERCEL_PROJECT_NAME || "web";
  const vercelOrgId =
    process.env.NEXT_PUBLIC_VERCEL_ORG_ID || "team_vhjzlMi6CfNow0IfBXnv2Yn2";

  // Show loading state while checking session
  if (isPending) {
    return (
      <IdeAIPageTemplate
        siteName="IdeaI"
        subtitle="Sign In"
        vercelProjectName={vercelProjectName}
        vercelOrgId={vercelOrgId}
      >
        <div style={{ textAlign: "center", padding: "40px 20px" }}>
          <Spinner />
        </div>
      </IdeAIPageTemplate>
    );
  }

  // Don't render if already signed in (will redirect)
  if (session?.user) {
    return null;
  }

  return (
    <IdeAIPageTemplate
      siteName="IdeaI"
      subtitle="Sign In"
      vercelProjectName={vercelProjectName}
      vercelOrgId={vercelOrgId}
    >
      <div
        style={{ maxWidth: "400px", margin: "0 auto", padding: "40px 20px" }}
      >
        <div className="space-y-6">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold">
              {mode === "signin" ? "Sign In" : "Create Account"}
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              {mode === "signin"
                ? "Sign in to your IdeaI account"
                : "Create a new IdeaI account"}
            </p>
          </div>

          <form onSubmit={handleEmailAuth} className="space-y-4">
            {mode === "signup" && (
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required={mode === "signup"}
                  placeholder="Your name"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="text-sm text-red-600 dark:text-red-400">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <Spinner className="mr-2" />
              ) : mode === "signin" ? (
                "Sign In"
              ) : (
                "Create Account"
              )}
            </Button>
          </form>

          {enabledProviders.length > 1 && (
            <>
              <Separator />
              <div className="space-y-2">
                {enabledProviders.includes("vercel") && (
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => handleSocialSignIn("vercel")}
                    disabled={loadingProvider === "vercel"}
                  >
                    {loadingProvider === "vercel" ? (
                      <Spinner className="mr-2" />
                    ) : (
                      <VercelIcon />
                    )}
                    Continue with Vercel
                  </Button>
                )}

                {enabledProviders.includes("github") && (
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => handleSocialSignIn("github")}
                    disabled={loadingProvider === "github"}
                  >
                    {loadingProvider === "github" ? (
                      <Spinner className="mr-2" />
                    ) : (
                      <GitHubIcon />
                    )}
                    Continue with GitHub
                  </Button>
                )}

                {enabledProviders.includes("google") && (
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => handleSocialSignIn("google")}
                    disabled={loadingProvider === "google"}
                  >
                    {loadingProvider === "google" ? (
                      <Spinner className="mr-2" />
                    ) : (
                      <GoogleIcon />
                    )}
                    Continue with Google
                  </Button>
                )}
              </div>
            </>
          )}

          <div className="text-center text-sm">
            <button
              type="button"
              onClick={() => {
                setMode(mode === "signin" ? "signup" : "signin");
                setError("");
              }}
              className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
            >
              {mode === "signin"
                ? "Don't have an account? Sign up"
                : "Already have an account? Sign in"}
            </button>
          </div>
        </div>
      </div>
    </IdeAIPageTemplate>
  );
}
