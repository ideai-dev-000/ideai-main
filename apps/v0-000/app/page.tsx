/**
 * @fileoverview Home page for v0-000 (V0-Compatible Version)
 *
 * @module V0000PageV0
 * @description
 * V0-compatible page WITHOUT @repo/ui dependencies.
 * Use this version when uploading to v0.dev.
 *
 * To use: Rename this file to page.tsx before uploading to v0
 */

"use client";

// V0-Compatible imports (NO @repo/ui)
import { Button } from "@/components/ui/button";
import { DemoButton } from "@/components/ui/demo-button";
import { DemoCard } from "@/components/ui/demo-card";
import { FeatureCardBlock } from "@/components/blocks/feature-card-block";
import { StatsBlock } from "@/components/blocks/stats-block";
import { CopyButton } from "@/components/tools/copy-button";
import { ToggleSwitch } from "@/components/tools/toggle-switch";
import { ThemeSelector } from "@/components/theme/theme-selector";
import { ThemePreview } from "@/components/theme/theme-preview";
import { ThemeSwitcherCompact } from "@/components/theme/theme-switcher-compact";
import { useState } from "react";

export default function Home() {
  const [copied, setCopied] = useState(false);
  const [toggleValue, setToggleValue] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText("Example text to copy");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Simple header (replaces IdeAIPageTemplate) */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">V0-000 Template</h1>
            <p className="text-sm text-muted-foreground">
              Perfect v0-compatible template for IdeaI monorepo experiments
            </p>
          </div>
          <div className="flex items-center gap-4">
            <ThemeSwitcherCompact />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="py-12 border-b">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-4">Welcome to V0-000</h2>
            <p className="text-lg text-muted-foreground mb-8">
              This is a v0-compatible template. In the monorepo, this uses
              IdeAIPageTemplate from @repo/ui.
            </p>
            <div className="flex gap-4 justify-center">
              <Button>Get Started</Button>
              <Button variant="outline">Learn More</Button>
            </div>
          </div>
        </section>

        {/* UI Components Demo */}
        <section className="py-12 border-b">
          <div className="container max-w-6xl">
            <h2 className="text-2xl font-semibold mb-6">UI Components Demo</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div>
                <h3 className="font-semibold">Buttons</h3>
                <div className="space-y-2">
                  <DemoButton label="Default Button" />
                  <DemoButton label="Outline Button" variant="outline" />
                  <DemoButton
                    label="Destructive Button"
                    variant="destructive"
                  />
                </div>
              </div>
              <div>
                <h3 className="font-semibold">Cards</h3>
                <DemoCard
                  title="Example Card"
                  description="This is a demo card component"
                  content={<p className="text-sm">Card content goes here</p>}
                  footer={<DemoButton label="Action" />}
                />
              </div>
              <div>
                <h3 className="font-semibold">Tools</h3>
                <div className="space-y-4">
                  <CopyButton text="Example text" />
                  <ToggleSwitch
                    label="Enable feature"
                    checked={toggleValue}
                    onCheckedChange={setToggleValue}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Blocks Demo */}
        <section className="py-12 border-b">
          <div className="container max-w-6xl">
            <h2 className="text-2xl font-semibold mb-6">Blocks Demo</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <FeatureCardBlock
                icon="brain"
                title="Feature 1"
                description="This is a feature card block"
              />
              <StatsBlock
                stats={[
                  { label: "Total Users", value: "1,234" },
                  { label: "Active Users", value: "892" },
                  { label: "Growth Rate", value: "+23%" },
                ]}
              />
            </div>
          </div>
        </section>

        {/* Theme Demo */}
        <section className="py-12">
          <div className="container max-w-6xl">
            <h2 className="text-2xl font-semibold mb-6">Theme System</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <ThemeSelector />
              <ThemePreview />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
