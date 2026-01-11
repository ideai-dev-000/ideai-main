# IdeaI File Distinction: Product vs Developer

## Overview

IdeaI uses two separate JSON configuration files with distinct purposes:

1. **`.ideai.json`** - IdeaI Product Configuration (tracked in git)
2. **`.ideai-dev.json`** - Developer Setup (gitignored, personal)

## `.ideai.json` - Product Configuration

**Purpose**: IdeaI product rules, config, and build settings

**Location**: Repository root (tracked in git)

**Who writes it**: IdeaI product team / build system

**Contains**:

- Product build configuration
- Rules for IdeaI framework
- Tool requirements for IdeaI apps
- Product-level settings

**Developer access**: READ-ONLY (do not modify)

**Example**:

```json
{
  "product": {
    "version": "1.0.0",
    "build": {
      "tools": ["drizzle", "next", "turbo"],
      "requirements": {
        "node": ">=20.0.0",
        "pnpm": ">=8.0.0"
      }
    },
    "rules": {
      "enforce_typescript": true,
      "require_tests": false
    }
  }
}
```

## `.ideai-dev.json` - Developer Setup

**Purpose**: Personal developer environment setup status

**Location**: Repository root (gitignored)

**Who writes it**: Each developer / setup system

**Contains**:

- Database migration status
- Auth configuration status
- Service keys setup status
- Environment variables status
- Dev ready flag

**Developer access**: READ-WRITE (auto-updated by setup system)

**Example**:

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
      "url_set": true
    },
    "service_keys": {
      "configured": true,
      "keys_count": 2
    },
    "environment": {
      "variables_set": true,
      "api_keys_available": true
    },
    "dev_ready": true,
    "last_full_check": "2026-01-11T12:00:00.000Z"
  }
}
```

## Why This Distinction?

### Product Config (`.ideai.json`)

- **Shared**: Same for all developers
- **Versioned**: Tracked in git
- **Product**: Defines IdeaI framework behavior
- **Tools**: Which tools IdeaI requires

### Developer Setup (`.ideai-dev.json`)

- **Personal**: Each dev has their own
- **Ignored**: Not in git (in `.gitignore`)
- **Setup**: Tracks dev environment status
- **Tools**: Whether dev has tools configured

## File Locations

```
ideai-main/
├── .ideai.json          # ✅ Product config (tracked)
├── .ideai-dev.json      # ❌ Dev setup (gitignored, personal)
├── .ideai-rules.md      # ✅ Product rules (tracked)
└── apps/
```

## Vercel Best Practices

Both files work with Vercel:

1. **`.ideai.json`** - Available at build time (tracked in repo)
2. **`.ideai-dev.json`** - Generated on first setup (not in repo, per-environment)

For Vercel deployments:

- `.ideai.json` is included in deployment
- `.ideai-dev.json` is generated from environment variables on first run
- Each Vercel environment (preview/production) can have different `.ideai-dev.json`

## Rules

✅ **DO**:

- Modify `.ideai-dev.json` (it's yours)
- Read `.ideai.json` for product requirements
- Let setup system auto-update `.ideai-dev.json`

❌ **DON'T**:

- Modify `.ideai.json` (product config)
- Commit `.ideai-dev.json` to git
- Mix product config with dev setup

## Migration from Old Format

If you have an old `.ideai.json` with setup data:

1. Move setup section to `.ideai-dev.json`
2. Keep product config in `.ideai.json`
3. Update `.gitignore` to ignore `.ideai-dev.json`

---

**Summary**: `.ideai.json` = Product, `.ideai-dev.json` = Personal Dev Setup
