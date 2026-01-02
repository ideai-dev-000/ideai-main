import { Button } from "@repo/ui/button"
import { Card } from "@repo/ui/card"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <Card className="max-w-2xl w-full p-8">
        <div className="flex flex-col items-center gap-6 text-center">
          <h1 className="text-4xl font-bold">Turborepo Next.js Starter</h1>
          <p className="text-lg text-muted-foreground">
            A modern monorepo starter with Turborepo, Next.js 16, and shared packages
          </p>
          <div className="flex gap-4">
            <Button size="lg">Get Started</Button>
            <Button variant="outline" size="lg">
              Learn More
            </Button>
          </div>
          <div className="mt-8 grid grid-cols-3 gap-4 w-full">
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-2">⚡ Fast</h3>
              <p className="text-sm text-muted-foreground">Turborepo for blazing fast builds</p>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-2">🎨 Modular</h3>
              <p className="text-sm text-muted-foreground">Shared UI components</p>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-2">📦 Scalable</h3>
              <p className="text-sm text-muted-foreground">Ready for growth</p>
            </div>
          </div>
        </div>
      </Card>
    </main>
  )
}
