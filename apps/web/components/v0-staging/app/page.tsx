/**
 * @fileoverview Main page for V0 prototype
 * 
 * @module V0PrototypePage
 * @description
 * Minimal page component ready for V0 prototyping.
 * Uses IdeaI shared components.
 */

import { IdeAIPageTemplate } from "@repo/ui";
import { IdeaIButton } from "@repo/ui";

export default function home() {
  return (
    <IdeAIPageTemplate
      siteName="V0 Prototype"
      vercelProjectName="v0-prototype"
      vercelOrgId={process.env.NEXT_PUBLIC_VERCEL_ORG_ID || "team_vhjzlMi6CfNow0IfBXnv2Yn2"}
      headerActions={<IdeaIButton appName="v0-prototype">Get Started</IdeaIButton>}
    >
      <div className="space-y-6">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">V0 Prototype</h1>
          <p className="text-lg text-muted-foreground">
            Minimal boilerplate for IdeaI-compatible prototypes
          </p>
        </div>
        
        <div className="max-w-2xl mx-auto space-y-4">
          <div className="p-6 border rounded-lg">
            <h2 className="text-xl font-semibold mb-2">Ready for V0</h2>
            <p className="text-muted-foreground">
              This is a minimal Next.js 16 boilerplate that follows IdeaI standards.
              Use it as a starting point for new prototypes in V0.
            </p>
          </div>
          
          <div className="p-6 border rounded-lg">
            <h2 className="text-xl font-semibold mb-2">IdeaI Compatible</h2>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Uses @repo/ui workspace dependency</li>
              <li>Next.js 16 with React 19</li>
              <li>Tailwind CSS + IdeaI Design System</li>
              <li>TypeScript with strict mode</li>
              <li>ESLint with IdeaI config</li>
            </ul>
          </div>
        </div>
      </div>
    </IdeAIPageTemplate>
  );
}

