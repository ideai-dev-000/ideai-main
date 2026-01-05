# Submodule Deployment Strategy

**Version**: 1.0.0  
**Last Updated**: January 3, 2026  
**Status**: ⚠️ SUPERSEDED - See Integrated Strategy  
**Priority**: High (Second Priority Task)

> **NOTE**: This document recommended separate Vercel projects. However, the **integrated approach** is now the recommended strategy. See `submodule-deployment-strategy-integrated.md` for the current approach.

---

## Overview

This document analyzes deployment strategies for Git submodules in the IdeaI monorepo. Submodules (like `apps/ideai-designer`) need a deployment strategy that aligns with IdeaI's architecture and deployment patterns.

---

## Current Deployment Context

### IdeaI Monorepo Deployment

- **Strategy**: Each app is a separate Vercel project
- **Root Directory**: `apps/{app-name}` (relative to repo root)
- **Deployment Script**: `deploy.sh` uses symlink trick to deploy from repo root
- **Current Apps**: 13 apps deployed independently
- **URL Pattern**: Each app gets its own Vercel URL (e.g., `web-idea-i.vercel.app`)

### Current Submodules

1. **`apps/ideai-designer`**
   - Repository: https://github.com/ideai-dev-000/ideai-designer.git
   - Status: Synced with v0
   - **Not currently deployed**

2. **`tools/code-context`**
   - Repository: https://github.com/ideai-dev/ideai-codecontext.git
   - Status: Local development only (not for production deployment)

---

## Deployment Options

### Option A: Separate Vercel Projects (Recommended)

**Strategy**: Each submodule gets its own Vercel project, deployed independently.

#### How It Works

1. **Create Vercel Project**
   - Create new Vercel project for submodule (e.g., `ideai-designer`)
   - Link to submodule repository (not ideai-main)
   - Configure Root Directory: `apps/ideai-designer` (relative to submodule repo root)

2. **Deployment Process**
   - Submodule repository has its own CI/CD
   - Deploys independently from ideai-main
   - Uses same deployment script pattern as main apps

3. **Integration with IdeaI**
   - IdeaI monorepo references submodule via Git submodule
   - IdeaI apps can embed submodule via iframe or API
   - Submodule URL is independent (e.g., `ideai-designer-idea-i.vercel.app`)

#### Pros ✅

1. **Isolation**
   - Independent deployments
   - No conflicts with main monorepo
   - Separate scaling and configuration

2. **Flexibility**
   - Submodule can deploy on its own schedule
   - Independent versioning
   - Can use different Vercel settings

3. **Clear Ownership**
   - Submodule repository owns its deployment
   - Clear separation of concerns
   - Easier to manage permissions

4. **Consistency**
   - Matches current IdeaI deployment pattern (each app = separate project)
   - Same Root Directory pattern as main apps
   - Familiar workflow for team

5. **Parent-Child Architecture**
   - Aligns with IdeaI parent-child patterns
   - Parent app (ideai-main) can embed child (submodule)
   - Clear hierarchy

6. **Development Workflow**
   - v0 development → commit to submodule repo → auto-deploy
   - IdeaI alignment → update submodule reference in ideai-main
   - Clear separation of concerns

#### Cons ❌

1. **More Projects to Manage**
   - Additional Vercel project per submodule
   - More dashboard configuration
   - More URLs to track

2. **Separate Domains**
   - Each submodule gets its own domain
   - May need custom domain setup
   - CORS considerations if embedding

3. **Deployment Coordination**
   - Submodule deploys independently
   - May need coordination for breaking changes
   - Version compatibility management

#### Implementation Steps

1. **Create Vercel Project**

   ```bash
   # In submodule repository
   cd apps/ideai-designer
   vercel link
   # Follow prompts to create new project
   ```

2. **Configure Vercel Dashboard**
   - Root Directory: `apps/ideai-designer` (or root if submodule is at root)
   - Framework: Next.js
   - Build Command: `pnpm build`
   - Install Command: `pnpm install`
   - Include files outside root: ✅ Enabled (if needed)

3. **Add Deployment Script**

   ```bash
   # In submodule repository
   # Add deploy.sh similar to ideai-main
   ```

4. **Update IdeaI Integration**

   ```typescript
   // In IdeaI apps that use submodule
   const DESIGNER_URL =
     process.env.NEXT_PUBLIC_DESIGNER_URL ||
     "https://ideai-designer-idea-i.vercel.app";
   ```

5. **Documentation**
   - Update deployment docs
   - Add submodule deployment guide
   - Document integration patterns

---

### Option B: Folders in ideai-main

**Strategy**: Deploy submodules as folders within ideai-main Vercel project.

#### How It Works

1. **Single Vercel Project**
   - Use existing `web` project (or create new unified project)
   - Configure routing to serve submodules at specific paths
   - Deploy entire ideai-main monorepo

2. **Routing Configuration**
   - Next.js rewrites to route `/designer` → `apps/ideai-designer`
   - Or use middleware to route based on path
   - Submodules served as part of main site

3. **Deployment Process**
   - Single deployment for entire monorepo
   - Submodules included automatically
   - Unified domain and URL structure

#### Pros ✅

1. **Single Project**
   - One Vercel project to manage
   - Unified domain
   - Simpler dashboard

2. **Unified Deployment**
   - Deploy everything together
   - Consistent versioning
   - Single deployment pipeline

3. **Shared Resources**
   - Same domain = no CORS issues
   - Shared environment variables
   - Unified analytics

#### Cons ❌

1. **Complex Routing**
   - Need Next.js rewrites or middleware
   - Path conflicts possible
   - More complex configuration

2. **Deployment Coupling**
   - Submodule changes require full monorepo deployment
   - Slower deployments (deploy everything)
   - Risk of breaking main site

3. **Scaling Limitations**
   - Can't scale submodules independently
   - Shared resources and limits
   - Less flexibility

4. **Development Workflow**
   - v0 changes → commit to submodule → update ideai-main → deploy everything
   - More steps, more coordination
   - Harder to test submodule in isolation

5. **Architecture Mismatch**
   - Doesn't align with IdeaI parent-child patterns (submodules should be independent)
   - Breaks separation of concerns
   - Harder to maintain

6. **Git Submodule Complexity**
   - Git submodules are already separate repos
   - Deploying as folders doesn't match Git structure
   - Confusing for developers

---

## Recommendation: Option A (Separate Vercel Projects)

### Rationale

1. **Architectural Alignment**
   - Matches IdeaI parent-child architecture
   - Submodules are independent entities
   - Clear separation of concerns

2. **Consistency**
   - Same pattern as current 13 apps
   - Team already familiar with separate projects
   - Predictable workflow

3. **Flexibility**
   - Independent deployments
   - Independent scaling
   - Independent configuration

4. **Development Workflow**
   - v0 → submodule repo → auto-deploy
   - IdeaI alignment → update reference
   - Clear separation of v0 development and IdeaI integration

5. **Maintainability**
   - Easier to debug (isolated)
   - Easier to rollback (independent)
   - Clearer ownership

### Implementation Plan

#### Phase 1: Setup (Week 1)

1. **Create Vercel Project**
   - Create `ideai-designer` project in Vercel
   - Link to submodule repository
   - Configure Root Directory

2. **Deployment Script**
   - Add `deploy.sh` to submodule repository
   - Test deployment process
   - Document deployment steps

3. **Integration Testing**
   - Test submodule deployment
   - Verify IdeaI integration
   - Test embedding in IdeaI apps

#### Phase 2: Documentation (Week 1)

1. **Update Deployment Docs**
   - Add submodule deployment guide
   - Document integration patterns
   - Update handover note

2. **Update Development Workflow**
   - Document v0 → deploy process
   - Update submodule development workflow
   - Add troubleshooting guide

#### Phase 3: Automation (Week 2)

1. **CI/CD Integration**
   - Add GitHub Actions to submodule repo
   - Auto-deploy on push
   - Add deployment status checks

2. **Deployment Scripts**
   - Enhance `deploy.sh` in ideai-main
   - Add submodule deployment option
   - Add verification steps

---

## Decision Matrix

| Factor                      | Option A (Separate)       | Option B (Folders)    |
| --------------------------- | ------------------------- | --------------------- |
| **Architectural Alignment** | ✅ Matches IdeaI patterns | ❌ Breaks separation  |
| **Consistency**             | ✅ Same as current apps   | ❌ Different pattern  |
| **Flexibility**             | ✅ Independent            | ❌ Coupled            |
| **Development Workflow**    | ✅ Clear separation       | ❌ More complex       |
| **Maintainability**         | ✅ Easier                 | ❌ Harder             |
| **Deployment Speed**        | ✅ Fast (isolated)        | ❌ Slow (full deploy) |
| **Scaling**                 | ✅ Independent            | ❌ Shared             |
| **Complexity**              | ✅ Simple                 | ❌ Complex routing    |

**Winner**: Option A (Separate Vercel Projects)

---

## Implementation Details

### Vercel Project Configuration

#### For Submodule Repository

**Project Settings**:

- **Project Name**: `ideai-designer`
- **Root Directory**: `apps/ideai-designer` (or root if submodule is at root)
- **Framework**: Next.js
- **Build Command**: `pnpm build`
- **Install Command**: `pnpm install`
- **Output Directory**: `.next`
- **Include files outside root**: ✅ Enabled (if accessing shared packages)

**Environment Variables**:

```env
NEXT_PUBLIC_VERCEL_PROJECT_NAME=ideai-designer
NEXT_PUBLIC_VERCEL_ORG_ID=idea-i
```

#### For IdeaI Integration

**Environment Variables** (in IdeaI apps):

```env
NEXT_PUBLIC_DESIGNER_URL=https://ideai-designer-idea-i.vercel.app
```

### Deployment Script (Submodule)

Create `deploy.sh` in submodule repository:

```bash
#!/bin/bash
# Deployment script for ideai-designer submodule

set -e

PROD_FLAG=""
if [[ "$1" == "--prod" ]]; then
  PROD_FLAG="--prod"
fi

echo "Deploying ideai-designer..."

if [ "$PROD_FLAG" == "--prod" ]; then
  vercel deploy --prod --yes
else
  vercel deploy --yes
fi

echo "✅ Deployment complete"
```

### Integration Pattern

In IdeaI apps that embed submodule:

```typescript
// apps/web/app/designer/page.tsx
export default function DesignerPage() {
  const designerUrl = process.env.NEXT_PUBLIC_DESIGNER_URL ||
    'https://ideai-designer-idea-i.vercel.app';

  return (
    <iframe
      src={designerUrl}
      className="w-full h-screen"
      title="IdeaI Designer"
    />
  );
}
```

---

## Migration Path

If currently using Option B (or no deployment):

1. **Create Vercel Project** (1 day)
   - Set up project in Vercel
   - Configure settings
   - Test deployment

2. **Add Deployment Script** (1 day)
   - Create `deploy.sh` in submodule
   - Test deployment process
   - Document steps

3. **Update Integration** (1 day)
   - Update IdeaI apps to use submodule URL
   - Add environment variables
   - Test embedding

4. **Documentation** (1 day)
   - Update deployment docs
   - Update development workflow
   - Update handover note

**Total**: ~4 days

---

## Success Criteria

Deployment strategy is successful when:

- [ ] Submodule deploys independently
- [ ] Submodule has its own Vercel project
- [ ] Submodule URL is accessible
- [ ] IdeaI apps can embed submodule
- [ ] Deployment process is documented
- [ ] Team understands workflow
- [ ] CI/CD is configured (optional)

---

## Next Steps

1. **Decision**: Approve Option A (Separate Vercel Projects)
2. **Implementation**: Follow Phase 1-3 plan
3. **Documentation**: Update all relevant docs
4. **Testing**: Verify deployment and integration
5. **Rollout**: Deploy submodule to production

---

## Related Documentation

- **`docs/development/submodule-development-workflow.md`**: v0 → IdeaI alignment process
- **`docs/deployment/unified-deployment.md`**: Current IdeaI deployment strategy
- **`docs/HANDOVER-NOTE.md`**: Current project status
- **`TODOS.md`**: All pending tasks

---

**Last Updated**: January 3, 2026  
**Status**: Awaiting decision approval  
**Recommended**: Option A (Separate Vercel Projects)
