import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function MonorepoHome() {
  const apps = [
    {
      name: "Web",
      description: "Main parent app and boilerplate",
      path: "/apps/web",
      port: 3000,
      status: "Production",
      features: ["Parent App", "Documentation Hub", "Boilerplate"],
    },
    {
      name: "Docs",
      description: "Documentation site with Contentlayer",
      path: "/apps/docs",
      port: 3001,
      status: "Active",
      features: ["Contentlayer", "MDX", "Search"],
    },
    {
      name: "All CSS",
      description: "Full CSS frameworks showcase",
      path: "/apps/allcss",
      port: 3002,
      status: "Active",
      features: ["Tailwind", "Bootstrap", "Material"],
    },
    {
      name: "Bootstrap",
      description: "Bootstrap-based app",
      path: "/apps/bootstrap",
      port: 3003,
      status: "Active",
      features: ["Bootstrap 5", "Components"],
    },
    {
      name: "Chakra",
      description: "Chakra UI implementation",
      path: "/apps/chakra",
      port: 3004,
      status: "Active",
      features: ["Chakra UI", "React"],
    },
    {
      name: "Material",
      description: "Material UI showcase",
      path: "/apps/material",
      port: 3005,
      status: "Active",
      features: ["MUI", "Components"],
    },
    {
      name: "MVP",
      description: "Minimal viable product template",
      path: "/apps/mvp",
      port: 3006,
      status: "Active",
      features: ["Quick Start", "Template"],
    },
  ]

  const packages = [
    {
      name: "@repo/ui",
      description: "Shared UI components and utilities",
      features: ["React Components", "IdeAI Docs Viewer", "Page Templates"],
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-5xl font-bold mb-4 text-balance">IdeaI Monorepo</h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Future-focused Turborepo setup with multiple Next.js apps and shared packages
          </p>
        </div>

        {/* Quick Start */}
        <Card className="mb-12 border-primary/20">
          <CardHeader>
            <CardTitle>Quick Start</CardTitle>
            <CardDescription>Get your monorepo running in seconds</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-muted p-4 rounded-lg font-mono text-sm">
                <div className="mb-2 text-muted-foreground"># Install dependencies</div>
                <div className="mb-4">pnpm install</div>

                <div className="mb-2 text-muted-foreground"># Start all apps</div>
                <div className="mb-4">pnpm dev</div>

                <div className="mb-2 text-muted-foreground"># Or start specific app</div>
                <div>pnpm --filter web dev</div>
              </div>

              <div className="flex flex-wrap gap-4">
                <Button asChild>
                  <Link href="/docs">View Documentation</Link>
                </Button>
                <Button variant="outline" asChild>
                  <a href="https://turbo.build/repo/docs" target="_blank" rel="noopener noreferrer">
                    Turborepo Docs
                  </a>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Apps Grid */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Applications</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {apps.map((app) => (
              <Card key={app.name} className="hover:border-primary/50 transition-colors">
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <CardTitle>{app.name}</CardTitle>
                    <span className="text-xs font-mono bg-muted px-2 py-1 rounded">:{app.port}</span>
                  </div>
                  <CardDescription>{app.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      {app.features.map((feature) => (
                        <span
                          key={feature}
                          className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                    <div className="font-mono text-sm text-muted-foreground">{app.path}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Packages */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Shared Packages</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {packages.map((pkg) => (
              <Card key={pkg.name}>
                <CardHeader>
                  <CardTitle className="font-mono">{pkg.name}</CardTitle>
                  <CardDescription>{pkg.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {pkg.features.map((feature) => (
                      <span key={feature} className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded">
                        {feature}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Architecture */}
        <Card>
          <CardHeader>
            <CardTitle>Architecture Highlights</CardTitle>
            <CardDescription>Key features of this monorepo</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-sm leading-relaxed">
              <li className="flex items-start gap-3">
                <span className="text-primary font-bold">•</span>
                <span>
                  <strong>Turborepo:</strong> Intelligent caching and parallel execution for fast builds
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary font-bold">•</span>
                <span>
                  <strong>pnpm Workspaces:</strong> Efficient dependency management across all apps
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary font-bold">•</span>
                <span>
                  <strong>Parent-Child Apps:</strong> Main app embeds child apps via iframes for unified deployment
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary font-bold">•</span>
                <span>
                  <strong>Shared UI Package:</strong> Reusable components including docs viewer and page templates
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary font-bold">•</span>
                <span>
                  <strong>Vercel Ready:</strong> Complete CI/CD configuration with GitHub Actions
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary font-bold">•</span>
                <span>
                  <strong>Future-Focused:</strong> No legacy support, built for 2026+ best practices
                </span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-12 text-center text-sm text-muted-foreground">
          <p>Built with Turborepo, Next.js 15, and pnpm</p>
        </div>
      </div>
    </div>
  )
}
