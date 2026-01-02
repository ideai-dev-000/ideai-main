---
title: Branch-Per-Site Workflow
description: How to use branch-per-site strategy for independent app deployments
---

# Branch-Per-Site Workflow

## Overview

Each IdeaI app can have its own Git branch, enabling independent deployments while maintaining monorepo benefits.

## Branch Naming Convention

```
branch/{app-name}
```

Examples:
- `branch/web` - Web app
- `branch/docs` - Documentation site
- `branch/landing` - Landing page
- `branch/all` - All components showcase

## Workflow

### Creating a Branch for an App

```bash
# Create and switch to new branch
git checkout -b branch/landing

# Make changes to apps/landing
# ... edit files ...

# Commit changes
git add apps/landing
git commit -m "feat(landing): add new feature"

# Push branch
git push -u origin branch/landing
```

### Vercel Project Configuration

1. **Link branch to Vercel project**:
   ```bash
   cd apps/landing
   vercel link
   # Select existing project: landing
   ```

2. **Configure in Vercel dashboard**:
   - Go to project settings
   - Git Integration → Production Branch: `branch/landing`
   - Root Directory: `apps/landing`
   - Ignored Build Step: `git diff HEAD^ HEAD --quiet apps/landing packages/`

3. **Verify**:
   - Push to `branch/landing` → triggers `landing` project deployment
   - Push to `main` → does NOT trigger `landing` project deployment

### Working with Multiple Branches

```bash
# Switch between branches
git checkout branch/landing
git checkout branch/docs
git checkout main

# See all branches
git branch -a

# Merge shared changes from main
git checkout branch/landing
git merge main
```

### Shared Package Changes

When changing shared packages (`packages/*`):

1. **Commit to main**:
   ```bash
   git checkout main
   git add packages/ui
   git commit -m "feat(ui): update shared component"
   git push
   ```

2. **Merge to app branches** (if needed):
   ```bash
   git checkout branch/landing
   git merge main
   git push
   ```

## Status Monitoring

The landing page automatically shows:
- **Local status**: Is dev server running?
- **Vercel status**: Latest deployment status
- **GitHub status**: Branch last commit, protection status

## Best Practices

1. **Use main for shared changes**: Packages, configs, docs
2. **Use branches for app-specific changes**: App code, features
3. **Keep branches in sync**: Regularly merge main into branches
4. **Clear commit messages**: Use semantic commits per app
5. **Test locally first**: Use `pnpm dev:start {app}` before pushing

## Troubleshooting

### Branch Not Triggering Deployment

- Check Vercel project settings: Production Branch matches branch name
- Verify Root Directory is correct
- Check Ignored Build Step isn't skipping builds incorrectly

### Shared Changes Not Reflecting

- Merge main into your branch: `git merge main`
- Verify packages are built: `pnpm build`
- Check Vercel build logs for errors

## Related Documentation

- [Branch-Per-Site Strategy](../architecture/branch-per-site-strategy.md)
- [Git Integration](../deployment/git-integration.md)










