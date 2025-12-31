---
title: CI/CD Workflows
description: Detailed documentation of GitHub Actions workflows for CI/CD, including build, test, preview, and production deployments.
---
# CI/CD Workflows

This document describes the GitHub Actions workflows configured for this project.

## Workflows

### 1. Main CI/CD Pipeline

**File**: `.github/workflows/ci-cd.yml`

**Triggers**:
- Push to `main`, `preview`, or `develop` branches
- Pull requests to `main`, `preview`, or `develop`

**Jobs**:

#### Build and Test
- Installs dependencies
- Runs linting (`pnpm lint`)
- Runs type checking (`pnpm check-types`)
- Builds all applications (`pnpm build`)
- Uploads build artifacts

#### Deploy Preview
- **Condition**: Runs on `preview` branch or pull requests
- Uses `deploy.sh` script to deploy all apps to Vercel preview
- Comments preview URLs on pull requests

#### Deploy Production
- **Condition**: Runs on `main` branch only
- Uses `deploy.sh --prod` script to deploy all apps to Vercel production

### 2. Preview Deployment

**File**: `.github/workflows/preview-deploy.yml`

**Triggers**:
- Push to `preview` branch
- Pull requests to `preview` or `main`

**Purpose**: Simplified workflow focused on preview deployments

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

## Workflow Configuration

### Required Secrets

All workflows require these GitHub secrets:
- `VERCEL_TOKEN` - Vercel authentication token (required)
- `VERCEL_ORG_ID` - Vercel organization ID (required)
- `VERCEL_PROJECT_ID` - Optional (not needed when using deploy.sh script)

See [GitHub Secrets Setup](../setup/github-secrets.md) for configuration.

### Optional Secrets

- `TURBO_TOKEN` - For Turborepo remote caching
- `TURBO_TEAM` - Turborepo team name

## Workflow Execution

### Viewing Workflow Runs

1. Navigate to [GitHub Actions](https://github.com/ideai-dev-000/ideai-main/actions)
2. Click on a workflow run to see details
3. Expand job steps to view logs

### Workflow Status Badges

Add to your README:

```markdown
![CI/CD](https://github.com/ideai-dev-000/ideai-main/workflows/CI%2FCD%20Pipeline/badge.svg)
```

## Customization

### Modifying Workflows

Workflows are located in `.github/workflows/`:
- Edit YAML files to modify behavior
- Test changes by pushing to a feature branch
- Workflows run automatically on push

### Adding New Jobs

Example job structure:

```yaml
jobs:
  new-job:
    name: New Job
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      # Add your steps here
```

### Deployment Process

The workflows use the unified `deploy.sh` script which:
1. Automatically discovers all apps
2. Deploys each app to its corresponding Vercel project
3. Uses Root Directory settings from Vercel dashboard
4. Handles monorepo complexity automatically

**Preview Deployment**:
```yaml
- name: Deploy all apps to Preview
  run: ./deploy.sh
  env:
    VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}
    VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
```

**Production Deployment**:
```yaml
- name: Deploy all apps to Production
  run: ./deploy.sh --prod
  env:
    VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}
    VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
```

## Best Practices

- ✅ Keep workflows focused and simple
- ✅ Use matrix builds for multiple Node versions
- ✅ Cache dependencies to speed up builds
- ✅ Fail fast on linting/type errors
- ✅ Use environment-specific secrets
- ✅ Add status badges to README

## Troubleshooting

### Workflow Not Triggering
- Check branch names match workflow triggers
- Verify workflow file syntax (YAML)
- Check GitHub Actions is enabled for repository

### Deployment Fails
- Verify all required secrets are set
- Check Vercel project configuration
- Review workflow logs for specific errors

### Build Timeouts
- Increase `timeout-minutes` in workflow
- Optimize build process
- Use Turborepo remote caching

## Related Documentation

- [Deployment Overview](./overview.md)
- [Vercel Configuration](./vercel.md)
- [GitHub Secrets Setup](../setup/github-secrets.md)

