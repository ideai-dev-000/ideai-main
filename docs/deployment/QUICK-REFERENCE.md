---
title: IdeaI Build - Quick Reference
description: Quick reference guide for all IdeaI deployment commands and workflows
---

# IdeaI Build - Quick Reference

**Last Updated**: January 1, 2026

## Deployment Commands

### Vercel Direct Deployment

```bash
# Preview - All apps
./deploy.sh

# Preview - Specific app
./deploy.sh web

# Production - All apps
./deploy.sh --prod

# Production - Specific app
./deploy.sh --prod web

# Production - Multiple apps
./deploy.sh --prod web docs
```

### GitHub Actions Deployment

```bash
# Preview deployment
git checkout preview
git push origin preview

# Production deployment
git checkout main
git push origin main
```

### Local Development

```bash
# Single app
pnpm --filter web dev

# All apps (via dev manager)
node scripts/dev-manager.mjs

# Specific apps
pnpm --filter web dev
pnpm --filter docs dev

# Cold refresh (clean everything and rebuild)
pnpm build:cold

# Clean only (no rebuild)
pnpm build:clean
```

### Subdomain Setup

```bash
./scripts/setup-subdomain.sh {app-name} {subdomain} {root-domain}
# Example: ./scripts/setup-subdomain.sh docs docs myui.space
```

### Auto-Setup (New Project)

```bash
# Interactive setup
node scripts/ideai-build.mjs setup

# Config file setup
node scripts/ideai-build.mjs setup --config setup.json

# Quick setup (defaults)
node scripts/ideai-build.mjs setup --quick --name my-project
```

---

## Deployment Types

| Type           | Command                            | URL Format                        | Lifetime      |
| -------------- | ---------------------------------- | --------------------------------- | ------------- |
| **Preview**    | `./deploy.sh {app}`                | `https://{app}-{hash}.vercel.app` | Temporary     |
| **Production** | `./deploy.sh --prod {app}`         | `https://{domain}`                | Permanent     |
| **Local**      | `pnpm --filter {app} dev`          | `http://localhost:{port}`         | While running |
| **Subdomain**  | `./scripts/setup-subdomain.sh ...` | `https://{subdomain}.{domain}`    | Permanent     |

---

## Deployment Methods

### Method 1: Vercel Direct

- **When**: Quick deployments, testing, manual releases
- **How**: `./deploy.sh` script
- **Speed**: Fast
- **Automation**: Manual

### Method 2: GitHub Actions

- **When**: Production releases, CI/CD, automatic deployments
- **How**: Git push triggers workflow
- **Speed**: Slower (includes build/test)
- **Automation**: Automatic

---

## App Architecture Modes

### Child Apps (Integrated)

- **URL**: `https://{domain}/apps/{app-name}`
- **Deployment**: Single deployment
- **Use Case**: Tightly coupled apps, single domain

### Standalone Apps

- **URL**: `https://{app-domain}` or `https://{subdomain}.{domain}`
- **Deployment**: Independent deployments
- **Use Case**: Independent scaling, separate domains

---

## Configuration Files

| File                   | Location                          | Purpose             |
| ---------------------- | --------------------------------- | ------------------- |
| `.ideai.json`          | `apps/{app}/.ideai.json`          | App configuration   |
| `.vercel/project.json` | `apps/{app}/.vercel/project.json` | Vercel project link |
| `vercel.json`          | `apps/{app}/vercel.json`          | Vercel build config |
| `package.json`         | `apps/{app}/package.json`         | Dependencies        |
| `next.config.ts`       | `apps/{app}/next.config.ts`       | Next.js config      |

---

## Vercel Dashboard Settings

**Required for each app**:

- ✅ Root Directory: `apps/{app-name}`
- ✅ Include files outside root directory: **Enabled**
- ✅ Framework Preset: Next.js
- ✅ Build Command: `pnpm build`
- ✅ Install Command: `pnpm install`

---

## GitHub Secrets

**Required**:

- `VERCEL_TOKEN` - Vercel API token
- `VERCEL_ORG_ID` - Vercel organization ID

**Optional**:

- `TURBO_TOKEN` - Turborepo token
- `TURBO_TEAM` - Turborepo team

---

## Troubleshooting

### "Command pnpm install exited with 1"

- ✅ Update `pnpm-lock.yaml`: `pnpm install` and commit
- ✅ Verify "Include files outside root directory" is enabled

### "Cannot find module '@repo/ui'"

- ✅ Verify "Include files outside root directory" is enabled
- ✅ Check Root Directory is `apps/{app-name}`
- ✅ Verify workspace dependencies in `package.json`

### "Project not linked"

- ✅ Run: `node scripts/ideai-vercel-link.mjs {app-name}`
- ✅ Check `.vercel/project.json` exists

---

## Related Documentation

- [Complete Workflow Guide](./ideai-build-workflow.md) - Full documentation
- [Auto-Setup System](./ideai-build-auto-setup.md) - One-click setup
- [Vercel Configuration](./vercel.md) - Vercel setup
- [GitHub Actions CI/CD](./ci-cd.md) - CI/CD pipelines
- [Deployment Strategies](./deployment-strategies.md) - Deployment options

---

**End of Quick Reference**
