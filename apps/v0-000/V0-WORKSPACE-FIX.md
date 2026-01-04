# V0 Workspace Dependency Fix

**CRITICAL**: v0 preview cannot resolve workspace dependencies like `@repo/ui`.

## The Problem

When you upload `apps/v0-000/` to v0.dev, it fails with:
\`\`\`
Failed to load "@repo/ui" from "blob:...". Modules must be served with a valid MIME type.
\`\`\`

**Why**: v0.dev runs in an isolated environment and cannot resolve:

- Workspace dependencies (`@repo/ui`)
- Monorepo package references
- Local file system dependencies

## Solution: Create V0-Compatible Version

### Option 1: Remove @repo/ui Dependencies (Recommended for v0)

**For v0.dev upload**, create a version that doesn't use `@repo/ui`:

1. **Replace `@repo/ui` imports** with local copies or remove them
2. **Use only standard packages** that v0 can install via npm
3. **Keep shadcn components** (these work fine in v0)

### Option 2: Use V0's Built-in Components

v0 has its own component library. Instead of `@repo/ui`, use:

- v0's built-in UI components
- Standard React components
- Shadcn components (via `@/components/ui/*`)

### Option 3: Copy Required Components Locally

If you need specific IdeaI components:

1. Copy them to `apps/v0-000/components/ideai/`
2. Update imports to use local paths
3. Remove `@repo/ui` dependency

## Quick Fix for V0 Upload

**Before uploading to v0.dev:**

1. **Comment out `@repo/ui` imports** in `app/page.tsx`:
   \`\`\`tsx
   // import { IdeAIPageTemplate } from "@repo/ui";
   // import { IdeaIButton } from "@repo/ui";
   // import { BrainIcon, CatIcon, MusicIcon, RocketIcon } from "@repo/ui";
   \`\`\`

2. **Use standard components instead**:
   \`\`\`tsx
   import { Button } from "@/components/ui/button";
   // Use standard HTML/React instead of IdeAIPageTemplate
   \`\`\`

3. **Remove `@repo/ui` from package.json** (temporarily for v0):
   \`\`\`json
   {
   "dependencies": {
   // "@repo/ui": "workspace:\*", // Comment out for v0
   }
   }
   \`\`\`

## For Monorepo Use

**In the monorepo**, keep `@repo/ui` - it works perfectly here.

**For v0.dev**, use the modified version without workspace dependencies.

---

**Note**: This is a limitation of v0's preview environment, not a bug in your code.
