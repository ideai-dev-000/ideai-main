---
title: Multi-App Deployment Strategy
description: Strategy for deploying multiple apps from a single monorepo to Vercel
---

# Multi-App Deployment Strategy

## Current Situation

### Original Setup
- **Project**: `ideai-main` (deploys `apps/web`)
- **Production URL**: https://www.myui.space
- **Root Directory**: `apps/web`
- **Status**: Original production site (unchanged)

### New Landing App
- **Project**: `landing` (deploys `apps/landing`)
- **Production URL**: https://landing-gules-tau.vercel.app
- **Root Directory**: `apps/landing`
- **Status**: New landing page with app showcase

## What Happened

### The Evolution
1. **Started**: Single project (`ideai-main`) deploying `apps/web` to `myui.space`
2. **Added**: New project (`landing`) deploying `apps/landing` to a new Vercel URL
3. **Result**: Two separate Vercel projects from the same monorepo

### Why This Approach is Good

#### Benefits of Separate Projects
1. **Independent Deployments**: Each app can deploy independently
2. **Separate Scaling**: Scale apps individually based on traffic
3. **Isolated Failures**: One app failure doesn't affect others
4. **Clear Separation**: Each app has its own domain/URL
5. **Git Integration**: Each project can track the same repo with different root directories
6. **Future-Proof**: Easy to add more apps

#### Current Architecture
```
Monorepo (ideai-main)
├── apps/web          → Vercel Project: ideai-main → myui.space
├── apps/docs         → (Not deployed yet)
├── apps/all          → (Not deployed yet)
├── apps/nocss        → (Not deployed yet)
├── apps/mvp          → (Not deployed yet)
├── apps/tailwind     → (Not deployed yet)
├── apps/allcss       → (Not deployed yet)
└── apps/landing      → Vercel Project: landing → landing-gules-tau.vercel.app
```

## The Challenge: Subfolder Routing

### Problem
- **Development**: Folder-based routing works (`/landing/web`, `/landing/docs`)
- **Production**: Subfolder routing doesn't work because:
  - Each app is a **separate Vercel project**
  - Each project has its own domain/URL
  - Folder-based routing requires a single project with rewrites

### Why Subfolders Don't Work in Production
When you have separate Vercel projects:
- Each project is deployed independently
- Each project has its own domain/URL
- There's no way to route `/web` from one project to another
- Folder-based routing only works within a single project

## Deployment Strategy Options

### Option 1: Separate Projects + Subdomains (Recommended)

**How it works:**
- Each app gets its own Vercel project
- Each app gets its own subdomain
- Landing page acts as hub, links to all apps

**URLs:**
- `www.myui.space` (existing - web app)
- `ideai.space` (landing page)
- `web.ideai.space` (web app - alternative)
- `docs.ideai.space` (docs app)
- `all.ideai.space` (all components app)
- `nocss.ideai.space` (no CSS app)
- `mvp.ideai.space` (MVP.css app)
- `tailwind.ideai.space` (Tailwind app)
- `allcss.ideai.space` (all CSS app)

**Pros:**
- ✅ Independent deployments
- ✅ Separate scaling
- ✅ Clean URLs
- ✅ Works with separate projects
- ✅ Future-proof

**Cons:**
- ❌ Requires DNS configuration
- ❌ More projects to manage

### Option 2: Single Project with Rewrites

**How it works:**
- One Vercel project handles all apps
- Rewrites route `/web` → `apps/web`, `/docs` → `apps/docs`, etc.

**URLs:**
- `ideai.space/web`
- `ideai.space/docs`
- `ideai.space/all`
- etc.

**Pros:**
- ✅ Folder-based routing works
- ✅ Single project to manage
- ✅ No DNS configuration needed

**Cons:**
- ❌ All apps deploy together
- ❌ Complex rewrite configuration
- ❌ Harder to scale independently
- ❌ One failure affects all

### Option 3: Hybrid Approach

**How it works:**
- Main landing at root domain (`ideai.space`)
- Other apps as separate projects with subdomains
- Landing page links to subdomain apps

**Pros:**
- ✅ Best of both worlds
- ✅ Landing page at root
- ✅ Apps independent

**Cons:**
- ❌ More setup
- ❌ Mixed routing approach

## Recommended Approach: Separate Projects + Subdomains

### Implementation Plan

1. **Keep existing projects:**
   - `ideai-main` → `www.myui.space` (unchanged)
   - `landing` → `ideai.space` (main domain)

2. **Create separate projects for each app:**
   - `docs` → `docs.ideai.space`
   - `all` → `all.ideai.space`
   - `nocss` → `nocss.ideai.space`
   - `mvp` → `mvp.ideai.space`
   - `tailwind` → `tailwind.ideai.space`
   - `allcss` → `allcss.ideai.space`

3. **Update landing page:**
   - Use subdomain URLs in production
   - Keep folder-based routing in development

4. **Configure DNS:**
   - Add CNAME records for all subdomains
   - Point to Vercel

## Git Integration

### How It Works
- **Same Repository**: All projects track `ideai-dev-000/ideai-main`
- **Different Root Directories**: Each project uses a different `apps/{name}` directory
- **Independent Deployments**: Changes to any app trigger that app's deployment
- **No Conflicts**: Each project only builds its own app

### Configuration Per Project
Each project in Vercel dashboard:
1. **Root Directory**: `apps/{app-name}`
2. **Include files outside root**: ✅ Enabled (required for monorepos)
3. **Build Command**: `pnpm --filter @repo/{app-name} build`
4. **Install Command**: `pnpm install`
5. **Framework**: Next.js (auto-detected)

## Configuration Files

### vercel.json per App (Optional)
Each app can have its own `vercel.json`:
```json
{
  "buildCommand": "pnpm --filter @repo/{app-name} build",
  "installCommand": "pnpm install",
  "framework": "nextjs"
}
```

### Dashboard Settings (Required for Each Project)
1. Root Directory: `apps/{app-name}`
2. ✅ Enable "Include files outside the root directory in the Build Step"
3. Install Command: `pnpm install`
4. Build Command: `pnpm --filter @repo/{app-name} build`

## Current Issues to Fix

1. **Subfolder routing in production**: Doesn't work with separate projects
   - **Status**: Known limitation
   - **Solution**: Use subdomains or update landing page to use correct URLs
   
2. **Landing page modal URLs**: Need to work in production
   - **Status**: Needs fix
   - **Solution**: Update routing config to use subdomains in production

3. **Multiple projects management**: Need clear documentation
   - **Status**: ✅ Addressed in this document
   - **Solution**: Keep Vercel Projects Registry updated

## Next Steps

See [Unified Deployment Guide](../deployment/unified-deployment.md) for complete deployment instructions.

## Related Documentation

- [Vercel Projects Registry](./vercel-projects-registry.md)
- [Vercel Configuration](../deployment/vercel.md)
