# Key Sync System Architecture

## Overview

The Key Sync System ensures local development environment keys always match database/cloud keys seamlessly. It uses secure hashing to compare keys without exposing them, and provides a unified way to manage keys across local dev, database, and cloud environments.

## Design Principles

1. **Single Source of Truth**: Database is the authoritative source for keys
2. **Secure Comparison**: Hash-based validation without exposing keys
3. **Bidirectional Sync**: Push local → DB, Pull DB → local
4. **Environment Isolation**: Separate keys for `local`, `production`, `preview`
5. **Seamless Integration**: Works with existing cloud manager

## Components

### 1. Key Sync Manager (`packages/cloud-manager/src/key-sync.ts`)

Core sync functionality:

- `syncKeysFromDb()` - Downloads keys from DB to local `.env`
- `syncKeysToDb()` - Uploads local `.env` keys to DB
- `validateKeySync()` - Validates local matches DB using hashes
- `hashKey()` - Generates secure fingerprint for comparison

### 2. API Endpoints

#### `/api/user-keys/sync` (POST)

Secure endpoint for dev sync (returns decrypted keys):

- Requires authentication
- In production, requires `x-dev-sync-token` header
- Returns all user keys decrypted for local sync

#### `/api/user-keys/hashes` (GET)

Returns key hashes for validation:

- Doesn't expose actual keys
- Used for validation without full sync
- Requires authentication

### 3. CLI Tool (`scripts/ideai-key-sync.mjs`)

```bash
# Pull keys from DB to local .env
pnpm key-sync pull

# Push local .env keys to DB
pnpm key-sync push

# Validate that local matches DB
pnpm key-sync validate
```

## Workflow

### Initial Setup

1. **Developer adds key in UI** (`/settings/service-keys`)
   - Key is encrypted and stored in DB
   - Environment: `production` or `local`

2. **Sync to local dev**:
   ```bash
   pnpm key-sync pull --user=USER_ID
   ```

   - Downloads keys from DB
   - Updates `.env.local` file
   - Keys are decrypted for local use

### Daily Development

1. **Before starting work**:

   ```bash
   pnpm key-sync validate
   ```

   - Checks if local keys match DB
   - Shows mismatches if any

2. **If keys are out of sync**:

   ```bash
   pnpm key-sync pull  # Always pull from DB (source of truth)
   ```

3. **If you add a local key** (shouldn't happen, but possible):
   ```bash
   pnpm key-sync push  # Uploads to DB
   ```

## Security Model

### Hash-Based Validation

```typescript
// Generate hash (16-char fingerprint)
hashKey("vck_abc123...") → "a1b2c3d4e5f6g7h8"

// Compare without exposing key
localHash === dbHash  // Safe comparison
```

### Encryption

- Keys stored in DB are encrypted using `INTEGRATION_ENCRYPTION_KEY`
- Sync endpoint decrypts only for authenticated dev sync
- Local `.env` files contain plaintext (standard practice for local dev)

### Authentication

- Sync requires user session authentication
- Production sync requires `x-dev-sync-token` header
- Hash endpoint is read-only (no keys exposed)

## Environment Variables

### Required in `.env.local`:

```bash
# Your user ID (for sync)
IDEAI_USER_ID=your-user-id

# API URL for sync (optional, defaults to localhost:3018)
IDEAI_KEY_SYNC_API_URL=http://localhost:3018/api/user-keys

# Dev sync token (for production sync)
DEV_SYNC_TOKEN=your-secure-token
```

### Service Keys (auto-managed):

```bash
# These are auto-synced from database
AI_GATEWAY_API_KEY=vck_...
OPENAI_API_KEY=sk-...
V0_API_KEY=v0_...
```

## Integration with Cloud Manager

The key sync system integrates with the existing cloud manager:

1. **Vercel Sync**: When keys are added via UI, optionally sync to Vercel env vars
2. **Auto-Validation**: Cloud manager can validate keys before deployments
3. **Team Keys**: Supports team-level key management

## Best Practices

1. **Always pull, never push** (unless adding new local keys)
   - Database is source of truth
   - Local keys should always match DB

2. **Use environment separation**:
   - `local` - Development keys
   - `production` - Production keys
   - `preview` - Preview/staging keys

3. **Validate before deployments**:

   ```bash
   pnpm key-sync validate
   ```

4. **Never commit `.env.local`**:
   - Already in `.gitignore`
   - Contains sensitive keys

## Troubleshooting

### Keys out of sync

```bash
# Validate first
pnpm key-sync validate

# Pull from DB (fixes local)
pnpm key-sync pull
```

### Sync fails with 401

- Check you're authenticated in the app
- Verify `IDEAI_USER_ID` in `.env.local`

### Sync fails with 403 (production)

- Set `DEV_SYNC_TOKEN` in `.env.local`
- Request token from team lead

### Hash validation fails but keys work

- Keys might be different but both valid
- Pull from DB to ensure consistency

## Future Enhancements

- [ ] Auto-sync on dev server start
- [ ] Git hooks to validate before commit
- [ ] Vercel auto-sync integration
- [ ] Team key sharing
- [ ] Key rotation reminders
