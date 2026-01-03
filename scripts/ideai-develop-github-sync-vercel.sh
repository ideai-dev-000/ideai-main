#!/bin/bash

# Sync Vercel CLI deployment to GitHub
# 
# Usage:
#   ./scripts/ideai-develop-github-sync-vercel.sh [app-name] [reason]
#
# Examples:
#   ./scripts/ideai-develop-github-sync-vercel.sh web "emergency hotfix"
#   ./scripts/ideai-develop-github-sync-vercel.sh all "quick iteration"
#
# This script creates a git commit documenting the Vercel CLI deployment
# and pushes it to GitHub to maintain version control.
#
# @location scripts/ideai-develop-github-sync-vercel.sh

set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if app name provided
if [ -z "$1" ]; then
  echo -e "${RED}❌ Error: App name required${NC}"
  echo ""
  echo "Usage: ./scripts/ideai-develop-github-sync-vercel.sh [app-name] [reason]"
  echo ""
  echo "Examples:"
  echo "  ./scripts/ideai-develop-github-sync-vercel.sh web \"emergency hotfix\""
  echo "  ./scripts/ideai-develop-github-sync-vercel.sh all \"quick iteration\""
  exit 1
fi

APP_NAME="$1"
REASON="${2:-CLI deployment}"

# Ensure we're in repo root
REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO_ROOT"

echo -e "${BLUE}=== Syncing Vercel CLI Deployment to GitHub ===${NC}"
echo ""
echo -e "App: ${YELLOW}${APP_NAME}${NC}"
echo -e "Reason: ${YELLOW}${REASON}${NC}"
echo ""

# Check if git repository
if [ ! -d ".git" ]; then
  echo -e "${RED}❌ Error: Not a git repository${NC}"
  echo "Please run this script from the repository root."
  exit 1
fi

# Check if git remote configured
if ! git remote get-url origin > /dev/null 2>&1; then
  echo -e "${RED}❌ Error: Git remote 'origin' not configured${NC}"
  echo "Please configure git remote:"
  echo "  git remote add origin https://github.com/ideai-dev-000/ideai-main.git"
  exit 1
fi

# Check current branch
CURRENT_BRANCH=$(git branch --show-current)
echo -e "Current branch: ${YELLOW}${CURRENT_BRANCH}${NC}"
echo ""

# Check git status
if ! git diff --quiet --exit-code || ! git diff --cached --quiet --exit-code; then
  echo -e "${YELLOW}⚠️  Uncommitted changes detected${NC}"
  echo ""
  echo "You have uncommitted changes. Options:"
  echo "  1. Commit changes first, then run sync script"
  echo "  2. Stash changes, sync, then pop stash"
  echo ""
  read -p "Continue anyway? (y/N): " -n 1 -r
  echo ""
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Aborted."
    exit 1
  fi
fi

# Determine environment (try to detect from branch or ask)
ENVIRONMENT="preview"
if [ "$CURRENT_BRANCH" == "main" ]; then
  ENVIRONMENT="production"
elif [ "$CURRENT_BRANCH" == "preview" ]; then
  ENVIRONMENT="preview"
else
  read -p "Environment (preview/production) [preview]: " -r
  if [ -n "$REPLY" ]; then
    ENVIRONMENT="$REPLY"
  fi
fi

# Create commit message
COMMIT_MSG="deploy(${APP_NAME}): deploy via Vercel CLI

Deployed to ${ENVIRONMENT} environment via Vercel CLI.

- App: ${APP_NAME}
- Environment: ${ENVIRONMENT}
- Deployed via: Vercel CLI
- Reason: ${REASON}

Related: TICKET-XXX"

# Check if there are changes to commit
if git diff --quiet --exit-code && git diff --cached --quiet --exit-code; then
  echo -e "${YELLOW}No code changes detected. Creating empty commit to document deployment.${NC}"
  echo ""
  
  # Create empty commit
  git commit --allow-empty -m "$COMMIT_MSG" || {
    echo -e "${RED}❌ Failed to create commit${NC}"
    exit 1
  }
else
  echo -e "${BLUE}Staging changes...${NC}"
  git add .
  
  echo -e "${BLUE}Creating commit...${NC}"
  git commit -m "$COMMIT_MSG" || {
    echo -e "${RED}❌ Failed to create commit${NC}"
    exit 1
  }
fi

# Push to GitHub
echo ""
echo -e "${BLUE}Pushing to GitHub...${NC}"
git push origin "$CURRENT_BRANCH" || {
  echo -e "${RED}❌ Failed to push to GitHub${NC}"
  echo ""
  echo "Possible issues:"
  echo "  - Not authenticated with GitHub"
  echo "  - No permission to push to repository"
  echo "  - Branch protection rules blocking push"
  echo ""
  echo "Try:"
  echo "  gh auth login"
  echo "  git push origin $CURRENT_BRANCH"
  exit 1
}

echo ""
echo -e "${GREEN}✅ Successfully synced to GitHub${NC}"
echo ""
echo -e "Commit: ${YELLOW}$(git log -1 --oneline)${NC}"
echo -e "Branch: ${YELLOW}${CURRENT_BRANCH}${NC}"
echo -e "Remote: ${YELLOW}$(git remote get-url origin)${NC}"
echo ""
echo -e "${GREEN}=== Sync Complete ===${NC}"


