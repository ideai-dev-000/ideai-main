---
title: Deployment Status & Quick Reference
description: Current deployment status, quick commands, and troubleshooting
---

# Deployment Status & Quick Reference

**Last Updated**: January 1, 2026

## ✅ Deployment Status

### Command Line Deployment

- ✅ **Preview**: `./deploy.sh` - Works correctly
- ✅ **Production**: `./deploy.sh --prod` - Works correctly
- ✅ **Single App**: `./deploy.sh web` or `./deploy.sh --prod docs` - Works correctly

### GitHub Actions Deployment

- ✅ **Preview Workflow**: `.github/workflows/preview-deploy.yml` - Configured
- ✅ **Production Workflow**: `.github/workflows/ci-cd.yml` - Configured
- ✅ **Automatic Triggers**: Push to `preview` (preview) or `main` (production)

## Quick Commands

### Deploy from Command Line

\`\`\`bash

# Preview - Deploy all apps

./deploy.sh

# Preview - Deploy specific app

./deploy.sh web
./deploy.sh docs

# Production - Deploy all apps

./deploy.sh --prod

# Production - Deploy specific app

./deploy.sh --prod web
./deploy.sh --prod docs
\`\`\`

### Deploy via Git Push

\`\`\`bash

# Preview deployment

git checkout preview
git push origin preview

# Production deployment

git checkout main
git push origin main
\`\`\`

## Current Apps (9 total)

| App      | Port | Vercel Project | Status    |
| -------- | ---- | -------------- | --------- |
| web      | 3000 | `web`          | ✅ Linked |
| docs     | 3001 | `docs`         | ✅ Linked |
| all      | 3002 | -              | Ready     |
| nocss    | 3003 | -              | Ready     |
| mvp      | 3004 | -              | Ready     |
| tailwind | 3005 | -              | Ready     |
| allcss   | 3006 | -              | Ready     |
| unocss   | 3008 | -              | Ready     |
| shadcn   | 3009 | -              | Ready     |

## Required GitHub Secrets

For automatic deployment via GitHub Actions:

- ✅ `VERCEL_TOKEN` - Required
- ✅ `VERCEL_ORG_ID` - Required (value: `team_vhjzlMi6CfNow0IfBXnv2Yn2`)
- ⚠️ `VERCEL_PROJECT_ID` - Optional (not needed with deploy.sh)

**Check secrets**:
\`\`\`bash
gh secret list --repo ideai-dev-000/ideai-main
\`\`\`

## Vercel Dashboard Configuration

For each deployed app, verify in Vercel dashboard:

1. **Root Directory**: `apps/{app-name}`
   - Example: `apps/web`, `apps/docs`
2. **Include files outside root**: ✅ Enabled
3. **Framework**: Next.js (auto-detected)
4. **Build Command**: Auto-detected
5. **Install Command**: Auto-detected (pnpm)

## Troubleshooting

### Deployment Fails Locally

\`\`\`bash

# Check authentication

vercel whoami

# Re-authenticate if needed

vercel login

# Check project linking

cat apps/web/.vercel/project.json
\`\`\`

### GitHub Actions Fails

1. **Check secrets are set**:
   \`\`\`bash
   gh secret list --repo ideai-dev-000/ideai-main
   \`\`\`

2. **View workflow logs**:
   - Go to: https://github.com/ideai-dev-000/ideai-main/actions
   - Click on failed run → View logs

3. **Common issues**:
   - Missing `VERCEL_TOKEN` secret
   - Expired token (regenerate at https://vercel.com/account/tokens)
   - Wrong `VERCEL_ORG_ID`

### Build Errors

1. **Check Root Directory** in Vercel dashboard
2. **Enable "Include files outside root directory"**
3. **Test build locally**: `pnpm build`

## Related Documentation

- [Deployment Debugging Guide](./debugging-deployment.md) - Detailed troubleshooting
- [Unified Deployment Guide](./unified-deployment.md) - How deploy.sh works
- [Vercel Configuration](./vercel.md) - Dashboard setup
- [CI/CD Workflows](./ci-cd.md) - GitHub Actions details


