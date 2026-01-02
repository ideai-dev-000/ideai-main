---
title: Branch Protection Setup
description: Guide to configuring GitHub branch protection rules for safe deployments
---

# Branch Protection Setup

**Last Updated**: January 1, 2026

## Overview

Branch protection rules ensure that code changes are reviewed and tested before being merged to production branches. This guide explains how to configure branch protection for the IdeaI monorepo.

## Why Branch Protection?

✅ **Prevent direct pushes** to production branches  
✅ **Require code review** before merging  
✅ **Require status checks** (CI/CD) to pass  
✅ **Maintain deployment history** and quality  
✅ **Prevent accidental deployments**  

## Recommended Branch Protection Rules

### Main Branch (`main`)

**Purpose**: Production deployments - highest protection level

**Recommended Settings**:

1. **Require a pull request before merging**
   - ✅ Required
   - ✅ Require approvals: 1 (or more, as needed)
   - ✅ Dismiss stale pull request approvals when new commits are pushed
   - ✅ Require review from Code Owners (if CODEOWNERS file exists)

2. **Require status checks to pass before merging**
   - ✅ Required
   - ✅ Require branches to be up to date before merging
   - ✅ Status checks to require:
     - `build-and-test` (from `ci-cd.yml`)
     - `deploy-preview` (from `ci-cd.yml`)

3. **Require conversation resolution before merging**
   - ✅ Required (recommended)

4. **Do not allow bypassing the above settings**
   - ✅ Required (prevents admins from bypassing)

5. **Restrict who can push to matching branches**
   - ⚠️ Optional (only if you want to restrict direct pushes)
   - If enabled, only specified teams/users can push

6. **Allow force pushes**
   - ❌ Disabled (prevents history rewriting)

7. **Allow deletions**
   - ❌ Disabled (prevents branch deletion)

### Preview Branch (`preview`)

**Purpose**: Preview/staging deployments - moderate protection

**Recommended Settings**:

1. **Require a pull request before merging**
   - ⚠️ Optional (less strict than main)
   - If enabled: Require approvals: 1

2. **Require status checks to pass before merging**
   - ✅ Required
   - ✅ Require branches to be up to date before merging
   - ✅ Status checks to require:
     - `build-and-test` (from `ci-cd.yml`)

3. **Require conversation resolution before merging**
   - ⚠️ Optional

4. **Do not allow bypassing the above settings**
   - ⚠️ Optional (less strict than main)

5. **Allow force pushes**
   - ❌ Disabled

6. **Allow deletions**
   - ❌ Disabled

### Develop Branch (`develop`)

**Purpose**: Development/testing - minimal protection

**Recommended Settings**:

1. **Require a pull request before merging**
   - ⚠️ Optional (can allow direct pushes for development)

2. **Require status checks to pass before merging**
   - ✅ Required (at minimum, require build to pass)

3. **Allow force pushes**
   - ⚠️ Optional (can allow for development flexibility)

4. **Allow deletions**
   - ❌ Disabled

## Setup Instructions

### Step 1: Navigate to Branch Protection Settings

1. Go to repository: [ideai-dev-000/ideai-main](https://github.com/ideai-dev-000/ideai-main)
2. Click **Settings** tab
3. Click **Branches** in left sidebar
4. Click **Add rule** (or edit existing rule)

### Step 2: Configure Branch Name Pattern

**For `main` branch**:
- Branch name pattern: `main`
- Or use pattern: `main` (exact match)

**For `preview` branch**:
- Branch name pattern: `preview`

**For `develop` branch**:
- Branch name pattern: `develop`

### Step 3: Configure Protection Rules

Follow the recommended settings above for each branch.

### Step 4: Save Settings

Click **Create** (or **Save changes**) to apply protection rules.

## Status Checks Configuration

### Required Status Checks

For `main` branch, require these status checks:

1. **build-and-test**
   - From workflow: `.github/workflows/ci-cd.yml`
   - Job name: `build-and-test`
   - Ensures: Linting, type checking, and builds pass

2. **deploy-preview** (optional, but recommended)
   - From workflow: `.github/workflows/ci-cd.yml`
   - Job name: `deploy-preview`
   - Ensures: Preview deployment succeeds

### How to Add Status Checks

1. In branch protection settings
2. Under "Require status checks to pass before merging"
3. Check the boxes for:
   - `build-and-test`
   - `deploy-preview` (optional)

**Note**: Status checks only appear after at least one workflow run has completed.

## Verification

### Test Branch Protection

1. **Create a test branch**:
   \`\`\`bash
   git checkout -b test-branch-protection
   git commit --allow-empty -m "test: branch protection"
   git push origin test-branch-protection
   \`\`\`

2. **Create a PR to `main`**:
   - PR should be created successfully
   - Status checks should run
   - PR should not be mergeable until checks pass

3. **Try to push directly to `main`** (should fail if protection enabled):
   \`\`\`bash
   git checkout main
   git commit --allow-empty -m "test: direct push"
   git push origin main
   # Should fail with protection error
   \`\`\`

### Verify Status Checks

1. Go to PR
2. Check that status checks are running
3. Verify checks must pass before merge button is enabled

## Troubleshooting

### Status Checks Not Appearing

**Problem**: Status checks don't appear in branch protection settings.

**Solution**:
1. Ensure workflows have run at least once
2. Check workflow file syntax is correct
3. Verify GitHub Actions is enabled for repository
4. Wait a few minutes for checks to appear

### Cannot Merge PR

**Problem**: PR shows "Merging is blocked" but all checks passed.

**Solution**:
1. Check branch protection settings
2. Verify required status checks are selected
3. Ensure "Require branches to be up to date" is configured correctly
4. Check if PR needs to be updated (rebase/merge)

### Direct Push Still Works

**Problem**: Can still push directly to protected branch.

**Solution**:
1. Verify branch protection is enabled
2. Check "Restrict who can push" is configured (if needed)
3. Ensure you're not bypassing as admin (if "Do not allow bypassing" is enabled)

### Status Checks Failing

**Problem**: Status checks are failing, blocking merges.

**Solution**:
1. Check workflow logs for errors
2. Fix code issues (linting, type errors, build failures)
3. Re-run failed checks if needed
4. Verify secrets are configured correctly

## Best Practices

1. ✅ **Start strict, relax if needed**: Begin with strict rules, adjust based on team needs
2. ✅ **Require reviews**: At least one approval for production branches
3. ✅ **Require status checks**: Ensure CI/CD passes before merging
4. ✅ **Document exceptions**: If bypassing is needed, document why
5. ✅ **Regular review**: Review protection rules periodically
6. ✅ **Team communication**: Ensure team understands protection rules

## Related Documentation

- [GitHub → Vercel Workflow](../deployment/workflow-git-to-vercel.md)
- [CI/CD Workflows](../deployment/ci-cd.md)
- [Branch Workflow Guide](../development/branch-workflow.md)
- [Deployment Safety Checklist](../deployment/safety-checklist.md)
