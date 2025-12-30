# GitHub Secrets Configuration

This guide explains how to configure GitHub secrets required for CI/CD deployments to Vercel.

## Overview

GitHub Actions requires three secrets to authenticate and deploy to Vercel:
- `VERCEL_TOKEN` - Authentication token for Vercel API
- `VERCEL_ORG_ID` - Your Vercel organization/team ID
- `VERCEL_PROJECT_ID` - Your Vercel project ID

## Quick Setup (Recommended)

We provide an automated script to simplify the setup process.

### Prerequisites

- GitHub CLI (`gh`) installed and authenticated
- Vercel account access

### Step 1: Get Your Vercel Token

1. Navigate to [Vercel Tokens](https://vercel.com/account/tokens)
2. Click **"Create Token"**
3. Name it (e.g., "GitHub Actions")
4. Set expiration (optional, or "No expiration")
5. Click **"Create"**
6. **Copy the token immediately** - it starts with `vercel_...`
   - ⚠️ You can only view it once!

### Step 2: Run the Setup Script

```bash
cd /path/to/ideai-main
./scripts/setup-secrets.sh
```

The script will:
1. Verify GitHub CLI authentication
2. Prompt for your Vercel token
3. Automatically set all three required secrets

### What the Script Does

The `setup-secrets.sh` script:
- Validates GitHub CLI authentication
- Prompts for your Vercel token
- Sets `VERCEL_TOKEN` secret
- Sets `VERCEL_ORG_ID` secret (pre-configured)
- Sets `VERCEL_PROJECT_ID` secret (pre-configured)

## Manual Setup

If you prefer to set secrets manually or the script doesn't work:

### Option 1: GitHub CLI

```bash
# Authenticate with GitHub CLI first
gh auth login

# Set secrets (replace YOUR_TOKEN with actual token)
gh secret set VERCEL_TOKEN --body "YOUR_TOKEN" --repo ideai-dev-000/ideai-main
gh secret set VERCEL_ORG_ID --body "team_vhjzlMi6CfNow0IfBXnv2Yn2" --repo ideai-dev-000/ideai-main
gh secret set VERCEL_PROJECT_ID --body "prj_rOeGwbNZwaO6sJ2J685Y3g9TV2cw" --repo ideai-dev-000/ideai-main
```

### Option 2: GitHub Web Interface

1. Go to: [Repository Secrets](https://github.com/ideai-dev-000/ideai-main/settings/secrets/actions)
2. Click **"New repository secret"**
3. Add each secret:
   - **Name**: `VERCEL_TOKEN`, **Value**: (your token from Vercel)
   - **Name**: `VERCEL_ORG_ID`, **Value**: `team_vhjzlMi6CfNow0IfBXnv2Yn2`
   - **Name**: `VERCEL_PROJECT_ID`, **Value**: `prj_rOeGwbNZwaO6sJ2J685Y3g9TV2cw`

## Verification

After setup, verify secrets are configured:

```bash
# List secrets (names only, values are hidden)
gh secret list --repo ideai-dev-000/ideai-main
```

Or check in GitHub: [Secrets Page](https://github.com/ideai-dev-000/ideai-main/settings/secrets/actions)

You should see:
- ✅ `VERCEL_TOKEN`
- ✅ `VERCEL_ORG_ID`
- ✅ `VERCEL_PROJECT_ID`

## Project-Specific Values

Current project configuration:
- **Organization ID**: `team_vhjzlMi6CfNow0IfBXnv2Yn2`
- **Project ID**: `prj_rOeGwbNZwaO6sJ2J685Y3g9TV2cw`
- **Project Name**: `web`

These values are automatically used by the setup script.

## Troubleshooting

### Script Fails: "GitHub CLI not authenticated"
```bash
gh auth login
```

### Script Fails: "Token cannot be empty"
- Ensure you copied the entire token from Vercel
- Token should start with `vercel_`
- No extra spaces before/after

### Secrets Not Working in CI/CD
- Verify all three secrets are set
- Check secret names match exactly (case-sensitive)
- Ensure Vercel token hasn't expired
- Verify you have admin access to the repository

### Token Expired
1. Create a new token at [Vercel Tokens](https://vercel.com/account/tokens)
2. Update the secret:
   ```bash
   gh secret set VERCEL_TOKEN --body "NEW_TOKEN" --repo ideai-dev-000/ideai-main
   ```

## Security Best Practices

- ✅ Use separate tokens for different environments
- ✅ Set token expiration dates when possible
- ✅ Rotate tokens periodically
- ✅ Never commit tokens to version control
- ✅ Use GitHub Secrets (not environment variables in code)

## Related Documentation

- [Deployment Guide](../deployment/overview.md)
- [CI/CD Workflows](../deployment/ci-cd.md)
- [Vercel Configuration](../deployment/vercel.md)

