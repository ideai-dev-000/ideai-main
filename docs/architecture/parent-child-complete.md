---
title: Parent-Child App Architecture - Complete Guide
description: Complete guide to the parent/child app architecture with .ideai.json configuration
---

# Parent-Child App Architecture - Complete Guide

## Overview

Simple, powerful parent/child app architecture where:

- **Parent app** (`web`) serves at root: `myui.space/`
- **Child apps** embedded at: `myui.space/apps/{name}`
- **One unified app**: Same domain, same codebase
- **Easy configuration**: `.ideai.json` files (optional - defaults work)

## Quick Start

### 1. Defaults Work (No Config Needed)

\`\`\`bash

# Test defaults

node scripts/test-parent-child.js
\`\`\`

**Result**:

- ✅ `web` = parent (automatic)
- ✅ All others = children (automatic)
- ✅ URLs: `/apps/{name}`
- ✅ Ports: 3001-3009

### 2. Configuration (Optional)

Create `.ideai.json` in app directory:

**Parent** (`apps/web/.ideai.json`):
\`\`\`json
{
"role": "parent",
"name": "IdeaI",
"childApps": ["docs", "all", "nocss"]
}
\`\`\`

**Child** (`apps/docs/.ideai.json`):
\`\`\`json
{
"role": "child",
"name": "Documentation",
"parentApp": "web",
"localPort": 3001
}
\`\`\`

### 3. Build & Test

\`\`\`bash

# Check dependencies

pnpm --filter web build:check

# Build

pnpm --filter web build

# Track build

pnpm --filter web build:track

# Full verification

./scripts/verify-all.sh
\`\`\`

## Architecture

### How It Works

1. **Parent App** (`web`)
   - Serves at root: `/`
   - Has route: `/apps/[app]/[[...path]]`
   - Embeds child apps in iframe

2. **Child Apps**
   - Detected via `.ideai.json` or defaults
   - Served at: `/apps/{name}`
   - Load in iframe with header/footer hidden
   - Only `<main>` content shown

3. **Iframe Detection**
   - Child apps automatically detect iframe
   - Hide header/footer when embedded
   - Show only main content

### File Structure

\`\`\`
apps/
├── web/ # Parent app
│ ├── .ideai.json # Parent config (optional)
│ └── app/
│ └── apps/
│ └── [app]/
│ └── [[...path]]/
│ └── page.tsx # Child app router
├── docs/ # Child app
│ ├── .ideai.json # Child config (optional)
│ └── app/
│ └── page.tsx # Child app page
└── all/ # Child app
└── app/
└── page.tsx
\`\`\`

## Configuration System

### `.ideai.json` Format

**Parent App**:
\`\`\`json
{
"role": "parent",
"name": "IdeaI",
"description": "Main IdeaI application",
"childApps": ["docs", "all", "nocss"],
"build": {
"includeChildDependencies": true,
"verifyDependencies": true,
"securityCheck": true,
"trackBuilds": true
}
}
\`\`\`

**Child App**:
\`\`\`json
{
"role": "child",
"name": "Documentation",
"description": "IdeaI documentation site",
"parentApp": "web",
"localPort": 3001
}
\`\`\`

### Defaults (No Config Needed)

- `web` → **parent** (automatic)
- All other apps → **child** (automatic)
- Parent reference: `web` (automatic)
- Ports: 3001-3009 (automatic)

## Build System

### Dependency Management

**Check Dependencies**:
\`\`\`bash
pnpm --filter web build:check
\`\`\`

**Sync Dependencies** (auto-add missing):
\`\`\`bash

# Dry run first

pnpm --filter web build:sync --dry-run

# Actual sync

pnpm --filter web build:sync
pnpm install
\`\`\`

**Track Builds**:
\`\`\`bash
pnpm --filter web build:track
node scripts/ideai-build-track.mjs web report
\`\`\`

### Security (2026 Best Practices)

- ✅ **pnpm** (secure by default)
- ✅ **Lock file**: `pnpm-lock.yaml`
- ✅ **Workspace protocol**: Internal packages
- ✅ **Dependency verification**: Automatic
- ✅ **Build tracking**: Metadata stored

## URLs

### Parent App

- Root: `/`
- Apps index: `/index`

### Child Apps

- `/apps/docs` → Documentation
- `/apps/all` → All Components
- `/apps/nocss` → No CSS
- `/apps/mvp` → MVP.css
- `/apps/tailwind` → Tailwind CSS
- `/apps/allcss` → All CSS
- `/apps/bootstrap` → Bootstrap
- `/apps/unocss` → UnoCSS
- `/apps/shadcn` → Shadcn Components

## CSS Compatibility

### Current: Iframe Isolation

Each child app loads in iframe with its own CSS:

- ✅ Complete isolation
- ✅ No conflicts
- ✅ Each child can use different CSS frameworks

### Future: Unified Build

If moving to unified build (no iframes):

- Parent needs all child CSS libraries
- Use `build:sync` to auto-add dependencies
- CSS scoping required

## Verification

### Complete Verification

\`\`\`bash
./scripts/verify-all.sh
\`\`\`

**Checks**:

1. ✅ Defaults working
2. ✅ Dependencies tracked
3. ✅ TypeScript compiles
4. ✅ Linter passes
5. ✅ Build succeeds
6. ✅ Tracking active

### Manual Verification

\`\`\`bash

# 1. Test defaults

node scripts/test-parent-child.js

# 2. Check dependencies

pnpm --filter web build:check

# 3. TypeScript

pnpm --filter web check-types

# 4. Linter

pnpm --filter web lint

# 5. Build

pnpm --filter web build

# 6. Track

pnpm --filter web build:track
\`\`\`

## Switching App Roles

### Make App a Parent

1. Create `apps/my-app/.ideai.json`:
   \`\`\`json
   {
   "role": "parent",
   "name": "My Parent",
   "childApps": ["child1", "child2"]
   }
   \`\`\`

2. Update children to reference new parent

### Make App a Child

1. Create `apps/my-app/.ideai.json`:
   \`\`\`json
   {
   "role": "child",
   "name": "My Child",
   "parentApp": "web",
   "localPort": 3010
   }
   \`\`\`

2. Add to parent's `childApps` array

## Scripts Reference

### Test Scripts

- `scripts/test-parent-child.js` - Test defaults and configs
- `scripts/ideai-build-check.mjs` - Check dependencies
- `scripts/ideai-build-sync.mjs` - Sync dependencies
- `scripts/ideai-build-track.mjs` - Track builds
- `scripts/verify-all.sh` - Complete verification

### Package.json Scripts

\`\`\`json
{
"scripts": {
"build:check": "Check dependencies",
"build:sync": "Sync dependencies",
"build:track": "Track build"
}
}
\`\`\`

## Status

### ✅ Working

- Defaults system
- Configuration system
- Build system
- Dependency tracking
- Build tracking
- TypeScript compilation
- Linter
- Routing

### ⏳ Future

- Production unified build
- CSS compatibility (if moving away from iframes)
- Advanced build optimization

## Documentation

- [Configuration Guide](./ideai-config.md)
- [Build System](./ideai-build-system.md)
- [Verification Guide](./parent-child-verification.md)
- [Status](./parent-child-status.md)
- [CSS Compatibility](./parent-child-css.md)

## Key Points

1. **One Unified App**: Same domain, same codebase
2. **Easy Configuration**: `.ideai.json` files (optional)
3. **Defaults Work**: No config needed to start
4. **Secure**: 2026 best practices (pnpm, lock files)
5. **Tracked**: Build metadata for visibility
6. **Flexible**: Easy to switch parent/child roles


