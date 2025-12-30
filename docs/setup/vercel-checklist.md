# Vercel Setup Checklist

Quick reference for configuring Vercel for this Turborepo monorepo.

## ✅ Required Settings in Vercel Dashboard

1. **Root Directory**: `apps/web`
   - Location: [Project Settings → Build & Development Settings](https://vercel.com/idea-i/web/settings/general)
   - Set to: `apps/web`

2. **Include files outside the root directory in the Build Step**: ✅ **ENABLED**
   - Location: Same page, below Root Directory
   - **This checkbox MUST be ticked for Turborepo monorepos**
   - Without this, Vercel can't access:
     - Root `package.json`, `pnpm-workspace.yaml`, `turbo.json`
     - Shared packages in `packages/`
     - Workspace dependencies

## Why This Matters

For standard Turborepo + Vercel deployments:
- Root Directory tells Vercel where your app is (`apps/web`)
- "Include files outside..." allows Vercel to access monorepo root files
- Both are required for proper workspace resolution

## Reference

- [Vercel Build Configuration Docs](https://vercel.com/docs/builds/configure-a-build#root-directory)
- [Project Documentation](./docs/deployment/vercel.md)
