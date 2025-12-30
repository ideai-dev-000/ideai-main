# Deployment Overview

This document provides an overview of the deployment architecture and processes for this monorepo.

## Architecture

This project uses:
- **GitHub Actions** for CI/CD pipelines
- **Vercel** for hosting and preview deployments
- **Turborepo** for monorepo build orchestration

## Applications

The monorepo contains two Next.js applications:

- **`apps/web`** - Main web application
- **`apps/docs`** - Documentation site

Each application can be deployed independently to Vercel.

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
Deployments can be triggered manually using Vercel CLI:

```bash
# From repository root (Vercel uses Root Directory setting)
vercel deploy        # Preview
vercel deploy --prod # Production
```

**Note**: Vercel uses the Root Directory setting (`apps/web`) from the dashboard, so deploy from the repo root.

## Quick Links

- [CI/CD Workflows](./ci-cd.md) - Detailed workflow documentation
- [Vercel Configuration](./vercel.md) - Vercel setup and configuration
- [Setup Guide](../setup/github-secrets.md) - Initial setup instructions

## Related Documentation

- [Development Guide](../development/getting-started.md)
- [Troubleshooting](./troubleshooting.md)

