---
title: Multi-Strategy Deployment Plan
description: Comprehensive phased plan for supporting subdomains, sub-folders, self-sovereign apps, and mother-child app architectures
---

# Multi-Strategy Deployment Plan

**Last Updated**: January 1, 2026  
**Status**: Planning Phase  
**Priority**: High

## Overview

This document outlines a comprehensive, phased approach to support multiple deployment strategies for the IdeaI monorepo:

1. **Subdomains** - `{app}.myui.space` routing
2. **Sub-folders** - `myui.space/apps/{name}` routing (current, needs fixing)
3. **Self-Sovereign Apps** - Individual apps deployed independently with full isolation
4. **Mother-Child Apps** - Self-compiled mother apps with embedded child apps demonstrating different CSS frameworks

## Commit Message Standards

### CRITICAL: All Commits Must Follow This Format

**Every commit for any ticket must include a well-formatted commit message:**

```
type(scope): detailed subject line

Detailed explanation of what changed and why.

- Specific change 1
- Specific change 2
- Specific change 3

Related: TICKET-XXX
```

### Commit Types

- `fix`: Bug fixes
- `feat`: New features
- `docs`: Documentation changes
- `refactor`: Code refactoring
- `test`: Test additions/changes
- `chore`: Maintenance tasks
- `deploy`: Deployment changes
- `style`: Code style changes (formatting, etc.)

### Scope Examples

- `web`: Main web app
- `docs`: Documentation site
- `ui`: Shared UI package
- `deploy`: Deployment scripts
- `config`: Configuration files
- `vercel`: Vercel configuration

### Examples

**Good Commit Message:**
```
fix(web): resolve sub-folder route 404 issue

Fixed Next.js App Router catch-all route that was returning 404
in production. Converted client component to use React's use() hook
for async params handling.

- Updated page.tsx to use use() hook instead of useEffect
- Fixed async params resolution
- Added error handling for route matching
- Updated TypeScript types for params

Related: TICKET-0.1
```

**Bad Commit Message (DON'T DO THIS):**
```
fix: stuff
```

### Commit Signing

**In non-interactive environments** (Cursor/AI tools):
1. Disable auto-sign: `git config --global --unset commit.gpgsign`
2. Make commit
3. Re-enable: `git config --global commit.gpgsign true`

**See**: [Commit Signing Setup](../setup/commit-signing.md) for details.

---

## Deployment Workflow Strategy

### Current State Analysis

**Option A: GitHub → Vercel (Recommended)**
- ✅ Git push triggers automatic Vercel deployment
- ✅ Full version control and history
- ✅ Pull request previews
- ✅ Rollback via git
- ⚠️ Requires GitHub Actions configuration

**Option B: Vercel → GitHub (Backup)**
- ✅ Direct deployment from Vercel CLI
- ✅ Faster iteration
- ⚠️ Requires manual git push after deployment
- ⚠️ Risk of code drift

**Recommended Approach**: **GitHub → Vercel with Vercel CLI backup**
- Primary: Push to GitHub → Auto-deploy via GitHub Actions
- Backup: Direct Vercel CLI deployment → Auto-commit to GitHub via webhook/hook

### Implementation Priority

1. **Phase 0** (Immediate): Fix current sub-folder routing issue
2. **Phase 1** (Easy): Document and stabilize current deployment workflow
3. **Phase 2** (Easy): Self-sovereign app deployment (already partially working)
4. **Phase 3** (Medium): Subdomain support
5. **Phase 4** (Medium): Mother-child app architecture
6. **Phase 5** (Advanced): Advanced routing and optimization

---

## Phase 0: Fix Current Issues (CRITICAL - Do First)

**Priority**: 🔴 **CRITICAL**  
**Estimated Time**: 2-4 hours  
**Risk Level**: Low (fixing existing functionality)

### Tickets

#### TICKET-0.1: Fix Sub-Folder Route 404 Issue
**Status**: In Progress  
**Priority**: P0 - Critical  
**Assignee**: TBD

**Problem**: 
- Route exists: `apps/web/app/apps/[app]/[[...path]]/page.tsx`
- Route builds successfully
- Returns 404 in production

**Investigation Tasks**:
- [ ] Check Vercel deployment logs for routing errors
- [ ] Verify Next.js App Router route structure matches requirements
- [ ] Test route locally in production mode
- [ ] Check if route needs server-side rendering vs client-side
- [ ] Verify route is included in build output

**Solution Options**:
1. Convert to server component if needed
2. Add route configuration to `next.config.js`
3. Check Vercel routing configuration
4. Verify route directory structure matches Next.js conventions

**Acceptance Criteria**:
- ✅ `/apps/docs` returns 200 (not 404)
- ✅ `/apps/all` returns 200 (not 404)
- ✅ All sub-app routes work in production
- ✅ Route handles catch-all paths correctly

**Documentation Required**:
- [ ] Document route structure
- [ ] Document troubleshooting steps
- [ ] Add to deployment checklist

**Commit Message Format** (REQUIRED):
```
fix(web): resolve sub-folder route 404 issue

Fixed Next.js App Router catch-all route that was returning 404
in production. [Detailed explanation of solution]

- [Specific change 1]
- [Specific change 2]
- [Specific change 3]

Related: TICKET-0.1
```

---

## Phase 1: Stabilize Deployment Workflow (EASY - Do Second)

**Priority**: 🟡 **HIGH**  
**Estimated Time**: 4-6 hours  
**Risk Level**: Low (documentation and configuration)

### Tickets

#### TICKET-1.1: Document Current Deployment Workflow
**Status**: Pending  
**Priority**: P1 - High  
**Estimated Time**: 2 hours

**Tasks**:
- [ ] Document GitHub → Vercel auto-deployment workflow
- [ ] Document Vercel CLI direct deployment workflow
- [ ] Create decision matrix for when to use each approach
- [ ] Document rollback procedures
- [ ] Create deployment runbook

**Deliverables**:
- `docs/deployment/workflow-git-to-vercel.md`
- `docs/deployment/workflow-vercel-direct.md`
- `docs/deployment/deployment-decision-matrix.md`
- `docs/deployment/rollback-procedures.md`

**Acceptance Criteria**:

**Commit Message Format** (REQUIRED):
```
type(scope): detailed subject line

Detailed explanation of what changed and why.

- [Specific change 1]
- [Specific change 2]
- [Specific change 3]

Related: TICKET-1.1
```
- ✅ Complete documentation for both workflows
- ✅ Clear decision criteria
- ✅ Step-by-step procedures
- ✅ Troubleshooting guides included

#### TICKET-1.2: Implement GitHub → Vercel Auto-Deployment
**Status**: Pending  
**Priority**: P1 - High  
**Estimated Time**: 3 hours

**Tasks**:
- [ ] Verify GitHub Actions workflows exist and work
- [ ] Test preview deployment on branch push
- [ ] Test production deployment on main branch push
- [ ] Configure branch protection rules
- [ ] Set up deployment status checks
- [ ] Document required GitHub secrets
- [ ] Create setup script for GitHub secrets

**Configuration Required**:
- GitHub Actions workflow: `.github/workflows/deploy.yml`
- Required secrets: `VERCEL_TOKEN`, `VERCEL_ORG_ID`
- Branch protection: Require status checks

**Acceptance Criteria**:
- ✅ Push to `preview` branch triggers preview deployment
- ✅ Push to `main` branch triggers production deployment
- ✅ Deployment status visible in GitHub PRs
- ✅ Failed deployments block merges (if configured)

**Documentation Required**:

**Commit Message Format** (REQUIRED):
```
type(scope): detailed subject line

Detailed explanation of what changed and why.

- [Specific change 1]
- [Specific change 2]
- [Specific change 3]

Related: TICKET-1.2
```
- [ ] Update `docs/setup/github-secrets.md`
- [ ] Update `docs/deployment/ci-cd.md`
- [ ] Add troubleshooting section

#### TICKET-1.3: Implement Vercel → GitHub Backup Workflow
**Status**: Pending  
**Priority**: P2 - Medium  
**Estimated Time**: 2 hours

**Tasks**:
- [ ] Research Vercel webhook options for git sync
- [ ] Document manual git push after Vercel CLI deployment
- [ ] Create script to sync Vercel deployments to GitHub
- [ ] Document when to use direct Vercel deployment
- [ ] Create checklist for post-deployment git sync

**Acceptance Criteria**:
- ✅ Clear procedure for syncing Vercel → GitHub
- ✅ Script or automation for sync
- ✅ Documentation of when to use this workflow

**Documentation Required**:

**Commit Message Format** (REQUIRED):
```
type(scope): detailed subject line

Detailed explanation of what changed and why.

- [Specific change 1]
- [Specific change 2]
- [Specific change 3]

Related: TICKET-1.3
```
- [ ] `docs/deployment/workflow-vercel-to-github.md`
- [ ] Update deployment decision matrix

#### TICKET-1.4: Create Deployment Safety Checklist
**Status**: Pending  
**Priority**: P1 - High  
**Estimated Time**: 1 hour

**Tasks**:
- [ ] Create pre-deployment checklist
- [ ] Create post-deployment verification checklist
- [ ] Document rollback procedures
- [ ] Create deployment safety guidelines
- [ ] Document server impact considerations

**Deliverables**:
- `docs/deployment/safety-checklist.md`
- `docs/deployment/pre-deployment-checklist.md`
- `docs/deployment/post-deployment-verification.md`

**Acceptance Criteria**:

**Commit Message Format** (REQUIRED):
```
type(scope): detailed subject line

Detailed explanation of what changed and why.

- [Specific change 1]
- [Specific change 2]
- [Specific change 3]

Related: TICKET-1.4
```
- ✅ Comprehensive checklists
- ✅ Clear safety guidelines
- ✅ Server impact documentation
- ✅ Rollback procedures documented

---

## Phase 2: Self-Sovereign App Deployment (EASY - Already Partially Working)

**Priority**: 🟡 **HIGH**  
**Estimated Time**: 6-8 hours  
**Risk Level**: Low (building on existing functionality)

### Overview

Self-sovereign apps are individual apps that:
- Deploy independently to Vercel
- Have their own Vercel project
- Pull in all dependencies from monorepo
- Work in complete isolation
- Can be accessed standalone or via main app

### Tickets

#### TICKET-2.1: Complete Self-Sovereign App Configuration
**Status**: Pending  
**Priority**: P1 - High  
**Estimated Time**: 3 hours

**Current State**: 
- ✅ All apps linked to Vercel projects
- ⚠️ Root Directory not configured for all apps
- ⚠️ Some apps fail deployment due to missing config

**Tasks**:
- [ ] Configure Root Directory for all apps in Vercel dashboard
- [ ] Enable "Include files outside root" for all apps
- [ ] Verify each app can build in isolation
- [ ] Test deployment for each app
- [ ] Document configuration per app

**Apps to Configure**:
- [ ] all
- [ ] nocss
- [ ] mvp
- [ ] tailwind
- [ ] allcss
- [ ] bootstrap
- [ ] unocss
- [ ] shadcn
- [ ] material
- [ ] chakra
- [ ] radix

**Configuration Template**:
```
Vercel Dashboard Settings:
- Root Directory: apps/{app-name}
- Include files outside root: ✅ Enabled
- Framework: Next.js (auto-detected)
- Build Command: pnpm build (auto-detected)
- Install Command: pnpm install (auto-detected)
```

**Acceptance Criteria**:
- ✅ All apps deploy successfully to preview
- ✅ All apps deploy successfully to production
- ✅ Each app works standalone
- ✅ Configuration documented per app

**Documentation Required**:

**Commit Message Format** (REQUIRED):
```
type(scope): detailed subject line

Detailed explanation of what changed and why.

- [Specific change 1]
- [Specific change 2]
- [Specific change 3]

Related: TICKET-2.1
```
- [ ] `docs/deployment/self-sovereign-apps.md`
- [ ] Update `docs/deployment/vercel.md` with per-app config
- [ ] Create configuration checklist

#### TICKET-2.2: Create Self-Sovereign App Deployment Script
**Status**: Pending  
**Priority**: P2 - Medium  
**Estimated Time**: 2 hours

**Tasks**:
- [ ] Enhance `deploy.sh` to verify Vercel config before deployment
- [ ] Add pre-deployment validation
- [ ] Add post-deployment verification
- [ ] Create script to check all app configurations
- [ ] Add configuration validation

**Script Features**:
- Verify Root Directory is set
- Verify "Include files outside root" is enabled
- Check project linking
- Validate build before deployment
- Generate deployment report

**Acceptance Criteria**:
- ✅ Script validates configuration before deployment
- ✅ Script provides clear error messages
- ✅ Script generates deployment report
- ✅ Script can check all apps at once

**Documentation Required**:

**Commit Message Format** (REQUIRED):
```
type(scope): detailed subject line

Detailed explanation of what changed and why.

- [Specific change 1]
- [Specific change 2]
- [Specific change 3]

Related: TICKET-2.2
```
- [ ] Update `docs/deployment/unified-deployment.md`
- [ ] Document validation checks
- [ ] Document error messages and solutions

#### TICKET-2.3: Document Self-Sovereign App Architecture
**Status**: Pending  
**Priority**: P2 - Medium  
**Estimated Time**: 2 hours

**Tasks**:
- [ ] Document how self-sovereign apps work
- [ ] Explain dependency resolution
- [ ] Document build process
- [ ] Explain isolation guarantees
- [ ] Document when to use self-sovereign vs integrated

**Deliverables**:
- `docs/architecture/self-sovereign-apps.md`
- Architecture diagrams
- Dependency resolution explanation
- Build process documentation

**Acceptance Criteria**:

**Commit Message Format** (REQUIRED):
```
type(scope): detailed subject line

Detailed explanation of what changed and why.

- [Specific change 1]
- [Specific change 2]
- [Specific change 3]

Related: TICKET-2.3
```
- ✅ Complete architecture documentation
- ✅ Clear diagrams
- ✅ Decision criteria documented
- ✅ Examples provided

#### TICKET-2.4: Test Self-Sovereign App Isolation
**Status**: Pending  
**Priority**: P2 - Medium  
**Estimated Time**: 1 hour

**Tasks**:
- [ ] Deploy app in isolation
- [ ] Verify it doesn't depend on other apps
- [ ] Test that it pulls all needed dependencies
- [ ] Verify build succeeds without other apps
- [ ] Test runtime behavior in isolation

**Test Apps**:
- [ ] docs (already working)
- [ ] all
- [ ] shadcn

**Acceptance Criteria**:

**Commit Message Format** (REQUIRED):
```
type(scope): detailed subject line

Detailed explanation of what changed and why.

- [Specific change 1]
- [Specific change 2]
- [Specific change 3]

Related: TICKET-2.4
```
- ✅ Apps work completely standalone
- ✅ No dependencies on other apps
- ✅ All required packages included
- ✅ Build succeeds in isolation

---

## Phase 3: Subdomain Support (MEDIUM)

**Priority**: 🟢 **MEDIUM**  
**Estimated Time**: 8-12 hours  
**Risk Level**: Medium (requires DNS and Vercel configuration)

### Overview

Support subdomain routing where each app can be accessed at `{app}.myui.space`:
- `docs.myui.space` → docs app
- `all.myui.space` → all components app
- `shadcn.myui.space` → shadcn showcase

### Tickets

#### TICKET-3.1: Research Subdomain Configuration
**Status**: Pending  
**Priority**: P2 - Medium  
**Estimated Time**: 2 hours

**Tasks**:
- [ ] Research Vercel subdomain configuration
- [ ] Research DNS configuration for subdomains
- [ ] Document requirements and limitations
- [ ] Create subdomain strategy document
- [ ] Identify which apps should have subdomains

**Research Areas**:
- Vercel custom domain configuration
- DNS CNAME/A record setup
- Wildcard subdomain support
- SSL certificate handling
- Subdomain routing rules

**Deliverables**:
- `docs/deployment/subdomain-research.md`
- Subdomain strategy document
- DNS configuration guide

**Acceptance Criteria**:

**Commit Message Format** (REQUIRED):
```
type(scope): detailed subject line

Detailed explanation of what changed and why.

- [Specific change 1]
- [Specific change 2]
- [Specific change 3]

Related: TICKET-3.1
```
- ✅ Complete research documented
- ✅ Clear strategy defined
- ✅ Requirements identified
- ✅ Limitations documented

#### TICKET-3.2: Configure DNS for Subdomains
**Status**: Pending  
**Priority**: P2 - Medium  
**Estimated Time**: 2 hours

**Tasks**:
- [ ] Identify DNS provider
- [ ] Configure CNAME records for subdomains
- [ ] Configure wildcard subdomain (if supported)
- [ ] Document DNS configuration
- [ ] Test DNS propagation
- [ ] Verify SSL certificates

**Subdomains to Configure**:
- [ ] docs.myui.space
- [ ] all.myui.space
- [ ] shadcn.myui.space
- [ ] (others as needed)

**DNS Configuration**:
```
Type: CNAME
Name: docs
Value: cname.vercel-dns.com
TTL: 3600
```

**Acceptance Criteria**:
- ✅ DNS records configured
- ✅ SSL certificates issued
- ✅ Subdomains resolve correctly
- ✅ Configuration documented

**Documentation Required**:

**Commit Message Format** (REQUIRED):
```
type(scope): detailed subject line

Detailed explanation of what changed and why.

- [Specific change 1]
- [Specific change 2]
- [Specific change 3]

Related: TICKET-3.2
```
- [ ] `docs/deployment/dns-configuration.md`
- [ ] DNS record reference
- [ ] Troubleshooting guide

#### TICKET-3.3: Configure Vercel Projects for Subdomains
**Status**: Pending  
**Priority**: P2 - Medium  
**Estimated Time**: 3 hours

**Tasks**:
- [ ] Add custom domains to Vercel projects
- [ ] Configure domain verification
- [ ] Set up SSL certificates
- [ ] Configure redirects (www to non-www or vice versa)
- [ ] Test subdomain access
- [ ] Document per-app configuration

**Vercel Configuration**:
- Add custom domain in project settings
- Verify domain ownership
- Configure domain settings
- Set up redirects

**Acceptance Criteria**:
- ✅ All configured subdomains work
- ✅ SSL certificates active
- ✅ Redirects configured correctly
- ✅ Configuration documented

**Documentation Required**:

**Commit Message Format** (REQUIRED):
```
type(scope): detailed subject line

Detailed explanation of what changed and why.

- [Specific change 1]
- [Specific change 2]
- [Specific change 3]

Related: TICKET-3.3
```
- [ ] Update `docs/deployment/vercel.md` with subdomain config
- [ ] Per-app subdomain configuration
- [ ] Troubleshooting guide

#### TICKET-3.4: Update Main App for Subdomain Routing
**Status**: Pending  
**Priority**: P2 - Medium  
**Estimated Time**: 2 hours

**Tasks**:
- [ ] Update sub-app routing to detect subdomain requests
- [ ] Add subdomain → app mapping
- [ ] Configure redirects from main app to subdomains
- [ ] Update environment variables for subdomain URLs
- [ ] Test subdomain routing

**Code Changes**:
- Update `apps/web/app/apps/[app]/[[...path]]/page.tsx`
- Add subdomain detection
- Add redirect logic
- Update SUB_APPS configuration

**Acceptance Criteria**:
- ✅ Subdomain requests route correctly
- ✅ Main app redirects to subdomains when configured
- ✅ Fallback to sub-folder routing works
- ✅ Configuration is flexible

**Documentation Required**:

**Commit Message Format** (REQUIRED):
```
type(scope): detailed subject line

Detailed explanation of what changed and why.

- [Specific change 1]
- [Specific change 2]
- [Specific change 3]

Related: TICKET-3.4
```
- [ ] Update routing documentation
- [ ] Document subdomain configuration
- [ ] Document fallback behavior

#### TICKET-3.5: Create Subdomain Management Script
**Status**: Pending  
**Priority**: P3 - Low  
**Estimated Time**: 2 hours

**Tasks**:
- [ ] Create script to list all subdomains
- [ ] Create script to add subdomain to app
- [ ] Create script to verify subdomain configuration
- [ ] Create script to test subdomain access
- [ ] Document script usage

**Script Features**:
- List all configured subdomains
- Add subdomain to Vercel project
- Verify DNS configuration
- Test subdomain accessibility
- Generate subdomain report

**Acceptance Criteria**:
- ✅ Scripts work correctly
- ✅ Scripts provide clear output
- ✅ Scripts handle errors gracefully
- ✅ Scripts documented

**Documentation Required**:

**Commit Message Format** (REQUIRED):
```
type(scope): detailed subject line

Detailed explanation of what changed and why.

- [Specific change 1]
- [Specific change 2]
- [Specific change 3]

Related: TICKET-3.5
```
- [ ] `docs/deployment/subdomain-scripts.md`
- [ ] Usage examples
- [ ] Troubleshooting guide

---

## Phase 4: Mother-Child App Architecture (MEDIUM)

**Priority**: 🟢 **MEDIUM**  
**Estimated Time**: 12-16 hours  
**Risk Level**: Medium (new architecture pattern)

### Overview

Mother-child app architecture where:
- **Mother app**: Self-compiled Next.js app that embeds child apps
- **Child apps**: Different CSS framework demonstrations
- Child apps are compiled into mother app at build time
- All apps share same domain and routing
- Demonstrates different CSS frameworks side-by-side

### Tickets

#### TICKET-4.1: Design Mother-Child App Architecture
**Status**: Pending  
**Priority**: P2 - Medium  
**Estimated Time**: 4 hours

**Tasks**:
- [ ] Design architecture for mother-child apps
- [ ] Define how child apps are embedded
- [ ] Design build process
- [ ] Design routing structure
- [ ] Design CSS framework isolation
- [ ] Create architecture diagrams

**Architecture Considerations**:
- How to embed child apps (iframe, module federation, build-time inclusion)
- CSS framework isolation (CSS modules, scoped styles)
- Build process (compile all at once vs separate builds)
- Routing (how to route to child apps)
- State management (if needed)

**Deliverables**:
- `docs/architecture/mother-child-apps.md`
- Architecture diagrams
- Build process documentation
- Routing design

**Acceptance Criteria**:

**Commit Message Format** (REQUIRED):
```
type(scope): detailed subject line

Detailed explanation of what changed and why.

- [Specific change 1]
- [Specific change 2]
- [Specific change 3]

Related: TICKET-4.1
```
- ✅ Complete architecture design
- ✅ Clear diagrams
- ✅ Build process defined
- ✅ Routing strategy defined
- ✅ CSS isolation strategy defined

#### TICKET-4.2: Implement Mother App Base Structure
**Status**: Pending  
**Priority**: P2 - Medium  
**Estimated Time**: 3 hours

**Tasks**:
- [ ] Create mother app structure
- [ ] Set up base routing
- [ ] Create child app container component
- [ ] Set up build configuration
- [ ] Create child app registry
- [ ] Test base structure

**Mother App Structure**:
```
apps/mother/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   └── frameworks/
│       ├── [framework]/
│       │   └── page.tsx
├── components/
│   └── child-app-container.tsx
├── lib/
│   └── child-app-registry.ts
└── package.json
```

**Acceptance Criteria**:
- ✅ Mother app structure created
- ✅ Base routing works
- ✅ Child app container component works
- ✅ Build succeeds
- ✅ Structure documented

**Documentation Required**:

**Commit Message Format** (REQUIRED):
```
type(scope): detailed subject line

Detailed explanation of what changed and why.

- [Specific change 1]
- [Specific change 2]
- [Specific change 3]

Related: TICKET-4.2
```
- [ ] Update architecture docs
- [ ] Document structure
- [ ] Document build process

#### TICKET-4.3: Implement Child App Integration
**Status**: Pending  
**Priority**: P2 - Medium  
**Estimated Time**: 4 hours

**Tasks**:
- [ ] Create mechanism to include child apps
- [ ] Implement CSS framework isolation
- [ ] Set up child app routing
- [ ] Create child app loader
- [ ] Test child app integration
- [ ] Verify CSS isolation works

**Integration Methods**:
1. **Build-time inclusion**: Child apps compiled into mother app
2. **Runtime loading**: Child apps loaded at runtime
3. **Hybrid**: Some compiled, some loaded

**CSS Isolation**:
- CSS modules per child app
- Scoped styles
- Framework-specific CSS loading

**Acceptance Criteria**:
- ✅ Child apps integrate correctly
- ✅ CSS frameworks isolated
- ✅ Routing works
- ✅ No CSS conflicts
- ✅ Build succeeds

**Documentation Required**:

**Commit Message Format** (REQUIRED):
```
type(scope): detailed subject line

Detailed explanation of what changed and why.

- [Specific change 1]
- [Specific change 2]
- [Specific change 3]

Related: TICKET-4.3
```
- [ ] Document integration method
- [ ] Document CSS isolation
- [ ] Document routing

#### TICKET-4.4: Create CSS Framework Demo Child Apps
**Status**: Pending  
**Priority**: P2 - Medium  
**Estimated Time**: 3 hours

**Tasks**:
- [ ] Create Tailwind child app demo
- [ ] Create Bootstrap child app demo
- [ ] Create Material UI child app demo
- [ ] Create Chakra UI child app demo
- [ ] Create UnoCSS child app demo
- [ ] Test each child app in mother app

**Child App Requirements**:
- Self-contained (all dependencies included)
- CSS framework isolated
- Works when embedded in mother app
- Demonstrates framework features

**Acceptance Criteria**:
- ✅ All child apps work in mother app
- ✅ CSS frameworks isolated
- ✅ No conflicts between frameworks
- ✅ Each demo showcases framework features

**Documentation Required**:

**Commit Message Format** (REQUIRED):
```
type(scope): detailed subject line

Detailed explanation of what changed and why.

- [Specific change 1]
- [Specific change 2]
- [Specific change 3]

Related: TICKET-4.4
```
- [ ] Document each child app
- [ ] Document how to add new child apps
- [ ] Document CSS framework requirements

#### TICKET-4.5: Deploy Mother-Child App Architecture
**Status**: Pending  
**Priority**: P2 - Medium  
**Estimated Time**: 2 hours

**Tasks**:
- [ ] Configure Vercel project for mother app
- [ ] Set up build configuration
- [ ] Deploy to preview
- [ ] Deploy to production
- [ ] Test all child apps
- [ ] Verify CSS isolation in production

**Vercel Configuration**:
- Root Directory: `apps/mother`
- Include files outside root: ✅ Enabled
- Build Command: `pnpm build`
- Install Command: `pnpm install`

**Acceptance Criteria**:
- ✅ Mother app deploys successfully
- ✅ All child apps accessible
- ✅ CSS isolation works in production
- ✅ Routing works correctly

**Documentation Required**:

**Commit Message Format** (REQUIRED):
```
type(scope): detailed subject line

Detailed explanation of what changed and why.

- [Specific change 1]
- [Specific change 2]
- [Specific change 3]

Related: TICKET-4.5
```
- [ ] Update deployment docs
- [ ] Document mother app deployment
- [ ] Document troubleshooting

---

## Phase 5: Advanced Routing & Optimization (ADVANCED)

**Priority**: 🔵 **LOW**  
**Estimated Time**: 8-12 hours  
**Risk Level**: Medium (optimization work)

### Tickets

#### TICKET-5.1: Implement Smart Routing System
**Status**: Pending  
**Priority**: P3 - Low  
**Estimated Time**: 4 hours

**Tasks**:
- [ ] Create routing decision logic
- [ ] Implement subdomain detection
- [ ] Implement sub-folder routing
- [ ] Implement fallback routing
- [ ] Add routing configuration
- [ ] Test all routing scenarios

**Routing Logic**:
1. Check if subdomain request → route to subdomain app
2. Check if sub-folder request → route to sub-folder
3. Check if standalone URL configured → redirect
4. Fallback to integrated serving

**Acceptance Criteria**:

**Commit Message Format** (REQUIRED):
```
type(scope): detailed subject line

Detailed explanation of what changed and why.

- [Specific change 1]
- [Specific change 2]
- [Specific change 3]

Related: TICKET-5.1
```
- ✅ All routing scenarios work
- ✅ Routing is configurable
- ✅ Fallback works correctly
- ✅ Performance is acceptable

#### TICKET-5.2: Optimize Build Process
**Status**: Pending  
**Priority**: P3 - Low  
**Estimated Time**: 3 hours

**Tasks**:
- [ ] Analyze build times
- [ ] Optimize build process
- [ ] Implement build caching
- [ ] Parallelize builds where possible
- [ ] Optimize dependency resolution

**Acceptance Criteria**:

**Commit Message Format** (REQUIRED):
```
type(scope): detailed subject line

Detailed explanation of what changed and why.

- [Specific change 1]
- [Specific change 2]
- [Specific change 3]

Related: TICKET-5.2
```
- ✅ Build times reduced
- ✅ Caching works correctly
- ✅ Parallel builds work
- ✅ Documentation updated

#### TICKET-5.3: Implement Deployment Monitoring
**Status**: Pending  
**Priority**: P3 - Low  
**Estimated Time**: 3 hours

**Tasks**:
- [ ] Set up deployment monitoring
- [ ] Create deployment dashboard
- [ ] Track deployment success/failure
- [ ] Monitor build times
- [ ] Alert on failures

**Acceptance Criteria**:

**Commit Message Format** (REQUIRED):
```
type(scope): detailed subject line

Detailed explanation of what changed and why.

- [Specific change 1]
- [Specific change 2]
- [Specific change 3]

Related: TICKET-5.3
```
- ✅ Monitoring in place
- ✅ Dashboard functional
- ✅ Alerts configured
- ✅ Documentation complete

---

## Documentation Requirements

### Required Documentation

1. **Architecture Documentation**
   - [ ] Self-sovereign apps architecture
   - [ ] Mother-child apps architecture
   - [ ] Subdomain routing architecture
   - [ ] Sub-folder routing architecture

2. **Deployment Guides**
   - [ ] Self-sovereign app deployment
   - [ ] Subdomain configuration
   - [ ] Mother-child app deployment
   - [ ] Deployment workflow (GitHub → Vercel)
   - [ ] Deployment workflow (Vercel → GitHub)

3. **Configuration Guides**
   - [ ] DNS configuration
   - [ ] Vercel project configuration
   - [ ] Environment variables
   - [ ] Routing configuration

4. **Troubleshooting Guides**
   - [ ] Common deployment issues
   - [ ] Routing issues
   - [ ] DNS issues
   - [ ] Build issues

5. **Safety Documentation**
   - [ ] Pre-deployment checklist
   - [ ] Post-deployment verification
   - [ ] Rollback procedures
   - [ ] Server impact considerations

### Documentation Standards

- ✅ **OCD Accuracy**: 100% accuracy required
- ✅ **Code Examples**: All examples tested and working
- ✅ **File Paths**: All paths verified (relative paths correct)
- ✅ **Version Numbers**: All versions current
- ✅ **Links**: All links tested and working
- ✅ **Cross-References**: All references updated
- ✅ **Terminology**: Consistent terminology
- ✅ **No Outdated Info**: No outdated information
- ✅ **No Broken References**: All references work

---

## Safety & Server Impact Considerations

### Pre-Deployment Safety Checklist

- [ ] All builds succeed locally
- [ ] All tests pass
- [ ] No breaking changes
- [ ] Rollback plan documented
- [ ] Server impact assessed
- [ ] DNS changes planned (if applicable)
- [ ] Backup of current deployment
- [ ] Deployment window identified
- [ ] Team notified

### Post-Deployment Verification

- [ ] All routes accessible
- [ ] No 404 errors
- [ ] SSL certificates valid
- [ ] Performance acceptable
- [ ] No console errors
- [ ] All apps functional
- [ ] Monitoring shows healthy status

### Rollback Procedures

1. **Git-based Rollback**
   - Revert commit
   - Push to trigger new deployment
   - Verify rollback successful

2. **Vercel Rollback**
   - Use Vercel dashboard to rollback
   - Select previous deployment
   - Promote to production

3. **DNS Rollback** (if applicable)
   - Revert DNS changes
   - Wait for propagation
   - Verify old configuration works

---

## Priority Summary

### Immediate (Do First)
1. **TICKET-0.1**: Fix sub-folder route 404 issue
2. **TICKET-1.1**: Document current deployment workflow
3. **TICKET-1.4**: Create deployment safety checklist

### High Priority (Do Next)
4. **TICKET-1.2**: Implement GitHub → Vercel auto-deployment
5. **TICKET-2.1**: Complete self-sovereign app configuration
6. **TICKET-2.2**: Create self-sovereign app deployment script

### Medium Priority
7. **TICKET-3.1**: Research subdomain configuration
8. **TICKET-3.2**: Configure DNS for subdomains
9. **TICKET-4.1**: Design mother-child app architecture

### Low Priority (Future)
10. **TICKET-5.1**: Implement smart routing system
11. **TICKET-5.2**: Optimize build process
12. **TICKET-5.3**: Implement deployment monitoring

---

## Success Metrics

### Phase 0 Success
- ✅ All sub-app routes return 200 (not 404)
- ✅ Routes handle catch-all paths correctly

### Phase 1 Success
- ✅ Complete deployment documentation
- ✅ GitHub → Vercel auto-deployment working
- ✅ Safety checklists in place

### Phase 2 Success
- ✅ All apps deploy as self-sovereign
- ✅ All apps work in isolation
- ✅ Configuration documented

### Phase 3 Success
- ✅ At least 3 subdomains working
- ✅ DNS configuration documented
- ✅ SSL certificates active

### Phase 4 Success
- ✅ Mother app deployed
- ✅ At least 3 child apps working
- ✅ CSS isolation verified

### Phase 5 Success
- ✅ Smart routing implemented
- ✅ Build times optimized
- ✅ Monitoring in place

---

## Next Steps

1. **Review this plan** with team
2. **Prioritize tickets** based on business needs
3. **Assign tickets** to team members
4. **Start with Phase 0** (fix current issues)
5. **Document as you go** (don't skip documentation)
6. **Test thoroughly** before moving to next phase
7. **Review and adjust** plan as needed

---

**Last Updated**: January 1, 2026  
**Next Review**: After Phase 0 completion

