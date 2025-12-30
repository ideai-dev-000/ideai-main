# Deployment & CI/CD Setup

## Overview

This repository is configured with GitHub Actions for CI/CD and Vercel for preview deployments.

## CI/CD Workflows

### 1. Main CI/CD Pipeline (`.github/workflows/ci-cd.yml`)

Runs on:
- Push to `main`, `preview`, or `develop` branches
- Pull requests to `main`, `preview`, or `develop`

**Jobs:**
- **Build and Test**: Lints, type-checks, and builds all applications
- **Deploy Preview**: Deploys to Vercel preview environment (runs on `preview` branch or PRs)
- **Deploy Production**: Deploys to Vercel production (runs on `main` branch)

### 2. Preview Deployment (`.github/workflows/preview-deploy.yml`)

Simplified workflow for preview deployments:
- Runs on push to `preview` branch
- Runs on PRs to `preview` or `main`
- Builds, tests, and deploys to Vercel preview

## Required GitHub Secrets

Configure these in your GitHub repository settings (Settings → Secrets and variables → Actions):

1. **VERCEL_TOKEN** - Vercel authentication token
   - Get it from: https://vercel.com/account/tokens

2. **VERCEL_ORG_ID** - Your Vercel organization ID
   - Find it in: Vercel Dashboard → Settings → General

3. **VERCEL_PROJECT_ID** - Your Vercel project ID
   - Find it in: Vercel Dashboard → Project Settings → General

4. **TURBO_TOKEN** (optional) - For Turborepo remote caching
   - Get it from: `turbo login` then `turbo link`

5. **TURBO_TEAM** (optional) - Your Turborepo team name
   - Set after linking with `turbo link`

## Vercel Configuration

Each app has its own `vercel.json`:
- `apps/web/vercel.json` - Web app configuration
- `apps/docs/vercel.json` - Docs app configuration

## Deployment Process

### Preview Deployment
1. Push to `preview` branch or create a PR
2. GitHub Actions will:
   - Install dependencies
   - Run linting and type checking
   - Build all applications
   - Deploy to Vercel preview
3. Preview URL will be commented on PRs automatically

### Production Deployment
1. Merge to `main` branch
2. GitHub Actions will:
   - Run all tests and builds
   - Deploy to Vercel production

## Manual Deployment

You can also deploy manually using Vercel CLI:

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy preview
cd apps/web
vercel

# Deploy production
vercel --prod
```

## Checking CI/CD Status

1. Go to your GitHub repository
2. Click on "Actions" tab
3. View workflow runs and their status
4. Click on a run to see detailed logs

## Troubleshooting

- **Build fails**: Check the Actions logs for specific errors
- **Deployment fails**: Verify all required secrets are set correctly
- **Vercel errors**: Ensure project is linked in Vercel dashboard

