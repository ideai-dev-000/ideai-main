---
title: Deployment Overview
description: Overview of the deployment architecture and processes for the IdeaI monorepo, including CI/CD, Vercel configuration, and deployment environments.
---

# Deployment Overview

This document provides an overview of the deployment architecture and processes for this monorepo.

## Architecture

This project uses:
- **GitHub Actions** for CI/CD pipelines
- **Vercel** for hosting and preview deployments
- **Turborepo** for monorepo build orchestration

## Applications

The monorepo contains multiple Next.js applications:

- **`apps/web`** - Main IdeaI web application
  - Production: https://www.myui.space
  - Serves sub-apps at `/apps/{name}` via catch-all route
- **`apps/docs`** - IdeaI documentation site
  - Deployed as standalone Vercel project
  - Deployed as standalone Vercel project
- **`apps/all`, `apps/nocss`, `apps/mvp`, `apps/tailwind`, `apps/allcss`** - CSS showcase apps
  - Ready for deployment

All apps share components from `@repo/ui` and can be deployed using `./deploy.sh --prod`.

See [Unified Deployment Guide](./unified-deployment.md) for deployment instructions.

## Deployment Environments

### Preview
- **Trigger**: Push to `preview` branch or pull requests
- **URL**: Automatically generated preview URLs
- **Purpose**: Testing and review before production

### Production
- **Trigger**: Push to `main` branch
- **URL**: Production domain
- **Purpose**: Live production environment

## Deployment Methods

### Automatic (Recommended)
Deployments happen automatically via GitHub Actions when:
- Code is pushed to `preview` or `main` branches
- Pull requests are created/updated

### Manual
Deployments can be triggered manually using the unified deployment script:

```bash
# Deploy all apps to production
./deploy.sh --prod

# Deploy specific apps
./deploy.sh --prod docs web

# Preview deployment
./deploy.sh
```

See [Unified Deployment Guide](./unified-deployment.md) for complete instructions.

## Deployment Workflows

### GitHub → Vercel (Recommended)
- **Primary deployment method**: Automatic deployments via GitHub Actions
- **Triggers**: Push to `main` (production) or `preview` (preview)
- **Benefits**: Full version control, automated CI/CD, team visibility
- **See**: [GitHub → Vercel Workflow](./workflow-git-to-vercel.md)

### Vercel CLI Direct (Backup)
- **Backup deployment method**: Direct deployment via Vercel CLI
- **Use cases**: Quick iterations, emergency hotfixes, testing
- **Benefits**: Faster deployment, direct control
- **See**: [Vercel CLI Direct Workflow](./workflow-vercel-direct.md)

### Choosing a Method
- **Decision guide**: [Deployment Decision Matrix](./deployment-decision-matrix.md)
- **Safety checklists**: [Deployment Safety Checklist](./safety-checklist.md)
- **Rollback procedures**: [Rollback Procedures](./rollback-procedures.md)

## Quick Links

- [Unified Deployment Guide](./unified-deployment.md) - **Start here** for deployment
- [GitHub → Vercel Workflow](./workflow-git-to-vercel.md) - Primary deployment method
- [Vercel CLI Direct Workflow](./workflow-vercel-direct.md) - Backup deployment method
- [Deployment Decision Matrix](./deployment-decision-matrix.md) - Choose deployment method
- [Deployment Safety Checklist](./safety-checklist.md) - Pre/post deployment checklists
- [Rollback Procedures](./rollback-procedures.md) - Rollback guide
- [Deployment Architecture](../architecture/deployment-architecture.md) - Architecture overview
- [Vercel Configuration](./vercel.md) - Dashboard configuration
- [CI/CD Workflows](./ci-cd.md) - Automated deployment workflows

## Related Documentation

- [Development Guide](../development/getting-started.md)
- [Troubleshooting](./troubleshooting.md)

