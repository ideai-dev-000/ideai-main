/**
 * @fileoverview Home page for v0-000
 * 
 * @module V0000Page
 * @description
 * Example page showing how to use IdeaI components and v0-created components.
 */

"use client";

import { IdeAIPageTemplate } from "@repo/ui";
import { IdeaIButton } from "@repo/ui";
import { 
  BrainIcon, 
  CatIcon, 
  MusicIcon, 
  RocketIcon
} from "@repo/ui";
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
  const [toggleEnabled, setToggleEnabled] = useState(false);
  return (
    <IdeAIPageTemplate
      siteName="V0-000 Template"
      vercelProjectName="v0-000"
      vercelOrgId={process.env.NEXT_PUBLIC_VERCEL_ORG_ID || "team_vhjzlMi6CfNow0IfBXnv2Yn2"}
      headerActions={
        <div className="flex items-center gap-2">
          <ThemeSwitcherCompact />
          <IdeaIButton appName="v0-000">Get Started</IdeaIButton>
        </div>
      }
    >
      <div className="max-w-6xl mx-auto p-8 space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">V0-000 Template</h1>
          <p className="text-lg text-muted-foreground">
            Perfect v0-compatible template for IdeaI monorepo
          </p>
        </div>

        {/* Available Libraries Section */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Available Libraries</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-6 border rounded-lg">
              <h3 className="text-lg font-semibold mb-2">@repo/ui</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Shared IdeaI components and utilities
              </p>
              <ul className="text-sm space-y-1">
                <li>• IdeAIPageTemplate</li>
                <li>• IdeaIButton</li>
                <li>• ThemeProvider</li>
                <li>• All v0-exported components</li>
              </ul>
            </div>
            <div className="p-6 border rounded-lg">
              <h3 className="text-lg font-semibold mb-2">@/components/ui/*</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Shadcn/ui components (app-specific)
              </p>
              <ul className="text-sm space-y-1">
                <li>• Button, Card, Label</li>
                <li>• RadioGroup, Slider, Switch</li>
                <li>• Separator, Tooltip</li>
                <li>• And more...</li>
              </ul>
            </div>
          </div>
        </section>

        {/* V0 Components Demo */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">V0 Components Available</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 border rounded-lg text-center">
              <BrainIcon className="w-16 h-16 mx-auto mb-2" />
              <p className="text-sm font-medium">BrainIcon</p>
            </div>
            <div className="p-4 border rounded-lg text-center">
              <CatIcon className="w-16 h-16 mx-auto mb-2" />
              <p className="text-sm font-medium">CatIcon</p>
            </div>
            <div className="p-4 border rounded-lg text-center">
              <MusicIcon className="w-16 h-16 mx-auto mb-2" />
              <p className="text-sm font-medium">MusicIcon</p>
            </div>
            <div className="p-4 border rounded-lg text-center">
              <RocketIcon className="w-16 h-16 mx-auto mb-2" />
              <p className="text-sm font-medium">RocketIcon</p>
            </div>
          </div>
          <div className="p-4 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground">
              <strong>Note:</strong> Some v0 components (LogoPreview, SvgSelector, AnimationControls) 
              have dependencies on app-specific shadcn components and are best used in the web app 
              where those components are available. Simple icons work everywhere!
            </p>
          </div>
        </section>

        {/* UI Components Demo */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">UI Components Demo</h2>
          <p className="text-muted-foreground">
            Simple UI elements using <code className="bg-background px-1 rounded">@/components/ui/*</code>
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <h3 className="font-semibold">Buttons</h3>
              <div className="flex flex-wrap gap-2">
                <DemoButton label="Default" variant="default" />
                <DemoButton label="Secondary" variant="secondary" />
                <DemoButton label="Outline" variant="outline" />
                <DemoButton label="Destructive" variant="destructive" />
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="font-semibold">Cards</h3>
              <DemoCard
                title="Example Card"
                description="This is a demo card component"
                content={<p className="text-sm">Card content goes here</p>}
                footer={<DemoButton label="Action" size="sm" />}
              />
            </div>
          </div>
        </section>

        {/* Blocks Demo */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Blocks Demo</h2>
          <p className="text-muted-foreground">
            Composite components combining multiple UI elements
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FeatureCardBlock
              icon="brain"
              title="Smart Features"
              description="AI-powered functionality"
            />
            <FeatureCardBlock
              icon="rocket"
              title="Fast Performance"
              description="Lightning-fast execution"
            />
            <FeatureCardBlock
              icon="music"
              title="Rich Media"
              description="Audio and video support"
            />
            <FeatureCardBlock
              icon="cat"
              title="Friendly UX"
              description="Intuitive user experience"
            />
          </div>
          <div className="mt-4">
            <h3 className="font-semibold mb-2">Stats Block</h3>
            <StatsBlock
              stats={[
                { label: "Components", value: "24" },
                { label: "Blocks", value: "8" },
                { label: "Tools", value: "12" },
              ]}
            />
          </div>
        </section>

        {/* Tools Demo */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Tools Demo</h2>
          <p className="text-muted-foreground">
            Interactive utility components with behavior
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold">Copy Button</h3>
              <p className="text-sm text-muted-foreground">
                Click to copy text to clipboard:
              </p>
              <div className="flex items-center gap-2">
                <code className="bg-background px-2 py-1 rounded text-sm">import {"{ DemoButton }"} from "@/components/ui/demo-button"</code>
                <CopyButton text='import { DemoButton } from "@/components/ui/demo-button"' />
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="font-semibold">Toggle Switch</h3>
              <p className="text-sm text-muted-foreground">
                Interactive toggle control:
              </p>
              <ToggleSwitch
                label="Enable Feature"
                checked={toggleEnabled}
                onCheckedChange={setToggleEnabled}
              />
              {toggleEnabled && (
                <p className="text-sm text-green-600 dark:text-green-400">
                  ✓ Feature is enabled!
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Theming Demo */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Theming System</h2>
          <p className="text-muted-foreground">
            Themes work independently of UI components via CSS variables.
            Change themes and see all components update automatically.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ThemeSelector />
            <ThemePreview />
          </div>
          <div className="p-4 bg-muted/50 rounded-lg">
            <h3 className="font-semibold mb-2">How Theming Works</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Themes are defined in <code className="bg-background px-1 rounded">themes/</code> directory</li>
              <li>• Each theme has light and dark variants</li>
              <li>• Themes use CSS variables (--primary, --secondary, etc.)</li>
              <li>• UI components automatically use theme colors</li>
              <li>• Themes are independent - can be created without touching UI code</li>
              <li>• Works seamlessly with v0 - just define colors, components adapt</li>
            </ul>
          </div>
        </section>

        {/* Usage Instructions */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">How to Use</h2>
          <div className="p-6 bg-muted/50 rounded-lg space-y-4">
            <div>
              <h3 className="font-semibold mb-2">1. Create Components in V0</h3>
              <p className="text-sm text-muted-foreground">
                Use v0 to create components. They will be synced to v0-staging automatically.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">2. Sync to Monorepo</h3>
              <p className="text-sm text-muted-foreground">
                Run <code className="bg-background px-1 rounded">pnpm v0:sync</code> to sync components from v0-ideai to v0-staging.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">3. Export to All Apps</h3>
              <p className="text-sm text-muted-foreground">
                Run <code className="bg-background px-1 rounded">pnpm v0:export</code> to make components available in all apps via <code className="bg-background px-1 rounded">@repo/ui</code>.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">4. Use in Your App</h3>
              <p className="text-sm text-muted-foreground">
                Import and use: <code className="bg-background px-1 rounded">import {"{ ComponentName }"} from "@repo/ui"</code>
              </p>
            </div>
          </div>
        </section>
      </div>
    </IdeAIPageTemplate>
  );
}

