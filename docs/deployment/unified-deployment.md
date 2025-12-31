---
title: Unified Deployment Guide
description: Complete guide for deploying all IdeaI monorepo apps with a single command
---

# Unified Deployment Guide

## Overview

The IdeaI monorepo uses a unified deployment script (`deploy.sh`) that deploys all apps to Vercel with a single command. This script handles the complexity of monorepo deployments and ensures consistent deployment across all apps.

## Quick Start

```bash
# Deploy all apps to production
./deploy.sh --prod

# Deploy specific apps to production
./deploy.sh --prod docs landing

# Deploy all apps (preview)
./deploy.sh
```

## How It Works

### Deployment Process

1. **Script runs from repo root**
2. **For each app:**
   - Creates temporary symlink: `.vercel` → `apps/{app}/.vercel`
   - Deploys from repo root (Vercel finds `.vercel` symlink)
   - Vercel uses Root Directory setting from dashboard (`apps/{app}`)
   - Root Directory is relative to repo root (no path duplication)
   - Removes symlink after deployment

### Why This Approach Works

- ✅ **Deploys from repo root** - Root Directory setting works correctly
- ✅ **No path duplication** - Root Directory is relative to repo root
- ✅ **Uses dashboard settings** - Respects Root Directory and build config
- ✅ **Handles multiple apps** - Each app deploys independently

## Vercel Dashboard Configuration

### Required Settings for Each App

1. **Root Directory**: `apps/{app-name}`
   - Example: `apps/web`, `apps/docs`, `apps/landing`
   - ⚠️ **Must be relative to repo root** (not absolute path)
   - ⚠️ **NOT**: `apps/web/apps/web` (would duplicate)

2. **Include files outside root directory**: ✅ Enabled
   - Required for accessing `packages/` directory
   - Allows workspace dependencies to resolve

3. **Framework**: Next.js (auto-detected)

4. **Build Command**: Auto-detected from `package.json`

5. **Install Command**: Auto-detected (pnpm)

## Current Deployments

| App | Project | Root Directory | Status |
|-----|---------|---------------|--------|
| web | `web` | `apps/web` | ✅ Deployed |
| docs | `docs` | `apps/docs` | ✅ Deployed |
| landing | `landing` | `apps/landing` | ✅ Deployed |
| all | `all` | `apps/all` | Ready |
| nocss | `nocss` | `apps/nocss` | Ready |
| mvp | `mvp` | `apps/mvp` | Ready |
| tailwind | `tailwind` | `apps/tailwind` | Ready |
| allcss | `allcss` | `apps/allcss` | Ready |

## Troubleshooting

### Error: "The provided path does not exist"

**Cause**: Root Directory duplication (e.g., `apps/web/apps/web`)

**Solution**:
1. Check Root Directory in Vercel dashboard
2. Should be: `apps/{app-name}` (relative to repo root)
3. NOT: `apps/{app-name}/apps/{app-name}`

### Error: "Cannot find module '@repo/ui'"

**Cause**: Files outside root directory not included

**Solution**:
1. Enable "Include files outside the root directory in the Build Step"
2. Verify Root Directory is set correctly

### Deployment Fails

**Check**:
1. `.vercel/project.json` exists in `apps/{app}/.vercel/`
2. Project is linked: `cd apps/{app} && vercel link`
3. Root Directory is set correctly in dashboard
4. "Include files outside root directory" is enabled

## Architecture

### Main Site with Sub-Apps

- **Main app** (`web`) at root: `myui.space/`
- **Sub-apps** at: `myui.space/apps/{name}`
- **Catch-all route**: `apps/web/app/apps/[app]/[[...path]]/page.tsx`

### Standalone Apps

Each app can also be deployed as a standalone Vercel project:
- Independent deployments
- Separate URLs
- Isolated failures

## Best Practices

1. ✅ Always deploy from repo root using `deploy.sh`
2. ✅ Set Root Directory to `apps/{app-name}` in dashboard
3. ✅ Enable "Include files outside root directory"
4. ✅ Test single app first: `./deploy.sh --prod web`
5. ✅ Verify deployment before deploying all apps

## Related Documentation

- [Deployment Architecture](../architecture/deployment-architecture.md)
- [Vercel Setup](./vercel-setup.md)
- [Robust Deployment](./robust-deployment.md)


