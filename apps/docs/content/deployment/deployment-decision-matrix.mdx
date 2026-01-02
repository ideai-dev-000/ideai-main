---
title: Deployment Decision Matrix
description: Decision guide for choosing the right deployment method for IdeaI apps
---

# Deployment Decision Matrix

**Last Updated**: January 1, 2026

## Quick Decision Guide

### When to Use GitHub → Vercel (Recommended)

✅ **Use for**:
- Regular deployments (90% of cases)
- Production deployments
- Team collaboration
- Pull request previews
- When you need full version control history
- When you want automated CI/CD

### When to Use Vercel CLI Direct (Backup)

✅ **Use for**:
- Quick iterations during active development
- Emergency hotfixes when GitHub Actions is down
- Testing deployment process locally
- Debugging deployment issues
- One-off deployments for specific apps

## Decision Matrix

| Scenario | Recommended Method | Reason |
|----------|-------------------|--------|
| **Regular production deployment** | GitHub → Vercel | Full history, team visibility, automated |
| **Pull request preview** | GitHub → Vercel | Automatic, integrated with PR workflow |
| **Quick development iteration** | Vercel CLI Direct | Faster, no CI/CD overhead |
| **Emergency hotfix** | Vercel CLI Direct | Faster, bypass CI/CD if needed |
| **Team collaboration** | GitHub → Vercel | All team members see deployments |
| **Testing deployment locally** | Vercel CLI Direct | Direct control, immediate feedback |
| **Debugging deployment issues** | Vercel CLI Direct | Can test changes quickly |
| **First-time deployment** | Vercel CLI Direct | Test process, then use GitHub → Vercel |
| **Scheduled deployments** | GitHub → Vercel | Can be automated with cron |
| **Multi-app deployment** | GitHub → Vercel | Handles all apps automatically |

## Detailed Scenarios

### Scenario 1: Regular Feature Deployment

**Situation**: You've completed a feature and want to deploy to production.

**Recommended**: GitHub → Vercel

**Steps**:
1. Create feature branch
2. Make changes and commit
3. Create PR to `preview` branch
4. Review PR (preview deployment auto-created)
5. Merge to `preview` (preview deployment)
6. Test in preview environment
7. Merge `preview` to `main` (production deployment)

**Why**: Full history, team visibility, automated testing

### Scenario 2: Quick Development Iteration

**Situation**: You're actively developing and want to test changes quickly.

**Recommended**: Vercel CLI Direct

**Steps**:
1. Make changes locally
2. Deploy to preview: `./deploy.sh web`
3. Test changes
4. Iterate and redeploy
5. When ready, commit and use GitHub → Vercel

**Why**: Faster feedback, no CI/CD overhead

**⚠️ Important**: Commit changes to git after testing!

### Scenario 3: Emergency Hotfix

**Situation**: Critical bug in production, need to fix immediately.

**Recommended**: Vercel CLI Direct (then sync to GitHub)

**Steps**:
1. Fix bug locally
2. Deploy immediately: `./deploy.sh --prod web`
3. Verify fix works
4. Commit and push to GitHub: `git commit -m "fix(web): emergency hotfix" && git push`
5. Create PR for review (post-deployment)

**Why**: Faster deployment, can bypass CI/CD if needed

**⚠️ Important**: Always sync to GitHub after emergency deployment!

### Scenario 4: Testing New Deployment Process

**Situation**: You want to test a new deployment configuration.

**Recommended**: Vercel CLI Direct

**Steps**:
1. Test deployment locally: `./deploy.sh web`
2. Verify configuration works
3. Document changes
4. Commit and use GitHub → Vercel for future deployments

**Why**: Direct control, immediate feedback

### Scenario 5: Pull Request Preview

**Situation**: You want preview deployments for code review.

**Recommended**: GitHub → Vercel (automatic)

**Steps**:
1. Create PR to `main` or `preview`
2. GitHub Actions automatically creates preview deployment
3. Preview URL posted in PR comments
4. Reviewers can test changes

**Why**: Automatic, integrated with PR workflow

### Scenario 6: Multi-App Deployment

**Situation**: You need to deploy all 13 apps.

**Recommended**: GitHub → Vercel

**Steps**:
1. Push to `main` or `preview` branch
2. GitHub Actions deploys all apps automatically
3. Monitor deployment status

**Why**: Handles all apps automatically, consistent process

**Alternative**: Vercel CLI Direct
\`\`\`bash
./deploy.sh --prod  # Deploys all apps
\`\`\`

### Scenario 7: Single App Deployment

**Situation**: You only need to deploy one app.

**Both methods work**:

**GitHub → Vercel**:
- Push to branch
- All apps deploy (but only one changes)

**Vercel CLI Direct**:
\`\`\`bash
./deploy.sh --prod web  # Deploy only web app
\`\`\`

**Recommendation**: Use GitHub → Vercel for consistency, unless you need speed.

## Comparison Table

| Feature | GitHub → Vercel | Vercel CLI Direct |
|---------|----------------|-------------------|
| **Speed** | ⚠️ Slower (CI/CD) | ✅ Faster (direct) |
| **Version Control** | ✅ Automatic | ⚠️ Manual sync |
| **History** | ✅ Full git history | ⚠️ Must commit |
| **Team Visibility** | ✅ Visible to all | ⚠️ Only local |
| **Automation** | ✅ Fully automated | ⚠️ Manual steps |
| **Reliability** | ✅ More reliable | ⚠️ Depends on setup |
| **Rollback** | ✅ Easy (git revert) | ⚠️ Manual deploy |
| **CI/CD Integration** | ✅ Built-in | ❌ None |
| **PR Previews** | ✅ Automatic | ❌ Not available |
| **Best For** | Production, team | Quick iterations |

## Decision Flowchart

\`\`\`
Start
  │
  ├─ Is this a regular deployment?
  │   ├─ Yes → Use GitHub → Vercel
  │   └─ No → Continue
  │
  ├─ Is this an emergency hotfix?
  │   ├─ Yes → Use Vercel CLI Direct (then sync to GitHub)
  │   └─ No → Continue
  │
  ├─ Is this a quick development iteration?
  │   ├─ Yes → Use Vercel CLI Direct (then commit)
  │   └─ No → Continue
  │
  ├─ Is this testing/debugging?
  │   ├─ Yes → Use Vercel CLI Direct
  │   └─ No → Use GitHub → Vercel (default)
  │
End
\`\`\`

## Best Practices

### General

1. ✅ **Default to GitHub → Vercel**: Use for 90% of deployments
2. ✅ **Reserve CLI for special cases**: Quick iterations, emergencies, testing
3. ✅ **Always sync to GitHub**: Commit CLI deployments to maintain history
4. ✅ **Document exceptions**: Note why CLI was used in commit message
5. ✅ **Test before production**: Always test in preview first

### GitHub → Vercel

1. ✅ **Use feature branches**: Develop in separate branches
2. ✅ **Create PRs**: Review before merging
3. ✅ **Test in preview**: Deploy to preview before production
4. ✅ **Monitor deployments**: Check GitHub Actions and Vercel dashboards

### Vercel CLI Direct

1. ✅ **Commit after deployment**: Always sync to GitHub
2. ✅ **Use deploy.sh script**: Maintain consistency
3. ✅ **Document reason**: Explain why CLI was used
4. ✅ **Test locally first**: Run `pnpm build` before deploying
5. ✅ **Verify configuration**: Check Root Directory before deploying

## Common Mistakes

### ❌ Don't Do This

1. **Deploy via CLI without committing**: Always commit after CLI deployment
2. **Use CLI for regular deployments**: Use GitHub → Vercel instead
3. **Skip preview testing**: Always test in preview before production
4. **Deploy without verification**: Verify configuration before deploying
5. **Ignore deployment failures**: Always investigate and fix failures

### ✅ Do This Instead

1. **Commit after CLI deployment**: Maintain version control
2. **Use GitHub → Vercel for regular deployments**: Better for team
3. **Test in preview first**: Catch issues before production
4. **Verify before deploying**: Check configuration and build
5. **Investigate failures**: Fix issues before next deployment

## Related Documentation

- [GitHub → Vercel Workflow](./workflow-git-to-vercel.md)
- [Vercel CLI Direct Workflow](./workflow-vercel-direct.md)
- [Rollback Procedures](./rollback-procedures.md)
- [Unified Deployment Guide](./unified-deployment.md)
- [Deployment Safety Checklist](./safety-checklist.md)
