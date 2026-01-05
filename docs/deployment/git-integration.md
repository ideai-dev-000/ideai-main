# Git Integration for Multiple Vercel Projects

## Problem: Multiple Projects Deploying from Same Repo

When multiple Vercel projects are connected to the same Git repository, all projects can trigger deployments on every commit. This can cause:
- Wrong project deploying (e.g., docs deploying when web should)
- Unnecessary builds
- Confusion about which project is deploying

## Solution: Root Directory Configuration

Each Vercel project must have a **unique Root Directory** setting that tells Vercel which app to build.

### How It Works

1. **Git commit** triggers Vercel
2. **Vercel checks** which projects are connected to the repo
3. **For each project**, Vercel:
   - Checks if files in Root Directory changed
   - If changed, builds that project
   - If not changed, skips build (if Ignored Build Step is configured)

### Required Settings

#### For `web` Project (ideai-main → myui.space)

**Vercel Dashboard**: https://vercel.com/idea-i/web/settings/general

1. **Root Directory**: `apps/web`
   - ⚠️ **CRITICAL**: Must be exactly `apps/web`
   - This tells Vercel to build `apps/web` for this project

2. **Git Integration**: Connected to `ideai-dev-000/ideai-main`
   - Production Branch: `main` (or your production branch)
   - Preview Branches: All branches

3. **Ignore Build Step**: (Recommended)
   - **Location**: Settings → Git → Ignored Build Step
   - **Two Options**:
     
     **Option A: Direct Command** (Simpler)
     - Enter directly: `git diff HEAD^ HEAD --quiet apps/web packages/`
     - No script file needed
     
     **Option B: Script File** (If dashboard requires it)
     - Create script: `scripts/ignore-build-web.sh`
     - Enter in dashboard: `bash scripts/ignore-build-web.sh`
   - **How it works**: 
     - Returns exit code 0 (no changes) = Skip build
     - Returns exit code 1 (changes found) = Proceed with build

## Verification

### Check Project Settings

1. Go to each project's settings:
   - `web`: https://vercel.com/idea-i/web/settings/general
   - `docs`: https://vercel.com/idea-i/docs/settings/general

2. Verify:
   - ✅ Root Directory is set correctly (`apps/web` or `apps/docs`)
   - ✅ Git Integration shows correct repository
   - ✅ Production branch is correct

### Test Deployment

\`\`\`bash
# Make a change only to apps/web
echo "test" >> apps/web/app/page.tsx

# Commit and push
git add apps/web/app/page.tsx
git commit -m "test: web app only"
git push

# Check Vercel dashboard:
# - web project should deploy
# - docs project should NOT deploy (unless docs files also changed)
\`\`\`

## Troubleshooting

### Issue: Both Projects Deploy on Every Commit

**Cause**: Root Directory not set correctly, or Ignored Build Step not configured

**Solution**:
1. Verify Root Directory is set correctly for each project
2. Configure Ignored Build Step to skip when app files don't change
3. Example for `web` project:
   \`\`\`
   git diff HEAD^ HEAD --quiet apps/web
   \`\`\`

### Issue: Wrong Project Deploying

**Cause**: Root Directory might be wrong, or project linked incorrectly

**Solution**:
1. Check Root Directory in dashboard
2. Verify `.vercel/project.json` has correct project ID
3. Re-link if needed: `cd apps/web && vercel link`

### Issue: Project Not Deploying

**Cause**: Git integration not connected, or Root Directory files didn't change

**Solution**:
1. Check Git Integration in project settings
2. Verify repository is connected
3. Check if files in Root Directory actually changed

## Best Practices

1. ✅ **Set Root Directory correctly** for each project
2. ✅ **Use Ignored Build Step** to avoid unnecessary builds
3. ✅ **Monitor deployments** in Vercel dashboard
4. ✅ **Test with small changes** to verify correct project deploys
5. ✅ **Keep `.vercel/project.json`** in each app directory

## Ignored Build Step Examples

### Option A: Direct Command (Recommended)

If Vercel allows direct commands, enter these in the "Ignored Build Step" field:

**For `web` Project:**
\`\`\`
git diff HEAD^ HEAD --quiet apps/web packages/
\`\`\`

**For `docs` Project:**
\`\`\`
git diff HEAD^ HEAD --quiet apps/docs packages/
\`\`\`

### Option B: Script File (If Required)

If Vercel dashboard shows "bash your-script-name.sh" format, use script files with correct paths:

**Important**: Since Root Directory is `apps/{app-name}`, scripts are at `../../scripts/` relative to the app.

**For `web` Project:**
1. Script file: `scripts/ignore-build-web.sh` (already created)
2. Enter in dashboard: `bash ../../scripts/ignore-build-web.sh`

**For `docs` Project:**
1. Script file: `scripts/ignore-build-docs.sh` (if needed)
2. Enter in dashboard: `bash ../../scripts/ignore-build-docs.sh`

**Alternative (Recommended)**: Use the direct command instead of script file:
- For `web`: `git diff HEAD^ HEAD --quiet apps/web packages/`
- For `docs`: `git diff HEAD^ HEAD --quiet apps/docs packages/`

### Script Files Created

Script files are available at:
- `scripts/ignore-build-web.sh` - For web project
- `scripts/ignore-build-docs.sh` - For docs project (if needed)

Scripts are executable and ready to use.

### How It Works

1. **Vercel executes the command/script** on each commit
2. **`git diff HEAD^ HEAD`** compares current commit to previous commit
3. **`--quiet`** flag:
   - Returns exit code 0 if no differences found → Vercel skips build
   - Returns exit code 1 if differences found → Vercel proceeds with build
4. **Directory paths** limit the diff to specific directories

This ensures each project only builds when its own files (or shared packages) change.
