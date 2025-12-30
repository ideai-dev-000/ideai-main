/**
 * @fileoverview Dynamic documentation page handler
 * 
 * @module DocsDynamicPage
 * @description
 * Handles all documentation routes dynamically.
 * Reads markdown files from content/ directory and renders them.
 * 
 * @example
 * Routes like /docs/getting-started, /docs/deployment/overview
 */

import { notFound } from "next/navigation";
import { readFile } from "fs/promises";
import { join } from "path";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface PageProps {
  params: Promise<{ slug?: string[] }>;
}

async function getDocContent(slug: string[]) {
  // process.cwd() is already /path/to/apps/docs when running from that directory
  const basePath = join(process.cwd(), "content");
  const filePath = slug.length === 0 
    ? join(basePath, "index.mdx")
    : join(basePath, ...slug) + ".mdx";
  
  try {
    const source = await readFile(filePath, "utf-8");
    // Remove frontmatter if present
    const content = source.replace(/^---[\s\S]*?---\n/, "");
    return content;
  } catch (error) {
    console.error("Error reading doc file:", filePath, error);
    return null;
  }
}

export default async function DocsPage({ params }: PageProps) {
  const { slug = [] } = await params;
  const content = await getDocContent(slug);
  
  if (!content) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <article className="prose prose-lg dark:prose-invert max-w-none">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {content}
        </ReactMarkdown>
      </article>
    </div>
  );
}
