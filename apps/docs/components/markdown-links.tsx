/**
 * @fileoverview Custom link component for ReactMarkdown
 * 
 * @module MarkdownLinks
 * @description
 * Converts markdown links to Next.js Link components for SEO-friendly URLs.
 * Handles both internal docs links and external links.
 */

import Link from "next/link";
import type { ComponentPropsWithoutRef } from "react";

interface LinkProps extends ComponentPropsWithoutRef<"a"> {
  href?: string;
  children?: React.ReactNode;
}

export function MarkdownLink({ href, children, ...props }: LinkProps) {
  if (!href) {
    return <>{children}</>;
  }

  // External links
  if (href.startsWith("http://") || href.startsWith("https://")) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
        {children}
      </a>
    );
  }

  // Internal docs links - convert to /docs/ URLs
  let docsUrl = href;
  
  // Remove .md or .mdx extension
  docsUrl = docsUrl.replace(/\.(md|mdx)$/, "");
  
  // Handle relative paths
  if (docsUrl.startsWith("./")) {
    docsUrl = docsUrl.slice(2);
  }
  
  // Convert to absolute /docs/ path
  if (!docsUrl.startsWith("/")) {
    docsUrl = `/docs/${docsUrl}`;
  } else if (!docsUrl.startsWith("/docs")) {
    docsUrl = `/docs${docsUrl}`;
  }

  return (
    <Link 
      href={docsUrl} 
      className="text-slate-900 dark:text-slate-50 underline hover:text-slate-700 dark:hover:text-slate-300"
      {...props}
    >
      {children}
    </Link>
  );
}

