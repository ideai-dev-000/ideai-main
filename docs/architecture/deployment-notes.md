# Deployment Notes

## Current Deployment Status

### Original Project (`ideai-main` → `web`)
- **Vercel Project**: `web` (was `ideai-main`)
- **Root Directory**: `apps/web`
- **Production Domain**: `myui.space` (needs verification)
- **Status**: ⚠️ May need domain reassignment

### Landing Project
- **Vercel Project**: `landing`
- **Root Directory**: `apps/landing`
- **Production URL**: `landing-gules-tau.vercel.app`
- **Desired Domain**: `myui.space` (root)
- **Status**: ✅ Deployed

## Folder-Based Routing Strategy

### Current Setup
- **Landing**: Root domain (`myui.space`)
- **Other Apps**: `/apps/{name}` (e.g., `/apps/web`, `/apps/docs`)

### Important Limitation
⚠️ **Folder-based routing in production requires ONE of the following:

1. **Single Vercel Project with Rewrites** (Recommended for folder routing)
   - All apps served from one project
   - Next.js rewrites proxy to different apps
   - Requires all apps to be built together

2. **Separate Projects with Custom Domain Setup**
   - Each app is a separate Vercel project
   - Requires DNS configuration for subdomains or paths
   - More complex but allows independent deployments

### Current Approach
We're using **separate Vercel projects** but want **folder-based routing**. This requires:
- Either: Configure DNS/rewrites to route `/apps/{name}` to separate projects
- Or: Switch to a single project with rewrites

## Vercel Project Name in Header

All apps now display their Vercel project name in the header with a clickable link to the Vercel dashboard.

**Environment Variable**: `NEXT_PUBLIC_VERCEL_PROJECT_NAME`
- Set in Vercel dashboard for each project
- Falls back to app name if not set
- Link format: `https://vercel.com/{orgId}/{projectName}`

## Next Steps

1. ✅ Add Vercel project name to header (completed)
2. ✅ Update routing to `/apps/{name}` paths (completed)
3. ⚠️ Fix `ideai-main` project deployment to `myui.space`
4. ⚠️ Configure landing app to use `myui.space` domain
5. ⚠️ Set up folder-based routing in production (requires DNS or single project)

