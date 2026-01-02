---
title: Deployment Debugging Guide
description: Complete guide for debugging and fixing deployment issues for preview and production
---

# Deployment Debugging Guide

This guide helps you debug and fix deployment issues for both preview and production environments.

## Quick Status Check

### Test Local Deployment

```bash
# Test preview deployment
./deploy.sh web

# Test production deployment
./deploy.sh --prod web
```

### Check Vercel Authentication

```bash
# Verify you're logged in
vercel whoami

# List all projects
vercel project ls
```

### Check Project Linking

```bash
# Verify project is linked
cat apps/web/.vercel/project.json
cat apps/docs/.vercel/project.json
```

## Common Issues and Fixes

### Issue 1: "Project not linked"

**Symptoms**: `❌ Project not linked: apps/web`

**Fix**:
```bash
cd apps/web
vercel link
# Select your project when prompted
```

### Issue 2: "Cannot find module '@repo/ui'"

**Symptoms**: Build fails with module resolution errors

**Fix**:
1. Go to Vercel dashboard → Project Settings → General
2. Verify **Root Directory** is set to: `apps/web` (or `apps/docs`)
3. **Enable** "Include files outside the root directory in the Build Step"
4. Save and redeploy

### Issue 3: "Unauthorized" or "Invalid token"

**Symptoms**: Deployment fails with authentication error

**Fix**:
```bash
# Re-authenticate
vercel login

# Or set token explicitly
export VERCEL_TOKEN="your_token_here"
```

### Issue 4: GitHub Actions Deployment Fails

**Symptoms**: Workflow runs but deployment step fails

**Check**:
1. Verify secrets are set:
   ```bash
   gh secret list --repo ideai-dev-000/ideai-main
   ```
2. Required secrets:
   - `VERCEL_TOKEN`
   - `VERCEL_ORG_ID`
   - `VERCEL_PROJECT_ID` (optional, not needed for deploy.sh)

**Fix**:
- Update secrets if needed
- Verify token hasn't expired

### Issue 5: Wrong Project Deploys

**Symptoms**: Changes to `apps/web` deploy to `docs` project

**Fix**:
1. Check `.vercel/project.json` in each app:
   ```bash
   cat apps/web/.vercel/project.json
   cat apps/docs/.vercel/project.json
   ```
2. Verify Root Directory in Vercel dashboard matches
3. Re-link if needed:
   ```bash
   cd apps/web
   vercel link
   ```

## Deployment Workflow

### Manual Deployment (Command Line)

#### Preview Deployment
```bash
# Deploy all apps (preview)
./deploy.sh

# Deploy specific app (preview)
./deploy.sh web
./deploy.sh docs
```

#### Production Deployment
```bash
# Deploy all apps (production)
./deploy.sh --prod

# Deploy specific app (production)
./deploy.sh --prod web
./deploy.sh --prod docs
```

### Automatic Deployment (Git Push)

#### Preview Environment
- **Trigger**: Push to `preview` branch or create PR
- **Workflow**: `.github/workflows/preview-deploy.yml`
- **Result**: All apps deployed to preview URLs

#### Production Environment
- **Trigger**: Push to `main` branch
- **Workflow**: `.github/workflows/ci-cd.yml` → `deploy-production` job
- **Result**: All apps deployed to production URLs

## Verification Steps

### 1. Verify Vercel Configuration

For each app, check in Vercel dashboard:

- ✅ **Root Directory**: `apps/{app-name}`
- ✅ **Include files outside root**: Enabled
- ✅ **Framework**: Next.js (auto-detected)
- ✅ **Build Command**: Auto-detected
- ✅ **Install Command**: Auto-detected (pnpm)

### 2. Verify Project Linking

```bash
# Check web app
cat apps/web/.vercel/project.json
# Should show: {"projectId":"...","orgId":"...","projectName":"web"}

# Check docs app
cat apps/docs/.vercel/project.json
# Should show: {"projectId":"...","orgId":"...","projectName":"docs"}
```

### 3. Test Deployment Locally

```bash
# Test preview
./deploy.sh web

# Test production
./deploy.sh --prod web
```

### 4. Check GitHub Secrets

```bash
# List secrets (names only)
gh secret list --repo ideai-dev-000/ideai-main

# Should see:
# - VERCEL_TOKEN
# - VERCEL_ORG_ID
# - VERCEL_PROJECT_ID (optional)
```

## Debugging Commands

### Vercel CLI

```bash
# Check authentication
vercel whoami

# List projects
vercel project ls

# Inspect deployment
vercel inspect <deployment-url>

# View deployment logs
vercel logs <deployment-url>

# Check project info
vercel project ls --scope idea-i
```

### GitHub Actions

```bash
# View workflow runs
gh run list --repo ideai-dev-000/ideai-main

# View specific run logs
gh run view <run-id> --log --repo ideai-dev-000/ideai-main

# Re-run failed workflow
gh run rerun <run-id> --repo ideai-dev-000/ideai-main
```

## Step-by-Step Debugging

### If Preview Deployment Fails

1. **Check local deployment works**:
   ```bash
   ./deploy.sh web
   ```

2. **If local works, check GitHub secrets**:
   ```bash
   gh secret list --repo ideai-dev-000/ideai-main
   ```

3. **Check workflow logs**:
   - Go to: https://github.com/ideai-dev-000/ideai-main/actions
   - Click on failed workflow run
   - Expand deployment step to see error

4. **Common fixes**:
   - Update `VERCEL_TOKEN` if expired
   - Verify `VERCEL_ORG_ID` is correct
   - Check project linking in each app

### If Production Deployment Fails

1. **Test production locally first**:
   ```bash
   ./deploy.sh --prod web
   ```

2. **Verify you're on main branch**:
   ```bash
   git branch --show-current
   ```

3. **Check workflow conditions**:
   - Production only deploys on `main` branch
   - Verify workflow file has correct branch condition

4. **Check Vercel dashboard**:
   - Go to project settings
   - Verify Root Directory is correct
   - Check "Include files outside root" is enabled

## Troubleshooting Checklist

- [ ] Vercel CLI authenticated (`vercel whoami`)
- [ ] Projects linked (`.vercel/project.json` exists)
- [ ] Root Directory set correctly in Vercel dashboard
- [ ] "Include files outside root" enabled
- [ ] GitHub secrets configured
- [ ] Local deployment works (`./deploy.sh web`)
- [ ] Workflow files are valid YAML
- [ ] Branch names match workflow triggers

## Getting Help

### Check Logs

1. **Vercel Dashboard**: https://vercel.com/idea-i
   - Click on project → Deployments → View logs

2. **GitHub Actions**: https://github.com/ideai-dev-000/ideai-main/actions
   - Click on workflow run → View logs

3. **Local Build**: 
   ```bash
   pnpm build
   ```

### Useful Links

- [Vercel Dashboard](https://vercel.com/idea-i)
- [GitHub Actions](https://github.com/ideai-dev-000/ideai-main/actions)
- [Vercel Documentation](https://vercel.com/docs)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)

## Related Documentation

- [Deployment Overview](./overview.md)
- [Vercel Configuration](./vercel.md)
- [CI/CD Workflows](./ci-cd.md)
- [GitHub Secrets Setup](../setup/github-secrets.md)



