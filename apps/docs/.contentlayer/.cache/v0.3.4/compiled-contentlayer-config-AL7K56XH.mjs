// contentlayer.config.ts
import { defineDocumentType, makeSource } from "contentlayer/source-files";
var Doc = defineDocumentType(() => ({
  name: "Doc",
  filePathPattern: "**/*.mdx",
  contentType: "mdx",
  fields: {
    title: {
      type: "string",
      description: "The title of the documentation page",
      required: true
    },
    description: {
      type: "string",
      description: "SEO description for the page",
      required: false
    },
    published: {
      type: "boolean",
      description: "Whether the page is published",
      default: true
    }
  },
  computedFields: {
    url: {
      type: "string",
      resolve: (doc) => {
        const path = doc._raw.flattenedPath;
        if (path === "index") {
          return "/docs";
        }
        return `/docs/${path}`;
      }
    },
    slug: {
      type: "string",
      resolve: (doc) => {
        if (doc._raw.flattenedPath === "index") {
          return "";
        }
        return doc._raw.flattenedPath;
      }
    }
  }
}));
var contentlayer_config_default = makeSource({
  contentDirPath: "content",
  documentTypes: [Doc],
  disableImportAliasWarning: true
});
export {
  contentlayer_config_default as default
};
//# sourceMappingURL=compiled-contentlayer-config-AL7K56XH.mjs.map
