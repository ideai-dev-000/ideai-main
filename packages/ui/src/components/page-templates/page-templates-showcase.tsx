/**
 * @fileoverview Page Templates Showcase - All Template Layouts
 *
 * @module PageTemplatesShowcase
 * @description
 * Unified showcase for all page templates with filtering.
 * Shows all templates in one view, filterable by type.
 *
 * @example
 * ```tsx
 * <PageTemplatesShowcase />
 * ```
 */

"use client";

import { useState, useMemo } from "react";
import { IdeAIPageTemplate } from "../ideai-page-template";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import {
  LayoutDashboard,
  FileText,
  Users,
  ShoppingBag,
  Rocket,
  FolderKanban,
  BookOpen,
  Shield,
} from "lucide-react";
import pageTemplatesData from "./examples/page-templates.json";
import type { PageTemplate, TemplateType } from "./types";
import {
  DashboardTemplate,
  BlogTemplate,
  SocialTemplate,
  ShopTemplate,
  LandingTemplate,
  PortfolioTemplate,
  DocsTemplate,
  AdminTemplate,
} from "./templates";

/**
 * Unified Page Templates Showcase Component
 *
 * Displays all page templates in a single view.
 * Filterable by template type using toggle group at the top.
 */
export function PageTemplatesShowcase() {
  const templates = pageTemplatesData as PageTemplate[];

  const vercelProjectName =
    process.env.NEXT_PUBLIC_VERCEL_PROJECT_NAME || "web";
  const vercelOrgId =
    process.env.NEXT_PUBLIC_VERCEL_ORG_ID || "team_vhjzlMi6CfNow0IfBXnv2Yn2";

  // Get unique template types
  const availableTypes = useMemo(() => {
    const allTypes: TemplateType[] = [
      "dashboard",
      "blog",
      "social",
      "shop",
      "landing",
      "portfolio",
      "docs",
      "admin",
    ];
    const typesInData = new Set(templates.map((t) => t.type));
    return allTypes.filter((type) => typesInData.has(type));
  }, [templates]);

  const [selectedTypes, setSelectedTypes] = useState<Set<TemplateType>>(
    new Set(availableTypes),
  );

  // Filter templates based on selected types
  const filteredTemplates = useMemo(() => {
    return templates.filter((template) => selectedTypes.has(template.type));
  }, [selectedTypes, templates]);

  const toggleType = (type: TemplateType) => {
    setSelectedTypes((prev) => {
      const next = new Set(prev);
      if (next.has(type)) {
        next.delete(type);
      } else {
        next.add(type);
      }
      // Ensure at least one type is selected
      if (next.size === 0) {
        next.add(type);
      }
      return next;
    });
  };

  const typeIcons: Record<TemplateType, typeof LayoutDashboard> = {
    dashboard: LayoutDashboard,
    blog: FileText,
    social: Users,
    shop: ShoppingBag,
    landing: Rocket,
    portfolio: FolderKanban,
    docs: BookOpen,
    admin: Shield,
  };

  const renderTemplate = (template: PageTemplate) => {
    switch (template.type) {
      case "dashboard":
        return <DashboardTemplate />;
      case "blog":
        return <BlogTemplate />;
      case "social":
        return <SocialTemplate />;
      case "shop":
        return <ShopTemplate />;
      case "landing":
        return <LandingTemplate />;
      case "portfolio":
        return <PortfolioTemplate />;
      case "docs":
        return <DocsTemplate />;
      case "admin":
        return <AdminTemplate />;
      default:
        return (
          <div className="p-12 text-center text-slate-600 dark:text-slate-400">
            Template preview coming soon
          </div>
        );
    }
  };

  return (
    <IdeAIPageTemplate
      siteName="IdeaI"
      vercelProjectName={vercelProjectName}
      vercelOrgId={vercelOrgId}
    >
      <div className="max-w-7xl mx-auto p-8 space-y-8">
        <header className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-foreground">
            Page Templates Showcase
          </h1>
          <p className="text-muted-foreground">
            Explore standard page layouts and templates for common use cases
          </p>
          <div className="flex items-center justify-center gap-2 text-sm">
            <Badge variant="secondary" className="text-sm">
              {filteredTemplates.length} Templates
            </Badge>
          </div>
        </header>

        {/* Filter Toggle Group */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground">
                Filter by Type
              </h2>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  if (selectedTypes.size === availableTypes.length) {
                    setSelectedTypes(new Set());
                  } else {
                    setSelectedTypes(new Set(availableTypes));
                  }
                }}
              >
                {selectedTypes.size === availableTypes.length
                  ? "Deselect All"
                  : "Select All"}
              </Button>
            </div>
            <div className="flex gap-2 flex-wrap">
              {availableTypes.map((type) => {
                const isSelected = selectedTypes.has(type);
                const Icon = typeIcons[type];
                const count = templates.filter((t) => t.type === type).length;
                return (
                  <Button
                    key={type}
                    variant={isSelected ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleType(type)}
                    aria-pressed={isSelected}
                    className="gap-2 capitalize"
                  >
                    <Icon className="h-4 w-4" />
                    <span>{type}</span>
                    <Badge variant="secondary" className="text-xs">
                      {count}
                    </Badge>
                  </Button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Templates List */}
        {filteredTemplates.length > 0 ? (
          <div className="space-y-12">
            {filteredTemplates.map((template) => (
              <div key={template.id} className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-foreground">
                      {template.name}
                    </h2>
                    <p className="text-muted-foreground mt-1">
                      {template.description}
                    </p>
                  </div>
                  <Badge variant="outline">{template.category}</Badge>
                </div>
                <Card className="overflow-hidden">
                  <CardContent className="p-0">
                    {renderTemplate(template)}
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">
                No templates selected. Choose a type above to view templates.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </IdeAIPageTemplate>
  );
}
