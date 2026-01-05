#!/bin/bash

# GitHub Secrets Setup Script
# This script helps you add the required secrets to GitHub
# @location scripts/ideai-develop-setup-secrets.sh

echo "🔐 GitHub Secrets Setup"
echo "======================"
echo ""

# Check if gh CLI is authenticated
if ! gh auth status &>/dev/null; then
    echo "❌ GitHub CLI not authenticated"
    echo "Run: gh auth login"
    exit 1
fi

echo "✅ GitHub CLI is authenticated"
echo ""

# Get Vercel token from user
echo "📝 Step 1: Get your Vercel token"
echo "   1. Go to: https://vercel.com/account/tokens"
echo "   2. Click 'Create Token'"
echo "   3. Copy the token (it starts with 'vercel_...')"
echo ""
read -p "Paste your VERCEL_TOKEN here: " VERCEL_TOKEN

if [ -z "$VERCEL_TOKEN" ]; then
    echo "❌ Token cannot be empty"
    exit 1
fi

echo ""
echo "📤 Adding secrets to GitHub..."
echo ""

# Set VERCEL_TOKEN
echo "   Setting VERCEL_TOKEN..."
gh secret set VERCEL_TOKEN --body "$VERCEL_TOKEN" --repo ideai-dev-000/ideai-main

# Set VERCEL_ORG_ID
echo "   Setting VERCEL_ORG_ID..."
gh secret set VERCEL_ORG_ID --body "team_vhjzlMi6CfNow0IfBXnv2Yn2" --repo ideai-dev-000/ideai-main

# Set VERCEL_PROJECT_ID
echo "   Setting VERCEL_PROJECT_ID..."
gh secret set VERCEL_PROJECT_ID --body "prj_rOeGwbNZwaO6sJ2J685Y3g9TV2cw" --repo ideai-dev-000/ideai-main

echo ""
echo "✅ All secrets have been added!"
echo ""
echo "Verify at: https://github.com/ideai-dev-000/ideai-main/settings/secrets/actions"
echo ""


