import Link from "next/link";
import { IdeAIPageTemplate } from "@repo/ui/components/ideai-page-template";
import { Button } from "@repo/ui/components/ui/button";

export default function NotFound() {
  return (
    <IdeAIPageTemplate siteName="Framework Not Found">
      <div className="max-w-2xl mx-auto p-8 text-center">
        <h1 className="text-4xl font-bold mb-4">Framework Not Found</h1>
        <p className="text-slate-600 dark:text-slate-400 mb-8">
          The framework you're looking for doesn't exist or has been removed.
        </p>
        <Button asChild>
          <Link href="/">← Back to Framework Showcase</Link>
        </Button>
      </div>
    </IdeAIPageTemplate>
  );
}
