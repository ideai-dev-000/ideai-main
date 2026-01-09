/**
 * @fileoverview Client component for unified landing page
 *
 * @module UnifiedLandingPage
 * @description
 * Client-side landing page component with tabs to switch between Vibe Coding and Workflow tools.
 */

"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Code2, Workflow, ArrowRight, Sparkles } from "lucide-react";
import { HomeClient } from "@/components/home/home-client";
import Link from "next/link";

function UnifiedLandingPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, isPending } = useSession();
  const [activeTab, setActiveTab] = useState<"vibe-code" | "workflow" | null>(
    null,
  );

  // Check for redirect parameter from login
  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab === "vibe-code" && session?.user) {
      setActiveTab("vibe-code");
      // Clean up URL
      const url = new URL(window.location.href);
      url.searchParams.delete("tab");
      window.history.replaceState({}, "", url.pathname);
    }
  }, [searchParams, session]);

  const isAuthenticated =
    session?.user &&
    session.user.name !== "Anonymous" &&
    !session.user.email?.startsWith("temp-");

  // If authenticated and a tab is selected, show that view
  if (isAuthenticated && activeTab === "vibe-code") {
    return <HomeClient />;
  }

  if (isAuthenticated && activeTab === "workflow") {
    router.push("/workflow");
    return null;
  }

  // Handle button clicks - redirect to login if not authenticated
  const handleVibeCodeClick = () => {
    if (isAuthenticated) {
      setActiveTab("vibe-code");
    } else {
      router.push("/login?redirect=vibe-code");
    }
  };

  const handleWorkflowClick = () => {
    if (isAuthenticated) {
      router.push("/workflow");
    } else {
      router.push("/login?redirect=workflow");
    }
  };

  // Show landing page with option to choose
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-background to-muted">
      <div className="max-w-4xl w-full space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <Sparkles className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Capability2.0
            </h1>
          </div>
          <p className="text-xl text-muted-foreground">
            Unified platform for Vibe Coding & Workflow Automation
          </p>
          <p className="text-sm text-muted-foreground/80">
            One login. Two powerful tools. Build faster.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Vibe Code Card */}
          <Card
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={handleVibeCodeClick}
          >
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Code2 className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Vibe Code</CardTitle>
              </div>
              <CardDescription>
                AI-powered component generation using natural language
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <ArrowRight className="h-4 w-4" />
                  Generate React components with AI
                </li>
                <li className="flex items-center gap-2">
                  <ArrowRight className="h-4 w-4" />
                  Real-time preview and streaming
                </li>
                <li className="flex items-center gap-2">
                  <ArrowRight className="h-4 w-4" />
                  Download projects as ZIP
                </li>
              </ul>
              <Button className="w-full" onClick={handleVibeCodeClick}>
                Start Vibe Coding
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>

          {/* Workflow Card */}
          <Card
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={handleWorkflowClick}
          >
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Workflow className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Workflow</CardTitle>
              </div>
              <CardDescription>
                Visual workflow automation and orchestration
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <ArrowRight className="h-4 w-4" />
                  Build workflows visually
                </li>
                <li className="flex items-center gap-2">
                  <ArrowRight className="h-4 w-4" />
                  Connect integrations
                </li>
                <li className="flex items-center gap-2">
                  <ArrowRight className="h-4 w-4" />
                  Automate your workflows
                </li>
              </ul>
              <Button
                className="w-full"
                variant="outline"
                onClick={handleWorkflowClick}
              >
                Open Workflow Tool
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Auth Status */}
        {!isPending && !isAuthenticated && (
          <div className="text-center space-y-4">
            <p className="text-sm text-muted-foreground">
              Sign in to access both features with one account
            </p>
            <div className="flex items-center justify-center gap-4">
              <Button asChild variant="default">
                <Link href="/login">Sign In</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/register">Sign Up</Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function UnifiedLandingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      }
    >
      <UnifiedLandingPageInner />
    </Suspense>
  );
}
