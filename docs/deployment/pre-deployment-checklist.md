# Pre-Deployment Checklist

**Last Updated**: January 1, 2026  
**Purpose**: Complete checklist before cold reboot, local build, and Vercel deployment

---

## ✅ Documentation Status

- [x] `.ideai-rules.md` - Complete rules and standards (733 lines)
- [x] `.cursorrules` - Cursor-specific rules (matches .ideai-rules.md)
- [x] `README.md` - Project overview
- [x] `docs/deployment/` - Complete deployment documentation
- [x] All rules centralized and synchronized

---

## ✅ Pre-Deployment Verification

### 1. TypeScript & Lint Status

```bash
# Type checking
pnpm check-types
# Expected: All tasks successful

# Linting
pnpm lint
# Expected: No errors
```

### 2. Port Status (Cold Reboot Ready)

```bash
# Check for running dev servers
lsof -ti:3000,3001,3002,3003,3004,3005,3006,3007,3008,3009,3010,3011,3012
# Expected: No output (all ports free)
```

### 3. Build System

```bash
# Verify build scripts exist
ls -la deploy.sh
ls -la scripts/ideai-build.mjs

# Check package.json scripts
pnpm run --help
```

### 4. Deployment Prerequisites

```bash
# Vercel CLI installed
which vercel

# Vercel authenticated
vercel whoami

# Vercel projects linked
ls apps/*/.vercel/project.json
```

---

## 🚀 Deployment Workflow

### Step 1: Cold Reboot (Local)

```bash
# 1. Stop all running dev servers
pnpm dev:stop  # If dev-manager exists
# OR manually kill processes on ports 3000-3012

# 2. Verify ports are clear
lsof -ti:3000,3001,3002,3003,3004,3005,3006,3007,3008,3009,3010,3011,3012

# 3. Clean build artifacts (optional)
pnpm clean  # If available
# OR manually: rm -rf apps/*/.next apps/*/node_modules/.cache

# 4. Fresh install (optional but recommended)
pnpm install
```

### Step 2: Local Build Test

```bash
# 1. Type check
pnpm check-types
# ✅ Expected: All tasks successful

# 2. Lint
pnpm lint
# ✅ Expected: No errors

# 3. Build all apps
pnpm build
# ✅ Expected: All builds successful

# 4. Verify build outputs
ls apps/*/.next
# ✅ Expected: .next directories exist
```

### Step 3: Local Dev Test (Optional)

```bash
# Start all dev servers
pnpm dev
# OR
pnpm dev:start  # If dev-manager exists

# Verify all apps accessible:
# - http://localhost:3000 (web)
# - http://localhost:3001 (docs)
# - http://localhost:3002 (all)
# ... etc

# Stop when verified
pnpm dev:stop
```

### Step 4: Deploy to Vercel

```bash
# Preview deployment (all apps)
./deploy.sh

# Preview deployment (specific app)
./deploy.sh web
./deploy.sh docs

# Production deployment (all apps)
./deploy.sh --prod

# Production deployment (specific app)
./deploy.sh --prod web
./deploy.sh --prod docs
```

---

## 📊 CLI Monitoring Commands

### Watch Build Status

```bash
# Watch TypeScript compilation
pnpm check-types --watch

# Watch linting
pnpm lint --watch

# Watch build (if available)
pnpm build --watch
```

### Monitor Dev Servers

```bash
# Check dev server status
pnpm dev:status  # If dev-manager exists

# View running processes
lsof -i :3000-3012

# Check Turbo tasks
pnpm turbo run dev --dry-run
```

### Monitor Deployment

```bash
# Vercel deployment status
vercel ls

# Vercel project info
vercel inspect

# Vercel logs
vercel logs
```

---

## ✅ Final Verification Checklist

Before deploying to production:

- [ ] All TypeScript checks pass (`pnpm check-types`)
- [ ] All lint checks pass (`pnpm lint`)
- [ ] All builds succeed (`pnpm build`)
- [ ] All dev servers start correctly (`pnpm dev`)
- [ ] All ports are accessible (3000-3012)
- [ ] Vercel CLI authenticated (`vercel whoami`)
- [ ] Vercel projects linked (check `.vercel/project.json`)
- [ ] Documentation is up to date
- [ ] Rules are synchronized (`.ideai-rules.md` and `.cursorrules`)
- [ ] No uncommitted changes (or intentionally staged)

---

## 🎯 Quick Commands Reference

### Cold Reboot

```bash
# Stop everything
pkill -f "next dev" || true
lsof -ti:3000-3012 | xargs kill -9 2>/dev/null || true

# Verify clean
lsof -ti:3000-3012  # Should return nothing

# Fresh start
pnpm install
pnpm dev
```

### Build & Deploy

```bash
# Full verification
pnpm check-types && pnpm lint && pnpm build

# Deploy preview
./deploy.sh

# Deploy production
./deploy.sh --prod
```

### Monitoring

```bash
# Watch all
pnpm dev  # Terminal 1
pnpm check-types --watch  # Terminal 2 (if available)
vercel logs --follow  # Terminal 3 (after deploy)
```

---

## 📝 Notes

- **Cold Reboot**: Ensures no cached state or port conflicts
- **Local Build**: Verifies everything compiles before deployment
- **Vercel Deploy**: Uses `deploy.sh` script for unified deployment
- **CLI Monitoring**: All commands available via terminal
- **Documentation**: All processes documented in `docs/deployment/`

---

**Status**: ✅ Ready for deployment  
**Last Verified**: January 1, 2026
