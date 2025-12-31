# Deployment Status

## Current Deployments

### Main Web App
- **Vercel Project**: `web`
- **Root Directory**: `apps/web`
- **Production Domain**: `myui.space`
- **Status**: ✅ Deployed and working

### Standalone Apps
- **docs**: ✅ Deployed as standalone
- **landing**: ✅ Deployed as standalone
- **all, nocss, mvp, tailwind, allcss**: Ready for deployment

## Deployment Solution

### Unified Deployment Script

All apps deploy using `./deploy.sh --prod` from repo root.

**How it works:**
1. Creates temporary symlink: `.vercel` → `apps/{app}/.vercel`
2. Deploys from repo root
3. Vercel uses Root Directory from dashboard (`apps/{app}`)
4. Removes symlink after deployment

**Why this works:**
- Deploys from repo root (Root Directory is relative to repo root)
- No path duplication (avoids `apps/web/apps/web` issue)
- Respects Vercel dashboard settings

See [Unified Deployment Guide](../deployment/unified-deployment.md) for details.

## Architecture

### Main Site with Sub-Apps
- **Main app** (`web`) at root: `myui.space/`
- **Sub-apps** at: `myui.space/apps/{name}`
- **Catch-all route**: `apps/web/app/apps/[app]/[[...path]]/page.tsx`

### Standalone Apps
Each app can also be deployed independently as a separate Vercel project.

## Vercel Project Name in Header

All apps display their Vercel project name in the header with a clickable link.

**Environment Variable**: `NEXT_PUBLIC_VERCEL_PROJECT_NAME`
- Set in Vercel dashboard for each project
- Falls back to app name if not set

