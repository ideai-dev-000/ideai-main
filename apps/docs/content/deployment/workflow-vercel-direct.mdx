---
title: Vercel CLI Direct Deployment Workflow
description: Guide for deploying IdeaI apps directly via Vercel CLI (backup workflow)
---

# Vercel CLI Direct Deployment Workflow

**Last Updated**: January 1, 2026

## Overview

The **Vercel CLI Direct** workflow is a **backup deployment method** for IdeaI monorepo. This workflow allows direct deployment from local machine or CI/CD using Vercel CLI, bypassing GitHub Actions. Useful for quick iterations, emergency deployments, or when GitHub Actions is unavailable.

## When to Use

### Recommended Use Cases

✅ **Quick Iterations**: Fast deployment during active development  
✅ **Emergency Deployments**: When GitHub Actions is down  
✅ **Local Testing**: Test deployment process locally  
✅ **Debugging**: Debug deployment issues directly  
✅ **One-off Deployments**: Deploy single app quickly  

### Not Recommended For

❌ **Regular Deployments**: Use GitHub → Vercel workflow instead  
❌ **Team Workflows**: Team should use GitHub → Vercel for consistency  
❌ **Production Critical**: Prefer GitHub → Vercel for production safety  

## Prerequisites

### Required Tools

1. **Vercel CLI**: Installed globally
   ```bash
   npm install -g vercel@latest
   ```

2. **Vercel Account**: Logged in
   ```bash
   vercel login
   ```

3. **Project Linked**: Each app must be linked to Vercel project
   ```bash
   cd apps/web
   vercel link
   ```

### Required Environment Variables

- `VERCEL_TOKEN` (optional, if using non-interactive mode)
- `VERCEL_ORG_ID` (optional, if using non-interactive mode)

## Deployment Methods

### Method 1: Using deploy.sh Script (Recommended)

The unified `deploy.sh` script works with Vercel CLI:

**Preview Deployment**:
```bash
./deploy.sh
```

**Production Deployment**:
```bash
./deploy.sh --prod
```

**Single App**:
```bash
./deploy.sh --prod web
```

**With Token**:
```bash
VERCEL_TOKEN=your_token ./deploy.sh --prod
```

### Method 2: Direct Vercel CLI

**From App Directory**:
```bash
cd apps/web
vercel deploy --prod
```

**From Repo Root** (requires symlink setup):
```bash
# Create symlink (deploy.sh does this automatically)
ln -s apps/web/.vercel .vercel

# Deploy
vercel deploy --prod

# Remove symlink
rm .vercel
```

## Workflow Process

### Step-by-Step

1. **Ensure Project is Linked**
   ```bash
   cd apps/web
   vercel link
   ```
   - Select existing project or create new
   - Project config saved to `.vercel/project.json`

2. **Verify Configuration**
   - Root Directory: `apps/{app-name}` (in Vercel dashboard)
   - Include files outside root: ✅ Enabled

3. **Deploy**
   ```bash
   # From repo root (recommended)
   ./deploy.sh --prod web
   
   # Or from app directory
   cd apps/web
   vercel deploy --prod
   ```

4. **Verify Deployment**
   - Check Vercel dashboard
   - Visit deployment URL
   - Verify app works correctly

## Git Sync (CRITICAL)

### ⚠️ Important: Sync to GitHub After Deployment

When deploying directly via Vercel CLI, **you must sync changes to GitHub** to maintain version control.

**See**: [Vercel → GitHub Sync Workflow](./workflow-vercel-to-github.md) for complete sync guide.

### Option 1: Manual Git Push (Recommended)

```bash
# After Vercel deployment
git add .
git commit -m "deploy(web): deploy to production via CLI"
git push origin main
```

### Option 2: Auto-commit Script

Create a script to auto-commit after deployment:

```bash
#!/bin/bash
# scripts/post-vercel-deploy.sh

# Deploy via Vercel CLI
./deploy.sh --prod "$@"

# Commit and push
git add .
git commit -m "deploy($1): deploy via Vercel CLI"
git push origin main
```

**Usage**:
```bash
./scripts/post-vercel-deploy.sh web
```

### Option 3: Vercel Webhook (Future)

**Note**: Vercel doesn't automatically push to GitHub. You must manually sync.

**Future Enhancement**: Create webhook to auto-commit deployment info to GitHub.

## Deployment Script Details

The `deploy.sh` script handles:

1. **Project Linking**: Auto-links if not linked
2. **Symlink Creation**: Creates `.vercel` symlink in repo root
3. **Deployment**: Deploys from repo root (respects Root Directory)
4. **Cleanup**: Removes symlink after deployment

**See**: [Unified Deployment Guide](./unified-deployment.md) for details

## Non-Interactive Mode

For CI/CD or automated scripts:

```bash
# Set environment variables
export VERCEL_TOKEN=your_token
export VERCEL_ORG_ID=your_org_id

# Deploy
./deploy.sh --prod
```

**Note**: Token must have full access to organization and projects.

## Troubleshooting

### Error: "Project not linked"

**Solution**:
```bash
cd apps/web
vercel link
```

Or use `deploy.sh` which auto-links:
```bash
./deploy.sh --prod web
```

### Error: "Cannot find .vercel directory"

**Solution**:
- Ensure project is linked: `cd apps/web && vercel link`
- Or use `deploy.sh` which handles this automatically

### Error: "Root Directory not found"

**Solution**:
1. Check Root Directory in Vercel dashboard
2. Should be: `apps/{app-name}` (relative to repo root)
3. Enable "Include files outside root directory"

### Error: "Authentication failed"

**Solution**:
```bash
vercel login
```

Or set `VERCEL_TOKEN`:
```bash
export VERCEL_TOKEN=your_token
```

### Deployment Succeeds But Code Not Updated

**Cause**: Deployed from wrong directory or Root Directory misconfigured

**Solution**:
1. Verify Root Directory in Vercel dashboard
2. Deploy from repo root using `deploy.sh`
3. Check deployment logs in Vercel dashboard

## Best Practices

1. ✅ **Use deploy.sh**: Always use unified script for consistency
2. ✅ **Sync to GitHub**: Always commit and push after CLI deployment
3. ✅ **Test Locally**: Run `pnpm build` before deploying
4. ✅ **Verify Configuration**: Check Root Directory before deploying
5. ✅ **Document Deployments**: Add commit message explaining why CLI was used
6. ✅ **Prefer GitHub → Vercel**: Use GitHub workflow for regular deployments
7. ✅ **Emergency Only**: Reserve CLI for emergencies or quick iterations

## Comparison: GitHub → Vercel vs Vercel CLI

| Feature | GitHub → Vercel | Vercel CLI |
|---------|----------------|------------|
| **Version Control** | ✅ Automatic | ⚠️ Manual sync required |
| **History** | ✅ Full git history | ⚠️ Must commit manually |
| **Team Visibility** | ✅ Visible to all | ⚠️ Only local |
| **Automation** | ✅ Fully automated | ⚠️ Manual steps |
| **Speed** | ⚠️ Slower (CI/CD) | ✅ Faster (direct) |
| **Reliability** | ✅ More reliable | ⚠️ Depends on local setup |
| **Rollback** | ✅ Easy (git revert) | ⚠️ Must deploy previous version |
| **Recommended** | ✅ **Primary method** | ⚠️ Backup only |

## When to Use Each

### Use GitHub → Vercel When:
- ✅ Regular deployments
- ✅ Team collaboration
- ✅ Production deployments
- ✅ Need full history
- ✅ Want automated CI/CD

### Use Vercel CLI When:
- ✅ Quick iterations during development
- ✅ GitHub Actions is down
- ✅ Testing deployment process
- ✅ Debugging deployment issues
- ✅ Emergency hotfixes

## Related Documentation

- [Vercel → GitHub Sync Workflow](./workflow-vercel-to-github.md) - **CRITICAL**: Sync CLI deployments to GitHub
- [GitHub → Vercel Workflow](./workflow-git-to-vercel.md)
- [Deployment Decision Matrix](./deployment-decision-matrix.md)
- [Rollback Procedures](./rollback-procedures.md)
- [Unified Deployment Guide](./unified-deployment.md)
- [Vercel Configuration](./vercel.md)

