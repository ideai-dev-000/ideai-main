---
title: Integration Options for Advanced Apps
description: Options for integrating ideai-workflow, lead-processing-agent, and ideai-builder into IdeaI platform
---

# Integration Options for Advanced Apps

## Overview

Three sophisticated apps need to be integrated into the IdeaI platform:

1. **ideai-workflow** - AI workflow builder with visual drag-and-drop, database, auth, integrations
2. **lead-processing-agent** - Lead qualification agent with Slack integration, workflows, AI SDK
3. **ideai-builder** - v0 clone with authentication, multi-tenant support, database

**Key Characteristics:**

- ✅ Production-ready, fully functional apps
- ✅ Each has its own database (PostgreSQL with Drizzle)
- ✅ Each has authentication (Better Auth, NextAuth)
- ✅ Complex dependencies and environment variables
- ✅ API routes and server-side logic
- ✅ Workflow DevKit integration (workflow, lead-agent)

## Integration Options

### Option A: Simple Child App Integration (RECOMMENDED - Start Here)

**Approach**: Add them as child apps in the parent-child architecture, running as separate apps with iframe embedding.

#### Implementation Steps

1. **Create `.ideai.json` for each app:**

```json
// apps/ideai-workflow/.ideai.json
{
  "role": "child",
  "name": "IdeaI Workflow",
  "description": "AI-driven workflow automation platform",
  "parentApp": "web",
  "localPort": 3013,
  "vercelProject": {
    "projectName": "ideai-workflow",
    "orgId": "team_vhjzlMi6CfNow0IfBXnv2Yn2",
    "forkToNew": false
  },
  "metadata": {
    "id": "ideai-workflow",
    "port": 3013,
    "css": ["Tailwind CSS"],
    "capabilities": [
      "Visual workflow builder",
      "Workflow DevKit",
      "Database (PostgreSQL)",
      "Better Auth",
      "Multiple integrations"
    ],
    "path": "/apps/ideai-workflow",
    "category": "production"
  }
}
```

```json
// apps/lead-processing-agent/.ideai.json
{
  "role": "child",
  "name": "Lead Processing Agent",
  "description": "Inbound lead qualification and research agent",
  "parentApp": "web",
  "localPort": 3014,
  "vercelProject": {
    "projectName": "lead-processing-agent",
    "orgId": "team_vhjzlMi6CfNow0IfBXnv2Yn2",
    "forkToNew": false
  },
  "metadata": {
    "id": "lead-processing-agent",
    "port": 3014,
    "css": ["Tailwind CSS"],
    "capabilities": [
      "Lead qualification",
      "AI research agent",
      "Slack integration",
      "Workflow DevKit",
      "Human-in-the-loop"
    ],
    "path": "/apps/lead-processing-agent",
    "category": "production"
  }
}
```

```json
// apps/ideai-builder/.ideai.json
{
  "role": "child",
  "name": "IdeaI Builder",
  "description": "v0 clone with authentication and multi-tenant support",
  "parentApp": "web",
  "localPort": 3015,
  "vercelProject": {
    "projectName": "ideai-builder",
    "orgId": "team_vhjzlMi6CfNow0IfBXnv2Yn2",
    "forkToNew": false
  },
  "metadata": {
    "id": "ideai-builder",
    "port": 3015,
    "css": ["Tailwind CSS"],
    "capabilities": [
      "v0 SDK integration",
      "Multi-tenant architecture",
      "Authentication (NextAuth)",
      "Database (PostgreSQL)",
      "Real-time preview"
    ],
    "path": "/apps/ideai-builder",
    "category": "production"
  }
}
```

2. **Update parent app config:**

```json
// apps/web/.ideai.json - Add to childApps array
{
  "role": "parent",
  "name": "IdeaI",
  "childApps": [
    "docs",
    "all",
    "nocss",
    "mvp",
    "tailwind",
    "allcss",
    "bootstrap",
    "unocss",
    "shadcn",
    "ideai-designer",
    "v0-prototype",
    "v0-000",
    "ideai-workflow",
    "lead-processing-agent",
    "ideai-builder"
  ]
}
```

3. **Update port defaults in `packages/ui/src/lib/ideai-config.ts`:**

```typescript
const DEFAULT_CHILD_PORTS: Record<string, number> = {
  docs: 3001,
  all: 3002,
  nocss: 3003,
  mvp: 3004,
  tailwind: 3005,
  allcss: 3006,
  bootstrap: 3007,
  unocss: 3008,
  shadcn: 3009,
  material: 3010,
  chakra: 3011,
  radix: 3012,
  "ideai-workflow": 3013,
  "lead-processing-agent": 3014,
  "ideai-builder": 3015,
};
```

#### Pros

- ✅ **Zero code changes** - Apps work exactly as-is
- ✅ **Complete isolation** - Each app manages its own database, auth, env vars
- ✅ **Easy deployment** - Each app can deploy to separate Vercel projects
- ✅ **No conflicts** - Database connections, auth systems don't interfere
- ✅ **Quick integration** - Can be done in minutes
- ✅ **Iframe detection** - Apps automatically hide branding when embedded

#### Cons

- ⚠️ **Separate deployments** - Each app needs its own Vercel project
- ⚠️ **Environment variables** - Must be configured per app
- ⚠️ **Database setup** - Each app needs its own database
- ⚠️ **Iframe limitations** - Some features may not work perfectly in iframe (cookies, postMessage)

#### Deployment Strategy

**Development:**

- Each app runs on its own port (3013, 3014, 3015)
- Parent app embeds via iframe: `http://localhost:3000/apps/ideai-workflow`

**Production:**

- **Option 1**: Separate Vercel projects (recommended)
  - `ideai-workflow.vercel.app` → Embed at `/apps/ideai-workflow`
  - `lead-agent.vercel.app` → Embed at `/apps/lead-processing-agent`
  - `ideai-builder.vercel.app` → Embed at `/apps/ideai-builder`
- **Option 2**: Subdomains on same domain
  - `workflow.myui.space` → Embed at `/apps/ideai-workflow`
  - `leads.myui.space` → Embed at `/apps/lead-processing-agent`
  - `builder.myui.space` → Embed at `/apps/ideai-builder`

#### Environment Variables

Each app needs its own `.env.local`:

```bash
# apps/ideai-workflow/.env.local
DATABASE_URL=postgresql://...
BETTER_AUTH_SECRET=...
AI_GATEWAY_API_KEY=...

# apps/lead-processing-agent/.env.local
AI_GATEWAY_API_KEY=...
SLACK_BOT_TOKEN=...
SLACK_SIGNING_SECRET=...
EXA_API_KEY=...

# apps/ideai-builder/.env.local
AUTH_SECRET=...
POSTGRES_URL=postgresql://...
V0_API_KEY=...
```

---

### Option B: Self-Sovereign Apps (Future - Independent Deployment)

**Approach**: Each app is completely independent, not part of parent-child architecture.

#### Implementation

- No `.ideai.json` files (or `role: "standalone"`)
- Each app has its own domain/subdomain
- No iframe embedding
- Just part of monorepo for code sharing

#### Pros

- ✅ Complete independence
- ✅ No iframe limitations
- ✅ Own domain/branding
- ✅ Easier to scale individually

#### Cons

- ❌ Not integrated into IdeaI platform navigation
- ❌ Separate user experience
- ❌ More complex deployment

**When to use**: When apps need to be completely independent products.

---

### Option C: Unified Mode (NOT RECOMMENDED for these apps)

**Approach**: Import apps as components into parent app (all on port 3000).

#### Why NOT Recommended

- ❌ **Database conflicts** - All apps would share same database connection
- ❌ **Auth conflicts** - Multiple auth systems would conflict
- ❌ **Environment variables** - Complex to manage per-app env vars
- ❌ **Build complexity** - Each app has different build requirements
- ❌ **Code refactoring** - Would require significant changes to each app
- ❌ **Dependency conflicts** - Different versions of same packages

**When to use**: Only for simple apps without databases/auth.

---

## Recommended Approach: Option A (Simple Child App Integration)

### Implementation Checklist

- [ ] Create `.ideai.json` for each app
- [ ] Update parent app's `childApps` array
- [ ] Update port defaults in `ideai-config.ts`
- [ ] Test local development (each app on separate port)
- [ ] Configure environment variables for each app
- [ ] Set up databases for each app
- [ ] Create Vercel projects for each app (or configure subdomains)
- [ ] Test iframe embedding in parent app
- [ ] Update navigation in parent app to include new apps
- [ ] Deploy and test production

### Navigation Integration

Add to parent app navigation:

```tsx
// In IdeAIPageTemplate mainNav
{ label: "Workflow Builder", href: "/apps/ideai-workflow" },
{ label: "Lead Agent", href: "/apps/lead-processing-agent" },
{ label: "App Builder", href: "/apps/ideai-builder" },
```

### Testing

1. **Local Development:**

   ```bash
   # Start all apps
   pnpm dev

   # Or start individually
   pnpm --filter ideai-workflow dev      # Port 3013
   pnpm --filter lead-processing-agent dev  # Port 3014
   pnpm --filter ideai-builder dev       # Port 3015
   ```

2. **Test iframe embedding:**
   - Visit `http://localhost:3000/apps/ideai-workflow`
   - Verify app loads in iframe
   - Verify branding is hidden (header/footer)
   - Test functionality works in iframe context

3. **Test production:**
   - Deploy each app to Vercel
   - Configure environment variables
   - Test embedding from production parent app

---

## Long-Term: Abstraction Strategy

**Future goal**: Abstract capabilities into packages.

### Potential Packages

1. **`@repo/workflow-engine`** - Workflow DevKit wrapper
2. **`@repo/ai-agents`** - AI agent utilities
3. **`@repo/database`** - Shared database utilities
4. **`@repo/auth`** - Unified auth system

### Migration Path

1. **Phase 1** (Now): Simple child app integration (Option A)
2. **Phase 2** (Later): Extract shared utilities to packages
3. **Phase 3** (Future): Unified auth/database layer
4. **Phase 4** (Future): Consider unified mode if needed

---

## Summary

**Recommended**: **Option A - Simple Child App Integration**

- ✅ Fastest to implement (minutes, not hours)
- ✅ Zero code changes to existing apps
- ✅ Complete isolation (no conflicts)
- ✅ Production-ready immediately
- ✅ Easy to deploy and maintain
- ✅ Can abstract later without breaking changes

**Next Steps:**

1. Create `.ideai.json` files for all 3 apps
2. Update parent app configuration
3. Test locally
4. Deploy to production
