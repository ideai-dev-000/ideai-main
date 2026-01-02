---
title: Final Phased Deployment Plan
description: Complete phased plan for deploying IdeaI monorepo to production with all deployment strategies
---

# Final Phased Deployment Plan

This document outlines the complete phased plan for deploying the IdeaI monorepo to production, testing all deployment strategies, and achieving full multitenant Vercel setup.

## Overview

**Goal**: Deploy all apps to `myui.space` with full flexibility to serve apps directly or as standalone deployments, with subdomain support and multitenant configuration.

## Phase 1: Main App Deployment (Integrated Mode)

### Objective
Deploy main web app to preview and production, ensuring `/index` works and all apps are visible on one domain.

### Tasks
- [ ] Deploy `apps/web` to Vercel preview
- [ ] Verify `/index` page shows all apps
- [ ] Test `/apps/{name}` routes work with smart routing
- [ ] Deploy `apps/web` to production (`myui.space`)
- [ ] Verify production `/index` works
- [ ] Test all `/apps/{name}` routes in production

### Expected Result
- ✅ `preview-xxx.vercel.app/index` shows all apps
- ✅ `preview-xxx.vercel.app/apps/{name}` serves apps via iframe
- ✅ `myui.space/index` shows all apps
- ✅ `myui.space/apps/{name}` serves apps via iframe

### Configuration
- No environment variables needed (integrated mode default)
- All apps served directly via iframe

## Phase 2: Standalone App Deployment

### Objective
Deploy one app (docs) as a standalone Vercel project to test standalone mode.

### Tasks
- [ ] Create Vercel project for `apps/docs`
- [ ] Configure Root Directory: `apps/docs`
- [ ] Enable "Include files outside root"
- [ ] Deploy `apps/docs` to preview
- [ ] Deploy `apps/docs` to production
- [ ] Set `NEXT_PUBLIC_DOCS_URL` in main web app
- [ ] Test redirect from `myui.space/apps/docs` → standalone URL

### Expected Result
- ✅ `docs-xxx.vercel.app` works standalone
- ✅ `myui.space/apps/docs` redirects to standalone URL
- ✅ Hybrid mode working (docs standalone, others integrated)

### Configuration
```bash
# In main web app Vercel environment variables:
NEXT_PUBLIC_DOCS_URL=https://docs-xxx.vercel.app
```

## Phase 3: Subdomain Configuration

### Objective
Configure subdomain for standalone app (docs.myui.space).

### Tasks
- [ ] Add DNS record: `docs` → CNAME to Vercel
- [ ] Configure custom domain in Vercel for docs project
- [ ] Update `NEXT_PUBLIC_DOCS_URL` to `https://docs.myui.space`
- [ ] Test subdomain works
- [ ] Test redirect from `myui.space/apps/docs` → `docs.myui.space`

### Expected Result
- ✅ `docs.myui.space` works
- ✅ `myui.space/apps/docs` redirects to `docs.myui.space`
- ✅ Clean subdomain URLs

### Configuration
```bash
# DNS: docs.myui.space → CNAME to Vercel
# Vercel: Add custom domain to docs project
# Environment variable:
NEXT_PUBLIC_DOCS_URL=https://docs.myui.space
```

## Phase 4: Multitenant Vercel Setup

### Objective
Set up full multitenant configuration with multiple standalone apps and subdomains.

### Tasks
- [ ] Create Vercel projects for all apps (docs, all, nocss, mvp, tailwind, allcss, bootstrap, unocss, shadcn)
- [ ] Configure Root Directory for each project
- [ ] Enable "Include files outside root" for each
- [ ] Deploy all apps to preview
- [ ] Deploy all apps to production
- [ ] Configure subdomains for key apps:
  - `docs.myui.space`
  - `all.myui.space`
  - `shadcn.myui.space`
- [ ] Set environment variables in main web app for all standalone apps
- [ ] Test hybrid mode: some apps standalone, some integrated

### Expected Result
- ✅ All apps can be standalone or integrated
- ✅ Subdomains work for key apps
- ✅ Main app redirects to standalone URLs when configured
- ✅ Main app serves directly when not configured
- ✅ Full flexibility per app

### Configuration
```bash
# In main web app Vercel environment variables:
NEXT_PUBLIC_DOCS_URL=https://docs.myui.space
NEXT_PUBLIC_ALL_URL=https://all.myui.space
NEXT_PUBLIC_SHADCN_URL=https://shadcn.myui.space
# ... etc (only set for apps you want standalone)
```

## Phase 5: Documentation and Cleanup

### Objective
Review, consolidate, and clean up all documentation and legacy files.

### Tasks
- [ ] Review all deployment docs for accuracy
- [ ] Remove references to deleted `landing` app
- [ ] Consolidate duplicate documentation
- [ ] Update all cross-references
- [ ] Remove legacy files
- [ ] Verify all links work
- [ ] Update deployment status

### Expected Result
- ✅ All docs accurate and current
- ✅ No legacy references
- ✅ Clean documentation structure
- ✅ All links working

## Deployment Commands

### Phase 1: Main App
```bash
# Preview
./deploy.sh web

# Production
./deploy.sh --prod web
```

### Phase 2: Standalone App
```bash
# Create Vercel project (first time)
cd apps/docs
vercel link

# Deploy
./deploy.sh docs
./deploy.sh --prod docs
```

### Phase 4: All Apps
```bash
# Deploy all apps
./deploy.sh --prod
```

## Verification Checklist

### Phase 1
- [ ] `/index` shows all apps on preview
- [ ] `/index` shows all apps on production
- [ ] `/apps/{name}` routes work on preview
- [ ] `/apps/{name}` routes work on production
- [ ] Apps load via iframe correctly

### Phase 2
- [ ] Standalone docs app works
- [ ] Redirect from main app works
- [ ] Hybrid mode functioning

### Phase 3
- [ ] Subdomain resolves
- [ ] SSL certificate active
- [ ] Redirect works

### Phase 4
- [ ] All apps can be standalone
- [ ] All subdomains work
- [ ] Hybrid mode fully functional
- [ ] Environment variables correct

### Phase 5
- [ ] All docs reviewed
- [ ] No legacy references
- [ ] All links work
- [ ] Documentation complete

## Current Status

- ✅ Smart routing implemented
- ✅ Deployment strategies documented
- ✅ Deployment phases documented
- ⏳ Phase 1: Main app deployment (in progress)
- ⏳ Phase 2: Standalone app (pending)
- ⏳ Phase 3: Subdomain (pending)
- ⏳ Phase 4: Multitenant (pending)
- ⏳ Phase 5: Documentation cleanup (pending)

## Next Steps

1. **Deploy main app to preview** - Test `/index` and `/apps/{name}` routes
2. **Deploy main app to production** - Verify on `myui.space`
3. **Deploy docs as standalone** - Test hybrid mode
4. **Configure subdomain** - Test `docs.myui.space`
5. **Scale to all apps** - Full multitenant setup
6. **Clean up docs** - Final polish

## Related Documentation

- [Deployment Strategies](./deployment-strategies.md) - All deployment modes
- [Deployment Phases](./deployment-phases.md) - Phased approach
- [Unified Deployment](./unified-deployment.md) - Deployment commands
- [Vercel Setup](./vercel.md) - Vercel configuration

