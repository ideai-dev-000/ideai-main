---
title: Phased Implementation Plan
description: Detailed phased plan for remaining work on IdeaI monorepo
---

# Phased Implementation Plan

**Last Updated**: December 31, 2025

## Current Status

See [STATUS.md](./STATUS.md) for complete current status.

## Phase 1: Site Card Integration (In Progress) 🚧

**Goal**: Complete the IdeAISiteCard component integration into landing page

### Tasks
- [ ] Create `/api/status/local` endpoint
  - Check dev-manager.mjs for running apps
  - Return port status for each app
- [ ] Create `/api/status/vercel` endpoint
  - Fetch Vercel deployment status via API
  - Return latest deployment info per project
- [ ] Create `/api/status/github` endpoint (optional)
  - Fetch branch status from GitHub API
  - Return last commit, branch protection, etc.
- [ ] Integrate `IdeAISiteCard` into landing page
  - Replace `AppCard` with enhanced site card
  - Fetch status from APIs
- [ ] Test with real status data
- [ ] Add error handling and loading states
- [ ] Polish UI/UX

### Files to Create
- `apps/landing/app/api/status/local/route.ts`
- `apps/landing/app/api/status/vercel/route.ts`
- `apps/landing/app/api/status/github/route.ts` (optional)

### Files to Update
- `apps/landing/app/page.tsx` - Replace AppCard with IdeAISiteCard
- `apps/landing/app/config/routing.ts` - Add status info to AppConfig

### Estimated Time
2-3 hours

---

## Phase 2: Branch Workflow Setup 📋

**Goal**: Set up branch-per-site structure for independent deployments

### Tasks
- [ ] Create branch naming convention document
- [ ] Set up Vercel project → branch mapping
- [ ] Configure Ignored Build Step per branch
- [ ] Test branch-based deployment
- [ ] Update routing config with branch info
- [ ] Document branch workflow

### Files to Create
- `.github/workflows/branch-deploy.yml` (optional, for automation)

### Files to Update
- `apps/landing/app/config/routing.ts` - Add branch info
- `docs/development/branch-workflow.md` - Add setup instructions

### Estimated Time
3-4 hours

---

## Phase 3: GitHub Actions Integration 🤖

**Goal**: Automate branch-based deployments

### Tasks
- [ ] Create GitHub Actions workflow
- [ ] Trigger on branch push
- [ ] Deploy to correct Vercel project
- [ ] Update status in landing page
- [ ] Add deployment notifications

### Files to Create
- `.github/workflows/deploy-branch.yml`

### Files to Update
- `docs/deployment/ci-cd.md` - Add branch workflow docs

### Estimated Time
4-5 hours

---

## Phase 4: Enhanced Status Dashboard 📊

**Goal**: Full status dashboard with history and metrics

### Tasks
- [ ] Deployment history per site
- [ ] Build logs integration
- [ ] Performance metrics
- [ ] Error tracking
- [ ] Real-time updates (WebSocket or polling)

### Files to Create
- `apps/landing/app/api/status/history/route.ts`
- `apps/landing/app/api/status/metrics/route.ts`
- `apps/landing/app/components/status-dashboard.tsx`

### Estimated Time
6-8 hours

---

## Phase 5: Documentation Cleanup 📚

**Goal**: Consolidate and organize documentation

### Tasks
- [ ] Review all docs for duplicates
- [ ] Consolidate deployment docs
- [ ] Remove legacy/unused files
- [ ] Update cross-references
- [ ] Ensure all docs are current

### Files to Review/Remove
- `docs/deployment/vercel.md` vs `docs/deployment/vercel-setup.md` (consolidate)
- `docs/architecture/deployment-notes.md` (review if needed)
- `docs/architecture/multi-app-deployment.md` (review if needed)
- `docs/deployment/robust-deployment.md` (review if needed)

### Estimated Time
2-3 hours

---

## Priority Order

1. **Phase 1** (Current) - Site card integration
2. **Phase 5** - Documentation cleanup (can do in parallel)
3. **Phase 2** - Branch workflow setup
4. **Phase 3** - GitHub Actions
5. **Phase 4** - Enhanced dashboard

---

## Notes

- Phases can be worked on in parallel where appropriate
- Phase 5 (docs cleanup) can be done anytime
- Phase 1 is blocking Phase 2-4 (need status APIs first)
- Each phase builds on previous phases








