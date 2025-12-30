---
title: Contentlayer Integration
description: Documentation for the Contentlayer integration in the IdeaI docs site, including setup, configuration, and usage.
---

# Contentlayer Integration

This document describes the Contentlayer integration for the IdeaI documentation site, providing type-safe content access, SEO optimization, and semantic URLs.

## Overview

Contentlayer is integrated into the `apps/docs` application to provide:

- **Type-safe content access** - TypeScript types generated from content schema
- **SEO metadata** - Automatic title and description per page
- **Sitemap generation** - Automatic XML sitemap at `/sitemap.xml`
- **Semantic URLs** - Clean URLs like `/docs/deployment/overview`

## Installation

Contentlayer and the Next.js plugin are installed in `apps/docs`:

```json
{
  "dependencies": {
    "contentlayer": "^0.3.4",
    "next-contentlayer": "^0.3.4"
  }
}
```

## Configuration

### Contentlayer Config

The Contentlayer configuration is in `apps/docs/contentlayer.config.ts`:

```typescript
import { defineDocumentType, makeSource } from "contentlayer/source-files";

const Doc = defineDocumentType(() => ({
  name: "Doc",
  filePathPattern: "**/*.mdx",
  contentType: "mdx",
  fields: {
    title: { type: "string", required: true },
    description: { type: "string", required: false },
    published: { type: "boolean", default: true },
  },
  computedFields: {
    url: {
      type: "string",
      resolve: (doc) => `/docs/${doc._raw.flattenedPath}`,
    },
    slug: {
      type: "string",
      resolve: (doc) => doc._raw.flattenedPath,
    },
  },
}));

export default makeSource({
  contentDirPath: "content",
  documentTypes: [Doc],
  disableImportAliasWarning: true,
});
```

### Next.js Config

The Next.js configuration wraps the config with `withContentlayer`:

```javascript
import { withContentlayer } from "next-contentlayer";

const nextConfig = {
  turbopack: {},
};

export default withContentlayer(nextConfig);
```

### TypeScript Config

Path aliases are configured in `apps/docs/tsconfig.json`:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"],
      "contentlayer/generated": ["./.contentlayer/generated"]
    }
  }
}
```

## Content Structure

### Frontmatter

All documentation files must include frontmatter with at least a `title`:

```markdown
---
title: Page Title
description: SEO description for the page
published: true
---

# Page Title

Content here...
```

### File Organization

Documentation files are organized in `apps/docs/content/`:

```
content/
├── index.mdx
├── contributing.mdx
├── project-summary.mdx
├── deployment/
│   ├── overview.mdx
│   ├── ci-cd.mdx
│   ├── vercel.mdx
│   ├── troubleshooting.mdx
│   └── commit-signing-ci.mdx
├── setup/
│   ├── github-secrets.mdx
│   ├── vercel-checklist.mdx
│   └── commit-signing.mdx
├── development/
│   └── getting-started.mdx
├── tools/
│   └── code-context.mdx
└── tasks/
    └── code-context-integration.mdx
```

## Usage

### Accessing Content

Content is accessed via the generated types:

```typescript
import { allDocs, type Doc } from "contentlayer/generated";

// Get all docs
const docs = allDocs;

// Find a specific doc
const doc = allDocs.find((d) => d.slug === "deployment/overview");
```

### Rendering Content

Content is rendered using `react-markdown` (not Contentlayer's MDX component for stability):

```typescript
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

<ReactMarkdown remarkPlugins={[remarkGfm]}>
  {doc.body.raw}
</ReactMarkdown>
```

**Note**: We use `react-markdown` instead of Contentlayer's `useMDXComponent` hook because:
- More stable with Next.js 16 App Router
- Avoids client-side hydration issues
- Simpler server component rendering

### SEO Metadata

SEO metadata is generated automatically per page:

```typescript
export async function generateMetadata({ params }: PageProps) {
  const doc = getDocFromSlug(slug);
  
  return {
    title: `${doc.title} | IdeaI Docs`,
    description: doc.description || `Documentation for ${doc.title}`,
    openGraph: {
      title: `${doc.title} | IdeaI Docs`,
      description: doc.description,
      type: "article",
      url: `https://docs.ideai.studio${doc.url}`,
    },
  };
}
```

### Sitemap

A sitemap is automatically generated at `/sitemap.xml`:

```typescript
// apps/docs/app/sitemap.xml/route.ts
import { allDocs } from "contentlayer/generated";

export async function GET() {
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allDocs
  .filter((doc) => doc.published !== false)
  .map((doc) => `  <url>
    <loc>https://docs.ideai.studio${doc.url}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`)
  .join("\n")}
</urlset>`;

  return new Response(sitemap, {
    headers: { "Content-Type": "application/xml" },
  });
}
```

## URL Structure

Contentlayer generates semantic URLs based on file paths:

- `content/index.mdx` → `/docs/`
- `content/deployment/overview.mdx` → `/docs/deployment/overview`
- `content/setup/github-secrets.mdx` → `/docs/setup/github-secrets`

## Generated Files

Contentlayer generates type-safe files in `.contentlayer/generated/`:

- `index.mjs` - Main export with `allDocs`
- `types.d.ts` - TypeScript type definitions
- `Doc/` - Individual document JSON files

These files are generated automatically during:
- Development (`next dev`)
- Build (`next build`)
- Manual generation (`pnpm contentlayer build`)

## Current Status

✅ **Working:**
- Type-safe content access
- SEO metadata generation
- Sitemap generation
- 14 documentation files with frontmatter
- Semantic URLs
- Content rendering with `react-markdown`

⚠️ **Known Limitations:**
- Using `react-markdown` instead of Contentlayer's MDX rendering (for stability)
- Contentlayer has peer dependency warnings with Next.js 16 (non-blocking)

## Adding New Documentation

1. Create a new `.mdx` file in `apps/docs/content/`
2. Add frontmatter with `title` and optional `description`:

```markdown
---
title: New Page Title
description: Description for SEO
---

# New Page Title

Content...
```

3. Run `pnpm sync-docs` if adding to `docs/` directory (auto-syncs on build)
4. Contentlayer will automatically generate types
5. Page will be available at `/docs/{path}`

## Troubleshooting

### Types Not Generated

Run Contentlayer manually:

```bash
cd apps/docs
pnpm contentlayer build
```

### Missing Frontmatter

All `.mdx` files must have frontmatter with at least `title`:

```markdown
---
title: Required Title
---
```

### Build Errors

If Contentlayer build fails:
1. Check all `.mdx` files have valid frontmatter
2. Ensure `contentlayer.config.ts` is correct
3. Check TypeScript errors: `pnpm check-types`

## Related Documentation

- [Documentation Site Setup](../development/getting-started.md)
- [SEO Best Practices](./seo.md) (if exists)
- [Contentlayer Documentation](https://contentlayer.dev/docs)

