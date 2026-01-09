/**
 * @fileoverview Unified landing page for Capability2.0
 *
 * @module Capability2LandingPage
 * @description
 * Landing page with tabs to switch between Vibe Coding and Workflow tools.
 * Shared authentication allows users to access both features with one login.
 */

"use client";

import { Suspense, useState } from "react";
import { useRouter } from "next/navigation";
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
import { EnvSetup } from "@/components/env-setup";

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
      description: "Secret key for authentication",
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

function UnifiedLandingPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [activeTab, setActiveTab] = useState<"vibe-code" | "workflow" | null>(
    null,
  );

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
            onClick={() => setActiveTab("vibe-code")}
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
              <Button
                className="w-full"
                onClick={() => setActiveTab("vibe-code")}
              >
                Start Vibe Coding
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>

          {/* Workflow Card */}
          <Card
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => router.push("/workflow")}
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
                onClick={() => router.push("/workflow")}
              >
                Open Workflow Tool
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Auth Status */}
        {!isPending && !isAuthenticated && (
          <div className="text-center text-sm text-muted-foreground">
            <p>Sign in to access both features with one account</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Home() {
  const isDevelopment = process.env.NODE_ENV === "development";
  const envVarsPresent = hasEnvVars();

  // Only show setup screen in development if environment variables are missing
  if (!envVarsPresent && isDevelopment) {
    const missingVars = getMissingVars();
    return <EnvSetup missingVars={missingVars} />;
  }

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
      <UnifiedLandingPage />
    </Suspense>
  );
}
