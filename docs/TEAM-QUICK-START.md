---
title: Quick Start for New Team Members
description: Essential information for new developers to get started immediately
---

# Quick Start Guide for New Team Members

**Welcome!** This is your fast-track guide to getting started.

---

## 🎯 Start Here (5 Minutes)

1. **Read**: [ONBOARDING.md](./ONBOARDING.md) - Complete project overview
2. **Review**: [STATUS.md](./STATUS.md) - Current project status
3. **Check**: [MULTI-STRATEGY-DEPLOYMENT-PLAN.md](./deployment/MULTI-STRATEGY-DEPLOYMENT-PLAN.md) - All tasks and tickets

---

## 🚀 Your First Task

**Current Priority**: **TICKET-0.1** - Fix sub-folder route 404 issue

**Location**: [TICKET-0.1 Details](./deployment/MULTI-STRATEGY-DEPLOYMENT-PLAN.md#ticket-01-fix-sub-folder-route-404-issue)

**What to do**:
1. Read the ticket completely
2. Set up your environment (see below)
3. Investigate the issue
4. Fix it
5. **Write a well-formatted commit** (see commit standards below)
6. Create pull request

---

## ⚡ Quick Setup

```bash
# Clone and setup
git clone https://github.com/ideai-dev-000/ideai-main.git
cd ideai-main
pnpm install

# Start development
pnpm dev:start

# Access apps
# Main: http://localhost:3000
# Docs: http://localhost:3001
```

---

## 📝 Commit Message Format (REQUIRED)

**Every commit MUST follow this format:**

```
type(scope): detailed subject line

Detailed explanation of what changed and why.

- Specific change 1
- Specific change 2
- Specific change 3

Related: TICKET-XXX
```

**Example**:
```
fix(web): resolve sub-folder route 404 issue

Fixed Next.js App Router catch-all route that was returning 404
in production. Converted client component to use React's use() hook
for async params handling.

- Updated page.tsx to use use() hook instead of useEffect
- Fixed async params resolution
- Added error handling for route matching

Related: TICKET-0.1
```

**See**: [Commit Standards in ONBOARDING.md](./ONBOARDING.md#commit-standards) for full details.

---

## 📋 All Tasks

**See**: [Multi-Strategy Deployment Plan](./deployment/MULTI-STRATEGY-DEPLOYMENT-PLAN.md)

**Total**: 19 tickets
- **Critical**: 1 (TICKET-0.1 - Do this first!)
- **High**: 5
- **Medium**: 8
- **Low**: 5

**Start with**: TICKET-0.1 (Phase 0)

---

## 🆘 Need Help?

- **Documentation**: `docs/` directory
- **Onboarding**: [ONBOARDING.md](./ONBOARDING.md)
- **Status**: [STATUS.md](./STATUS.md)
- **Tasks**: [MULTI-STRATEGY-DEPLOYMENT-PLAN.md](./deployment/MULTI-STRATEGY-DEPLOYMENT-PLAN.md)

---

**Ready to start?** Begin with [TICKET-0.1](./deployment/MULTI-STRATEGY-DEPLOYMENT-PLAN.md#ticket-01-fix-sub-folder-route-404-issue)!


