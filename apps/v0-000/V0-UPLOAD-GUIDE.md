# V0 Upload Guide - Step by Step

**Complete guide for uploading v0-000 to v0.dev without errors.**

## ⚠️ Critical Issues

1. **@repo/ui workspace dependency** - v0 preview cannot resolve this
2. **NEXT_PUBLIC_VERCEL_ORG_ID** - Must be set in next.config.mjs

## Quick Fix (Before Uploading to v0)

### Step 1: Replace Files for V0 Compatibility

\`\`\`bash
cd apps/v0-000

# Backup original files

cp app/layout.tsx app/layout-monorepo.tsx
cp app/page.tsx app/page-monorepo.tsx

# Use v0-compatible versions

cp app/layout-v0.tsx app/layout.tsx
cp app/page-v0.tsx app/page.tsx
\`\`\`

### Step 2: Verify next.config.mjs

The `next.config.mjs` already includes:
\`\`\`javascript
env: {
NEXT_PUBLIC_VERCEL_ORG_ID: process.env.NEXT_PUBLIC_VERCEL_ORG_ID || "team_vhjzlMi6CfNow0IfBXnv2Yn2",
}
\`\`\`

This ensures v0 can read the org ID.

### Step 3: Upload to v0.dev

1. Upload the entire `apps/v0-000/` folder to v0.dev
2. v0 will read `NEXT_PUBLIC_VERCEL_ORG_ID` from `next.config.mjs`
3. No `@repo/ui` imports = no errors!

## Restore for Monorepo Use

After testing in v0, restore the original files:

\`\`\`bash
cd apps/v0-000

# Restore monorepo versions

cp app/layout-monorepo.tsx app/layout.tsx
cp app/page-monorepo.tsx app/page.tsx
\`\`\`

## What Changed in V0 Versions

### layout-v0.tsx

- ❌ Removed: `import { ThemeProvider } from "@repo/ui"`
- ✅ Added: `import { ThemeProvider } from "next-themes"`
- Uses standard `next-themes` directly (works in v0)

### page-v0.tsx

- ❌ Removed: All `@repo/ui` imports
  - `IdeAIPageTemplate`
  - `IdeaIButton`
  - `BrainIcon`, `CatIcon`, `MusicIcon`, `RocketIcon`
- ✅ Replaced: Simple header div (replaces `IdeAIPageTemplate`)
- ✅ Kept: All shadcn components (`@/components/ui/*`)
- ✅ Kept: All local components (demos, blocks, tools, themes)

## Why This Works

1. **No workspace dependencies**: v0 can install all packages via npm
2. **Standard packages only**: `next-themes`, `framer-motion`, shadcn components
3. **Local components**: All demo components work (they don't use `@repo/ui`)
4. **Env vars in config**: `next.config.mjs` makes env vars available to v0

## Files Structure

\`\`\`
apps/v0-000/
├── app/
│ ├── layout.tsx # ← Replace with layout-v0.tsx for v0
│ ├── layout-v0.tsx # V0-compatible (no @repo/ui)
│ ├── layout-monorepo.tsx # Original (with @repo/ui)
│ ├── page.tsx # ← Replace with page-v0.tsx for v0
│ ├── page-v0.tsx # V0-compatible (no @repo/ui)
│ └── page-monorepo.tsx # Original (with @repo/ui)
├── next.config.mjs # ✅ Already has env vars
└── V0-UPLOAD-GUIDE.md # This file
\`\`\`

## Automated Script (Optional)

Create a script to automate the swap:

\`\`\`bash
#!/bin/bash

# scripts/v0-000-prepare-for-v0.sh

cd apps/v0-000

# Backup originals

cp app/layout.tsx app/layout-monorepo.tsx
cp app/page.tsx app/page-monorepo.tsx

# Use v0 versions

cp app/layout-v0.tsx app/layout.tsx
cp app/page-v0.tsx app/page.tsx

echo "✅ v0-000 is ready for v0.dev upload!"
echo "📤 Upload apps/v0-000/ to v0.dev"
\`\`\`

---

**Remember**: Always restore the monorepo versions after testing in v0!
