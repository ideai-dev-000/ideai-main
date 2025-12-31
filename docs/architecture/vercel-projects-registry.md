---
title: Vercel Projects Registry
description: Complete registry of all Vercel projects in the IdeaI monorepo
---

# Vercel Projects Registry

## Current Projects

### 1. web (Main Site - ideai-main)
- **Project Name**: `web` (was `ideai-main`)
- **Project ID**: `prj_rOeGwbNZwaO6sJ2J685Y3g9TV2cw`
- **Root Directory**: `apps/web`
- **Production URL**: https://www.myui.space
- **Status**: ✅ Active (main production site)
- **Git Integration**: Connected to `ideai-dev-000/ideai-main`
- **Purpose**: Main IdeaI web application
- **⚠️ Important**: Ensure Root Directory is `apps/web` and Ignored Build Step is configured

### 2. landing
- **Project Name**: `landing`
- **Project ID**: `prj_VIRwSW56SWqru373Mby3oB1XYOAz`
- **Root Directory**: `apps/landing`
- **Production URL**: https://landing-gules-tau.vercel.app
- **Status**: ✅ Active (standalone landing page)
- **Git Integration**: Connected to `ideai-dev-000/ideai-main`
- **Purpose**: Monorepo landing page with app showcase
- **⚠️ Important**: Ensure Root Directory is `apps/landing` and Ignored Build Step is configured

## What Happened

### Original Setup
- **Single Project**: `ideai-main` deployed `apps/web` to `myui.space`
- **One App**: Only the web app was deployed
- **Simple**: Single project, single app, single domain

### New Situation
- **Two Projects**: `ideai-main` (web) + `landing` (landing page)
- **Separate Deployments**: Each project deploys independently
- **Different URLs**: 
  - `ideai-main` → `myui.space` (unchanged)
  - `landing` → `landing-gules-tau.vercel.app` (new)

### Why This is Good
1. **Independent Deployments**: Each app can deploy separately
2. **Isolated Failures**: One app failure doesn't affect others
3. **Scalability**: Scale apps individually
4. **Git Integration**: Both projects can track the same repo with different root directories
5. **Future-Proof**: Easy to add more apps as separate projects

## The Challenge: Subfolder Routing

### Problem
- **Development**: Folder-based routing works (`/landing/web`, `/landing/docs`)
- **Production**: Subfolder routing doesn't work because:
  - Each app is a **separate Vercel project**
  - Each project has its own domain/URL
  - Folder-based routing requires a single project with rewrites

### Solution Options

#### Option 1: Subdomains (Recommended)
- Each app gets its own subdomain
- `web.ideai.space`, `docs.ideai.space`, `all.ideai.space`, etc.
- Landing page at root: `ideai.space`
- **Pros**: Clean URLs, independent deployments, works with separate projects
- **Cons**: Requires DNS configuration

#### Option 2: Single Project with Rewrites
- One Vercel project handles all apps
- Rewrites route `/web` → `apps/web`, `/docs` → `apps/docs`, etc.
- **Pros**: Folder-based routing works
- **Cons**: All apps deploy together, complex configuration, harder to scale

#### Option 3: Hybrid
- Landing page at root domain
- Other apps as separate projects with subdomains
- **Pros**: Best of both worlds
- **Cons**: More setup

## Recommended Approach: Subdomains

### Why Subdomains Work Best
1. **Separate Projects**: Each app is its own Vercel project
2. **Independent**: Deploy, scale, and fail independently
3. **Clean URLs**: `web.ideai.space` is cleaner than `ideai.space/web`
4. **Git Integration**: All projects can track the same repo
5. **Future-Proof**: Easy to add more apps

### Implementation Plan
1. Keep `ideai-main` → `www.myui.space` (existing)
2. Keep `landing` → `ideai.space` (main domain)
3. Create separate projects for each app:
   - `docs` → `docs.ideai.space`
   - `all` → `all.ideai.space`
   - `nocss` → `nocss.ideai.space`
   - `mvp` → `mvp.ideai.space`
   - `tailwind` → `tailwind.ideai.space`
   - `allcss` → `allcss.ideai.space`
4. Update landing page to use subdomain URLs in production
5. Configure DNS for all subdomains

## Git Integration

### How It Works
- **Same Repository**: All projects track `ideai-dev-000/ideai-main`
- **Different Root Directories**: Each project uses a different `apps/{name}` directory
- **Independent Deployments**: Changes to any app trigger that app's deployment
- **No Conflicts**: Each project only builds its own app

### Configuration
Each project in Vercel dashboard:
1. **Root Directory**: `apps/{app-name}`
2. **Include files outside root**: ✅ Enabled
3. **Build Command**: `pnpm --filter @repo/{app-name} build`
4. **Install Command**: `pnpm install`

## Adding New Apps

### Checklist
1. Create app in `apps/{name}`
2. Add to `turbo.json` build pipeline
3. Create Vercel project:
   - Name: `{name}`
   - Root Directory: `apps/{name}`
   - Enable "Include files outside root"
4. Connect Git repository
5. Add to landing page config
6. Configure DNS (if using subdomains)
7. Update this registry

## Project Configuration Template

```json
{
  "projectName": "{app-name}",
  "rootDirectory": "apps/{app-name}",
  "buildCommand": "pnpm --filter @repo/{app-name} build",
  "installCommand": "pnpm install",
  "framework": "nextjs",
  "includeFilesOutsideRoot": true
}
```

## Current Issues

1. **Subfolder routing in production**: Doesn't work with separate projects
   - **Status**: Known limitation
   - **Solution**: Use subdomains or update landing page URLs

2. **Landing page modal URLs**: Need to work in production
   - **Status**: Needs fix
   - **Solution**: Update routing config to use subdomains in production

3. **Multiple projects management**: Need clear documentation
   - **Status**: This document addresses this
   - **Solution**: Keep this registry updated

## Next Steps

See [Unified Deployment Guide](../deployment/unified-deployment.md) for deployment instructions.

