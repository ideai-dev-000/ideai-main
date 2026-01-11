/**
 * @fileoverview Download Utilities for Vibe Chats
 *
 * @module VibeDownloadUtils
 * @description
 * Utilities for extracting code files from vibe chats for download.
 * Composable functions for processing chat content.
 */

/**
 * Recursively extract code files from chat message content
 */
export function extractCodeFilesFromContent(
  content: any,
  files: Record<string, string> = {},
): Record<string, string> {
  if (!content) return files;

  // Handle array of content items
  if (Array.isArray(content)) {
    for (const item of content) {
      extractCodeFilesFromContent(item, files);
    }
    return files;
  }

  // Handle CodeProjectPart structure
  if (typeof content === "object" && content !== null) {
    // Check if this is a CodeProjectPart with changedFiles
    if (
      content.type === "code-project" &&
      Array.isArray(content.changedFiles)
    ) {
      for (const file of content.changedFiles) {
        const fileName = file.fileName || file.baseName;
        const fileContent = file.source || file.content || "";

        if (fileName && fileContent) {
          // Normalize path - ensure it starts with app/ if it's a Next.js file
          let normalizedPath = fileName;
          if (
            !normalizedPath.startsWith("app/") &&
            !normalizedPath.startsWith("components/") &&
            !normalizedPath.startsWith("lib/") &&
            !normalizedPath.includes("/")
          ) {
            // If no path, assume it's in app/
            normalizedPath = `app/${normalizedPath}`;
          }

          files[normalizedPath] = fileContent;
        }
      }
    }

    // Recursively check nested structures
    for (const key in content) {
      if (key !== "type" && typeof content[key] === "object") {
        extractCodeFilesFromContent(content[key], files);
      }
    }

    // Check parts array (common in TaskSection)
    if (Array.isArray(content.parts)) {
      for (const part of content.parts) {
        extractCodeFilesFromContent(part, files);
      }
    }
  }

  return files;
}

/**
 * Extract code files from chat messages
 */
export function extractFilesFromMessages(
  messages: any[],
): Record<string, string> {
  const files: Record<string, string> = {};

  for (const message of messages) {
    if (message.role === "assistant" && message.content) {
      extractCodeFilesFromContent(message.content, files);
    }
  }

  return files;
}

/**
 * Generate basic Next.js project files if none exist
 */
export function generateBasicNextJsFiles(
  projectName: string,
): Record<string, string> {
  const sanitizedName = projectName
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  return {
    "package.json": JSON.stringify(
      {
        name: sanitizedName,
        version: "0.1.0",
        private: true,
        scripts: {
          dev: "next dev",
          build: "next build",
          start: "next start",
          lint: "next lint",
        },
        dependencies: {
          react: "^18.3.1",
          "react-dom": "^18.3.1",
          next: "^15.1.3",
        },
        devDependencies: {
          typescript: "^5.7.2",
          "@types/node": "^22.10.2",
          "@types/react": "^18.3.17",
          "@types/react-dom": "^18.3.1",
          eslint: "^9.18.0",
          "eslint-config-next": "^15.1.3",
        },
      },
      null,
      2,
    ),
    "tsconfig.json": JSON.stringify(
      {
        compilerOptions: {
          target: "ES2017",
          lib: ["dom", "dom.iterable", "esnext"],
          allowJs: true,
          skipLibCheck: true,
          strict: true,
          noEmit: true,
          esModuleInterop: true,
          module: "esnext",
          moduleResolution: "bundler",
          resolveJsonModule: true,
          isolatedModules: true,
          jsx: "preserve",
          incremental: true,
          plugins: [
            {
              name: "next",
            },
          ],
          paths: {
            "@/*": ["./*"],
          },
        },
        include: [
          "next-env.d.ts",
          "**/*.ts",
          "**/*.tsx",
          ".next/types/**/*.ts",
        ],
        exclude: ["node_modules"],
      },
      null,
      2,
    ),
    "next.config.js": `/** @type {import('next').NextConfig} */
const nextConfig = {};

module.exports = nextConfig;
`,
    ".gitignore": `# See https://help.github.com/articles/ignoring-files/ for more about ignoring files.

# dependencies
/node_modules
/.pnp
.pnp.js

# testing
/coverage

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# local env files
.env*.local

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts
`,
    "README.md": `# ${projectName}

This is a Next.js project generated from v0 chat.

## Getting Started

First, install the dependencies:

\`\`\`bash
npm install
# or
yarn install
# or
pnpm install
\`\`\`

Then, run the development server:

\`\`\`bash
npm run dev
# or
yarn dev
# or
pnpm dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
`,
  };
}

/**
 * Sanitize project name for use in file names
 */
export function sanitizeProjectName(name: string): string {
  return (
    name
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "") || "v0-app"
  );
}
