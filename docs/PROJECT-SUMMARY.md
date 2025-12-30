# Project Summary

This document provides a high-level overview of the IdeaI monorepo project, its architecture, and current state.

## Project Overview

**IdeaI Monorepo** is a Turborepo-based monorepo containing Next.js applications and shared packages, configured for automated CI/CD with GitHub Actions and Vercel deployments.

## Architecture

### Monorepo Structure

```
ideai-main/
├── apps/
│   ├── web/          # Main Next.js web application
│   └── docs/         # Documentation Next.js app
├── packages/
│   ├── ui/           # Shared React component library
│   ├── eslint-config/    # Shared ESLint configurations
│   └── typescript-config/ # Shared TypeScript configs
└── docs/             # Project documentation
```

### Technology Stack

- **Monorepo**: Turborepo
- **Package Manager**: pnpm
- **Frameworks**: Next.js 16
- **Language**: TypeScript
- **Linting**: ESLint
- **Formatting**: Prettier
- **CI/CD**: GitHub Actions
- **Hosting**: Vercel

## Deployment Architecture

### CI/CD Pipeline

1. **GitHub Actions Workflows**:
   - `ci-cd.yml`: Main pipeline (build, test, deploy)
   - `preview-deploy.yml`: Dedicated preview deployments

2. **Deployment Flow**:
   - Push to `preview` branch → Preview deployment
   - Push to `main` branch → Production deployment
   - Pull requests → Preview deployment

3. **Vercel Configuration**:
   - Root Directory: `apps/web`
   - Include files outside root: Enabled (required for monorepos)
   - Standard Turborepo + Vercel boilerplate approach
   - No `vercel.json` files needed (auto-detection)

## Current Configuration

### Vercel Project
- **Organization**: `idea-i`
- **Organization ID**: `team_vhjzlMi6CfNow0IfBXnv2Yn2`
- **Project Name**: `ideai-main` (deploys `apps/web`)
- **Project ID**: `prj_Se4sFOjdH4fRzSOsK8YDiNVFssHx`
- **Production URL**: https://www.myui.space
- **Preview URL**: https://preview.myui.space

### GitHub Repository
- **Repository**: `ideai-dev-000/ideai-main`
- **Branches**: `main`, `preview`, `develop`

### Required Secrets
- `VERCEL_TOKEN` - Vercel authentication token
- `VERCEL_ORG_ID` - Vercel organization ID
- `VERCEL_PROJECT_ID` - Vercel project ID
- `TURBO_TOKEN` (optional) - For remote caching
- `TURBO_TEAM` (optional) - Turborepo team name

## Deployment Status

### ✅ Working Configuration

- **Standard Vercel Boilerplate Approach**: 
  - Deploy from repo root (no `working-directory` in workflows)
  - Vercel uses Root Directory setting from dashboard
  - Auto-detects Next.js framework
  - No pre-building required
  - No `vercel.json` files needed

- **Commit Signing**:
  - GPG key configured and working
  - Commits automatically signed
  - Verified commits accepted by Vercel

- **Monorepo Support**:
  - Root Directory: `apps/web`
  - Include files outside root: Enabled
  - Workspace dependencies resolved correctly
  - Shared packages accessible during build

- **CI/CD**:
  - GitHub Actions workflows configured
  - Automatic preview deployments
  - Production deployments on main branch
  - Linting and type checking before deployment

## Applications

### Web App (`apps/web`)
- **Purpose**: Main IdeaI web application
- **Port**: 3000 (development)
- **Production**: https://www.myui.space
- **Landing Page**: Clean design with "IdeaI" heading
- **Features**: Shared Button component from `@repo/ui`

### Docs App (`apps/docs`)
- **Purpose**: IdeaI documentation site
- **Port**: 3001 (development)
- **Status**: Not deployed (local development only)
- **Landing Page**: Same design as web, with "IdeaI Docs" heading
- **Features**: Shared Button component from `@repo/ui`

Both apps share:
- Same landing page design and styling
- Shared UI components from `@repo/ui`
- Consistent branding (IdeaI)
- Same development workflow

## Key Features

### Development
- Hot module replacement
- TypeScript type checking
- ESLint linting
- Prettier code formatting
- Turborepo task orchestration
- Shared component library

### Deployment
- Automatic preview deployments
- Production deployments
- Vercel integration
- GitHub Actions automation
- Verified commit support (when configured)

### Code Quality
- TypeScript strict mode
- ESLint with Next.js rules
- Prettier formatting
- Pre-commit checks (via CI/CD)
- Rich code headers with JSDoc

## Documentation Structure

```
docs/
├── README.md                    # Documentation index
├── PROJECT-SUMMARY.md          # This file
├── setup/
│   ├── github-secrets.md       # GitHub secrets configuration
│   ├── vercel-checklist.md     # Vercel setup checklist
│   └── commit-signing.md      # GPG commit signing setup
├── deployment/
│   ├── overview.md            # Deployment architecture
│   ├── ci-cd.md               # CI/CD workflows
│   ├── vercel.md              # Vercel configuration
│   └── troubleshooting.md      # Common issues and solutions
└── development/
    ├── getting-started.md      # Development setup
    └── CONTRIBUTING.md         # Contribution guidelines
```

## Quick Start

### Development
```bash
# Install dependencies
pnpm install

# Start development servers
pnpm dev

# Build all applications
pnpm build
```

### Deployment
- **Preview**: Push to `preview` branch
- **Production**: Push to `main` branch
- **Manual**: Use Vercel CLI from repo root

## Important Notes

### Vercel Configuration
- **Do NOT** use `working-directory` in GitHub Actions workflows
- **Do NOT** create `vercel.json` files (auto-detection works)
- **DO** set Root Directory in Vercel dashboard: `apps/web`
- **DO** enable "Include files outside root directory"

### Commit Signing
- ✅ GPG commit signing configured and working
- Commits automatically signed with GPG key
- Verified commits show "Verified" badge on GitHub
- Vercel accepts verified commits for deployments
- See [Commit Signing Setup](./setup/commit-signing.md) for details

## Related Documentation

- [Documentation Index](./README.md)
- [Getting Started](./development/getting-started.md)
- [Deployment Overview](./deployment/overview.md)
- [Vercel Configuration](./deployment/vercel.md)

