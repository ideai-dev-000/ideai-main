---
title: Vercel → GitHub Sync Workflow
description: Guide for syncing Vercel CLI deployments back to GitHub to maintain version control
---

# Vercel → GitHub Sync Workflow

**Last Updated**: January 1, 2026

## Overview

When deploying directly via Vercel CLI (bypassing GitHub Actions), you **must sync changes back to GitHub** to maintain version control and keep git history in sync with deployments. This document explains how to sync Vercel deployments to GitHub.

## Why Sync is Critical

⚠️ **CRITICAL**: Vercel CLI deployments do NOT automatically update GitHub. You must manually sync to maintain:

- ✅ **Version Control**: Git history matches deployments
- ✅ **Team Visibility**: Team can see what's deployed
- ✅ **Rollback Capability**: Can rollback via git if needed
- ✅ **Deployment History**: Complete deployment history in git
- ✅ **Code Consistency**: Git and Vercel stay in sync

## When to Sync

**Always sync after**:
- ✅ Deploying via Vercel CLI (`vercel deploy` or `./deploy.sh`)
- ✅ Emergency hotfix deployments
- ✅ Quick iteration deployments
- ✅ Testing deployment process

**Sync is NOT needed when**:
- ✅ Deploying via GitHub → Vercel workflow (automatic)
- ✅ GitHub Actions handles deployment (automatic sync)

## Sync Methods

### Method 1: Manual Git Commit & Push (Recommended)

**Best for**: Most scenarios, maintains clear history

**Steps**:

1. **After Vercel deployment, commit changes**:
   \`\`\`bash
   # Stage any changes
   git add .
   
   # Commit with descriptive message
   git commit -m "deploy(web): deploy to production via CLI
   
   Deployed via Vercel CLI for [reason: emergency hotfix/quick iteration].
   Changes: [brief description of what was deployed]
   
   Related: TICKET-XXX"
   
   # Push to GitHub
   git push origin main
   \`\`\`

2. **If no code changes** (deployment only):
   \`\`\`bash
   # Create empty commit documenting deployment
   git commit --allow-empty -m "deploy(web): deploy to production via CLI
   
   No code changes - deployment only.
   Reason: [why CLI was used instead of GitHub workflow]
   
   Related: TICKET-XXX"
   
   git push origin main
   \`\`\`

### Method 2: Automated Sync Script

**Best for**: Frequent CLI deployments, automation

**Use the sync script**:
\`\`\`bash
./scripts/sync-vercel-to-github.sh [app-name] [reason]
\`\`\`

**Example**:
\`\`\`bash
# Sync after deploying web app
./scripts/sync-vercel-to-github.sh web "emergency hotfix"

# Sync after deploying all apps
./scripts/sync-vercel-to-github.sh all "quick iteration"
\`\`\`

**What the script does**:
1. Checks git status
2. Creates commit with deployment info
3. Pushes to GitHub
4. Provides deployment summary

**See**: [Sync Script Documentation](#sync-script) below

### Method 3: Post-Deployment Hook Script

**Best for**: Automatic sync after every CLI deployment

**Create wrapper script** that:
1. Deploys via Vercel CLI
2. Automatically syncs to GitHub

**Example**:
\`\`\`bash
#!/bin/bash
# scripts/deploy-and-sync.sh

# Deploy
./deploy.sh --prod "$@"

# Sync to GitHub
./scripts/sync-vercel-to-github.sh "$1" "CLI deployment"
\`\`\`

## Sync Procedures by Scenario

### Scenario 1: Emergency Hotfix

**Situation**: Critical bug, deployed via CLI for speed.

**Sync Steps**:
\`\`\`bash
# 1. Fix bug and deploy
./deploy.sh --prod web

# 2. Commit fix (if not already committed)
git add .
git commit -m "fix(web): emergency hotfix for [issue]

Fixed critical bug: [description]
Deployed via CLI for speed.

Related: TICKET-XXX"

# 3. Push to GitHub
git push origin main

# 4. Create PR for review (post-deployment)
gh pr create --title "fix(web): emergency hotfix" --body "Emergency fix deployed via CLI. Review and merge."
\`\`\`

### Scenario 2: Quick Development Iteration

**Situation**: Testing deployment process, deployed via CLI.

**Sync Steps**:
\`\`\`bash
# 1. Deploy via CLI
./deploy.sh web

# 2. Test deployment
# (verify it works)

# 3. Commit changes (if any)
git add .
git commit -m "deploy(web): quick iteration deployment

Testing deployment process via CLI.
No production changes.

Related: TICKET-XXX"

# 4. Push to GitHub
git push origin main
\`\`\`

### Scenario 3: Testing New Configuration

**Situation**: Testing Vercel configuration changes, deployed via CLI.

**Sync Steps**:
\`\`\`bash
# 1. Deploy via CLI
./deploy.sh --prod web

# 2. Verify configuration works

# 3. Document configuration (if changed)
# Update docs/deployment/vercel.md if needed

# 4. Commit documentation
git add docs/deployment/vercel.md
git commit -m "docs(deploy): update Vercel configuration

Tested new configuration via CLI deployment.
Configuration verified working.

Related: TICKET-XXX"

# 5. Push to GitHub
git push origin main
\`\`\`

## Sync Script

### Usage

\`\`\`bash
./scripts/sync-vercel-to-github.sh [app-name] [reason]
\`\`\`

**Parameters**:
- `app-name`: App that was deployed (e.g., `web`, `docs`, `all`)
- `reason`: Reason for CLI deployment (e.g., "emergency hotfix", "quick iteration")

**Examples**:
\`\`\`bash
# Sync single app
./scripts/sync-vercel-to-github.sh web "emergency hotfix"

# Sync all apps
./scripts/sync-vercel-to-github.sh all "quick iteration"

# With detailed reason
./scripts/sync-vercel-to-github.sh docs "testing new deployment process"
\`\`\`

### What It Does

1. **Checks git status**: Verifies repository state
2. **Creates commit**: Documents deployment with metadata
3. **Pushes to GitHub**: Syncs changes to remote
4. **Provides summary**: Shows what was synced

### Commit Message Format

The script creates commits with this format:
\`\`\`
deploy([app]): deploy via Vercel CLI

[Reason for CLI deployment]

- App: [app-name]
- Environment: [preview/production]
- Deployed via: Vercel CLI
- Reason: [reason provided]

Related: TICKET-XXX (if provided)
\`\`\`

## Best Practices

### Commit Messages

✅ **Good commit messages**:
\`\`\`
deploy(web): deploy to production via CLI

Emergency hotfix for authentication issue.
Deployed via CLI for speed, changes committed.

Related: TICKET-1.5
\`\`\`

❌ **Bad commit messages**:
\`\`\`
deploy: stuff
\`\`\`

### When to Document

✅ **Always document**:
- Why CLI was used instead of GitHub workflow
- What was deployed
- Any configuration changes
- Related ticket numbers

### Sync Timing

✅ **Sync immediately**:
- Right after CLI deployment
- Before moving on to other work
- Before team members pull changes

❌ **Don't delay**:
- Don't wait days to sync
- Don't forget to sync
- Don't skip sync "just this once"

## Troubleshooting

### Error: "Nothing to commit"

**Problem**: No changes to commit after deployment.

**Solution**: Create empty commit documenting deployment:
\`\`\`bash
git commit --allow-empty -m "deploy(web): deploy via CLI

No code changes - deployment only.
Reason: [why CLI was used]"
\`\`\`

### Error: "Git repository not found"

**Problem**: Not in git repository or wrong directory.

**Solution**: Ensure you're in repo root:
\`\`\`bash
cd /path/to/ideai-main
./scripts/sync-vercel-to-github.sh web "reason"
\`\`\`

### Error: "Remote not configured"

**Problem**: Git remote not set up.

**Solution**: Configure remote:
\`\`\`bash
git remote add origin https://github.com/ideai-dev-000/ideai-main.git
\`\`\`

### Error: "Permission denied"

**Problem**: No permission to push to repository.

**Solution**: 
1. Check GitHub authentication: `gh auth status`
2. Verify repository permissions
3. Use SSH instead of HTTPS if needed

## Automation Options

### Option 1: Post-Deployment Hook

Create wrapper that deploys and syncs:
\`\`\`bash
#!/bin/bash
# scripts/deploy-and-sync.sh

APP=$1
REASON=$2

# Deploy
./deploy.sh --prod "$APP"

# Sync
./scripts/sync-vercel-to-github.sh "$APP" "$REASON"
\`\`\`

### Option 2: Git Hooks

Create git hook to remind to sync:
\`\`\`bash
#!/bin/bash
# .git/hooks/post-commit

# Check if last commit mentions CLI deployment
if git log -1 --pretty=%B | grep -q "via Vercel CLI"; then
  echo "✅ Deployment synced to git"
else
  echo "⚠️  Remember to sync CLI deployments to git!"
fi
\`\`\`

### Option 3: Vercel Webhooks (Future)

**Note**: Vercel doesn't automatically push to GitHub. Future enhancement could:
- Use Vercel webhooks to trigger GitHub API
- Auto-commit deployment metadata
- Keep git and Vercel in sync automatically

## Checklist

After every CLI deployment:

- [ ] Deployment successful (verified in Vercel dashboard)
- [ ] Changes committed to git (if any code changes)
- [ ] Deployment documented in commit message
- [ ] Commit pushed to GitHub
- [ ] Team notified (if production deployment)
- [ ] PR created for review (if emergency hotfix)

## Related Documentation

- [Vercel CLI Direct Workflow](./workflow-vercel-direct.md)
- [GitHub → Vercel Workflow](./workflow-git-to-vercel.md)
- [Deployment Decision Matrix](./deployment-decision-matrix.md)
- [Rollback Procedures](./rollback-procedures.md)
- [Deployment Safety Checklist](./safety-checklist.md)
