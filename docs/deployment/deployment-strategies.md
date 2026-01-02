---
title: Deployment Strategies
description: Complete guide to all deployment strategies for IdeaI monorepo apps
---

# Deployment Strategies

This document outlines all possible deployment strategies for IdeaI monorepo apps, from integrated serving to standalone deployments.

## Overview

The IdeaI monorepo supports **three main deployment strategies**:

1. **Integrated Mode** - Apps served directly via main web app
2. **Standalone Mode** - Each app deployed as separate Vercel project
3. **Hybrid Mode** - Mix of integrated and standalone deployments

All strategies can coexist, allowing maximum flexibility.

## Strategy 1: Integrated Mode (Default)

### How It Works

- Main web app (`apps/web`) serves all sub-apps at `/apps/{name}`
- Apps are embedded via iframe when available
- Single deployment, single domain
- Apps can be built into main app or served from same origin

### Configuration

**No environment variables needed** - this is the default behavior.

### URLs

- Main app: `myui.space/`
- Apps index: `myui.space/index`
- Sub-apps: `myui.space/apps/{name}`
  - Example: `myui.space/apps/docs`
  - Example: `myui.space/apps/all`

### Pros

- ✅ Single deployment
- ✅ Single domain
- ✅ Clean URLs
- ✅ Easy to manage
- ✅ No DNS configuration needed
- ✅ Shared codebase

### Cons

- ❌ All apps deploy together
- ❌ Can't scale apps independently
- ❌ One failure affects all

### When to Use

- Small to medium projects
- Apps are tightly coupled
- Want single domain
- Don't need independent scaling

### Implementation

The catch-all route at `apps/web/app/apps/[app]/[[...path]]/page.tsx` automatically serves apps via iframe when:
- App exists in monorepo
- No standalone URL is configured
- App is available (running in dev or built in production)

## Strategy 2: Standalone Mode

### How It Works

- Each app is a separate Vercel project
- Each app has its own URL
- Main web app redirects to standalone URLs
- Apps deploy independently

### Configuration

Set environment variables in the main web app:

```bash
NEXT_PUBLIC_DOCS_URL=https://docs-xxx.vercel.app
NEXT_PUBLIC_ALL_URL=https://all-xxx.vercel.app
NEXT_PUBLIC_NOCSS_URL=https://nocss-xxx.vercel.app
# ... etc
```

### URLs

- Main app: `myui.space/`
- Standalone apps:
  - `docs-xxx.vercel.app` (or custom domain)
  - `all-xxx.vercel.app
  - ... etc

### Vercel Setup

For each app:

1. **Create Vercel Project**
   - Project Name: `{app-name}`
   - Root Directory: `apps/{app-name}`
   - Include files outside root: ✅ Enabled

2. **Deploy**
   - Can deploy independently
   - Each has own preview/production URLs

3. **Set Environment Variables**
   - In main web app, set `NEXT_PUBLIC_{APP}_URL`

### Pros

- ✅ Independent deployments
- ✅ Independent scaling
- ✅ Isolated failures
- ✅ Can use custom domains
- ✅ Future-proof

### Cons

- ❌ More projects to manage
- ❌ Requires DNS for custom domains
- ❌ More complex setup
- ❌ Multiple deployments

### When to Use

- Large projects
- Apps need independent scaling
- Apps have different requirements
- Want custom domains per app
- Apps are loosely coupled

### Implementation

When `NEXT_PUBLIC_{APP}_URL` is set and `NODE_ENV === "production"`, the catch-all route redirects to the standalone URL.

## Strategy 3: Hybrid Mode (Recommended)

### How It Works

- Mix of integrated and standalone deployments
- Some apps served directly, others standalone
- Smart routing: serves directly if available, redirects if standalone URL set
- Best of both worlds

### Configuration

Set environment variables **only for apps you want standalone**:

```bash
# Only docs and all are standalone
NEXT_PUBLIC_DOCS_URL=https://docs-xxx.vercel.app
NEXT_PUBLIC_ALL_URL=https://all-xxx.vercel.app

# Other apps (nocss, mvp, etc.) are served directly
# No env vars needed - they'll be served via iframe
```

### URLs

- Main app: `myui.space/`
- Standalone apps: `{app}-xxx.vercel.app`
- Integrated apps: `myui.space/apps/{name}`

### Pros

- ✅ Flexible - choose per app
- ✅ Can migrate apps gradually
- ✅ Best of both strategies
- ✅ Optimize per app needs

### Cons

- ❌ More complex configuration
- ❌ Need to track which apps are which

### When to Use

- Different apps have different needs
- Migrating from integrated to standalone
- Want flexibility
- Production apps standalone, dev apps integrated

### Implementation

The catch-all route is smart:
1. If `NEXT_PUBLIC_{APP}_URL` is set → redirect to standalone
2. If app exists locally → serve via iframe
3. Otherwise → show info page

## Routing Logic

The catch-all route (`apps/web/app/apps/[app]/[[...path]]/page.tsx`) uses this logic:

```typescript
// Priority 1: Redirect to standalone (if configured and production)
if (standaloneUrl && NODE_ENV === "production") {
  redirect(standaloneUrl);
}

// Priority 2: Serve directly via iframe (if available)
if (appAvailable || !standaloneUrl) {
  serveViaIframe(appUrl);
}

// Priority 3: Show info page (fallback)
showInfoPage();
```

## Deployment Phases

### Phase 1: Development (All Integrated)

**Setup**: No environment variables

**Behavior**:
- All apps served via iframe from local dev servers
- Main app at `localhost:3000`
- Sub-apps at `localhost:3000/apps/{name}`

**Use Case**: Local development

### Phase 2: Preview (Hybrid)

**Setup**: Set standalone URLs for critical apps

**Behavior**:
- Critical apps (docs, all) → standalone deployments
- Other apps → served directly
- Main app shows all apps at `/index`

**Use Case**: Testing deployment strategies

### Phase 3: Production (Hybrid or Standalone)

**Setup**: Choose strategy per app

**Options**:
- **Option A**: All integrated (no env vars)
- **Option B**: All standalone (all env vars set)
- **Option C**: Hybrid (some env vars set)

**Use Case**: Production deployment

## Migration Path

### From Integrated to Standalone

1. **Deploy app as standalone** (create Vercel project)
2. **Set environment variable** in main app: `NEXT_PUBLIC_{APP}_URL`
3. **Deploy main app** - it will now redirect
4. **Test** - verify redirect works
5. **Repeat** for other apps as needed

### From Standalone to Integrated

1. **Remove environment variable** from main app
2. **Ensure app exists** in monorepo
3. **Deploy main app** - it will now serve directly
4. **Test** - verify iframe works
5. **Optional**: Delete standalone Vercel project

## Environment Variables Reference

### Main Web App (`apps/web`)

Set these in Vercel dashboard or `.env.local`:

```bash
# Standalone app URLs (optional - only set if deploying standalone)
NEXT_PUBLIC_DOCS_URL=https://docs-xxx.vercel.app
NEXT_PUBLIC_ALL_URL=https://all-xxx.vercel.app
NEXT_PUBLIC_NOCSS_URL=https://nocss-xxx.vercel.app
NEXT_PUBLIC_MVP_URL=https://mvp-xxx.vercel.app
NEXT_PUBLIC_TAILWIND_URL=https://tailwind-xxx.vercel.app
NEXT_PUBLIC_ALLCSS_URL=https://allcss-xxx.vercel.app
NEXT_PUBLIC_BOOTSTRAP_URL=https://bootstrap-xxx.vercel.app
NEXT_PUBLIC_UNOCSS_URL=https://unocss-xxx.vercel.app
NEXT_PUBLIC_SHADCN_URL=https://shadcn-xxx.vercel.app
```

### Behavior

- **If set**: App redirects to standalone URL in production
- **If not set**: App served directly via iframe (if available)

## Examples

### Example 1: All Integrated

**Setup**: No environment variables

**Result**:
- `myui.space/apps/docs` → Served via iframe
- `myui.space/apps/all` → Served via iframe
- All apps accessible via main domain

### Example 2: All Standalone

**Setup**: All environment variables set

**Result**:
- `myui.space/apps/docs` → Redirects to `docs-xxx.vercel.app`
- `myui.space/apps/all` → Redirects to `all-xxx.vercel.app`
- Each app has own deployment

### Example 3: Hybrid

**Setup**: Only `NEXT_PUBLIC_DOCS_URL` set

**Result**:
- `myui.space/apps/docs` → Redirects to standalone
- `myui.space/apps/all` → Served via iframe
- `myui.space/apps/nocss` → Served via iframe
- Mix of both strategies

## Best Practices

1. **Start with integrated** - Easiest to set up
2. **Migrate to hybrid** - Move critical apps to standalone
3. **Go full standalone** - If you need independent scaling
4. **Use hybrid for flexibility** - Best of both worlds

## Troubleshooting

### App not loading

**Check**:
1. App exists in `apps/{name}` directory
2. App has `.ideai` metadata file
3. Environment variable is correct (if standalone)
4. Standalone URL is accessible (if redirecting)

### Redirect not working

**Check**:
1. Environment variable is set correctly
2. `NODE_ENV === "production"` (redirects only in production)
3. Standalone URL is accessible
4. No CORS issues

### Iframe not loading

**Check**:
1. App is running (in development)
2. App is built (in production)
3. No standalone URL is set
4. Same-origin policy allows iframe

## Related Documentation

- [Deployment Architecture](./deployment-architecture.md)
- [Vercel Setup](./vercel-setup.md)
- [Unified Deployment](./unified-deployment.md)



