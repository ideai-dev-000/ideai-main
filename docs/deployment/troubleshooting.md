# Deployment Troubleshooting

Common issues and solutions for deployment problems.

## GitHub Actions Issues

### Workflow Not Running

**Symptoms**: Workflows don't trigger on push/PR

**Solutions**:
- Verify workflow file syntax (check YAML)
- Ensure branch names match workflow triggers
- Check GitHub Actions is enabled: Settings → Actions → General
- Verify workflow file is in `.github/workflows/`

### Workflow Fails: "Secret not found"

**Symptoms**: Error about missing secrets

**Solutions**:
- Verify all required secrets are set
- Check secret names match exactly (case-sensitive)
- Ensure you have admin access to repository
- See [GitHub Secrets Setup](../setup/github-secrets.md)

### Build Timeout

**Symptoms**: Workflow times out during build

**Solutions**:
- Increase `timeout-minutes` in workflow
- Optimize build process
- Enable Turborepo remote caching
- Check for infinite loops in build scripts

## Vercel Deployment Issues

### "Unexpected error" During Deployment

**Symptoms**: Deployment queues successfully but fails with "Unexpected error" or generic build failures

**Solutions**:
1. **Enable "Include files outside the root directory in the Build Step"**:
   - Go to: [Project Settings → Build & Development Settings](https://vercel.com/idea-i/web/settings/general)
   - Find "Root Directory" section
   - **Check the box**: "Include files outside the root directory in the Build Step"
   - Save changes
2. Verify Root Directory is set to `apps/web`
3. This setting is **required** for Turborepo monorepos to access:
   - Root `package.json`, `pnpm-workspace.yaml`, `turbo.json`
   - Shared packages in `packages/` directory
   - Workspace dependencies

See [Vercel Build Configuration](https://vercel.com/docs/builds/configure-a-build#root-directory) for details.

### "No Next.js version detected"

**Symptoms**: Vercel can't detect Next.js framework

**Solutions**:
1. Set Root Directory in Vercel dashboard:
   - Go to: [Project Settings](https://vercel.com/idea-i/web/settings/general)
   - Set Root Directory to: `apps/web`
   - **Enable** "Include files outside the root directory in the Build Step"
2. Verify `package.json` contains `next` dependency
3. Ensure Root Directory is set correctly in Vercel dashboard

### Build Fails: "Cannot find module"

**Symptoms**: Module resolution errors during build (e.g., can't find `@repo/ui`)

**Solutions**:
1. **Enable "Include files outside the root directory in the Build Step"** (most common fix)
2. Verify `installCommand` runs from monorepo root
3. Check workspace dependencies are properly linked
4. Ensure `pnpm install` runs before build
5. Verify `package.json` workspace configuration is correct

### Deployment Fails: Authentication Error

**Symptoms**: "Unauthorized" or "Invalid token" errors

**Solutions**:
- Verify `VERCEL_TOKEN` secret is set correctly
- Check token hasn't expired
- Regenerate token if needed
- Ensure token has correct permissions

### Preview URL Not Generated

**Symptoms**: Deployment succeeds but no preview URL

**Solutions**:
- Check workflow logs for deployment step
- Verify Vercel project is linked correctly
- Check GitHub Actions has deployment permissions
- Review Vercel dashboard for deployment status

## Local Development Issues

### Vercel CLI Not Working

**Symptoms**: `vercel` command fails locally

**Solutions**:
```bash
# Re-authenticate
vercel login

# Re-link project (from repo root)
vercel link
```

**Note**: For standard deployments, use GitHub Actions workflows. Vercel CLI is mainly for local testing.

### Environment Variables Missing

**Symptoms**: App works locally but fails in deployment

**Solutions**:
- Set environment variables in Vercel dashboard
- Pull env vars locally: `vercel env pull .env.local`
- Verify `.env.local` is in `.gitignore`
- Check environment variable names match

## Common Error Messages

### "EADDRINUSE: address already in use"

**Solution**: Port is already in use, kill existing process:
```bash
lsof -ti:3000 | xargs kill -9
```

### "TURBO_TOKEN not found"

**Solution**: Optional secret, only needed for remote caching:
- Set `TURBO_TOKEN` and `TURBO_TEAM` secrets
- Or remove from workflow if not using remote caching

### "Project not found"

**Solution**: Verify project is linked (from repo root):
```bash
vercel link
```

### Deployment Canceled: "Unverified commit"

**Symptoms**: Deployment is canceled with message about unverified commit

**Solutions**:
1. **Quick fix** (for preview environments): Disable verification requirement in Vercel dashboard:
   - Go to: Project Settings → Deployment Protection
   - Disable "Require Verified Commits"
2. **Recommended**: Set up commit signing (see [Commit Signing Setup](../setup/commit-signing.md))

## Getting Help

### Check Logs

1. **GitHub Actions**: View workflow run logs
2. **Vercel Dashboard**: Check deployment logs
3. **Local Build**: Run `pnpm build` locally to see errors

### Useful Commands

```bash
# Check Vercel authentication
vercel whoami

# List Vercel projects
vercel project ls

# Inspect deployment
vercel inspect

# Check GitHub CLI
gh auth status
```

### Resources

- [Vercel Documentation](https://vercel.com/docs)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Turborepo Documentation](https://turbo.build/repo/docs)

## Related Documentation

- [Deployment Overview](./overview.md)
- [CI/CD Workflows](./ci-cd.md)
- [Vercel Configuration](./vercel.md)
- [GitHub Secrets Setup](../setup/github-secrets.md)

