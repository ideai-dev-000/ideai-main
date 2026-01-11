/**
 * @fileoverview IdeaI System Cards Component
 *
 * @module IdeAISystemCards
 * @description
 * Displays cards showing all loaded apps, modules (packages), and packages in the IdeaI system.
 * Used on the landing page for logged-in users.
 */

"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Code, Package, Box, ExternalLink, Server, Layers } from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Apps in the IdeaI monorepo
const IDEAI_APPS = [
  {
    name: "Web",
    path: "/",
    icon: Server,
    description: "Main IdeaI web application",
  },
  {
    name: "Capabilities",
    path: "/",
    icon: Code,
    description: "Unified capabilities platform",
  },
  {
    name: "Vibe",
    path: "/vibe",
    icon: Code,
    description: "AI-powered code generation",
  },
  {
    name: "Workflows",
    path: "/workflow",
    icon: Layers,
    description: "Workflow automation builder",
  },
  {
    name: "App Builder",
    path: "/app-builder",
    icon: Box,
    description: "App deployment manager",
  },
  {
    name: "Docs",
    path: "/docs",
    icon: Code,
    description: "Documentation site",
  },
];

// Modules (packages) in @repo/*
const IDEAI_MODULES = [
  { name: "@repo/ui", description: "Shared UI components and design system" },
  {
    name: "@repo/cloud-manager",
    description: "Cloud deployment and management",
  },
  {
    name: "@repo/ideai-user",
    description: "User authentication and management",
  },
  { name: "@repo/ideai-auth", description: "Authentication utilities" },
  { name: "@repo/ideai-db-manager", description: "Database management tools" },
  {
    name: "@repo/ideai-developer",
    description: "Developer utilities and scripts",
  },
  { name: "@repo/utils", description: "Shared utility functions" },
  {
    name: "@repo/monitoring",
    description: "System monitoring and observability",
  },
  { name: "@repo/security", description: "Security utilities and helpers" },
];

// Infrastructure packages
const INFRASTRUCTURE_PACKAGES = [
  { name: "@repo/eslint-config", description: "Shared ESLint configuration" },
  {
    name: "@repo/typescript-config",
    description: "Shared TypeScript configuration",
  },
];

/**
 * IdeaI System Cards Component
 * Shows all apps, modules, and packages available in the IdeaI system
 */
export function IdeAISystemCards() {
  return (
    <div className="space-y-6">
      {/* Apps Section */}
      <div>
        <div className="mb-4 flex items-center gap-2">
          <Server className="h-5 w-5 text-blue-600" />
          <h2 className="text-xl font-semibold">IdeaI Apps</h2>
          <Badge variant="secondary">{IDEAI_APPS.length}</Badge>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {IDEAI_APPS.map((app) => {
            const Icon = app.icon;
            return (
              <Card
                key={app.name}
                className="hover:shadow-md transition-shadow"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <Icon className="h-5 w-5 text-blue-600" />
                      <CardTitle className="text-lg">{app.name}</CardTitle>
                    </div>
                    {app.path && (
                      <a
                        href={app.path}
                        className="text-muted-foreground hover:text-foreground"
                        title="Open app"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm">
                    {app.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Modules Section */}
      <div>
        <div className="mb-4 flex items-center gap-2">
          <Package className="h-5 w-5 text-purple-600" />
          <h2 className="text-xl font-semibold">IdeaI Modules</h2>
          <Badge variant="secondary">{IDEAI_MODULES.length}</Badge>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {IDEAI_MODULES.map((module) => (
            <Card
              key={module.name}
              className="hover:shadow-md transition-shadow"
            >
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-purple-600" />
                  <CardTitle className="text-lg font-mono text-sm">
                    {module.name}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm">
                  {module.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Infrastructure Packages Section */}
      <div>
        <div className="mb-4 flex items-center gap-2">
          <Box className="h-5 w-5 text-green-600" />
          <h2 className="text-xl font-semibold">Infrastructure Packages</h2>
          <Badge variant="secondary">{INFRASTRUCTURE_PACKAGES.length}</Badge>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {INFRASTRUCTURE_PACKAGES.map((pkg) => (
            <Card key={pkg.name} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Box className="h-5 w-5 text-green-600" />
                  <CardTitle className="text-lg font-mono text-sm">
                    {pkg.name}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm">
                  {pkg.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
