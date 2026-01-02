---
title: Deployment Next Steps
description: Current deployment status and next steps for IdeaI monorepo
---

# Deployment Next Steps

**Last Updated**: January 1, 2026  
**Status**: Deployment blocked - Vercel configuration needed

## Current Situation

### What We've Done ✅

1. **Smart Routing System**
   - ✅ Implemented smart catch-all route at `apps/web/app/apps/[app]/[[...path]]/page.tsx`
   - ✅ Three-tier routing: redirect → iframe → info page
   - ✅ Automatic detection of local apps in development
   - ✅ Environment variable support for standalone deployments

2. **Documentation**
   - ✅ Created `docs/deployment/deployment-strategies.md` - Complete strategy guide
   - ✅ Created `docs/deployment/deployment-phases.md` - Phased approach
   - ✅ Created `docs/deployment/FINAL-PHASED-PLAN.md` - Complete 5-phase plan
   - ✅ Updated `docs/architecture/deployment-architecture.md` with references

3. **Legacy Cleanup**
   - ✅ Removed references to deleted `landing` app from docs
   - ✅ Updated `deploy.sh` to include `bootstrap` (removed `landing`)
   - ✅ Updated all documentation files

4. **Configuration**
   - ✅ Created `apps/web/vercel.json` with install/build commands
   - ✅ Updated `pnpm-lock.yaml` (committed)
   - ✅ Web app is linked to Vercel project

### Current Blocker ❌

**Deployment is failing** because Vercel install command fails.

**Error**: `Command "pnpm install" exited with 1`

**Root Cause**: Vercel dashboard setting "Include files outside the root directory in the Build Step" is likely **NOT ENABLED**.

## Required Vercel Dashboard Fix

### Step 1: Check Dashboard Settings

Go to: https://vercel.com/idea-i/web/settings/general

### Step 2: Verify These Settings

1. **Root Directory**: `apps/web` ✅ (should be set)
2. **Include files outside the root directory in the Build Step**: ⚠️ **MUST BE ENABLED**
   - This is **CRITICAL** for monorepo deployments
   - Without this, Vercel can't access:
     - Root `package.json` and `pnpm-workspace.yaml`
     - `packages/` directory (for `@repo/ui` workspace packages)
     - Root-level dependencies

3. **Install Command**: `pnpm install` (or auto-detected)
4. **Build Command**: `pnpm build` (or auto-detected)

### Step 3: Enable Setting

1. Scroll to "Build & Development Settings"
2. Find "Include files outside the root directory in the Build Step"
3. **Enable the checkbox** ✅
4. **Save changes**

### Step 4: Retry Deployment

```bash
./deploy.sh web
```

## Next Steps (After Fix)

### Phase 1: Main App Deployment (Current)

**Goal**: Deploy main web app to preview and production

**Tasks**:
1. ✅ Fix Vercel dashboard setting (blocked - waiting for user)
2. ⏳ Deploy `apps/web` to Vercel preview
3. ⏳ Verify `/index` page shows all apps
4. ⏳ Test `/apps/{name}` routes work with smart routing
5. ⏳ Deploy `apps/web` to production (`myui.space`)
6. ⏳ Verify production `/index` works
7. ⏳ Test all `/apps/{name}` routes in production

**Expected Result**:
- ✅ `preview-xxx.vercel.app/index` shows all apps
- ✅ `preview-xxx.vercel.app/apps/{name}` serves apps via iframe
- ✅ `myui.space/index` shows all apps
- ✅ `myui.space/apps/{name}` serves apps via iframe

### Phase 2: Standalone App Deployment

**Goal**: Deploy one app (docs) as standalone Vercel project

**Tasks**:
1. Create Vercel project for `apps/docs`
2. Configure Root Directory: `apps/docs`
3. Enable "Include files outside root"
4. Deploy `apps/docs` to preview
5. Deploy `apps/docs` to production
6. Set `NEXT_PUBLIC_DOCS_URL` in main web app
7. Test redirect from `myui.space/apps/docs` → standalone URL

### Phase 3: Subdomain Configuration

**Goal**: Configure subdomain for standalone app

**Tasks**:
1. Add DNS record: `docs` → CNAME to Vercel
2. Configure custom domain in Vercel for docs project
3. Update `NEXT_PUBLIC_DOCS_URL` to `https://docs.myui.space`
4. Test subdomain works
5. Test redirect from `myui.space/apps/docs` → `docs.myui.space`

### Phase 4: Multitenant Vercel Setup

**Goal**: Full multitenant configuration

**Tasks**:
1. Create Vercel projects for all apps
2. Configure Root Directory for each
3. Enable "Include files outside root" for each
4. Deploy all apps to preview
5. Deploy all apps to production
6. Configure subdomains for key apps
7. Set environment variables in main web app
8. Test hybrid mode

### Phase 5: Documentation and Cleanup

**Goal**: Final documentation polish

**Tasks**:
1. ✅ Review all deployment docs (mostly done)
2. ✅ Remove references to deleted `landing` app (done)
3. ⏳ Consolidate any remaining duplicates
4. ⏳ Update all cross-references
5. ⏳ Remove any remaining legacy files
6. ⏳ Verify all links work
7. ⏳ Update deployment status

## Current Configuration

### `apps/web/vercel.json`
```json
{
  "installCommand": "pnpm install",
  "buildCommand": "pnpm build"
}
```

This configuration should work once "Include files outside root directory" is enabled.

### Deployment Command
```bash
# Preview
./deploy.sh web

# Production
./deploy.sh --prod web
```

## Troubleshooting

### If deployment still fails after enabling setting:

1. **Check build logs**:
   - Go to: https://vercel.com/idea-i/web
   - Click on failed deployment
   - Check "Build Logs" tab

2. **Verify lockfile is committed**:
   ```bash
   git status pnpm-lock.yaml
   ```

3. **Test install locally**:
   ```bash
   cd apps/web
   cd ../..
   pnpm install
   ```

4. **Check Vercel project settings**:
   - Root Directory: `apps/web` (relative to repo root)
   - Include files outside root: ✅ Enabled
   - Framework: Next.js (auto-detected)

## Related Documentation

- [Deployment Strategies](./deployment-strategies.md) - All deployment modes
- [Deployment Phases](./deployment-phases.md) - Phased approach
- [Final Phased Plan](./FINAL-PHASED-PLAN.md) - Complete 5-phase plan
- [Unified Deployment](./unified-deployment.md) - Deployment commands
- [Vercel Setup](./vercel.md) - Vercel configuration

## Notes

- All 10 apps are configured in `deploy.sh` (web, docs, all, nocss, mvp, tailwind, allcss, bootstrap, unocss, shadcn)
- Smart routing is implemented and ready
- Documentation is mostly complete
- Only blocker is Vercel dashboard setting

