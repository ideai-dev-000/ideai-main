# Vercel Setup for IdeaI Monorepo

## Required Dashboard Settings

For each app deployed as a standalone project, configure in Vercel dashboard:

### General Settings

1. **Root Directory**: `apps/{app-name}`
   - Example: `apps/docs`, `apps/landing`
   - ⚠️ **CRITICAL**: Must be set correctly or deployment will fail

2. **Framework Preset**: Next.js (auto-detected)

3. **Build Command**: Auto-detected from `package.json`
   - Should be: `pnpm build` or `next build`

4. **Install Command**: Auto-detected
   - Should be: `pnpm install`

5. **Output Directory**: `.next` (Next.js default)

### Advanced Settings

1. **Include files outside the root directory in the Build Step**: ✅ Enable
   - Required for monorepo setup
   - Allows access to `packages/` and other shared code

2. **Environment Variables**: Set as needed
   - `NEXT_PUBLIC_VERCEL_PROJECT_NAME` - Project name (shown in header)
   - `NEXT_PUBLIC_VERCEL_ORG_ID` - Organization ID (default: `idea-i`)

## Project-Specific Setup

### Docs App

**Project**: `docs`  
**Root Directory**: `apps/docs`  
**Production URL**: `docs-*.vercel.app`

**Required Settings**:
- ✅ Root Directory: `apps/docs`
- ✅ Include files outside root: Enabled
- ✅ Install Command: `pnpm install`
- ✅ Build Command: `pnpm build`

### Landing App

**Project**: `landing`  
**Root Directory**: `apps/landing`  
**Production URL**: `landing-*.vercel.app`

**Required Settings**:
- ✅ Root Directory: `apps/landing`
- ✅ Include files outside root: Enabled
- ✅ Install Command: `pnpm install`
- ✅ Build Command: `pnpm build`

### Web App (Main Site)

**Project**: `web` (was `ideai-main`)  
**Root Directory**: `apps/web`  
**Production URL**: `myui.space`

**Required Settings**:
- ✅ Root Directory: `apps/web`
- ✅ Include files outside root: Enabled
- ✅ Install Command: `pnpm install`
- ✅ Build Command: `pnpm build`

## Troubleshooting

### Error: "npm install" exited with 1

**Cause**: Vercel is using npm instead of pnpm

**Fix**: 
1. Set `installCommand` in `vercel.json`:
   ```json
   {
     "installCommand": "pnpm install"
   }
   ```
2. Or set in Vercel dashboard: Settings → General → Install Command

### Error: Path does not exist

**Cause**: Root Directory is set incorrectly in Vercel dashboard

**Fix**:
1. Go to Vercel dashboard → Project Settings → General
2. Set Root Directory to: `apps/{app-name}` (e.g., `apps/docs`)
3. ⚠️ Do NOT include the full path or `~/_IDEAI/ideai-main/`
4. Just the relative path from repo root: `apps/docs`

### Error: Cannot find module '@repo/ui'

**Cause**: Files outside root directory not included

**Fix**:
1. Go to Vercel dashboard → Project Settings → General
2. Enable: "Include files outside the root directory in the Build Step"
3. This allows access to `packages/` directory

## Verification

After setup, verify deployment:

```bash
# Check project is linked
cd apps/{app-name}
cat .vercel/project.json

# Test deployment (preview)
vercel deploy

# Production deployment
vercel deploy --prod
```

## Quick Reference

| App | Root Directory | Project Name | Status |
|-----|---------------|--------------|--------|
| web | `apps/web` | `web` | ✅ Deployed |
| docs | `apps/docs` | `docs` | ✅ Deployed |
| landing | `apps/landing` | `landing` | ✅ Deployed |

