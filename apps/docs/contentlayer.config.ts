/**
 * @fileoverview Contentlayer configuration for IdeaI documentation
 * 
 * @module ContentlayerConfig
 * @description
 * Defines the document types and content structure for the IdeaI docs site.
 * Provides type-safe content access with automatic SEO metadata generation.
 * 
 * @see https://contentlayer.dev/docs
 */

import { defineDocumentType, makeSource } from "contentlayer/source-files";
import { writeFileSync } from "fs";
import { join } from "path";

/**
 * Document type for IdeaI documentation pages
 */
const Doc = defineDocumentType(() => ({
  name: "Doc",
  filePathPattern: "**/*.mdx",
  contentType: "mdx",
  fields: {
    title: {
      type: "string",
      description: "The title of the documentation page",
      required: true,
    },
    description: {
      type: "string",
      description: "SEO description for the page",
      required: false,
    },
    published: {
      type: "boolean",
      description: "Whether the page is published",
      default: true,
    },
  },
  computedFields: {
    url: {
      type: "string",
      resolve: (doc) => {
        // Remove .mdx extension and create URL path
        const path = doc._raw.flattenedPath;
        return `/docs/${path}`;
      },
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

