/**
 * @fileoverview Dynamic documentation page handler with Contentlayer
 * 
 * @module DocsDynamicPage
 * @description
 * Handles all documentation routes dynamically using Contentlayer.
 * Provides type-safe content access, SEO metadata, and semantic URLs.
 * 
 * @example
 * Routes like /docs/getting-started, /docs/deployment/overview
 * 
 * @see https://contentlayer.dev/docs
 */

import { notFound } from "next/navigation";
import { allDocs, type Doc } from "contentlayer/generated";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { MarkdownLink } from "../../../components/markdown-links";

interface PageProps {
  params: Promise<{ slug?: string[] }>;
}

/**
 * Get document by slug path
 */
function getDocFromSlug(slug: string[]): Doc | undefined {
  const slugPath = slug.join("/");
  return allDocs.find((doc: Doc) => doc.slug === slugPath);
}

/**
 * Generate metadata for SEO
 */
export async function generateMetadata({ params }: PageProps) {
  const { slug = [] } = await params;
  const doc = getDocFromSlug(slug);

  if (!doc) {
    return {
      title: "Page Not Found | IdeaI Docs",
      description: "The requested documentation page could not be found.",
    };
  }

  return {
    title: `${doc.title} | IdeaI Docs`,
    description: doc.description || `Documentation for ${doc.title}`,
    openGraph: {
      title: `${doc.title} | IdeaI Docs`,
      description: doc.description || `Documentation for ${doc.title}`,
      type: "article",
      url: `https://docs.ideai.studio${doc.url}`,
    },
    twitter: {
      card: "summary_large_image",
      title: `${doc.title} | IdeaI Docs`,
      description: doc.description || `Documentation for ${doc.title}`,
    },
  };
}

/**
 * Generate static params for all docs (for static generation)
 */
export async function generateStaticParams() {
  return allDocs
    .filter((doc: Doc) => doc.published !== false)
    .map((doc: Doc) => ({
      slug: doc.slug.split("/").filter(Boolean),
    }));
}

/**
 * Documentation page component
 */
export default async function DocsPage({ params }: PageProps) {
  const { slug = [] } = await params;
  const doc = getDocFromSlug(slug);

  if (!doc || doc.published === false) {
    notFound();
  }

  return (
    <div className="min-h-screen" style={{ 
      display: 'grid',
      gridTemplateRows: '20px 1fr 20px',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '80px',
      gap: '64px'
    }}>
      <main style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '32px',
        gridRowStart: 2,
        maxWidth: '900px',
        width: '100%'
      }}>
        <article className="prose prose-lg dark:prose-invert max-w-none" style={{
          fontFamily: 'var(--font-geist-sans)',
          color: 'var(--foreground)'
        }}>
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              a: MarkdownLink,
            }}
          >
            {doc.body.raw}
          </ReactMarkdown>
        </article>
      </main>
    </div>
  );
}
