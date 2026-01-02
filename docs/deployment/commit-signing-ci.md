---
title: Commit Signing in CI/CD
description: Guide to commit signing in GitHub Actions and Vercel deployments, including handling non-interactive environments.
---
# Commit Signing in CI/CD

This document explains how commit signing works in GitHub Actions and Vercel deployments.

## The Problem

Vercel can be configured to require verified commits. When commits are not signed (or signed incorrectly), Vercel will cancel deployments with an "unverified commit" error.

## Current Status

- ✅ GPG key configured locally: `014A28289CE5DCE5`
- ✅ Key added to GitHub account
- ⚠️ Commits made in non-interactive environments (Cursor/AI) are unsigned
- ⚠️ Vercel may require verified commits

## Solutions

### Option 1: Disable Verification Requirement (Quick Fix)

For preview deployments, you can disable the requirement:

1. Go to Vercel Dashboard → Your Project → Settings
2. Navigate to **Deployment Protection**
3. Disable **"Require Verified Commits"** for preview deployments
4. Keep it enabled for production (recommended)

**Pros**: Quick fix, no code changes  
**Cons**: Less secure for preview environments

### Option 2: Sign Commits in GitHub Actions (Recommended)

Configure GitHub Actions to sign commits using a GPG key stored as a secret.

#### Step 1: Export GPG Key

\`\`\`bash
# Export your private key (keep this secure!)
gpg --armor --export-secret-keys 014A28289CE5DCE5 > gpg-private-key.asc

# Export your public key
gpg --armor --export 014A28289CE5DCE5 > gpg-public-key.asc
\`\`\`

#### Step 2: Add GitHub Secrets

1. Go to: https://github.com/ideai-dev-000/ideai-main/settings/secrets/actions
2. Add secret: `GPG_PRIVATE_KEY` (paste the content of `gpg-private-key.asc`)
3. Add secret: `GPG_PASSPHRASE` (your GPG key passphrase)
4. Add secret: `GPG_KEY_ID` = `014A28289CE5DCE5`

#### Step 3: Update GitHub Actions Workflow

Add GPG setup steps before checkout:

\`\`\`yaml
- name: Import GPG Key
  uses: crazy-max/ghaction-import-gpg@v6
  with:
    gpg_private_key: ${{ secrets.GPG_PRIVATE_KEY }}
    passphrase: ${{ secrets.GPG_PASSPHRASE }}
    git_user_signingkey: true
    git_commit_gpgsign: true

- name: Checkout code
  uses: actions/checkout@v4
\`\`\`

**Pros**: Properly signed commits, works with Vercel verification  
**Cons**: Requires storing GPG key as secret (security consideration)

### Option 3: Configure Checkout to Verify Existing Commits

If commits are already signed locally, ensure GitHub Actions verifies them:

\`\`\`yaml
- name: Checkout code
  uses: actions/checkout@v4
  with:
    fetch-depth: 0  # Fetch full history for commit verification
\`\`\`

**Pros**: Simple, works if commits are already signed  
**Cons**: Doesn't help if commits are unsigned

## Recommended Approach

For this project:

1. **Preview deployments**: Disable "Require Verified Commits" in Vercel (quick fix)
2. **Production deployments**: Keep verification enabled
3. **Future**: Set up GPG signing in GitHub Actions for proper CI/CD signing

## Current Workflow

The preview deployment workflow (`preview-deploy.yml`) currently:
- Fetches full git history (`fetch-depth: 0`)
- Relies on commits being signed before push
- Vercel verifies commits if requirement is enabled

## Troubleshooting

### "Deployment canceled: unverified commit"

**Solution 1**: Disable requirement in Vercel (see Option 1)

**Solution 2**: Ensure commits are signed before pushing:
\`\`\`bash
# In your terminal (not Cursor/AI)
git config --global commit.gpgsign true
git commit --amend -S -m "Your message"
git push --force-with-lease
\`\`\`

**Solution 3**: Set up CI signing (see Option 2)

### Commits show "N" (no signature)

This means commits are unsigned. Options:
- Sign them with `git commit --amend -S`
- Or disable Vercel verification requirement
- Or set up CI signing

## Related Documentation

- [Commit Signing Setup](../setup/commit-signing.md) - Local GPG setup
- [Vercel Configuration](./vercel.md) - Vercel settings
- [Troubleshooting](./troubleshooting.md) - Common issues
- [GitHub: Signing Commits](https://docs.github.com/en/authentication/managing-commit-signature-verification)
