/**
 * @fileoverview IdeaI Documentation Viewer Page
 * 
 * @module DocsViewerPage
 * @description
 * Page that embeds IdeaI documentation with filtering capabilities.
 * Used by AI assistants and developers to access relevant documentation.
 */

import { Suspense } from "react";
import { IdeAIDocsViewer } from "@repo/ui/components/ideai-docs-viewer";

interface PageProps {
  searchParams: Promise<{ category?: string; path?: string; search?: string }>;
}

/**
 * Documentation viewer page
 * 
 * Filters and displays IdeaI documentation based on query parameters.
 */
export default async function DocsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  
  return (
    <Suspense fallback={<div>Loading documentation...</div>}>
      <IdeAIDocsViewer
        filter={{
          category: params.category,
          path: params.path,
          search: params.search,
        }}
        title="IdeaI Documentation"
        showNav={true}
      />
    </Suspense>
  );
}

