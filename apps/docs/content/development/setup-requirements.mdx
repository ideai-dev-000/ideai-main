# IdeaI Setup Requirements

## Overview

IdeaI uses a simple `.ideai-dev.json` file in the root directory to track your personal setup requirements. This file is automatically updated as you complete each setup step.

**Important**: This is separate from `.ideai.json` (product config). See [File Distinction](./ideai-file-distinction.md) for details.

## Requirements Checklist

All requirements must be met before the site is ready for development.

### 1. Database ✅

```json
{
  "database": {
    "migration_complete": true, // ✅ Required
    "connected": true, // ✅ Required
    "last_checked": "2026-01-11T...",
    "last_error": null
  }
}
```

**How to complete:**

- Click "Run Migration Now" in the dev setup modal
- Or run: `cd apps/ideai-capabilities && pnpm db:push`
- Ensure `DATABASE_URL` is set in `.env.local`

### 2. Auth Configuration ✅

```json
{
  "auth": {
    "configured": true, // ✅ Required
    "secret_set": true, // ✅ Required
    "url_set": true, // ✅ Required
    "last_checked": "2026-01-11T..."
  }
}
```

**How to complete:**

- Set `BETTER_AUTH_SECRET` in `.env.local`
- Set `BETTER_AUTH_URL` (usually `http://localhost:3018`)

### 3. Service Keys ✅

```json
{
  "service_keys": {
    "configured": true, // ✅ Required (or env vars)
    "keys_count": 1,
    "last_checked": "2026-01-11T..."
  }
}
```

**How to complete:**

- Visit `/settings/service-keys`
- Add at least one API key (AI Gateway, OpenAI, etc.)
- Or set `AI_GATEWAY_API_KEY` / `OPENAI_API_KEY` in `.env.local`

### 4. Environment Variables ✅

```json
{
  "environment": {
    "variables_set": true, // ✅ Required
    "api_keys_available": true, // ✅ Required
    "last_checked": "2026-01-11T..."
  }
}
```

**How to complete:**

- Ensure required env vars are set
- At minimum: `DATABASE_URL`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`

### 5. Dev Ready ✅

```json
{
  "dev_ready": true, // ✅ Must be true
  "last_full_check": "2026-01-11T..."
}
```

**Auto-set when all above are true.**

## .ideai-dev.json File

Location: `/Users/sv/_IDEAI/ideai-main/.ideai-dev.json` (gitignored, personal)

This file is automatically updated when:

- You run migrations via the UI
- Setup checks run
- Requirements are met

**Note**: This file is **gitignored** - it's personal to each developer and tracks your local setup status.

**Example complete file:**

```json
{
  "setup": {
    "database": {
      "migration_complete": true,
      "connected": true,
      "last_checked": "2026-01-11T12:00:00.000Z"
    },
    "auth": {
      "configured": true,
      "secret_set": true,
      "url_set": true,
      "last_checked": "2026-01-11T12:00:00.000Z"
    },
    "service_keys": {
      "configured": true,
      "keys_count": 1,
      "last_checked": "2026-01-11T12:00:00.000Z"
    },
    "environment": {
      "variables_set": true,
      "api_keys_available": true,
      "last_checked": "2026-01-11T12:00:00.000Z"
    },
    "dev_ready": true,
    "last_full_check": "2026-01-11T12:00:00.000Z"
  }
}
```

## Dev Setup Modal

When you sign in, the IdeaI Developer Setup Modal appears if:

- **Failures detected** (always shows, cannot be dismissed)
- **Warnings detected** (shows on first visit, can be dismissed)

The modal shows:

- ✅ Pass: Requirement met
- ⚠️ Warning: Should fix but can proceed
- ❌ Fail: Must fix before developing

## Actionable Buttons

All buttons in the modal are **fully functional**:

1. **Run Migration Now** - Executes `pnpm db:push` and shows logs
2. **Go to Settings** - Links to `/settings/service-keys`
3. **View Full Report** - Links to `/dev-setup` page

## Logs

All actions log to:

- Console (browser dev tools)
- API response `logs` array
- `.ideai.json` `last_error` field (if failed)

## Quick Start

1. **Sign in** to the app
2. **Modal appears** if setup incomplete
3. **Click "Run Migration Now"** if database migration needed
4. **Add service keys** via `/settings/service-keys`
5. **Check .ideai.json** - all should be `true` when done

## Status

Check your current status:

```bash
# Via API
curl http://localhost:3018/api/dev-setup/status

# Via file (personal dev setup)
cat .ideai-dev.json
```

---

**Simple Rule:** All items in `.ideai-dev.json` setup must be `true` before `dev_ready` is `true`. The modal guides you through each step.

**File Distinction:**

- `.ideai.json` = IdeaI product config (read-only, tracked in git)
- `.ideai-dev.json` = Your personal dev setup (read-write, gitignored)

See [File Distinction](./ideai-file-distinction.md) for details.
