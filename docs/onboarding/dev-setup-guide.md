# Dev Setup Guide - Automated Onboarding

## Overview

IdeaI includes an **automated dev setup checker** that validates your development environment on first use. This eliminates setup issues for new developers and ensures everything is configured correctly.

## Quick Start

### Option 1: Web UI (Recommended)

1. **Start dev server:**

   ```bash
   pnpm dev
   ```

2. **Navigate to setup page:**

   ```
   http://localhost:3018/dev-setup
   ```

3. **Review checks:**
   - ✅ Green = Everything OK
   - ⚠️ Yellow = Warning (can proceed)
   - ❌ Red = Must fix before proceeding

4. **Auto-fix migration:**
   - Click "Run Migration" if database migration check fails
   - Re-runs checks automatically after completion

### Option 2: CLI

```bash
# Check setup status
pnpm dev-setup check

# Run migration if needed
pnpm dev-setup migrate
```

## What Gets Checked

### 1. Database Migration ✅

- Verifies `user_service_keys` table exists
- **Auto-fix**: Click "Run Migration" button in UI

### 2. Auth Configuration ⚠️

- Checks `BETTER_AUTH_SECRET` and `BETTER_AUTH_URL`
- **Fix**: Add to `.env.local`

### 3. Service Keys Setup ⚠️

- Checks if you've added any API keys
- **Fix**: Visit `/settings/service-keys` to add keys

### 4. Environment Variables ⚠️

- Checks for fallback keys in `.env.local`
- **Note**: Database keys are preferred, env vars are fallback

### 5. Key Sync CLI Setup ⚠️

- Checks if `IDEAI_USER_ID` is configured for CLI sync
- **Fix**: Add `IDEAI_USER_ID` to `.env.local` or use `--user` flag

## Setup Flow for New Developers

1. **Clone repo:**

   ```bash
   git clone <repo>
   cd ideai-main
   pnpm install
   ```

2. **Configure environment:**

   ```bash
   cp .env.example .env.local
   # Edit .env.local with your values
   ```

3. **Run setup check:**

   ```bash
   pnpm dev-setup check
   ```

   Or visit `http://localhost:3018/dev-setup`

4. **Fix any failures:**
   - Database migration: `pnpm dev-setup migrate`
   - Auth config: Add missing env vars
   - Service keys: Add via UI at `/settings/service-keys`

5. **Start developing:**
   ```bash
   pnpm dev
   ```

## Integration with Cloud Manager

The dev setup checker is part of the `@repo/cloud-manager` package, ensuring:

- **Zero bloat**: Integrated into existing cloud infrastructure
- **Reduced complexity**: Single source of truth for setup validation
- **Automatic**: Can be triggered on first app start
- **Consistent**: Same checks across all IdeaI apps

## Local Mode

If database is not available, you can still develop in **local mode**:

- Service keys UI shows read-only view
- Uses environment variables for API keys
- No database required
- Perfect for offline development

## Benefits

✅ **Zero setup issues** - Automated validation catches problems early  
✅ **Onboarding speed** - New devs can start in minutes  
✅ **Consistency** - Same checks everywhere  
✅ **Self-service** - Auto-fix for common issues  
✅ **Documentation** - Fix steps shown inline

## Future Enhancements

- [ ] Auto-fix for all issues (currently only migration)
- [ ] Integration into app startup (auto-run on first visit)
- [ ] Team-wide setup status dashboard
- [ ] Setup checklist for CI/CD
