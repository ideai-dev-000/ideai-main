---
title: GitHub → Vercel Deployment Workflow
description: Complete guide for deploying IdeaI apps via GitHub Actions to Vercel
---

# GitHub → Vercel Deployment Workflow

**Last Updated**: January 1, 2026

## Overview

The **GitHub → Vercel** workflow is the **primary and recommended** deployment method for IdeaI monorepo. This workflow automatically deploys all apps to Vercel when code is pushed to GitHub, providing full version control, history, and automated CI/CD.

## How It Works

### Workflow Flow

\`\`\`
GitHub Push → GitHub Actions → Build & Test → Deploy to Vercel → Status Update
\`\`\`

1. **Developer pushes code** to GitHub (branch: `main`, `preview`, or `develop`)
2. **GitHub Actions triggers** automatically
3. **Build and test** runs (linting, type checking, build)
4. **Deploy job runs** based on branch:
   - `preview` branch → Preview deployment
   - `main` branch → Production deployment
5. **Vercel receives deployment** and builds apps
6. **Status updates** posted to PRs (if applicable)

## Workflow Files

### Main CI/CD Pipeline

**File**: `.github/workflows/ci-cd.yml`

**Triggers**:
- Push to `main`, `preview`, or `develop` branches
- Pull requests to `main`, `preview`, or `develop`

**Jobs**:

1. **Build and Test** (`build-and-test`)
   - Installs dependencies (`pnpm install --frozen-lockfile`)
   - Runs linting (`pnpm lint`)
   - Runs type checking (`pnpm check-types`)
   - Builds all applications (`pnpm build`)
   - **Condition**: Always runs on push/PR

2. **Deploy Preview** (`deploy-preview`)
   - **Condition**: Runs on `preview` branch OR pull requests
   - Authenticates with Vercel
   - Deploys all apps using `./deploy.sh` (preview mode)
   - Comments preview URLs on PRs

3. **Deploy Production** (`deploy-production`)
   - **Condition**: Runs on `main` branch only
   - Authenticates with Vercel
   - Deploys all apps using `./deploy.sh --prod` (production mode)

### Preview Deployment Workflow

**File**: `.github/workflows/preview-deploy.yml`

**Purpose**: Simplified workflow focused on preview deployments

**Triggers**:
- Push to `preview` branch
- Pull requests to `preview` or `main`

**Steps**:
1. Checkout code
2. Setup Node.js and pnpm
3. Install dependencies
4. Run linting
5. Run type checking
6. Install Vercel CLI
7. Authenticate with Vercel
8. Deploy all apps using `deploy.sh` script
9. Comment preview URLs on PRs

## Usage

### Preview Deployment

**Trigger**: Push to `preview` branch or create PR

\`\`\`bash
# Switch to preview branch
git checkout preview

# Make changes and commit
git add .
git commit -m "feat(web): add new feature"

# Push to trigger preview deployment
git push origin preview
\`\`\`

**Result**:
- ✅ All apps deployed to Vercel preview
- ✅ Preview URLs available in Vercel dashboard
- ✅ PR comments with deployment status (if PR)

### Production Deployment

**Trigger**: Push to `main` branch

\`\`\`bash
# Switch to main branch
git checkout main

# Merge changes from preview
git merge preview

# Push to trigger production deployment
git push origin main
\`\`\`

**Result**:
- ✅ All apps deployed to Vercel production
- ✅ Production URLs updated
- ✅ All 13 apps deployed automatically

### Pull Request Deployment

**Trigger**: Create PR to `main`, `preview`, or `develop`

**Workflow**:
1. Create PR from feature branch
2. GitHub Actions automatically runs
3. Preview deployment created
4. PR comment posted with deployment status

**Benefits**:
- ✅ Preview deployments for every PR
- ✅ Easy testing before merge
- ✅ Automatic status updates

## Required Configuration

### GitHub Secrets

All workflows require these secrets configured in GitHub:

1. **VERCEL_TOKEN** (Required)
   - Vercel authentication token
   - Get from: [Vercel Settings → Tokens](https://vercel.com/account/tokens)
   - Scope: Full access

2. **VERCEL_ORG_ID** (Required)
   - Vercel organization ID
   - Value: `team_vhjzlMi6CfNow0IfBXnv2Yn2`
   - Get from: Vercel dashboard → Settings → General

3. **TURBO_TOKEN** (Optional)
   - For Turborepo remote caching
   - Speeds up builds

4. **TURBO_TEAM** (Optional)
   - Turborepo team name

**Setup**: See [GitHub Secrets Setup](../setup/github-secrets.md) for automated setup script.

### Branch Protection (Recommended)

For safe deployments, configure branch protection rules:

**For `main` branch** (production):
- ✅ Require pull request before merging
- ✅ Require status checks to pass (`build-and-test`, `deploy-preview`)
- ✅ Require at least 1 approval
- ✅ Do not allow bypassing

**For `preview` branch** (preview/staging):
- ✅ Require status checks to pass (`build-and-test`)
- ⚠️ Optional: Require pull request before merging

**Setup**: See [Branch Protection Setup](../setup/branch-protection.md) for detailed configuration.

### Vercel Project Configuration

Each app must be configured in Vercel dashboard:

1. **Root Directory**: `apps/{app-name}`
   - Example: `apps/web`, `apps/docs`
   - Must be relative to repo root

2. **Include files outside root directory**: ✅ Enabled
   - Required for monorepo workspace dependencies

3. **Framework**: Next.js (auto-detected)

4. **Build Command**: Auto-detected from `package.json`

5. **Install Command**: Auto-detected (pnpm)

**Setup**: See [Vercel Configuration](./vercel.md)

## Deployment Script

The workflows use the unified `deploy.sh` script:

**Preview Mode**:
\`\`\`bash
./deploy.sh
\`\`\`

**Production Mode**:
\`\`\`bash
./deploy.sh --prod
\`\`\`

**Single App**:
\`\`\`bash
./deploy.sh --prod web
\`\`\`

**Script Features**:
- ✅ Auto-discovers all apps
- ✅ Handles Vercel project linking
- ✅ Deploys from repo root (respects Root Directory)
- ✅ Supports preview and production modes
- ✅ Deploys single or multiple apps

**Details**: See [Unified Deployment Guide](./unified-deployment.md)

## Branch Strategy

### Main Branch (`main`)
- **Purpose**: Production deployments
- **Trigger**: Production deployment on push
- **Protection**: Should require PR reviews (recommended)

### Preview Branch (`preview`)
- **Purpose**: Preview/staging deployments
- **Trigger**: Preview deployment on push
- **Usage**: Test before production

### Develop Branch (`develop`)
- **Purpose**: Development/testing
- **Trigger**: Preview deployment on push
- **Usage**: Active development

### Feature Branches
- **Purpose**: Feature development
- **Trigger**: Preview deployment on PR
- **Usage**: Individual features

## Monitoring & Status

### Viewing Workflow Runs

1. Navigate to [GitHub Actions](https://github.com/ideai-dev-000/ideai-main/actions)
2. Click on a workflow run to see details
3. Expand job steps to view logs
4. Check deployment status in Vercel dashboard

### Workflow Status Badges

Add to README:

\`\`\`markdown
![CI/CD](https://github.com/ideai-dev-000/ideai-main/workflows/CI%2FCD%20Pipeline/badge.svg)
\`\`\`

### Deployment Status

- **GitHub Actions**: Shows build/test status
- **Vercel Dashboard**: Shows deployment status
- **PR Comments**: Shows preview deployment URLs

## Benefits

✅ **Full Version Control**: All deployments tracked in git  
✅ **Automated CI/CD**: No manual deployment steps  
✅ **Pull Request Previews**: Automatic preview deployments  
✅ **Rollback Support**: Easy rollback via git revert  
✅ **History**: Complete deployment history in GitHub  
✅ **Team Collaboration**: All deployments visible to team  
✅ **Safety**: Build/test before deployment  

## Limitations

⚠️ **Requires GitHub Push**: Must push to GitHub to deploy  
⚠️ **GitHub Actions Dependency**: Relies on GitHub Actions availability  
⚠️ **Secret Management**: Requires GitHub secrets configuration  

## Troubleshooting

### Workflow Not Triggering

**Check**:
1. Branch name matches workflow triggers (`main`, `preview`, `develop`)
2. Workflow file syntax is valid YAML
3. GitHub Actions is enabled for repository
4. Workflow file is in `.github/workflows/` directory

**Solution**:
- Verify branch name
- Check workflow file for syntax errors
- Ensure GitHub Actions is enabled

### Deployment Fails

**Check**:
1. All required secrets are set (`VERCEL_TOKEN`, `VERCEL_ORG_ID`)
2. Vercel project is linked (`.vercel/project.json` exists)
3. Root Directory is set correctly in Vercel dashboard
4. "Include files outside root directory" is enabled

**Solution**:
- Verify secrets in GitHub Settings → Secrets
- Check Vercel project configuration
- Review workflow logs for specific errors

### Build Timeouts

**Check**:
1. Build time exceeds timeout limit (default: 15-20 minutes)
2. Build process is optimized

**Solution**:
- Increase `timeout-minutes` in workflow file
- Optimize build process
- Use Turborepo remote caching (`TURBO_TOKEN`)

### Authentication Errors

**Check**:
1. `VERCEL_TOKEN` is valid and not expired
2. Token has correct permissions

**Solution**:
- Regenerate token in Vercel dashboard
- Update secret in GitHub Settings → Secrets

## Best Practices

1. ✅ **Always use PRs**: Create PRs for code review before merge
2. ✅ **Test in preview**: Deploy to preview before production
3. ✅ **Monitor deployments**: Check GitHub Actions and Vercel dashboards
4. ✅ **Use feature branches**: Develop features in separate branches
5. ✅ **Keep workflows simple**: Avoid complex workflow logic
6. ✅ **Document changes**: Update docs when workflows change
7. ✅ **Test locally first**: Run `pnpm build` before pushing

## Related Documentation

- [Vercel CLI Direct Deployment](./workflow-vercel-direct.md)
- [Deployment Decision Matrix](./deployment-decision-matrix.md)
- [Rollback Procedures](./rollback-procedures.md)
- [Unified Deployment Guide](./unified-deployment.md)
- [CI/CD Workflows](./ci-cd.md)
- [Vercel Configuration](./vercel.md)
- [GitHub Secrets Setup](../setup/github-secrets.md)
- [Branch Protection Setup](../setup/branch-protection.md)
