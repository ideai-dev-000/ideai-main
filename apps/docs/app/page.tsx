import { Button } from "@repo/ui/button"

export default function DocsHome() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="max-w-2xl text-center">
        <h1 className="text-5xl font-bold mb-4">📚 Documentation</h1>
        <p className="text-xl text-muted-foreground mb-8">
          Welcome to the documentation app in your Turborepo monorepo
        </p>
        <Button>View Docs</Button>
      </div>
    </main>
  )
}
