/**
 * @fileoverview Landing page for IdeaI Capabilities
 *
 * @module CapabilitiesLanding
 * @description
 * Landing page that shows a clean static page for unauthenticated users,
 * explaining the workflow automation tool and prompting sign up/sign in.
 * For authenticated users, shows the workflow menu to access their workflows.
 */

"use client";

import { useSession } from "@/lib/auth-client";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Workflow,
  Zap,
  GitBranch,
  Shield,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { AuthDialog } from "@/components/auth/dialog";
import { IdeAISystemCards } from "@/components/ideai-system-cards";

export default function CapabilitiesLanding() {
  const { data: session, isPending } = useSession();
  const [isMounted, setIsMounted] = useState(false);

  // Track client-side mount to prevent hydration mismatch
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Check if user is authenticated (not anonymous)
  const isAnonymous =
    !session?.user ||
    session.user.name === "Anonymous" ||
    session.user.email?.startsWith("temp-");

  // Show loading state while checking session OR during initial render (prevent hydration mismatch)
  if (isPending || !isMounted) {
    return (
      <div className="pointer-events-auto flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-slate-300 border-t-slate-600 mx-auto" />
          <p className="text-slate-600 dark:text-slate-400">Loading...</p>
        </div>
      </div>
    );
  }

  // Show static landing page for unauthenticated users
  if (isAnonymous) {
    return (
      <div className="pointer-events-auto min-h-screen">
        <div className="container mx-auto px-4 py-16">
          <div className="mx-auto max-w-4xl">
            {/* Hero Section */}
            <div className="mb-16 text-center">
              <h1 className="mb-4 text-5xl font-bold tracking-tight sm:text-6xl">
                Automate Your Workflows
              </h1>
              <p className="mb-8 text-xl text-slate-600 dark:text-slate-400">
                Build powerful automation workflows with a visual, drag-and-drop
                builder. Connect tools, automate tasks, and streamline your
                work.
              </p>
              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                <AuthDialog>
                  <Button size="lg" className="w-full sm:w-auto">
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </AuthDialog>
                <AuthDialog>
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full sm:w-auto"
                  >
                    Sign In
                  </Button>
                </AuthDialog>
              </div>
            </div>

            {/* Features Grid */}
            <div className="mb-16 grid gap-6 md:grid-cols-3">
              <Card>
                <CardHeader>
                  <div className="mb-2 flex items-center gap-2">
                    <Workflow className="h-6 w-6 text-blue-600" />
                    <CardTitle>Visual Builder</CardTitle>
                  </div>
                  <CardDescription>
                    Create workflows visually with drag-and-drop. No code
                    required.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 text-green-600 flex-shrink-0" />
                      <span>Intuitive interface</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 text-green-600 flex-shrink-0" />
                      <span>Real-time preview</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 text-green-600 flex-shrink-0" />
                      <span>AI-powered suggestions</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="mb-2 flex items-center gap-2">
                    <Zap className="h-6 w-6 text-yellow-600" />
                    <CardTitle>Powerful Automation</CardTitle>
                  </div>
                  <CardDescription>
                    Connect your favorite tools and automate repetitive tasks.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 text-green-600 flex-shrink-0" />
                      <span>100+ integrations</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 text-green-600 flex-shrink-0" />
                      <span>Conditional logic</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 text-green-600 flex-shrink-0" />
                      <span>Error handling</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="mb-2 flex items-center gap-2">
                    <GitBranch className="h-6 w-6 text-purple-600" />
                    <CardTitle>Flexible Workflows</CardTitle>
                  </div>
                  <CardDescription>
                    Build complex workflows with branching, loops, and
                    transformations.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 text-green-600 flex-shrink-0" />
                      <span>Parallel execution</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 text-green-600 flex-shrink-0" />
                      <span>Data transformations</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 text-green-600 flex-shrink-0" />
                      <span>Custom logic</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Benefits Section */}
            <Card className="mb-16">
              <CardHeader>
                <CardTitle>Why Choose Our Workflow Builder?</CardTitle>
                <CardDescription>
                  Everything you need to automate your work and save time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <h3 className="mb-2 flex items-center gap-2 font-semibold">
                      <Shield className="h-5 w-5 text-green-600" />
                      Secure & Reliable
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Your workflows run securely with enterprise-grade
                      infrastructure. All data is encrypted and backed up
                      automatically.
                    </p>
                  </div>
                  <div>
                    <h3 className="mb-2 flex items-center gap-2 font-semibold">
                      <Zap className="h-5 w-5 text-yellow-600" />
                      Fast Execution
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Workflows execute in seconds, not minutes. Parallel
                      processing ensures your automations run as fast as
                      possible.
                    </p>
                  </div>
                  <div>
                    <h3 className="mb-2 flex items-center gap-2 font-semibold">
                      <Workflow className="h-5 w-5 text-blue-600" />
                      Easy to Use
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      No technical knowledge required. Build complex workflows
                      using our intuitive visual interface.
                    </p>
                  </div>
                  <div>
                    <h3 className="mb-2 flex items-center gap-2 font-semibold">
                      <GitBranch className="h-5 w-5 text-purple-600" />
                      Scalable
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Start small and scale up. From simple automations to
                      complex multi-step workflows, we've got you covered.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* CTA Section */}
            <div className="text-center">
              <Card className="bg-slate-50 dark:bg-slate-900">
                <CardHeader>
                  <CardTitle className="text-2xl">
                    Ready to Automate Your Work?
                  </CardTitle>
                  <CardDescription>
                    Join thousands of users who are already saving time with
                    automated workflows
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <AuthDialog>
                    <Button size="lg">
                      Get Started Free
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </AuthDialog>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Authenticated users - show workflow menu and system cards
  return (
    <div className="pointer-events-auto min-h-screen">
      <div className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-7xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold">IdeaI Dashboard</h1>
          </div>

          {/* Welcome Card */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Welcome back!</CardTitle>
              <CardDescription>
                Your IdeaI system overview. Access workflows, apps, modules, and
                packages.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <Workflow className="h-12 w-12 text-slate-400" />
                <div>
                  <p className="text-slate-600 dark:text-slate-400">
                    Access your workflows from the side menu or navigate using
                    the header.
                  </p>
                  <p className="mt-2 text-sm text-slate-500 dark:text-slate-500">
                    Explore the IdeaI apps, modules, and packages below.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* System Cards */}
          <IdeAISystemCards />
        </div>
      </div>
    </div>
  );
}
