---
title: Branch-Per-Site Deployment Strategy
description: Strategy for managing multiple Vercel projects via separate branches, enabling independent deployments from monorepo
---

# Branch-Per-Site Deployment Strategy

## Overview

This strategy enables each IdeaI app to have its own Git branch, with each commit triggering a deployment to its corresponding Vercel project. This provides:

- **Independent deployments** - Each app deploys only when its code changes
- **Clear separation** - Each branch maps to one Vercel project
- **Monorepo benefits** - Shared code still works, but deployments are isolated
- **Visual status** - Landing page shows real-time status of all sites

## Architecture

### Branch Structure

```
main                    → ideai-main project (web app at myui.space)
├── branch/web          → web project (if separate deployment needed)
├── branch/docs         → docs project (docs.ideai.space or standalone)
├── branch/landing      → landing project (landing.ideai.space)
├── branch/all          → all project (all.ideai.space)
└── branch/{app-name}   → {app-name} project
```

### Vercel Project Mapping

| Branch | Vercel Project | Domain | Root Directory |
|--------|---------------|--------|----------------|
| `main` | `ideai-main` | `myui.space` | `apps/web` |
| `branch/landing` | `landing` | `landing.ideai.space` | `apps/landing` |
| `branch/docs` | `docs` | `docs.ideai.space` | `apps/docs` |
| `branch/all` | `all` | `all.ideai.space` | `apps/all` |

### How It Works

1. **Developer workflow**:
   - Work on `main` branch for shared changes
   - Create `branch/{app-name}` for app-specific changes
   - Push to branch → triggers Vercel deployment

2. **Vercel configuration**:
   - Each project linked to specific branch
   - Root Directory set to `apps/{app-name}`
   - Ignored Build Step configured for branch

3. **Status monitoring**:
   - Landing page fetches status from:
     - Local dev servers (via dev-manager API)
     - Vercel API (deployment status)
     - GitHub API (branch status)

## Implementation Phases

### Phase 1: Site Card Component ✅ (Current)

**Goal**: Create visual status card component for landing page

- [x] Create `IdeAISiteCard` component with shadcn styling
- [x] Display local dev server status (running/stopped)
- [x] Display Vercel deployment status (deployed/building/failed)
- [x] Add quick links (Vercel dashboard, GitHub branch, local URL)
- [x] Integrate into landing page

**Components**:
- `packages/ui/src/components/ideai-site-card.tsx`
- Uses shadcn Card, Badge, Button components
- Real-time status indicators

### Phase 2: Status API Endpoints

**Goal**: Create APIs to fetch real-time status

- [ ] Create `/api/status/local` endpoint
  - Checks dev-manager.mjs for running apps
  - Returns port status for each app
- [ ] Create `/api/status/vercel` endpoint
  - Fetches Vercel deployment status via API
  - Returns latest deployment info per project
- [ ] Create `/api/status/github` endpoint
  - Fetches branch status from GitHub API
  - Returns last commit, branch protection, etc.

**Files**:
- `apps/landing/app/api/status/local/route.ts`
- `apps/landing/app/api/status/vercel/route.ts`
- `apps/landing/app/api/status/github/route.ts`

### Phase 3: Branch Workflow Setup

**Goal**: Set up branch-per-site structure

- [ ] Create branch naming convention
- [ ] Set up Vercel project → branch mapping
- [ ] Configure Ignored Build Step per branch
- [ ] Document branch workflow

**Configuration**:
- Update `apps/landing/app/config/routing.ts` with branch info
- Create `docs/deployment/branch-workflow.md`

### Phase 4: GitHub Actions Integration

**Goal**: Automate branch-based deployments

- [ ] Create GitHub Actions workflow
- [ ] Trigger on branch push
- [ ] Deploy to correct Vercel project
- [ ] Update status in landing page

**Files**:
- `.github/workflows/deploy-branch.yml`

### Phase 5: Enhanced Status Dashboard

**Goal**: Full status dashboard with history

- [ ] Deployment history per site
- [ ] Build logs integration
- [ ] Performance metrics
- [ ] Error tracking

## Site Card Component Design

### Props Interface

```typescript
interface IdeAISiteCardProps {
  app: AppConfig;
  localStatus?: 'running' | 'stopped' | 'unknown';
  vercelStatus?: 'deployed' | 'building' | 'failed' | 'unknown';
  vercelUrl?: string;
  githubBranch?: string;
  lastDeployed?: string;
}
```

### Visual Design

- **Card Header**: App name + status badges
- **Status Section**: 
  - Local: 🟢 Running / 🔴 Stopped
  - Vercel: 🟢 Deployed / 🟡 Building / 🔴 Failed
- **Actions**: 
  - Open local URL
  - View Vercel dashboard
  - View GitHub branch
  - View deployment logs

### shadcn Components Used

- `Card` - Main container
- `Badge` - Status indicators
- `Button` - Action buttons
- `Separator` - Visual dividers
- `Skeleton` - Loading states

## Benefits

1. **Independent Deployments**: Each app deploys only when its branch changes
2. **Clear Ownership**: Each branch clearly maps to one Vercel project
3. **Visual Status**: Landing page shows real-time status of all sites
4. **Quick Access**: Direct links to Vercel, GitHub, local dev
5. **Scalable**: Easy to add new apps/sites

## Migration Path

1. **Start with main branch**: All apps deploy from `main` (current state)
2. **Create branch for landing**: Test branch-per-site with `branch/landing`
3. **Gradually migrate**: Move other apps to branches as needed
4. **Keep main for shared**: Use `main` for shared package changes

## Related Documentation

- [Deployment Architecture](./deployment-architecture.md)
- [Git Integration](../deployment/git-integration.md)
- [Vercel Setup](../deployment/vercel-setup.md)








