/**
 * @fileoverview Download route for v0 chat projects
 * @module api/chats/[chatId]/download
 * @description Extracts code files from v0 chat and returns them as downloadable project structure
 */

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "v0-sdk";
import { auth } from "@/lib/auth";
import { getChatOwnership } from "@/lib/db/queries";

// Create v0 client with custom baseUrl if V0_API_URL is set
const v0 = createClient(
  process.env.V0_API_URL ? { baseUrl: process.env.V0_API_URL } : {},
);

/**
 * Recursively extract code files from chat message content
 */
function extractCodeFilesFromContent(
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
function extractFilesFromMessages(messages: any[]): Record<string, string> {
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
function generateBasicNextJsFiles(projectName: string): Record<string, string> {
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
function sanitizeProjectName(name: string): string {
  return (
    name
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "") || "v0-app"
  );
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ chatId: string }> },
) {
  try {
    const { chatId } = await context.params;
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!chatId) {
      return NextResponse.json(
        { success: false, error: "Chat ID is required" },
        { status: 400 },
      );
    }

    // Check authentication and ownership
    if (session?.user?.id) {
      const ownership = await getChatOwnership({ v0ChatId: chatId });

      if (!ownership) {
        return NextResponse.json(
          { success: false, error: "Chat not found" },
          { status: 404 },
        );
      }

      if (ownership.user_id !== session.user.id) {
        return NextResponse.json(
          { success: false, error: "Forbidden" },
          { status: 403 },
        );
      }
    }

    // Fetch chat details from v0 API
    const chatDetails = await v0.chats.getById({ chatId });

    if (!chatDetails) {
      return NextResponse.json(
        { success: false, error: "Chat not found" },
        { status: 404 },
      );
    }

    // Extract project name from chat
    const projectName =
      chatDetails.title || chatDetails.name || `v0-chat-${chatId.slice(0, 8)}`;
    const sanitizedName = sanitizeProjectName(projectName);

    // Extract code files from latestVersion.files (primary source)
    const extractedFiles: Record<string, string> = {};
    if (
      chatDetails.latestVersion &&
      chatDetails.latestVersion.files &&
      Array.isArray(chatDetails.latestVersion.files)
    ) {
      for (const file of chatDetails.latestVersion.files) {
        if (file.name && file.content) {
          extractedFiles[file.name] = file.content;
        }
      }
    }

    // Also try extracting from messages as fallback (for chats without latestVersion)
    if (
      Object.keys(extractedFiles).length === 0 &&
      chatDetails.messages &&
      Array.isArray(chatDetails.messages)
    ) {
      Object.assign(
        extractedFiles,
        extractFilesFromMessages(chatDetails.messages),
      );
    }

    // If no files were extracted, return empty project structure
    const allFiles: Record<string, string> = {};

    // Always include basic Next.js project files
    const basicFiles = generateBasicNextJsFiles(sanitizedName);
    Object.assign(allFiles, basicFiles);

    // Add extracted code files
    Object.assign(allFiles, extractedFiles);

    // If no code files were extracted, create a basic app/page.tsx
    if (Object.keys(extractedFiles).length === 0) {
      allFiles["app/page.tsx"] = `export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">${projectName}</h1>
        <p className="text-gray-600">Generated from v0 chat</p>
      </div>
    </main>
  );
}
`;
      allFiles["app/layout.tsx"] = `import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "${projectName}",
  description: "Generated from v0 chat",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
`;
    }

    return NextResponse.json({
      success: true,
      files: allFiles,
      projectName: sanitizedName,
    });
  } catch (error) {
    console.error("Failed to prepare chat download:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to prepare chat download",
      },
      { status: 500 },
    );
  }
}
