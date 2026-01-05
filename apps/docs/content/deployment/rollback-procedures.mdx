---
title: Rollback Procedures
description: Complete guide for rolling back IdeaI deployments in various scenarios
---

# Rollback Procedures

**Last Updated**: January 1, 2026

## Overview

This document describes procedures for rolling back IdeaI deployments when issues are discovered. Rollbacks can be performed via git (recommended) or Vercel dashboard (quick fix).

## Quick Reference

### Git-Based Rollback (Recommended)

\`\`\`bash
# Find the last good commit
git log --oneline

# Revert the problematic commit
git revert <commit-hash>

# Push to trigger new deployment
git push origin main
\`\`\`

### Vercel Dashboard Rollback (Quick Fix)

1. Go to Vercel dashboard
2. Select project
3. Go to Deployments tab
4. Find previous good deployment
5. Click "..." → "Promote to Production"

## Rollback Methods

### Method 1: Git Revert (Recommended)

**Best for**: Most scenarios, maintains history, team visibility

**Process**:
1. Identify problematic commit
2. Revert commit in git
3. Push to trigger new deployment
4. Verify rollback successful

**Steps**:

\`\`\`bash
# 1. Find the problematic commit
git log --oneline -10

# Example output:
# abc1234 feat(web): add new feature
# def5678 fix(web): fix bug
# ghi9012 deploy(web): deploy to production

# 2. Revert the commit (creates new commit that undoes changes)
git revert abc1234

# 3. Push to trigger deployment
git push origin main
\`\`\`

**Result**:
- ✅ New commit created that undoes problematic changes
- ✅ Full history maintained
- ✅ Automatic deployment via GitHub Actions
- ✅ Team can see rollback in git history

### Method 2: Vercel Dashboard Rollback

**Best for**: Quick fixes, when git revert is not possible

**Process**:
1. Go to Vercel dashboard
2. Select project
3. Find previous good deployment
4. Promote to production

**Steps**:

1. **Navigate to Vercel Dashboard**
   - Go to [Vercel Dashboard](https://vercel.com/idea-i)
   - Select the project (e.g., `web`)

2. **Go to Deployments Tab**
   - Click "Deployments" in sidebar
   - View list of deployments

3. **Find Previous Good Deployment**
   - Look for deployment before the problematic one
   - Check commit hash, timestamp, status

4. **Promote to Production**
   - Click "..." menu on good deployment
   - Select "Promote to Production"
   - Confirm promotion

**Result**:
- ✅ Quick rollback (no git changes)
- ✅ Immediate effect
- ⚠️ Git and Vercel out of sync (must sync manually)

**⚠️ Important**: After Vercel rollback, sync to git:

\`\`\`bash
# Get the commit hash of the rolled-back deployment
# (from Vercel dashboard)

# Reset local branch to that commit
git reset --hard <commit-hash>

# Force push (use with caution!)
git push origin main --force
\`\`\`

### Method 3: Deploy Previous Version via CLI

**Best for**: When you need to rollback specific app quickly

**Process**:
1. Find previous good deployment commit
2. Checkout that commit
3. Deploy via CLI
4. Sync to git

**Steps**:

\`\`\`bash
# 1. Find previous good commit
git log --oneline -10

# 2. Checkout that commit (detached HEAD)
git checkout <commit-hash>

# 3. Deploy that version
cd apps/web
vercel deploy --prod

# 4. Return to main branch
git checkout main

# 5. Create revert commit
git revert <problematic-commit-hash>
git push origin main
\`\`\`

**Result**:
- ✅ Quick rollback for specific app
- ✅ Can rollback without affecting other apps
- ⚠️ Requires manual git sync

## Rollback Scenarios

### Scenario 1: Broken Production Deployment

**Situation**: Recent deployment broke production, need immediate rollback.

**Recommended**: Vercel Dashboard Rollback (fastest)

**Steps**:
1. Go to Vercel dashboard
2. Find previous good deployment
3. Promote to production
4. Verify site works
5. Then sync to git (git revert)

**Time**: ~2 minutes

### Scenario 2: Feature Causing Issues

**Situation**: New feature deployed but causing problems, need to remove.

**Recommended**: Git Revert

**Steps**:
1. Find commit that added feature
2. Revert commit: `git revert <commit-hash>`
3. Push to trigger deployment
4. Verify rollback successful

**Time**: ~5-10 minutes (includes deployment)

### Scenario 3: Multiple Problematic Commits

**Situation**: Multiple commits causing issues, need to rollback to specific point.

**Recommended**: Git Revert (multiple reverts) or Vercel Dashboard

**Option A: Multiple Git Reverts**
\`\`\`bash
# Revert commits in reverse order (newest first)
git revert <newest-commit>
git revert <middle-commit>
git revert <oldest-commit>
git push origin main
\`\`\`

**Option B: Vercel Dashboard**
1. Find last good deployment
2. Promote to production
3. Sync to git (reset to that commit)

### Scenario 4: Single App Issue

**Situation**: Only one app has issues, others are fine.

**Recommended**: Deploy Previous Version via CLI

**Steps**:
1. Checkout previous good commit for that app
2. Deploy that app only: `./deploy.sh --prod web`
3. Verify rollback
4. Sync to git (revert specific commits)

### Scenario 5: All Apps Need Rollback

**Situation**: All apps need to rollback (rare).

**Recommended**: Git Revert

**Steps**:
1. Find problematic commit affecting all apps
2. Revert commit: `git revert <commit-hash>`
3. Push to trigger deployment of all apps
4. Verify all apps rolled back

## Verification

### After Rollback

**Check**:
1. ✅ Site loads correctly
2. ✅ No console errors
3. ✅ Features work as expected
4. ✅ Deployment status in Vercel dashboard
5. ✅ Git history shows rollback commit

**Commands**:
\`\`\`bash
# Check deployment status
curl -I https://www.myui.space

# Check git history
git log --oneline -5

# Verify Vercel deployment
# (check Vercel dashboard)
\`\`\`

## Prevention

### Pre-Deployment

1. ✅ **Test in preview first**
2. ✅ **Run local build**: `pnpm build`
3. ✅ **Review changes**: Check diff before deploying
4. ✅ **Use feature flags**: For risky changes
5. ✅ **Deploy to preview first**: Test before production

### Post-Deployment

1. ✅ **Monitor immediately**: Check site after deployment
2. ✅ **Verify key features**: Test critical functionality
3. ✅ **Check error logs**: Monitor for errors
4. ✅ **Have rollback plan**: Know how to rollback before deploying

## Best Practices

1. ✅ **Default to Git Revert**: Maintains history, team visibility
2. ✅ **Use Vercel Dashboard for emergencies**: When speed is critical
3. ✅ **Always verify rollback**: Check site works after rollback
4. ✅ **Document rollback reason**: Add note in commit/PR
5. ✅ **Sync after Vercel rollback**: Keep git and Vercel in sync
6. ✅ **Test rollback process**: Practice rollback in preview environment
7. ✅ **Have rollback plan**: Know rollback steps before deploying

## Common Mistakes

### ❌ Don't Do This

1. **Force push without team approval**: Can break others' work
2. **Rollback without verification**: Always verify rollback worked
3. **Forget to sync git after Vercel rollback**: Git and Vercel out of sync
4. **Rollback without understanding issue**: Fix root cause, not just symptoms
5. **Skip testing after rollback**: Always verify site works

### ✅ Do This Instead

1. **Use git revert**: Maintains history, safer
2. **Verify rollback**: Check site works after rollback
3. **Sync git after Vercel rollback**: Keep everything in sync
4. **Investigate root cause**: Fix the issue, not just rollback
5. **Test thoroughly**: Verify all features work after rollback

## Troubleshooting

### Rollback Not Working

**Check**:
1. Deployment actually completed
2. Correct deployment was promoted
3. DNS/CDN cache (may take a few minutes)
4. Browser cache (hard refresh: Cmd+Shift+R)

**Solution**:
- Wait a few minutes for cache to clear
- Hard refresh browser
- Check Vercel deployment logs
- Verify correct deployment was promoted

### Git and Vercel Out of Sync

**Situation**: Rolled back via Vercel dashboard, but git still has problematic code.

**Solution**:
\`\`\`bash
# Find the commit hash of the rolled-back deployment
# (from Vercel dashboard)

# Reset to that commit
git reset --hard <commit-hash>

# Force push (coordinate with team first!)
git push origin main --force
\`\`\`

**⚠️ Warning**: Force push can break others' work. Coordinate with team!

### Multiple Apps Need Different Versions

**Situation**: Different apps need to rollback to different commits.

**Solution**:
1. Rollback each app individually via Vercel dashboard
2. Or: Create separate revert commits for each app
3. Deploy apps individually: `./deploy.sh --prod <app-name>`

## Related Documentation

- [GitHub → Vercel Workflow](./workflow-git-to-vercel.md)
- [Vercel CLI Direct Workflow](./workflow-vercel-direct.md)
- [Deployment Decision Matrix](./deployment-decision-matrix.md)
- [Deployment Safety Checklist](./safety-checklist.md)
- [Unified Deployment Guide](./unified-deployment.md)
