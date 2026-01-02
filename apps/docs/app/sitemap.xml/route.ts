/**
 * @fileoverview Sitemap generation for IdeaI documentation
 * 
 * @module SitemapRoute
 * @description
 * Generates XML sitemap for SEO optimization.
 * Automatically includes all published documentation pages.
 */

import { allDocs, type Doc } from "contentlayer/generated";

export async function GET() {
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allDocs
  .filter((doc: Doc) => doc.published !== false)
  .map(
    (doc: Doc) => `  <url>
    <loc>https://docs.ideai.studio${doc.url}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`
  )
  .join("\n")}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}

