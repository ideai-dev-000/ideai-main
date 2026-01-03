import { IdeAIPageTemplate } from "@repo/ui/components/ideai-page-template";

export default function NotFound() {
  return (
    <IdeAIPageTemplate siteName="IdeaI /radix" subtitle="Page Not Found">
      <div>
        <h1>404 - Page Not Found</h1>
        <p>The page you are looking for does not exist.</p>
      </div>
    </IdeAIPageTemplate>
  );
}
