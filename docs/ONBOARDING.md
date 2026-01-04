---
title: Onboarding Guide for New Team Members
description: Complete guide for new developers and management to understand the IdeaI monorepo project
---

# IdeaI Monorepo - Onboarding Guide

**Welcome to the IdeaI Development Team!**

This document provides a comprehensive overview of the project, current status, and how to get started.

---

## 🎯 Project Overview

### What is IdeaI?

**IdeaI** is a modern monorepo showcasing multiple deployment strategies and CSS framework demonstrations. The project demonstrates:

- **Multi-strategy deployment**: Subdomains, sub-folders, self-sovereign apps, and mother-child architectures
- **CSS framework showcase**: Multiple apps demonstrating different CSS frameworks (Tailwind, Bootstrap, Material UI, Chakra, UnoCSS, etc.)
- **Unified design system**: Centralized UI components and styles shared across all apps
- **Production-ready infrastructure**: Deployed to `myui.space` with Vercel

### Brand Name: IdeaI

**CRITICAL**: The product/brand name must ALWAYS be written as **IdeaI** (exact capitalization: capital I, lowercase dea, capital I):

- ✅ Correct: `IdeaI`, `IdeaI web app`, `Welcome to IdeaI`, `IdeaI.Space`
- ❌ Incorrect: `IDEAI`, `Ideai`, `ideai`, `IDEAi`, `Idea I`, or any other variation

---

## 📊 Current Status

### ✅ What's Working

- **Main Site**: https://www.myui.space (LIVE)
- **13 Apps**: All building successfully
- **Unified Deployment**: `deploy.sh` script for all apps
- **Vercel Integration**: All apps linked to Vercel projects
- **Documentation**: Comprehensive docs in `docs/` directory

### ⚠️ Current Issues

- **Sub-folder routing**: Routes at `/apps/{name}` return 404 (needs fixing)
- **Vercel configuration**: Some apps need Root Directory configured in dashboard

### 📋 Active Work

**Current Priority**: Fix sub-folder route 404 issue (TICKET-0.1)

See: [Multi-Strategy Deployment Plan](./deployment/MULTI-STRATEGY-DEPLOYMENT-PLAN.md)

---

## 🏗️ Architecture

### Project Structure

\`\`\`
ideai-main/
├── apps/ # 14 Next.js applications
│ ├── web/ # Main IdeaI app (port 3000)
│ ├── docs/ # Documentation site (port 3001)
│ ├── all/ # Component showcase (port 3002)
│ ├── nocss/ # No CSS demo (port 3003)
│ ├── mvp/ # MVP.css demo (port 3004)
│ ├── tailwind/ # Tailwind CSS demo (port 3005)
│ ├── allcss/ # All CSS demo (port 3006)
│ ├── bootstrap/ # Bootstrap demo (port 3007)
│ ├── unocss/ # UnoCSS demo (port 3008)
│ ├── shadcn/ # Shadcn Components (port 3009)
│ ├── material/ # Material UI demo (port 3010)
│ ├── chakra/ # Chakra UI demo (port 3011)
│ ├── radix/ # Radix UI demo (port 3012)
│ └── pico/ # Pico CSS demo (port 3013)
├── packages/ # Shared packages
│ ├── ui/ # Shared UI components and styles
│ ├── eslint-config/ # Shared ESLint config
│ └── typescript-config/ # Shared TypeScript config
├── docs/ # Documentation
├── scripts/ # Utility scripts
└── deploy.sh # Unified deployment script
\`\`\`

### Apps Overview

| App       | Port | Purpose                     | Status       |
| --------- | ---- | --------------------------- | ------------ |
| web       | 3000 | Main IdeaI application      | ✅ Deployed  |
| docs      | 3001 | Documentation site          | ✅ Deployed  |
| all       | 3002 | Complete component showcase | ✅ Built     |
| nocss     | 3003 | Pure HTML (no CSS)          | ✅ Built     |
| mvp       | 3004 | MVP.css framework demo      | ✅ Built     |
| tailwind  | 3005 | Tailwind CSS demo           | ✅ Built     |
| allcss    | 3006 | Tailwind CSS only           | ✅ Built     |
| bootstrap | 3007 | Bootstrap framework demo    | ✅ Built     |
| unocss    | 3008 | UnoCSS framework demo       | ✅ Built     |
| shadcn    | 3009 | Shadcn/ui components        | ✅ Built     |
| material  | 3010 | Material UI demo            | ✅ Built     |
| chakra    | 3011 | Chakra UI demo              | ✅ Built     |
| radix     | 3012 | Radix UI primitives         | ✅ Built     |
| pico      | 3013 | Pico CSS framework demo     | ✅ Built     |
| cloud     | -    | Cloud Manager (in web app)  | ✅ Available |

---

## 🚀 Quick Start

### Prerequisites

- **Node.js**: >= 18
- **pnpm**: 9.0.0 (package manager)
- **Git**: For version control
- **Vercel CLI**: For deployments (optional)

### Initial Setup

\`\`\`bash

# Clone the repository

git clone https://github.com/ideai-dev-000/ideai-main.git
cd ideai-main

# Install dependencies

pnpm install

# Start all development servers

pnpm dev:start

# Or start individual app

pnpm --filter web dev
\`\`\`

### Development Commands

\`\`\`bash

# Start all dev servers

pnpm dev:start

# Check dev server status

pnpm dev:status

# Stop all dev servers

pnpm dev:stop

# Restart all dev servers

pnpm dev:restart

# Build all apps

pnpm build

# Lint all apps

pnpm lint

# Type check all apps

pnpm check-types
\`\`\`

### Accessing Apps Locally

- Main app: http://localhost:3000
- Documentation: http://localhost:3001
- All components: http://localhost:3002
- (See table above for all ports)

---

## 📚 Documentation Structure

### Essential Reading (Start Here)

1. **[Project Status](./STATUS.md)** - Current project status and completed work
2. **[Multi-Strategy Deployment Plan](./deployment/MULTI-STRATEGY-DEPLOYMENT-PLAN.md)** - Complete deployment roadmap
3. **[Getting Started](./development/getting-started.md)** - Development setup guide
4. **[Deployment Overview](./deployment/overview.md)** - Deployment architecture

### Key Documentation

- **Architecture**: `docs/architecture/`
  - Design system
  - UI consistency standards
  - Deployment architecture
- **Deployment**: `docs/deployment/`
  - Vercel configuration
  - Unified deployment guide
  - CI/CD workflows
- **Development**: `docs/development/`
  - Getting started
  - Dev server manager
  - Branch workflow

---

## 🎯 Current Tasks & Priorities

### Immediate Priority (Do First)

**TICKET-0.1: Fix Sub-Folder Route 404 Issue** 🔴 CRITICAL

- **Status**: In Progress
- **Problem**: Routes at `/apps/{name}` return 404 in production
- **Location**: `apps/web/app/apps/[app]/[[...path]]/page.tsx`
- **See**: [TICKET-0.1 Details](./deployment/MULTI-STRATEGY-DEPLOYMENT-PLAN.md#ticket-01-fix-sub-folder-route-404-issue)

### High Priority (Do Next)

1. **TICKET-1.1**: Document current deployment workflow
2. **TICKET-1.2**: Implement GitHub → Vercel auto-deployment
3. **TICKET-1.4**: Create deployment safety checklist
4. **TICKET-2.1**: Complete self-sovereign app configuration

### Complete Task List

**See**: [Multi-Strategy Deployment Plan](./deployment/MULTI-STRATEGY-DEPLOYMENT-PLAN.md)

**Total Tickets**: 19

- Critical: 1
- High: 5
- Medium: 8
- Low: 5

---

## 🔄 Deployment Workflow

### Current Deployment Options

1. **GitHub → Vercel (Recommended)**
   - Push to GitHub → Auto-deploy via GitHub Actions
   - Full version control and history
   - Pull request previews

2. **Vercel CLI Direct**
   - Deploy directly from command line
   - Faster iteration
   - Requires manual git sync

### Deployment Commands

\`\`\`bash

# Deploy all apps (preview)

./deploy.sh

# Deploy all apps (production)

./deploy.sh --prod

# Deploy specific app (production)

./deploy.sh --prod web
\`\`\`

### Deployment Status

- **Main Site**: https://www.myui.space ✅ LIVE
- **Documentation**: https://docs-xxx.vercel.app ✅ LIVE
- **Other Apps**: Linked to Vercel, need configuration

---

## 📝 Commit Message Standards

### CRITICAL: All Commits Must Follow This Format

Every commit must be well-formatted and descriptive:

\`\`\`
type(scope): detailed subject line

Detailed explanation of what changed and why.

- Specific change 1
- Specific change 2
- Specific change 3

Related: TICKET-XXX
\`\`\`

### Commit Types

- `fix`: Bug fixes
- `feat`: New features
- `docs`: Documentation changes
- `refactor`: Code refactoring
- `test`: Test additions/changes
- `chore`: Maintenance tasks
- `deploy`: Deployment changes

### Examples

\`\`\`bash

# Good commit message

fix(web): resolve sub-folder route 404 issue

Fixed Next.js App Router catch-all route that was returning 404
in production. Converted client component to use React's use() hook
for async params handling.

- Updated page.tsx to use use() hook instead of useEffect
- Fixed async params resolution
- Added error handling for route matching

Related: TICKET-0.1

# Bad commit message (DON'T DO THIS)

fix: stuff
\`\`\`

**See**: [Commit Standards](#commit-standards) section below for full details.

---

## 🛠️ Development Standards

### Code Quality

- **TypeScript**: Strict mode enabled
- **ESLint**: Shared config from `@repo/eslint-config`
- **Prettier**: Code formatting
- **No `any` types**: All functions must be typed

### File Naming

- **Semantic names**: `user-profile-card.tsx` not `component1.tsx`
- **kebab-case**: For file names
- **PascalCase**: For component names

### CSS Architecture

- **Centralized**: All styles in `packages/ui/src/styles/`
- **No custom CSS in apps**: Use Tailwind classes + CSS variables
- **CSS modules**: Only for app-specific layout adjustments

### Brand Standards

- **Brand name**: Always **IdeaI** (exact capitalization)
- **UniFrame**: Brand name for component system
- **File naming**: `uf-` prefix for UniFrame files

---

## 🔐 Security & Safety

### Pre-Deployment Checklist

- [ ] All builds succeed locally
- [ ] All tests pass
- [ ] No breaking changes
- [ ] Rollback plan documented
- [ ] Server impact assessed

### Post-Deployment Verification

- [ ] All routes accessible
- [ ] No 404 errors
- [ ] SSL certificates valid
- [ ] Performance acceptable
- [ ] No console errors

### Rollback Procedures

1. **Git-based**: Revert commit → Push → Auto-deploy
2. **Vercel**: Use dashboard to rollback to previous deployment

**See**: [Deployment Safety Checklist](./deployment/MULTI-STRATEGY-DEPLOYMENT-PLAN.md#safety--server-impact-considerations)

---

## 📞 Getting Help

### Resources

- **Documentation**: `docs/` directory
- **Status**: [STATUS.md](./STATUS.md)
- **Deployment Plan**: [MULTI-STRATEGY-DEPLOYMENT-PLAN.md](./deployment/MULTI-STRATEGY-DEPLOYMENT-PLAN.md)
- **Troubleshooting**: [Deployment Debugging](./deployment/debugging-deployment.md)

### Common Issues

1. **Build fails**: Check Root Directory in Vercel dashboard
2. **Route 404**: See TICKET-0.1
3. **Module not found**: Verify "Include files outside root" is enabled
4. **Deployment fails**: Check Vercel project configuration

---

## 🎓 Learning Path

### Week 1: Orientation

1. Read this onboarding guide
2. Review [Project Status](./STATUS.md)
3. Set up local development environment
4. Explore the codebase structure
5. Review [Multi-Strategy Deployment Plan](./deployment/MULTI-STRATEGY-DEPLOYMENT-PLAN.md)

### Week 2: First Contribution

1. Pick a ticket from Phase 1 (easiest)
2. Read ticket details thoroughly
3. Set up development environment
4. Make changes following standards
5. Write well-formatted commit
6. Create pull request

### Week 3+: Active Development

1. Work on assigned tickets
2. Follow commit message standards
3. Document as you go
4. Test thoroughly
5. Deploy safely

---

## 🚦 Next Steps

1. **Read this guide** completely
2. **Set up your environment** (see Quick Start)
3. **Review current tasks** in [Multi-Strategy Deployment Plan](./deployment/MULTI-STRATEGY-DEPLOYMENT-PLAN.md)
4. **Start with TICKET-0.1** (fix sub-folder route 404)
5. **Follow commit standards** (see below)

---

## 📋 Commit Standards

### Format

\`\`\`
type(scope): detailed subject line

Detailed explanation of what changed and why.

- Specific change 1
- Specific change 2
- Specific change 3

Related: TICKET-XXX
\`\`\`

### Types

- `fix`: Bug fixes
- `feat`: New features
- `docs`: Documentation changes
- `refactor`: Code refactoring
- `test`: Test additions/changes
- `chore`: Maintenance tasks
- `deploy`: Deployment changes
- `style`: Code style changes (formatting, etc.)

### Scope Examples

- `web`: Main web app
- `docs`: Documentation site
- `ui`: Shared UI package
- `deploy`: Deployment scripts
- `config`: Configuration files

### Good Examples

\`\`\`bash
fix(web): resolve sub-folder route 404 issue

Fixed Next.js App Router catch-all route that was returning 404
in production. Converted client component to use React's use() hook
for async params handling.

- Updated page.tsx to use use() hook instead of useEffect
- Fixed async params resolution
- Added error handling for route matching
- Updated TypeScript types for params

Related: TICKET-0.1

---

feat(deploy): add deployment validation script

Created script to validate Vercel configuration before deployment.
Prevents deployment failures due to missing Root Directory settings.

- Added validate-vercel-config.sh script
- Checks Root Directory setting
- Verifies "Include files outside root" is enabled
- Provides clear error messages

Related: TICKET-2.2

---

docs(deployment): document self-sovereign app architecture

Added comprehensive documentation for self-sovereign app deployment
strategy. Explains how apps work in isolation and how to configure them.

- Created self-sovereign-apps.md
- Documented architecture
- Added configuration examples
- Included troubleshooting guide

Related: TICKET-2.3
\`\`\`

### Bad Examples (DON'T DO THIS)

\`\`\`bash

# Too vague

fix: stuff

# No explanation

fix(web): route fix

# Missing details

fix: 404 error

# No ticket reference

feat: new feature
\`\`\`

### Commit Signing

**In non-interactive environments** (Cursor/AI tools):

1. Disable auto-sign: `git config --global --unset commit.gpgsign`
2. Make commit
3. Re-enable: `git config --global commit.gpgsign true`

**In interactive environments**:

- Commits are automatically signed with GPG

---

## ✅ Checklist for New Team Members

- [ ] Read this onboarding guide
- [ ] Set up local development environment
- [ ] Review [Project Status](./STATUS.md)
- [ ] Review [Multi-Strategy Deployment Plan](./deployment/MULTI-STRATEGY-DEPLOYMENT-PLAN.md)
- [ ] Understand commit message standards
- [ ] Review code quality standards
- [ ] Pick first ticket to work on
- [ ] Ask questions if unclear

---

**Welcome to the team! Let's build something amazing together! 🚀**

**Last Updated**: January 1, 2026
