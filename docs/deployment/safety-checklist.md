---
title: Deployment Safety Checklist
description: Comprehensive pre-deployment and post-deployment checklists for safe IdeaI deployments
---

# Deployment Safety Checklist

**Last Updated**: January 1, 2026

## Overview

This document provides comprehensive checklists for safe deployments of IdeaI apps. Use these checklists before and after every deployment to ensure quality and prevent issues.

## Pre-Deployment Checklist

### Code Quality

- [ ] **All tests pass**: `pnpm test` (if tests exist)
- [ ] **Linting passes**: `pnpm lint` (no errors)
- [ ] **Type checking passes**: `pnpm check-types` (no errors)
- [ ] **Build succeeds**: `pnpm build` (all apps build successfully)
- [ ] **No console errors**: Check browser console in development
- [ ] **No TypeScript errors**: All types are correct
- [ ] **No ESLint warnings**: Code follows style guidelines

### Code Review

- [ ] **Code reviewed**: PR reviewed and approved (if using GitHub workflow)
- [ ] **Changes documented**: Commit messages are clear and descriptive
- [ ] **Breaking changes noted**: Documented in commit/PR description
- [ ] **Dependencies updated**: `pnpm-lock.yaml` committed if dependencies changed
- [ ] **Migration scripts**: Database/migration scripts included if needed

### Configuration

- [ ] **Environment variables**: All required env vars set in Vercel dashboard
- [ ] **Root Directory**: Set correctly in Vercel dashboard (`apps/{app-name}`)
- [ ] **Include files outside root**: ✅ Enabled in Vercel dashboard
- [ ] **Build command**: Correct in Vercel dashboard (or auto-detected)
- [ ] **Install command**: Correct in Vercel dashboard (or auto-detected)
- [ ] **Framework**: Next.js detected correctly

### Testing

- [ ] **Local testing**: App works in local development (`pnpm dev`)
- [ ] **Production build test**: Test production build locally (`pnpm build && pnpm start`)
- [ ] **Preview deployment**: Deployed to preview and tested
- [ ] **Key features tested**: Critical functionality verified
- [ ] **Cross-browser testing**: Tested in major browsers (if applicable)
- [ ] **Mobile testing**: Tested on mobile devices (if applicable)

### Deployment Preparation

- [ ] **Branch selected**: Correct branch for deployment (`main` for production, `preview` for preview)
- [ ] **Deployment method chosen**: GitHub → Vercel (recommended) or Vercel CLI
- [ ] **Rollback plan**: Know how to rollback if issues occur
- [ ] **Deployment window**: Appropriate time for deployment (consider users)
- [ ] **Team notified**: Team aware of deployment (if production)
- [ ] **Backup created**: Backup of current deployment (if applicable)

### Server Impact Assessment

- [ ] **Downtime expected**: None (Vercel zero-downtime deployments)
- [ ] **Performance impact**: Assessed and acceptable
- [ ] **Database migrations**: Planned and tested (if applicable)
- [ ] **API changes**: Backward compatible or migration plan in place
- [ ] **Breaking changes**: Documented and communicated

### Documentation

- [ ] **Changes documented**: What changed and why
- [ ] **Deployment notes**: Any special instructions or considerations
- [ ] **Rollback procedure**: Documented if complex rollback needed
- [ ] **Monitoring plan**: Know what to monitor after deployment

## Post-Deployment Verification

### Immediate Checks (Within 5 minutes)

- [ ] **Deployment succeeded**: Check Vercel dashboard for success status
- [ ] **Site loads**: Visit production URL, site loads correctly
- [ ] **No 404 errors**: All routes accessible
- [ ] **No console errors**: Check browser console for errors
- [ ] **SSL certificate valid**: HTTPS working correctly
- [ ] **Performance acceptable**: Page load times reasonable

### Functional Checks (Within 15 minutes)

- [ ] **Key features work**: Critical functionality verified
- [ ] **Forms work**: All forms submit correctly (if applicable)
- [ ] **Navigation works**: All links and routes work
- [ ] **API endpoints work**: All API routes respond correctly (if applicable)
- [ ] **Authentication works**: Login/logout works (if applicable)
- [ ] **Data loads**: Content displays correctly

### Visual Checks

- [ ] **Layout correct**: No broken layouts or CSS issues
- [ ] **Images load**: All images display correctly
- [ ] **Fonts load**: All fonts render correctly
- [ ] **Responsive design**: Works on mobile and desktop
- [ ] **Dark mode**: Works correctly (if applicable)

### Monitoring (Within 1 hour)

- [ ] **Error logs clean**: No new errors in Vercel logs
- [ ] **Performance metrics**: Page load times acceptable
- [ ] **User reports**: No user-reported issues
- [ ] **Analytics**: Traffic patterns normal
- [ ] **Uptime**: Site remains accessible

### Long-term Monitoring (24 hours)

- [ ] **No regression**: Previous features still work
- [ ] **Performance stable**: No performance degradation
- [ ] **Error rate normal**: Error rate within expected range
- [ ] **User feedback**: No negative user feedback
- [ ] **Metrics normal**: Analytics show normal patterns

## Deployment-Specific Checklists

### Production Deployment

**Additional Checks**:
- [ ] **Preview tested**: Changes tested in preview environment first
- [ ] **Stakeholders notified**: Key stakeholders aware of deployment
- [ ] **Rollback ready**: Know exact rollback steps
- [ ] **Monitoring active**: Monitoring tools active and alerting
- [ ] **Support ready**: Support team aware and ready (if applicable)
- [ ] **Documentation updated**: User-facing docs updated if needed

### Preview Deployment

**Additional Checks**:
- [ ] **Preview URL accessible**: Preview URL works correctly
- [ ] **PR comment posted**: Preview URL in PR comments (if PR)
- [ ] **Team notified**: Team aware of preview deployment
- [ ] **Testing scheduled**: Plan for testing preview deployment

### Emergency Hotfix

**Additional Checks**:
- [ ] **Issue identified**: Root cause understood
- [ ] **Fix tested**: Fix tested locally before deployment
- [ ] **Impact assessed**: Understand impact of hotfix
- [ ] **Rollback plan**: Know how to rollback if hotfix causes issues
- [ ] **Post-deployment fix**: Plan for proper fix after hotfix deployed

## Server Impact Considerations

### Zero-Downtime Deployments

✅ **Vercel provides zero-downtime deployments**:
- New deployment builds in parallel
- Traffic switches to new deployment when ready
- Old deployment remains available during switch
- No user-visible downtime

### Performance Impact

**Consider**:
- **Build time**: Longer builds may delay deployment
- **Cold starts**: First request after deployment may be slower
- **Cache warming**: May need to warm caches after deployment
- **Database connections**: Connection pool may need adjustment

### Database Migrations

**If applicable**:
- [ ] **Migration tested**: Tested in preview/staging
- [ ] **Backward compatible**: Migration doesn't break existing code
- [ ] **Rollback plan**: Can rollback migration if needed
- [ ] **Backup created**: Database backed up before migration

### API Changes

**If applicable**:
- [ ] **Backward compatible**: Old clients still work
- [ ] **Versioning**: API versioned if breaking changes
- [ ] **Documentation updated**: API docs updated
- [ ] **Clients notified**: API consumers notified of changes

## Rollback Readiness

### Before Deployment

- [ ] **Rollback procedure known**: Know exact steps to rollback
- [ ] **Previous version identified**: Know which version to rollback to
- [ ] **Rollback tested**: Tested rollback process in preview
- [ ] **Team trained**: Team knows how to rollback

### Rollback Triggers

**Rollback if**:
- ❌ Site doesn't load
- ❌ Critical features broken
- ❌ Performance severely degraded
- ❌ Security issues discovered
- ❌ Data loss or corruption
- ❌ User reports critical issues

**See**: [Rollback Procedures](./rollback-procedures.md) for detailed steps

## Best Practices

1. ✅ **Always use checklists**: Don't skip steps
2. ✅ **Test in preview first**: Never deploy untested code to production
3. ✅ **Monitor after deployment**: Watch for issues immediately
4. ✅ **Have rollback plan**: Know how to rollback before deploying
5. ✅ **Document deployments**: Keep notes on what changed and why
6. ✅ **Communicate with team**: Keep team informed of deployments
7. ✅ **Review metrics**: Check analytics and monitoring after deployment

## Common Mistakes to Avoid

### ❌ Don't Do This

1. **Skip testing**: Always test before deploying
2. **Deploy on Friday**: Avoid deploying before weekends
3. **Skip preview**: Always test in preview first
4. **Ignore errors**: Fix errors before deploying
5. **Deploy without review**: Get code review before production
6. **Skip monitoring**: Always monitor after deployment
7. **Forget rollback plan**: Always have rollback plan ready

### ✅ Do This Instead

1. **Test thoroughly**: Test in preview and locally
2. **Deploy early in week**: Deploy Monday-Thursday
3. **Always use preview**: Test in preview before production
4. **Fix all errors**: Resolve errors before deploying
5. **Get code review**: Review before production deployment
6. **Monitor actively**: Watch for issues after deployment
7. **Have rollback ready**: Know rollback steps before deploying

## Checklist Templates

### Quick Pre-Deployment Checklist

```
□ Build succeeds: pnpm build
□ Linting passes: pnpm lint
□ Type checking passes: pnpm check-types
□ Preview tested: Deployed and tested in preview
□ Rollback plan: Know how to rollback
□ Team notified: Team aware of deployment
```

### Quick Post-Deployment Checklist

```
□ Deployment succeeded: Check Vercel dashboard
□ Site loads: Visit production URL
□ No errors: Check browser console
□ Key features work: Test critical functionality
□ Monitoring active: Watch for issues
```

## Related Documentation

- [Rollback Procedures](./rollback-procedures.md)
- [GitHub → Vercel Workflow](./workflow-git-to-vercel.md)
- [Vercel CLI Direct Workflow](./workflow-vercel-direct.md)
- [Deployment Decision Matrix](./deployment-decision-matrix.md)
- [Unified Deployment Guide](./unified-deployment.md)

