---
title: IdeaI Build - Complete Deployment Workflow
description: Comprehensive, religiously accurate guide to all IdeaI deployment processes, methods, and auto-setup system
---

# IdeaI Build - Complete Deployment Workflow

**Last Updated**: January 1, 2026  
**Status**: Complete Reference Document  
**Version**: 1.0.0

## Table of Contents

1. [Overview](#overview)
2. [Deployment Methods](#deployment-methods)
3. [Deployment Types](#deployment-types)
4. [App Architecture Modes](#app-architecture-modes)
5. [Complete Workflows](#complete-workflows)
6. [Auto-Setup System](#auto-setup-system)
7. [Verification Checklists](#verification-checklists)

---

## Overview

IdeaI monorepo supports **two primary deployment methods** and **four deployment types**, with flexible app architecture modes. This document is the **single source of truth** for all deployment processes.

### Key Concepts

- **Two Build Processes**: Vercel Direct + GitHub Actions
- **Four Deployment Types**: Preview, Production, Local, Subdomain
- **Two App Modes**: Child Apps (integrated) vs Standalone Apps
- **One Auto-Setup**: Complete automation for new projects

---

## Deployment Methods

### Method 1: Vercel Direct Deployment

**What**: Manual deployment via Vercel CLI from local machine  
**When**: Quick deployments, testing, manual releases  
**How**: `./deploy.sh` script or `vercel deploy` command

#### Process Flow

```
Local Machine → Vercel CLI → Vercel Platform → Build & Deploy
```

#### Steps

1. **Prerequisites**
   - ✅ Vercel CLI installed: `npm install -g vercel`
   - ✅ Authenticated: `vercel login`
   - ✅ Project linked: `apps/{app}/.vercel/project.json` exists
   - ✅ Dashboard configured: Root Directory + Include files outside root

2. **Deploy Command**

   ```bash
   # From repo root
   ./deploy.sh [--prod] [app1] [app2] ...
   ```

3. **What Happens**
   - Script creates temporary `.vercel` symlink to `apps/{app}/.vercel`
   - Deploys from repo root (respects Root Directory dashboard setting)
   - Vercel builds using dashboard configuration
   - Removes symlink after deployment

4. **Output**
   - Preview URL: `https://{app}-{hash}.vercel.app`
   - Production URL: `https://{domain}` (if configured)

#### Configuration Requirements

**Vercel Dashboard Settings** (per app):

- **Root Directory**: `apps/{app-name}` (relative to repo root)
- **Include files outside root directory**: ✅ **Enabled** (required)
- **Framework Preset**: Next.js (auto-detected)
- **Build Command**: `pnpm build` (from `package.json`)
- **Install Command**: `pnpm install` (from `package.json`)
- **Output Directory**: `.next` (Next.js default)

**Project Linking**:

- Each app has `.vercel/project.json` in `apps/{app}/.vercel/`
- Contains: `projectId`, `orgId`, `projectName`
- Created via: `node scripts/ideai-vercel-link.mjs {app}`

#### Advantages

- ✅ Fast iteration
- ✅ No Git push required
- ✅ Immediate feedback
- ✅ Good for testing

#### Disadvantages

- ❌ Manual process
- ❌ No automatic triggers
- ❌ Requires local setup

---

### Method 2: GitHub Actions Deployment

**What**: Automated deployment via GitHub Actions workflows  
**When**: Production releases, CI/CD, automatic deployments  
**How**: Push to branch triggers workflow

#### Process Flow

```
Git Push → GitHub Actions → Build & Test → Deploy to Vercel → Status Update
```

#### Workflow Files

**Main CI/CD Pipeline**: `.github/workflows/ci-cd.yml`

**Triggers**:

- Push to `main`, `preview`, or `develop` branches
- Pull requests to `main`, `preview`, or `develop`

**Jobs**:

1. **`build-and-test`** (Always runs)
   - Installs dependencies: `pnpm install --frozen-lockfile`
   - Runs linting: `pnpm lint`
   - Runs type checking: `pnpm check-types`
   - Builds all apps: `pnpm build`
   - **Condition**: Always runs on push/PR

2. **`deploy-preview`** (Conditional)
   - **Condition**: `github.ref == 'refs/heads/preview' || github.event_name == 'pull_request'`
   - Authenticates with Vercel
   - Deploys all apps: `./deploy.sh` (preview mode)
   - Comments preview URLs on PRs

3. **`deploy-production`** (Conditional)
   - **Condition**: `github.ref == 'refs/heads/main'`
   - Authenticates with Vercel
   - Deploys all apps: `./deploy.sh --prod` (production mode)

**Preview Deployment Workflow**: `.github/workflows/preview-deploy.yml`

- Separate workflow for preview branch
- Same process as `deploy-preview` job
- Provides dedicated preview deployment pipeline

#### Steps

1. **Prerequisites**
   - ✅ GitHub repository configured
   - ✅ GitHub Secrets set:
     - `VERCEL_TOKEN` - Vercel API token
     - `VERCEL_ORG_ID` - Vercel organization ID (`team_vhjzlMi6CfNow0IfBXnv2Yn2`)
     - `TURBO_TOKEN` (optional) - Turborepo token
     - `TURBO_TEAM` (optional) - Turborepo team
   - ✅ Workflow files in `.github/workflows/`
   - ✅ Vercel projects linked (same as Method 1)

2. **Trigger Deployment**

   ```bash
   # Preview deployment
   git checkout preview
   git push origin preview

   # Production deployment
   git checkout main
   git push origin main
   ```

3. **What Happens**
   - GitHub Actions triggers on push
   - Runs build and test job
   - Conditionally runs deploy job based on branch
   - Deploys via `./deploy.sh` script
   - Updates deployment status

4. **Output**
   - Preview URL: Commented on PR or in workflow logs
   - Production URL: Vercel dashboard
   - Status: GitHub Actions UI

#### Configuration Requirements

**GitHub Secrets** (Repository Settings → Secrets):

- `VERCEL_TOKEN`: Get from https://vercel.com/account/tokens
- `VERCEL_ORG_ID`: `team_vhjzlMi6CfNow0IfBXnv2Yn2`
- `TURBO_TOKEN`: Optional, for Turborepo caching
- `TURBO_TEAM`: Optional, for Turborepo team

**Vercel Dashboard Settings**: Same as Method 1

#### Advantages

- ✅ Automatic on Git push
- ✅ Full CI/CD pipeline
- ✅ Version control integration
- ✅ Status updates on PRs
- ✅ Build verification before deploy

#### Disadvantages

- ❌ Requires Git push
- ❌ Slower than direct deployment
- ❌ More complex setup

---

## Deployment Types

### Type 1: Preview Deployment

**What**: Temporary deployment for testing and review  
**URL Format**: `https://{app}-{hash}.vercel.app`  
**Lifetime**: Temporary (Vercel-managed)

#### When to Use

- Testing before production
- Reviewing PRs
- Sharing with stakeholders
- Staging environment

#### How to Deploy

**Vercel Direct**:

```bash
./deploy.sh web
# or
./deploy.sh docs web
```

**GitHub Actions**:

```bash
git checkout preview
git push origin preview
```

**Vercel Dashboard**:

- Click "Redeploy" on any deployment
- Select "Preview" environment

#### Configuration

- **No special configuration needed**
- Uses Vercel's automatic preview URLs
- Environment variables: Uses preview environment (if set)

---

### Type 2: Production Deployment

**What**: Live production deployment  
**URL Format**: `https://{domain}` (custom domain) or `https://{app}.vercel.app`  
**Lifetime**: Permanent (until next deployment)

#### When to Use

- Live production releases
- Public-facing applications
- Final releases

#### How to Deploy

**Vercel Direct**:

```bash
./deploy.sh --prod web
# or
./deploy.sh --prod docs web
```

**GitHub Actions**:

```bash
git checkout main
git push origin main
```

**Vercel Dashboard**:

- Click "Promote to Production" on preview deployment
- Or click "Redeploy" → Select "Production"

#### Configuration

**Custom Domain** (optional):

1. Add domain in Vercel dashboard: Project Settings → Domains
2. Configure DNS at registrar:
   - Type: CNAME
   - Name: `www` (or subdomain)
   - Value: `cname.vercel-dns.com`
3. Wait for DNS propagation (up to 48 hours)

**Environment Variables**:

- Set in Vercel dashboard: Project Settings → Environment Variables
- Production environment variables used

---

### Type 3: Local Development

**What**: Running apps locally for development  
**URL Format**: `http://localhost:{port}`  
**Lifetime**: While dev server is running

#### When to Use

- Development and testing
- Debugging
- Local iteration

#### How to Run

**Single App**:

```bash
cd apps/web
pnpm dev
# Runs on http://localhost:3000
```

**All Apps** (via dev manager):

```bash
# From repo root
node scripts/dev-manager.mjs
# Starts all apps on their configured ports
```

**Specific Apps**:

```bash
pnpm --filter web dev
pnpm --filter docs dev
```

#### Configuration

**Port Configuration**:

- Ports are defined in each app's `package.json` dev script: `next dev --port {port}`
- See [Critical Development Environment Details](#critical-development-environment-details) section below for complete port mapping

**Turbo Concurrency Configuration**:

- **CRITICAL**: Turbo default concurrency is 10, but we have 13 persistent dev tasks
- **Solution**: `package.json` dev script includes `--concurrency=20`
- See [Critical Development Environment Details](#critical-development-environment-details) section below for full details

**Environment Variables**:

- Create `.env.local` in app directory
- Or set in shell: `export NEXT_PUBLIC_APP_MODE=unified`

**App Mode**:

- `NEXT_PUBLIC_IDEAI_APP_MODE=unified` - All apps on port 3000
- `NEXT_PUBLIC_IDEAI_APP_MODE=individual` - Separate ports (default)

---

## Critical Development Environment Details

**⚠️ IMPORTANT**: This section documents critical configuration details that must be maintained accurately. These settings are essential for the development environment to function correctly.

### Scripts Organization

**Structure**: All IdeaI scripts are in flat structure at `scripts/` root (no nested folders)

**Naming Convention**: `ideai-[main function]-[sub function].[ext]`

**Examples**:

- `ideai-build.mjs` - Main build CLI
- `ideai-build-checker-dependency.mjs` - Dependency checker
- `ideai-boot-logger-dev.mjs` - Dev server logger
- `ideai-develop-vercel-link.mjs` - Vercel project linker
- `ideai-ui-main.mjs` - Unified UI entry point
- `ideai-ui-test.mjs` - UI test script
- `ideai-useful-test-local.mjs` - Local testing utility

**Total Scripts**: 24 ideai scripts in root directory

**Key Scripts**:

- **Build**: `ideai-build.mjs` (main CLI), `ideai-build-*.mjs` (12 build tools)
- **Boot**: `ideai-boot-logger-*.mjs` (3 boot tools)
- **Develop**: `ideai-develop-*.mjs` / `ideai-develop-*.sh` (6 develop tools)
- **UI**: `ideai-ui-main.mjs`, `ideai-ui-test.mjs`
- **Testing**: `ideai-useful-test-local.mjs`

**Path Updates**: All scripts use `join(__dirname, '..')` for `REPO_ROOT` (scripts are in root, so one level up)

### Turbo Concurrency Configuration

**CRITICAL SETTING**: Must be configured correctly or dev servers won't start

**Problem**:

- Turbo default concurrency: 10
- Number of apps with dev scripts: 13
- All dev tasks are persistent (run simultaneously)
- Error: "You have 13 persistent tasks but `turbo` is configured for concurrency of 10"

**Solution** (in `package.json`):

```json
{
  "scripts": {
    "dev": "turbo run dev --concurrency=20"
  }
}
```

**Why 20?**:

- 13 apps need to run simultaneously
- Need buffer for other processes
- 20 provides safe margin

**What Happens Without This**:

- `pnpm dev` fails with concurrency error
- Cannot start all apps at once
- Must start apps individually or increase concurrency

**Verification**:

```bash
# Check if concurrency is set
grep "concurrency" package.json

# Should show: "dev": "turbo run dev --concurrency=20"
```

### Complete Port Mapping

**All 13 Apps with Ports** (as of January 2026):

| App         | Port | URL                   | Purpose                |
| ----------- | ---- | --------------------- | ---------------------- |
| `web`       | 3000 | http://localhost:3000 | Main IdeaI application |
| `docs`      | 3001 | http://localhost:3001 | Documentation site     |
| `all`       | 3002 | http://localhost:3002 | Component showcase     |
| `nocss`     | 3003 | http://localhost:3003 | No CSS demo            |
| `mvp`       | 3004 | http://localhost:3004 | MVP.css demo           |
| `tailwind`  | 3005 | http://localhost:3005 | Tailwind CSS demo      |
| `allcss`    | 3006 | http://localhost:3006 | All CSS demo           |
| `bootstrap` | 3007 | http://localhost:3007 | Bootstrap demo         |
| `unocss`    | 3008 | http://localhost:3008 | UnoCSS demo            |
| `shadcn`    | 3009 | http://localhost:3009 | Shadcn Components      |
| `material`  | 3010 | http://localhost:3010 | Material UI demo       |
| `chakra`    | 3011 | http://localhost:3011 | Chakra UI demo         |
| `radix`     | 3012 | http://localhost:3012 | Radix UI primitives    |

**Port Configuration**:

- Ports are defined in each app's `package.json` dev script
- Format: `"dev": "next dev --port {port}"`
- Ports are sequential but not consecutive (gaps for future apps)

**Checking Port Status**:

```bash
# Check all dev ports
lsof -ti:3000,3001,3002,3003,3004,3005,3006,3007,3008,3009,3010,3011,3012

# Check specific port
lsof -ti:3000

# Kill all dev servers
lsof -ti:3000,3001,3002,3003,3004,3005,3006,3007,3008,3009,3010,3011,3012 | xargs kill -9
```

### Development Workflow

**Starting All Apps**:

```bash
# Start all 13 apps (requires --concurrency=20 in package.json)
pnpm dev

# Start specific app
pnpm --filter web dev
pnpm --filter docs dev
```

**Stopping All Apps**:

```bash
# Kill all processes on dev ports
lsof -ti:3000,3001,3002,3003,3004,3005,3006,3007,3008,3009,3010,3011,3012 | xargs kill -9

# Or stop individual app
lsof -ti:3000 | xargs kill -9  # Stop web app
```

**Checking Status**:

```bash
# Count running servers
lsof -ti:3000,3001,3002,3003,3004,3005,3006,3007,3008,3009,3010,3011,3012 | wc -l

# Check specific app
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000
```

### Scripts Path Structure

**All Scripts Location**: `scripts/` (root level, flat structure)

**No Nested Folders**: All scripts moved to root for simplicity

**Import Paths in Scripts**:

- `REPO_ROOT = join(__dirname, '..')` (scripts are in root, so one level up to repo root)
- All internal script references use root paths: `scripts/ideai-*.mjs`

**Key Script References**:

- Build CLI: `scripts/ideai-build.mjs`
- UI Main: `scripts/ideai-ui-main.mjs`
- Vercel Link: `scripts/ideai-develop-vercel-link.mjs`
- All follow pattern: `scripts/ideai-[category]-[function].mjs`

### Maintenance Checklist

**When Adding New App**:

- [ ] Add dev script with unique port in `apps/{app}/package.json`
- [ ] Verify port not in use (3000-3012 range)
- [ ] Update port mapping table in this document
- [ ] Test: `pnpm --filter {app} dev`
- [ ] Verify: `lsof -ti:{port}` shows process

**When Modifying Scripts**:

- [ ] Keep flat structure (no nested folders)
- [ ] Use naming convention: `ideai-[main]-[sub].[ext]`
- [ ] Update `REPO_ROOT` paths if moving files
- [ ] Update all references to moved scripts
- [ ] Test script imports and paths

**When Updating Turbo**:

- [ ] Verify `--concurrency=20` in `package.json` dev script
- [ ] Ensure concurrency >= number of apps with dev scripts
- [ ] Test: `pnpm dev` starts all apps without errors

**Regular Verification**:

- [ ] All 13 apps have dev scripts with ports
- [ ] Ports are unique and sequential
- [ ] Turbo concurrency is set correctly
- [ ] All scripts in flat root structure
- [ ] All script paths updated correctly

---

### Type 4: Subdomain Deployment

**What**: Standalone deployment with custom subdomain  
**URL Format**: `https://{subdomain}.{root-domain}`  
**Lifetime**: Permanent (until domain removed)

#### When to Use

- Standalone app deployments
- Separate domains for apps
- Independent scaling

#### How to Deploy

**Step 1: Deploy App**

```bash
./deploy.sh --prod {app-name}
```

**Step 2: Setup Subdomain**

```bash
./scripts/setup-subdomain.sh {app-name} {subdomain} {root-domain}
# Example: ./scripts/setup-subdomain.sh docs docs myui.space
```

**Step 3: Configure DNS**

- Add CNAME record at registrar:
  - Type: CNAME
  - Name: `{subdomain}`
  - Value: `cname.vercel-dns.com`
  - TTL: 3600

**Step 4: Add Domain in Vercel**

- Vercel dashboard: Project Settings → Domains
- Add: `{subdomain}.{root-domain}`
- Wait for DNS verification

**Step 5: Update Environment Variables**

- In main `web` app, set:
  ```
  NEXT_PUBLIC_{APP_NAME}_URL=https://{subdomain}.{root-domain}
  ```
- Example: `NEXT_PUBLIC_DOCS_URL=https://docs.myui.space`

#### Configuration

**Subdomain Script** (`scripts/setup-subdomain.sh`):

- Adds domain to Vercel project
- Shows DNS instructions
- Verifies DNS configuration
- Updates environment variables
- Redeploys web app

**Environment Variables**:

- `NEXT_PUBLIC_{APP_NAME}_URL` - Standalone URL for app
- Set in Vercel dashboard: Project Settings → Environment Variables

**Routing Behavior**:

- If `NEXT_PUBLIC_{APP_NAME}_URL` is set, main app redirects to standalone URL
- If not set, main app serves app via iframe at `/apps/{name}`

---

## App Architecture Modes

### Mode 1: Child Apps (Integrated)

**What**: Apps served as routes within parent app  
**URL Format**: `https://{domain}/apps/{app-name}`  
**Architecture**: Parent app embeds child apps

#### How It Works

1. **Parent App** (`web`)
   - Serves at root: `https://myui.space/`
   - Has catch-all route: `/apps/[app]/[[...path]]`
   - Embeds child apps via iframe or component import

2. **Child Apps**
   - Detected via `.ideai.json` configuration
   - Served at: `/apps/{name}`
   - Load in iframe with header/footer hidden
   - Only `<main>` content shown

3. **Configuration**

**Parent App** (`apps/web/.ideai.json`):

```json
{
  "role": "parent",
  "name": "IdeaI",
  "childApps": ["docs", "all", "nocss", "mvp", ...]
}
```

**Child App** (`apps/docs/.ideai.json`):

```json
{
  "role": "child",
  "name": "Documentation",
  "parentApp": "web",
  "localPort": 3001
}
```

#### Unified Mode vs Individual Mode

**Unified Mode** (`NEXT_PUBLIC_IDEAI_APP_MODE=unified`):

- All apps run on port 3000
- Child apps imported as components
- No branding in child apps
- Production-ready

**Individual Mode** (`NEXT_PUBLIC_IDEAI_APP_MODE=individual`):

- Each app on separate port
- Child apps in iframes
- Complete isolation
- Good for development

#### Advantages

- ✅ Single deployment
- ✅ Single domain
- ✅ Clean URLs
- ✅ Easy to manage
- ✅ Shared codebase

#### Disadvantages

- ❌ All apps deploy together
- ❌ Can't scale independently
- ❌ One failure affects all

---

### Mode 2: Standalone Apps

**What**: Each app deployed as separate Vercel project  
**URL Format**: `https://{app-domain}` or `https://{subdomain}.{root-domain}`  
**Architecture**: Independent deployments

#### How It Works

1. **Each App is Independent**
   - Separate Vercel project
   - Separate deployment
   - Separate domain (optional)

2. **Main App Redirects**
   - If `NEXT_PUBLIC_{APP_NAME}_URL` is set, redirects to standalone URL
   - If not set, serves via iframe (fallback)

3. **Configuration**

**Environment Variable** (in main `web` app):

```
NEXT_PUBLIC_DOCS_URL=https://docs.myui.space
```

**Vercel Project**:

- Each app has its own Vercel project
- Configured independently
- Deploys independently

#### Advantages

- ✅ Independent scaling
- ✅ Independent deployments
- ✅ Isolated failures
- ✅ Separate domains

#### Disadvantages

- ❌ More complex setup
- ❌ Multiple deployments
- ❌ DNS configuration needed
- ❌ More Vercel projects

---

## Complete Workflows

### Workflow 1: New App Setup (First Time)

**Goal**: Set up a new app for deployment

**Steps**:

1. **Create App Directory**

   ```bash
   mkdir -p apps/{app-name}
   cd apps/{app-name}
   ```

2. **Initialize Next.js App**

   ```bash
   npx create-next-app@latest . --typescript --tailwind --app
   ```

3. **Create `.ideai.json`**

   ```json
   {
     "role": "child",
     "name": "App Name",
     "parentApp": "web",
     "localPort": 3001,
     "vercelProject": {
       "projectName": "{app-name}",
       "orgId": "team_vhjzlMi6CfNow0IfBXnv2Yn2",
       "forkToNew": false
     }
   }
   ```

4. **Link Vercel Project**

   ```bash
   node ../../scripts/ideai-vercel-link.mjs {app-name}
   ```

5. **Configure Vercel Dashboard**
   - Root Directory: `apps/{app-name}`
   - Include files outside root: ✅ Enabled
   - Framework: Next.js (auto-detected)

6. **Test Local**

   ```bash
   pnpm dev
   ```

7. **Deploy Preview**

   ```bash
   ./deploy.sh {app-name}
   ```

8. **Deploy Production**
   ```bash
   ./deploy.sh --prod {app-name}
   ```

---

### Workflow 2: Standard Production Deployment

**Goal**: Deploy app to production

**Method A: Vercel Direct**

1. **Verify Prerequisites**
   - ✅ Vercel CLI installed and authenticated
   - ✅ Project linked
   - ✅ Dashboard configured

2. **Deploy**

   ```bash
   ./deploy.sh --prod {app-name}
   ```

3. **Verify**
   - Check Vercel dashboard
   - Visit production URL
   - Test functionality

**Method B: GitHub Actions**

1. **Verify Prerequisites**
   - ✅ GitHub Secrets configured
   - ✅ Workflow files present
   - ✅ Project linked

2. **Deploy**

   ```bash
   git checkout main
   git add .
   git commit -m "feat: deploy {app-name} to production"
   git push origin main
   ```

3. **Monitor**
   - Check GitHub Actions workflow
   - Check Vercel dashboard
   - Verify deployment

---

### Workflow 3: Preview Deployment for PR

**Goal**: Deploy preview for pull request review

**Method A: Vercel Direct**

1. **Deploy Preview**

   ```bash
   ./deploy.sh {app-name}
   ```

2. **Share URL**
   - Copy preview URL from output
   - Share with reviewers

**Method B: GitHub Actions**

1. **Create PR**

   ```bash
   git checkout -b feature/new-feature
   git push origin feature/new-feature
   # Create PR on GitHub
   ```

2. **Automatic Deployment**
   - GitHub Actions triggers on PR
   - Deploys to preview
   - Comments preview URL on PR

3. **Review**
   - Check preview URL in PR comment
   - Test functionality
   - Request changes if needed

---

### Workflow 4: Subdomain Setup

**Goal**: Set up standalone app with custom subdomain

1. **Deploy App**

   ```bash
   ./deploy.sh --prod {app-name}
   ```

2. **Run Subdomain Script**

   ```bash
   ./scripts/setup-subdomain.sh {app-name} {subdomain} {root-domain}
   # Example: ./scripts/setup-subdomain.sh docs docs myui.space
   ```

3. **Configure DNS**
   - Go to domain registrar
   - Add CNAME record:
     - Type: CNAME
     - Name: `{subdomain}`
     - Value: `cname.vercel-dns.com`
     - TTL: 3600

4. **Add Domain in Vercel**
   - Vercel dashboard: Project Settings → Domains
   - Add: `{subdomain}.{root-domain}`
   - Wait for DNS verification

5. **Update Environment Variables**
   - In main `web` app, set:
     ```
     NEXT_PUBLIC_{APP_NAME}_URL=https://{subdomain}.{root-domain}
     ```
   - Redeploy web app

6. **Verify**
   - Visit `https://{subdomain}.{root-domain}`
   - Test redirect from main app: `https://{root-domain}/apps/{app-name}`

---

## Auto-Setup System

### Overview

**Goal**: One-button setup for complete new IdeaI project (repo + Vercel project + domain)

**Components**:

1. **IdeaI Build CLI** - Command-line interface
2. **Setup Wizard** - Interactive configuration
3. **Automation Scripts** - GitHub, Vercel, DNS automation
4. **Verification System** - Post-setup checks

### Architecture

```
IdeaI Build CLI
├── Project Generator
│   ├── Create repo structure
│   ├── Initialize Next.js apps
│   ├── Configure .ideai.json files
│   └── Setup package.json
├── Vercel Integration
│   ├── Create Vercel projects
│   ├── Link projects
│   ├── Configure dashboard settings
│   └── Set environment variables
├── GitHub Integration
│   ├── Create repository
│   ├── Setup workflows
│   ├── Configure secrets
│   └── Initial commit
├── DNS Integration
│   ├── Domain verification
│   ├── DNS record creation
│   └── Subdomain setup
└── Verification
    ├── Build checks
    ├── Deployment tests
    └── Health checks
```

### Implementation Plan

**Phase 1: CLI Foundation**

- Create `scripts/ideai-build.mjs`
- Interactive prompts for configuration
- Project structure generation

**Phase 2: Vercel Automation**

- Vercel API integration
- Project creation
- Dashboard configuration
- Environment variables

**Phase 3: GitHub Automation**

- GitHub API integration
- Repository creation
- Workflow setup
- Secrets configuration

**Phase 4: DNS Automation**

- Domain provider API integration
- DNS record creation
- Verification

**Phase 5: Verification**

- Build verification
- Deployment testing
- Health checks

### Usage

```bash
# Interactive setup
node scripts/ideai-build.mjs setup

# Non-interactive (with config file)
node scripts/ideai-build.mjs setup --config setup.json

# Quick setup (defaults)
node scripts/ideai-build.mjs setup --quick
```

### Configuration File Format

```json
{
  "project": {
    "name": "my-ideai-project",
    "description": "My IdeaI project",
    "apps": ["web", "docs"]
  },
  "github": {
    "org": "my-org",
    "repo": "my-ideai-project",
    "private": false
  },
  "vercel": {
    "orgId": "team_xxx",
    "projects": [
      {
        "app": "web",
        "projectName": "my-web-app",
        "domain": "myapp.com"
      }
    ]
  },
  "dns": {
    "provider": "cloudflare",
    "rootDomain": "myapp.com",
    "subdomains": [
      {
        "app": "docs",
        "subdomain": "docs"
      }
    ]
  }
}
```

---

## Verification Checklists

### Pre-Deployment Checklist

**Vercel Direct Deployment**:

- [ ] Vercel CLI installed and authenticated
- [ ] Project linked (`apps/{app}/.vercel/project.json` exists)
- [ ] Dashboard configured (Root Directory + Include files outside root)
- [ ] `.ideai.json` configured correctly
- [ ] Dependencies installed (`pnpm install`)
- [ ] Build succeeds locally (`pnpm build`)
- [ ] Linting passes (`pnpm lint`)
- [ ] Type checking passes (`pnpm check-types`)

**GitHub Actions Deployment**:

- [ ] GitHub Secrets configured (`VERCEL_TOKEN`, `VERCEL_ORG_ID`)
- [ ] Workflow files present (`.github/workflows/ci-cd.yml`)
- [ ] Project linked (same as Vercel Direct)
- [ ] Dashboard configured (same as Vercel Direct)
- [ ] All pre-deployment checks pass
- [ ] Branch is correct (`main` for production, `preview` for preview)

### Post-Deployment Checklist

- [ ] Deployment succeeded (check Vercel dashboard)
- [ ] URL is accessible
- [ ] App loads correctly
- [ ] No console errors
- [ ] Functionality works as expected
- [ ] Environment variables set correctly
- [ ] Custom domain works (if configured)
- [ ] Redirects work (if configured)

### Subdomain Setup Checklist

- [ ] App deployed to production
- [ ] Subdomain script run successfully
- [ ] DNS record added at registrar
- [ ] Domain added in Vercel dashboard
- [ ] DNS verification passed
- [ ] Environment variable set in main app
- [ ] Main app redeployed
- [ ] Subdomain URL accessible
- [ ] Redirect from main app works

---

## Quick Reference

### Deployment Commands

```bash
# Vercel Direct - Preview
./deploy.sh {app-name}

# Vercel Direct - Production
./deploy.sh --prod {app-name}

# Vercel Direct - Multiple Apps
./deploy.sh --prod web docs

# GitHub Actions - Preview
git checkout preview && git push origin preview

# GitHub Actions - Production
git checkout main && git push origin main

# Local Development
pnpm --filter {app-name} dev

# Subdomain Setup
./scripts/setup-subdomain.sh {app-name} {subdomain} {root-domain}
```

### Configuration Files

- **App Config**: `apps/{app}/.ideai.json`
- **Vercel Link**: `apps/{app}/.vercel/project.json`
- **Vercel Config**: `apps/{app}/vercel.json`
- **Package Config**: `apps/{app}/package.json`
- **Next.js Config**: `apps/{app}/next.config.ts`

### Important URLs

- **Vercel Dashboard**: https://vercel.com/idea-i/{project-name}
- **GitHub Actions**: https://github.com/{org}/{repo}/actions
- **Vercel API Tokens**: https://vercel.com/account/tokens
- **GitHub Secrets**: https://github.com/{org}/{repo}/settings/secrets/actions

---

## Troubleshooting

### Common Issues

**"Command pnpm install exited with 1"**:

- ✅ Check `pnpm-lock.yaml` is up to date
- ✅ Run `pnpm install` locally and commit lockfile
- ✅ Verify dashboard setting "Include files outside root directory" is enabled

**"Cannot find module '@repo/ui'"**:

- ✅ Verify "Include files outside root directory" is enabled
- ✅ Check Root Directory is set to `apps/{app-name}`
- ✅ Verify workspace dependencies in `package.json`

**"Project not linked"**:

- ✅ Run `node scripts/ideai-vercel-link.mjs {app-name}`
- ✅ Check `.vercel/project.json` exists in `apps/{app}/.vercel/`

**"Deployment failed"**:

- ✅ Check Vercel dashboard for build logs
- ✅ Verify all prerequisites are met
- ✅ Check environment variables are set
- ✅ Verify build succeeds locally

---

## Related Documentation

- [Vercel Configuration](./vercel.md)
- [GitHub Actions CI/CD](./ci-cd.md)
- [Deployment Strategies](./deployment-strategies.md)
- [Parent-Child Architecture](../architecture/parent-child-complete.md)
- [Troubleshooting](./troubleshooting.md)

---

**End of Document**
