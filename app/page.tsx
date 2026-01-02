import Link from "next/link"

export default function MonorepoLanding() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-background to-muted">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-block mb-4 px-4 py-2 bg-primary/10 rounded-full">
              <span className="text-sm font-medium text-primary">Turborepo + Next.js</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">Monorepo Starter Kit</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              A production-ready monorepo setup with Turborepo, Next.js 16, and shared packages. Built for speed and
              scalability.
            </p>
          </div>

          {/* Apps Grid */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <Link
              href="http://localhost:3000"
              target="_blank"
              className="group relative p-8 bg-card rounded-xl border hover:border-primary transition-all hover:shadow-lg"
            >
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <svg className="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </div>
              <div className="mb-4 text-4xl">🚀</div>
              <h2 className="text-2xl font-bold mb-2">Web App</h2>
              <p className="text-muted-foreground mb-4">Main Next.js application with shared UI components</p>
              <div className="text-sm text-muted-foreground">
                <span className="font-mono bg-muted px-2 py-1 rounded">apps/web</span>
                <span className="mx-2">•</span>
                <span className="font-mono">localhost:3000</span>
              </div>
            </Link>

            <Link
              href="http://localhost:3001"
              target="_blank"
              className="group relative p-8 bg-card rounded-xl border hover:border-primary transition-all hover:shadow-lg"
            >
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <svg className="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </div>
              <div className="mb-4 text-4xl">📚</div>
              <h2 className="text-2xl font-bold mb-2">Docs App</h2>
              <p className="text-muted-foreground mb-4">Documentation site for your monorepo</p>
              <div className="text-sm text-muted-foreground">
                <span className="font-mono bg-muted px-2 py-1 rounded">apps/docs</span>
                <span className="mx-2">•</span>
                <span className="font-mono">localhost:3001</span>
              </div>
            </Link>
          </div>

          {/* Packages */}
          <div className="mb-12">
            <h3 className="text-2xl font-bold mb-6">Shared Packages</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-6 bg-card rounded-lg border">
                <div className="flex items-start gap-3">
                  <div className="text-2xl">🎨</div>
                  <div>
                    <h4 className="font-semibold mb-1">@repo/ui</h4>
                    <p className="text-sm text-muted-foreground mb-2">Shared React component library</p>
                    <span className="text-xs font-mono bg-muted px-2 py-1 rounded">packages/ui</span>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-card rounded-lg border">
                <div className="flex items-start gap-3">
                  <div className="text-2xl">⚙️</div>
                  <div>
                    <h4 className="font-semibold mb-1">@repo/typescript-config</h4>
                    <p className="text-sm text-muted-foreground mb-2">Shared TypeScript configurations</p>
                    <span className="text-xs font-mono bg-muted px-2 py-1 rounded">packages/typescript-config</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Start */}
          <div className="bg-card rounded-xl border p-8">
            <h3 className="text-xl font-bold mb-4">🚀 Quick Start</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold">
                  1
                </span>
                <div>
                  <code className="text-sm bg-muted px-3 py-1 rounded font-mono">pnpm install</code>
                  <p className="text-sm text-muted-foreground mt-1">Install dependencies for all apps and packages</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold">
                  2
                </span>
                <div>
                  <code className="text-sm bg-muted px-3 py-1 rounded font-mono">pnpm dev</code>
                  <p className="text-sm text-muted-foreground mt-1">Start all apps in development mode</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold">
                  3
                </span>
                <div>
                  <code className="text-sm bg-muted px-3 py-1 rounded font-mono">pnpm build</code>
                  <p className="text-sm text-muted-foreground mt-1">Build all apps and packages for production</p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-12 text-center text-sm text-muted-foreground">
            <p>
              Built with{" "}
              <a
                href="https://turbo.build"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-foreground hover:underline"
              >
                Turborepo
              </a>{" "}
              and{" "}
              <a
                href="https://nextjs.org"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-foreground hover:underline"
              >
                Next.js
              </a>
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
