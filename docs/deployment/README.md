---
title: Deployment Documentation
description: Complete deployment documentation index for IdeaI monorepo
---

# Deployment Documentation

Complete guide to deploying the IdeaI monorepo to Vercel.

## Quick Start

**⚠️ IMPORTANT**: Before deploying, ensure Vercel dashboard settings are correct:
- Root Directory: `apps/{app-name}`
- **Include files outside root directory**: ✅ **ENABLED** (required!)

See [Next Steps](./DEPLOYMENT-NEXT-STEPS.md) for current status and blockers.

## Documentation Index

### Getting Started
- **[Next Steps](./DEPLOYMENT-NEXT-STEPS.md)** - ⚠️ **START HERE** - Current status and blockers
- **[Overview](./overview.md)** - Deployment architecture overview
- **[Unified Deployment](./unified-deployment.md)** - How to deploy with `deploy.sh`

### Strategies & Phases
- **[Deployment Strategies](./deployment-strategies.md)** - All deployment modes (integrated, standalone, hybrid)
- **[Deployment Phases](./deployment-phases.md)** - Phased approach from dev to production
- **[Final Phased Plan](./FINAL-PHASED-PLAN.md)** - Complete 5-phase deployment plan

### Configuration
- **[Vercel Setup](./vercel.md)** - Vercel dashboard configuration
- **[CI/CD Workflows](./ci-cd.md)** - GitHub Actions workflows
- **[Git Integration](./git-integration.md)** - Git-based deployment triggers

### Troubleshooting
- **[Debugging Deployment](./debugging-deployment.md)** - Common issues and solutions
- **[Troubleshooting](./troubleshooting.md)** - Quick reference for issues
- **[Deployment Status](./DEPLOYMENT-STATUS.md)** - Current deployment status

## Current Status

**Last Updated**: January 1, 2026

### ✅ Completed
- Smart routing system implemented
- All deployment strategies documented
- Legacy cleanup done
- Configuration files updated

### ⏳ In Progress
- Phase 1: Main app deployment (blocked - Vercel setting needed)

### 📋 Next Steps
1. Enable "Include files outside root directory" in Vercel dashboard
2. Deploy main app to preview
3. Verify `/index` works
4. Deploy to production
5. Continue with Phase 2-5

See [Next Steps](./DEPLOYMENT-NEXT-STEPS.md) for details.

## Quick Commands

```bash
# Preview deployment
./deploy.sh web

# Production deployment
./deploy.sh --prod web

# Deploy all apps
./deploy.sh --prod
```

## Related Documentation

- [Architecture Docs](../architecture/deployment-architecture.md) - Architecture overview
- [Development Guide](../development/getting-started.md) - Local development


