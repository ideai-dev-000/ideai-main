# Robust Deployment Strategy

## Problem: Path Confusion

Vercel can get confused about root directories when deploying from monorepos, especially when:
- Using `--cwd` flag
- Root Directory setting in dashboard doesn't match deployment context
- Paths get duplicated (e.g., `apps/web/apps/web`)

## Solution: Deploy from App Directory

### Current Approach

The deployment script now:
1. **Changes into the app directory** (`cd apps/$app`)
2. **Deploys from there** (`vercel deploy`)
3. **Vercel reads `.vercel/project.json`** which contains project info
4. **Vercel uses Root Directory from dashboard** (should be `apps/$app`)

### Why This Works

- ✅ No path confusion - we're in the app directory
- ✅ Vercel reads project config from `.vercel/project.json`
- ✅ Root Directory setting is relative to repo root (as set in dashboard)
- ✅ Clear separation - each app deploys independently

## Vercel Dashboard Settings

### For Each App

**Root Directory**: `apps/{app-name}`
- Example: `apps/web`, `apps/docs`, `apps/landing`
- ⚠️ **Must be relative to repo root**
- ⚠️ **NOT absolute**: `~/_IDEAI/ideai-main/apps/web`
- ⚠️ **NOT duplicated**: `apps/web/apps/web`

**Include files outside root directory**: ✅ Enabled
- Required for accessing `packages/` directory

## Deployment Flow

```
1. Script runs from repo root
2. For each app:
   a. cd into apps/$app
   b. vercel deploy (reads .vercel/project.json)
   c. Vercel uses Root Directory from dashboard
   d. cd back to repo root
3. Next app...
```

## Verification

Before deploying, verify:

```bash
# Check project is linked
cat apps/web/.vercel/project.json

# Should show:
# {"projectId":"...","orgId":"...","projectName":"web"}
```

## Troubleshooting

### Error: Path does not exist

**Check**:
1. Root Directory in dashboard is `apps/{app-name}` (not absolute)
2. `.vercel/project.json` exists in app directory
3. Project is linked correctly

### Error: Cannot find module '@repo/ui'

**Check**:
1. "Include files outside root directory" is enabled
2. `packages/` directory is accessible from app directory

### Error: Build command failed

**Check**:
1. `package.json` has correct build script
2. `vercel.json` has correct build command (if needed)
3. Dependencies are installed correctly

## Best Practices

1. ✅ Always deploy from app directory (not repo root with --cwd)
2. ✅ Use relative paths in Root Directory setting
3. ✅ Verify `.vercel/project.json` exists before deploying
4. ✅ Enable "Include files outside root directory" for all apps
5. ✅ Test deployment with single app first: `./deploy.sh --prod web`

