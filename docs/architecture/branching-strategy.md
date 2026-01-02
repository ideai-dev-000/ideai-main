---
title: Branching Strategy for Vercel Projects
description: How to use Git branches with different Vercel projects
---

# Branching Strategy for Vercel Projects

Complete guide for using Git branches with Vercel project configuration.

## Overview

The IdeaI monorepo supports flexible branching strategies that work with Vercel's project system. You can:

1. **Same project, different branches** - All branches deploy to one project (preview/production)
2. **Branch-specific projects** - Different branches use different Vercel projects
3. **App-specific projects** - Each app has its own project, branches deploy to same project

## Strategy 1: Same Project, Different Branches (Recommended)

**Use case**: Standard workflow where all branches deploy to the same project

### Configuration

**All branches** use the same `.ideai.json`:

```json
// apps/web/.ideai.json (same on all branches)
{
  "vercelProject": {
    "projectName": "ideai-main",
    "forkToNew": false
  }
}
```

### How It Works

- **Main branch** → Production deployment
- **Feature branches** → Preview deployments
- **All use same project**: `ideai-main`

### Benefits

- ✅ Simple configuration
- ✅ All deployments in one place
- ✅ Easy to see all previews
- ✅ Standard Vercel workflow

### Example

```bash
# Main branch
git checkout main
./deploy.sh --prod web
# → Deploys to ideai-main (production)

# Feature branch
git checkout feature/new-feature
./deploy.sh web
# → Deploys to ideai-main (preview)
```

## Strategy 2: Branch-Specific Projects

**Use case**: Separate projects for different environments (staging, production, etc.)

### Configuration

**Main branch** (`apps/web/.ideai.json`):
```json
{
  "vercelProject": {
    "projectName": "ideai-main",
    "forkToNew": false
  }
}
```

**Develop branch** (`apps/web/.ideai.json`):
```json
{
  "vercelProject": {
    "projectName": "ideai-main-staging",
    "forkToNew": true
  }
}
```

### How It Works

- **Main branch** → `ideai-main` project (production)
- **Develop branch** → `ideai-main-staging` project (staging)
- **Feature branches** → Use branch-specific config or default

### Benefits

- ✅ Complete isolation between environments
- ✅ Different domains per environment
- ✅ Independent scaling
- ✅ Safe testing without affecting production

### Example

```bash
# Main branch
git checkout main
./deploy.sh --prod web
# → Deploys to ideai-main (production)

# Develop branch
git checkout develop
./deploy.sh --prod web
# → Deploys to ideai-main-staging (staging production)
```

## Strategy 3: App-Specific Projects

**Use case**: Each app has its own Vercel project, branches deploy to same project

### Configuration

**Web app** (`apps/web/.ideai.json`):
```json
{
  "vercelProject": {
    "projectName": "ideai-main",
    "forkToNew": false
  }
}
```

**Docs app** (`apps/docs/.ideai.json`):
```json
{
  "vercelProject": {
    "projectName": "docs",
    "forkToNew": false
  }
}
```

### How It Works

- **Web app** → `ideai-main` project
- **Docs app** → `docs` project
- **All branches** of each app deploy to its project

### Benefits

- ✅ Independent deployments per app
- ✅ Isolated failures
- ✅ Different scaling per app
- ✅ Clear separation of concerns

## Branching Workflow Examples

### Example 1: Feature Development

**Setup**:
```json
// apps/web/.ideai.json (all branches)
{
  "vercelProject": {
    "projectName": "ideai-main",
    "forkToNew": false
  }
}
```

**Workflow**:
```bash
# Create feature branch
git checkout -b feature/new-feature

# Make changes
# ...

# Deploy preview
./deploy.sh web
# → Preview URL: https://ideai-main-{hash}-idea-i.vercel.app

# Merge to main
git checkout main
git merge feature/new-feature

# Deploy production
./deploy.sh --prod web
# → Production URL: https://www.myui.space
```

### Example 2: Staging Environment

**Setup**:
```json
// apps/web/.ideai.json (develop branch)
{
  "vercelProject": {
    "projectName": "ideai-main-staging",
    "forkToNew": true
  }
}
```

**Workflow**:
```bash
# Develop branch
git checkout develop

# Deploy staging
./deploy.sh --prod web
# → Staging URL: https://ideai-main-staging.vercel.app

# Test staging, then merge to main
git checkout main
git merge develop

# Deploy production
./deploy.sh --prod web
# → Production URL: https://www.myui.space
```

## Best Practices

### 1. Keep Configs Simple

**Good**: Same config on all branches
```json
{
  "vercelProject": {
    "projectName": "ideai-main",
    "forkToNew": false
  }
}
```

**Avoid**: Complex branch-specific configs unless needed

### 2. Document Project Assignments

Add comments or documentation about which branches use which projects:

```json
{
  "vercelProject": {
    "projectName": "ideai-main",
    "forkToNew": false
    // All branches use ideai-main
    // Main → production
    // Feature branches → preview
  }
}
```

### 3. Use Environment Variables for Differences

Instead of different projects, use environment variables:

```bash
# Production
NEXT_PUBLIC_ENV=production ./deploy.sh --prod web

# Staging
NEXT_PUBLIC_ENV=staging ./deploy.sh --prod web
```

### 4. Branch Protection

Configure branch protection in Vercel:
- **Main branch**: Require verified commits
- **Feature branches**: Allow preview deployments

## Migration Between Strategies

### From Separate Projects to Same Project

**Before**:
```json
// apps/web/.ideai.json
{
  "vercelProject": {
    "projectName": "web",
    "forkToNew": false
  }
}
```

**After**:
```json
// apps/web/.ideai.json
{
  "vercelProject": {
    "projectName": "ideai-main",
    "forkToNew": false
  }
}
```

**Steps**:
1. Update `.ideai.json`
2. Re-link: `node scripts/ideai-vercel-link.mjs web`
3. Deploy: `./deploy.sh web`

### From Same Project to Separate Projects

**Before**:
```json
{
  "vercelProject": {
    "projectName": "ideai-main",
    "forkToNew": false
  }
}
```

**After**:
```json
{
  "vercelProject": {
    "projectName": "web",
    "forkToNew": true,
    "newProjectName": "web"
  }
}
```

**Steps**:
1. Update `.ideai.json`
2. Re-link: `node scripts/ideai-vercel-link.mjs web`
3. Deploy: `./deploy.sh web` (creates new project)

## Troubleshooting

### Issue: Wrong Project on Branch

**Symptom**: Branch deploys to wrong Vercel project

**Solution**:
1. Check `.ideai.json` on that branch
2. Verify `.vercel/project.json` matches
3. Re-link: `node scripts/ideai-vercel-link.mjs <app>`

### Issue: Project Not Found

**Symptom**: Deployment fails with "Project not found"

**Solution**:
1. Check project exists: `vercel projects ls`
2. Set `forkToNew: true` to auto-create
3. Or create project manually in Vercel dashboard

### Issue: Config Conflicts Between Branches

**Symptom**: Git merge conflicts in `.ideai.json`

**Solution**:
1. Decide on strategy (same project vs. separate)
2. Resolve conflicts
3. Re-link after merge

## Related Documentation

- [Vercel Project Configuration](./vercel-project-config.md)
- [Branch Workflow](../development/branch-workflow.md)
- [Vercel Configuration](../deployment/vercel.md)


