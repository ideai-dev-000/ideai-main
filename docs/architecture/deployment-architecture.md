---
title: Deployment Architecture
description: Complete deployment architecture for IdeaI monorepo - main site with sub-apps and standalone deployments
---

# Deployment Architecture

## Overview

The IdeaI monorepo supports **two deployment modes**:

1. **Main Site with Sub-Apps** - Single main site serving sub-apps at `/apps/{name}`
2. **Standalone Apps** - Each app deployed independently as its own Vercel project

Both modes can coexist, allowing flexibility in deployment strategy.

## Architecture

### Main Site (Web App)

**Location**: `apps/web`  
**Production URL**: `myui.space`  
**Purpose**: Main IdeaI application served at root domain

**Sub-App Routing**:
- Catch-all route at `/apps/[app]/[[...path]]`
- Serves sub-apps at `myui.space/apps/{name}`
- Can redirect to standalone URLs or serve directly

### Sub-Apps

Sub-apps can be accessed via:
- **Main site**: `myui.space/apps/{name}` (via catch-all route)
- **Standalone**: Each app has its own Vercel project and URL

**Available Sub-Apps**:
- `docs` - Documentation site
- `landing` - App showcase/landing page
- `all` - Component showcase
- `nocss` - No CSS demo
- `mvp` - MVP.css demo
- `tailwind` - Tailwind CSS demo
- `allcss` - All CSS demo

## Deployment Modes

### Mode 1: Main Site with Sub-Apps (Recommended for Production)

**How it works**:
- Main app (`web`) deployed to `myui.space`
- Catch-all route handles `/apps/{name}` requests
- Sub-apps can be:
  - Served directly (if built into main app)
  - Redirected to standalone URLs (if deployed separately)

**Benefits**:
- ✅ Single domain for all apps
- ✅ Clean URLs (`myui.space/apps/docs`)
- ✅ Shared codebase, no duplication
- ✅ Single deployment for main site

**Configuration**:
- Set environment variables in main app:
  - `NEXT_PUBLIC_DOCS_URL` - Standalone docs URL (optional)
  - `NEXT_PUBLIC_LANDING_URL` - Standalone landing URL (optional)
  - etc.

### Mode 2: Standalone Apps

**How it works**:
- Each app is a separate Vercel project
- Each app has its own URL
- Apps can be deployed independently

**Benefits**:
- ✅ Independent deployments
- ✅ Separate scaling
- ✅ Isolated failures
- ✅ Different domains/subdomains

**Configuration**:
- Each app has its own `vercel.json`
- Each app has its own Vercel project
- Root Directory set in Vercel dashboard

## Unified Deployment

### Single Command Deployment

Use the unified deployment script to deploy all apps:

```bash
# Deploy all apps (preview)
./deploy.sh

# Deploy all apps (production)
./deploy.sh --prod

# Deploy specific apps (production)
./deploy.sh --prod docs landing
```

### Manual Deployment

Deploy individual apps:

```bash
# From app directory
cd apps/docs
vercel deploy --prod --yes

# Or from root
vercel deploy --prod --yes --cwd apps/docs
```

## Current Deployment Status

### Main Site
- **Project**: `web` (was `ideai-main`)
- **URL**: `myui.space`
- **Status**: ✅ Deployed
- **Sub-App Routing**: ✅ Configured

### Standalone Apps

#### Docs
- **Project**: `docs`
- **URL**: `docs-*.vercel.app` (or custom domain)
- **Status**: ✅ Deployed as standalone
- **Root Directory**: `apps/docs`

#### Landing
- **Project**: `landing`
- **URL**: `landing-*.vercel.app` (or custom domain)
- **Status**: ✅ Deployed as standalone
- **Root Directory**: `apps/landing`

## Configuration

### Environment Variables

#### Main App (Web)
```env
# Optional: Standalone app URLs for redirects
NEXT_PUBLIC_DOCS_URL=https://docs-xxx.vercel.app
NEXT_PUBLIC_LANDING_URL=https://landing-xxx.vercel.app
NEXT_PUBLIC_ALL_URL=https://all-xxx.vercel.app
# ... etc
```

#### Standalone Apps
```env
# Vercel project name (shown in header)
NEXT_PUBLIC_VERCEL_PROJECT_NAME=docs
NEXT_PUBLIC_VERCEL_ORG_ID=idea-i
```

### Vercel Configuration

Each app has a `vercel.json`:
```json
{}
```

Most settings are auto-detected. Configure in Vercel dashboard:
- **Root Directory**: `apps/{app-name}`
- **Framework**: Next.js (auto-detected)
- **Build Command**: Auto-detected from `package.json`
- **Install Command**: Auto-detected (pnpm)

## Best Practices

### Code Sharing
- ✅ All apps share `@repo/ui` package
- ✅ No code duplication
- ✅ Shared components and styles
- ✅ Centralized CSS architecture

### Deployment Strategy
1. **Development**: All apps run locally on different ports
2. **Preview**: Deploy all apps for testing
3. **Production**: 
   - Main app always deployed
   - Sub-apps can be standalone or served via main app

### URL Strategy
- **Main app**: Always at root (`myui.space`)
- **Sub-apps**: 
  - Via main: `myui.space/apps/{name}`
  - Standalone: `{app}-xxx.vercel.app` or custom domain

## Future Enhancements

1. **Dynamic Sub-App Loading**: Load sub-apps dynamically via iframe or module federation
2. **Single Build**: Build all apps into main app for true single deployment
3. **Subdomain Routing**: Support `docs.myui.space` style routing
4. **Auto-Discovery**: Automatically discover deployed apps at runtime

## Troubleshooting

### Sub-App Not Loading
- Check catch-all route exists: `apps/web/app/apps/[app]/[[...path]]/page.tsx`
- Verify environment variables are set
- Check standalone URL is correct

### Deployment Fails
- Verify Root Directory in Vercel dashboard
- Check `vercel.json` is valid JSON
- Ensure `package.json` has correct build scripts

### Code Duplication
- All apps use `@repo/ui` - no duplication
- Shared code in `packages/` directory
- CSS centralized in `packages/ui/src/styles/`


