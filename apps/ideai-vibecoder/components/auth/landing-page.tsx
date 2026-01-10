/**
 * @fileoverview Landing page for logged-out users
 *
 * @module LandingPage
 * @description
 * Beautiful landing page shown to users who are not logged in.
 * Features AuthDialog for sign-in/sign-up. Once authenticated,
 * users gain access to the full vibe coding suite.
 *
 * CRITICAL: This is the ONLY thing logged-out users can see.
 * All vibe functionality is completely inaccessible until login.
 */

"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import { AuthDialog } from "@repo/ideai-user/components/auth";
import { toast } from "sonner";
import { Sparkles, Code, Zap, Shield } from "lucide-react";

export function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex flex-col">
      {/* Simple Header */}
      <header className="border-b border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-semibold text-slate-900 dark:text-white">
                IdeaI VibeCoder
              </span>
            </div>
            <AuthDialog
              Button={Button}
              Dialog={Dialog}
              DialogContent={DialogContent}
              DialogDescription={DialogDescription}
              DialogHeader={DialogHeader}
              DialogTitle={DialogTitle}
              DialogTrigger={DialogTrigger}
              Input={Input}
              Label={Label}
              Separator={Separator}
              Spinner={Spinner}
              toast={toast}
            >
              <Button size="sm" variant="default">
                Sign In
              </Button>
            </AuthDialog>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl w-full text-center space-y-12">
          {/* Hero Section */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800">
              <Zap className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
              <span className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                The World&apos;s Most Performant Vibe Coding Platform
              </span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-slate-900 dark:text-white">
              Build Beautiful UIs
              <br />
              <span className="bg-gradient-to-r from-yellow-500 via-orange-500 to-pink-500 bg-clip-text text-transparent">
                Through Conversation
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Describe what you want to build, and watch as AI generates
              beautiful React components with stunning UIs in real-time.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-6 mt-16">
            <div className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
              <div className="h-12 w-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-4 mx-auto">
                <Code className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                AI-Powered Generation
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Generate React components with beautiful UIs using natural
                language prompts
              </p>
            </div>

            <div className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
              <div className="h-12 w-12 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-4 mx-auto">
                <Zap className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                Real-Time Preview
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                See your components come to life instantly with live preview and
                streaming responses
              </p>
            </div>

            <div className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
              <div className="h-12 w-12 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4 mx-auto">
                <Shield className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                Secure & Private
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Your projects are secure and private. Sign in to get started
              </p>
            </div>
          </div>

          {/* CTA Section */}
          <div className="space-y-6 mt-16">
            <p className="text-lg text-slate-700 dark:text-slate-300">
              Ready to start building? Sign in to access the full vibe coding
              suite.
            </p>
            <div className="flex items-center justify-center gap-4">
              <AuthDialog
                Button={Button}
                Dialog={Dialog}
                DialogContent={DialogContent}
                DialogDescription={DialogDescription}
                DialogHeader={DialogHeader}
                DialogTitle={DialogTitle}
                DialogTrigger={DialogTrigger}
                Input={Input}
                Label={Label}
                Separator={Separator}
                Spinner={Spinner}
                toast={toast}
              >
                <Button size="lg" variant="default" className="text-lg px-8">
                  Get Started
                </Button>
              </AuthDialog>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Free to use. No credit card required.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
