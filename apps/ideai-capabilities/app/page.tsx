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
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback, useRef } from "react";
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
  ChevronDown,
  Check,
} from "lucide-react";
import { WorkflowIcon } from "@/components/ui/workflow-icon";
import { AuthDialog } from "@/components/auth/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { api } from "@/lib/api-client";

// Standalone workflow menu component for landing page
function LandingWorkflowMenu() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [allWorkflows, setAllWorkflows] = useState<
    Array<{
      id: string;
      name: string;
      updatedAt: string;
    }>
  >([]);
  const { data: session } = useSession();
  const prevSessionRef = useRef(session);
  const hasAutoOpenedRef = useRef(false);

  // Load workflows
  const loadWorkflows = useCallback(async () => {
    try {
      const workflows = await api.workflow.getAll();
      setAllWorkflows(workflows);
    } catch (error) {
      console.error("Failed to load workflows:", error);
      setAllWorkflows([]);
    }
  }, []);

  // Load workflows on mount and when menu opens
  useEffect(() => {
    loadWorkflows();
  }, [loadWorkflows]);

  // Auto-open menu on login
  useEffect(() => {
    const prevSession = prevSessionRef.current;
    prevSessionRef.current = session;

    const wasAnonymous =
      !prevSession?.user ||
      prevSession.user.name === "Anonymous" ||
      prevSession.user.email?.startsWith("temp-");
    const isNowAuthenticated =
      session?.user &&
      session.user.name !== "Anonymous" &&
      !session.user.email?.startsWith("temp-");

    if (wasAnonymous && isNowAuthenticated && !hasAutoOpenedRef.current) {
      hasAutoOpenedRef.current = true;
      setTimeout(() => {
        setMenuOpen(true);
        loadWorkflows();
      }, 300);
    }

    if (!isNowAuthenticated) {
      hasAutoOpenedRef.current = false;
    }
  }, [session, loadWorkflows]);

  const handleOpenChange = useCallback(
    (open: boolean) => {
      setMenuOpen(open);
      if (open) {
        loadWorkflows();
      } else {
        hasAutoOpenedRef.current = false;
      }
    },
    [loadWorkflows],
  );

  return (
    <div className="flex h-9 max-w-[160px] items-center overflow-hidden rounded-md border bg-secondary text-secondary-foreground sm:max-w-none">
      <DropdownMenu open={menuOpen} onOpenChange={handleOpenChange}>
        <DropdownMenuTrigger className="flex h-full cursor-pointer items-center gap-2 px-3 font-medium text-sm transition-all hover:bg-black/5 dark:hover:bg-white/5">
          <WorkflowIcon className="size-4 shrink-0" />
          <p className="truncate font-medium text-sm">
            <span className="sm:hidden">New</span>
            <span className="hidden sm:inline">New Workflow</span>
          </p>
          <ChevronDown className="size-3 shrink-0 opacity-50" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-64">
          <DropdownMenuItem
            asChild
            className="flex items-center justify-between"
          >
            <a href="/workflow">
              New Workflow <Check className="size-4 shrink-0" />
            </a>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          {allWorkflows.length === 0 ? (
            <DropdownMenuItem disabled>No workflows found</DropdownMenuItem>
          ) : (
            allWorkflows
              .filter((w) => w.name !== "__current__")
              .map((workflow) => (
                <DropdownMenuItem
                  className="flex items-center justify-between"
                  key={workflow.id}
                  onClick={() =>
                    router.push(`/workflow/workflows/${workflow.id}`)
                  }
                >
                  <span className="truncate">{workflow.name}</span>
                </DropdownMenuItem>
              ))
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export default function CapabilitiesLanding() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
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

  // Authenticated users - show workflow menu
  return (
    <div className="pointer-events-auto min-h-screen">
      <div className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-4xl">
          {/* Header with workflow menu */}
          <div className="mb-8 flex items-center justify-between">
            <h1 className="text-3xl font-bold">My Workflows</h1>
            <LandingWorkflowMenu />
          </div>

          {/* Workflows list or empty state */}
          <Card>
            <CardHeader>
              <CardTitle>Welcome back!</CardTitle>
              <CardDescription>
                Select a workflow from the menu above or create a new one to get
                started.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Workflow className="mx-auto mb-4 h-12 w-12 text-slate-400" />
                <p className="text-slate-600 dark:text-slate-400">
                  Use the workflow menu above to access your workflows or create
                  a new one.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
