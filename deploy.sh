#!/bin/bash

# Unified deployment script for IdeaI monorepo
# Deploys all apps to Vercel with a single command
#
# Usage:
#   ./deploy.sh [--prod] [app1] [app2] ...
#
# Examples:
#   ./deploy.sh                    # Deploy all apps (preview)
#   ./deploy.sh --prod             # Deploy all apps (production)
#   ./deploy.sh --prod docs web # Deploy only docs and web (production)

set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if --prod flag is set
PROD_FLAG=""
if [[ "$1" == "--prod" ]]; then
  PROD_FLAG="--prod"
  shift
fi

# Get list of apps to deploy
APPS_TO_DEPLOY=("$@")

# If no apps specified, deploy all
if [ ${#APPS_TO_DEPLOY[@]} -eq 0 ]; then
  APPS_TO_DEPLOY=("web" "docs" "all" "nocss" "mvp" "tailwind" "allcss" "unocss" "shadcn")
fi

echo -e "${BLUE}=== IdeaI Monorepo Deployment ===${NC}"
echo ""
echo -e "Mode: ${PROD_FLAG:-preview}"
echo -e "Apps to deploy: ${APPS_TO_DEPLOY[*]}"
echo ""

# Ensure we're in repo root
REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$REPO_ROOT"

# Deploy each app
for app in "${APPS_TO_DEPLOY[@]}"; do
  echo -e "${YELLOW}Deploying ${app}...${NC}"
  
  # Check if app directory exists
  if [ ! -d "apps/$app" ]; then
    echo -e "${RED}❌ App directory not found: apps/${app}${NC}"
    exit 1
  fi
  
  # Verify .vercel directory exists (project is linked)
  if [ ! -f "apps/$app/.vercel/project.json" ]; then
    echo -e "${RED}❌ Project not linked: apps/${app}${NC}"
    echo -e "${YELLOW}Run: cd apps/${app} && vercel link${NC}"
    exit 1
  fi
  
  # The issue: When Root Directory is set in dashboard AND we deploy from apps/$app,
  # Vercel duplicates the path (apps/web + apps/web = apps/web/apps/web)
  #
  # Solution: Deploy from repo root, but we need Vercel to find the project.
  # We'll temporarily symlink .vercel to repo root, deploy, then remove it.
  
  # Create temporary symlink to .vercel in repo root
  if [ -L ".vercel" ] || [ -d ".vercel" ]; then
    rm -rf ".vercel"
  fi
  ln -s "apps/$app/.vercel" ".vercel"
  
  # Deploy from repo root
  # Vercel will find .vercel, use the project, and apply Root Directory from dashboard
  # Root Directory (apps/web) is relative to repo root, so it works correctly
  if [ "$PROD_FLAG" == "--prod" ]; then
    if [ -n "$VERCEL_TOKEN" ]; then
      vercel deploy --prod --yes --token="$VERCEL_TOKEN" || {
        rm -f ".vercel"
        echo -e "${RED}❌ ${app} deployment failed${NC}"
        echo -e "${YELLOW}⚠️  Verify Root Directory in dashboard is: apps/${app}${NC}"
        echo -e "${YELLOW}⚠️  Enable: Include files outside root directory${NC}"
        exit 1
      }
    else
      vercel deploy --prod --yes || {
        rm -f ".vercel"
        echo -e "${RED}❌ ${app} deployment failed${NC}"
        echo -e "${YELLOW}⚠️  Verify Root Directory in dashboard is: apps/${app}${NC}"
        echo -e "${YELLOW}⚠️  Enable: Include files outside root directory${NC}"
        exit 1
      }
    fi
  else
    if [ -n "$VERCEL_TOKEN" ]; then
      vercel deploy --yes --token="$VERCEL_TOKEN" || {
        rm -f ".vercel"
        echo -e "${RED}❌ ${app} deployment failed${NC}"
        exit 1
      }
    else
      vercel deploy --yes || {
        rm -f ".vercel"
        echo -e "${RED}❌ ${app} deployment failed${NC}"
        exit 1
      }
    fi
  fi
  
  # Remove temporary symlink
  rm -f ".vercel"
  
  echo -e "${GREEN}✅ ${app} deployed successfully${NC}"
  echo ""
done

echo -e "${GREEN}=== All deployments complete ===${NC}"

