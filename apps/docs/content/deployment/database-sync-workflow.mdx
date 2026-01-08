# Database Sync Workflow

**Last Updated**: January 8, 2026

Complete guide for syncing local database to production, enabling local development and testing workflows before pushing them live.

## Overview

The database sync feature allows you to sync database data between environments.

### ⚠️ Current Setup (January 2026)

**Important**: Currently using a single shared cloud database (Neon Postgres) for both local development and production.

- **Same Database**: Local and production use the same `DATABASE_URL` (Neon cloud database)
- **Sync Behavior**: Syncing currently uses the same database (tests the sync flow)
- **Future**: When databases are separated, sync will work between local and production databases

**Why This Matters**:

- Changes made locally immediately appear in production (same database)
- The sync feature currently validates the sync process but operates on the same database
- This is intentional for the current simplified setup

### Future Database Separation

**Planned**: Separate local and production databases are planned for future implementation (see TODOs). When implemented:

- Local development will use a separate database
- Production will use a separate database
- Sync will copy data from local → production

### Current Sync Feature

The database sync feature allows you to:

- **Test sync flow** - Validate the sync process works correctly
- **Prepare for separation** - When databases are separated, sync is ready to use
- **Future use** - Once separated, sync local workflows to production

---

## Quick Start

### Via UI (Recommended)

1. **Open Cloud Manager**: http://localhost:3000/cloud
2. **Click "Database" tab**
3. **Connect to Production**:
   - Click "Connect to Production" button
   - This fetches production `DATABASE_URL` from Vercel
4. **Sync Database**:
   - Click "Sync DB → Production" button
   - Confirm the sync (this overwrites production!)
   - Wait for sync to complete

### Via CLI

```bash
# Step 1: Get production DATABASE_URL
node scripts/ideai-db-manager.mjs connect --env production --app ideai-capabilities

# Step 2: Sync local to production (using the URL from step 1)
node scripts/ideai-db-manager.mjs sync \
  --target-url "postgresql://production-url-here"
```

---

## Detailed Workflow

### Step 1: Develop Locally

**Create and test workflows on your local database:**

```bash
# Start local app
cd apps/ideai-capabilities
pnpm dev

# Create workflows, test them, iterate
# All changes are saved to your local database
```

**Local Database Setup:**

- Ensure `DATABASE_URL` is set in `apps/ideai-capabilities/.env.local`
- Default: `postgres://localhost:5432/workflow`

### Step 2: Verify Local Workflows

**Check your workflows are ready:**

```bash
# View workflows via Drizzle Studio
cd apps/ideai-capabilities
pnpm db:studio
# Navigate to "workflows" table

# Or via CLI
node scripts/ideai-db-manager.mjs query \
  --sql "SELECT id, name, created_at FROM workflows ORDER BY created_at DESC" \
  --env local
```

### Step 3: Connect to Production

**Via UI:**

1. Go to Cloud Manager → Database tab
2. Click "Connect to Production"
3. System fetches production `DATABASE_URL` from Vercel

**Via CLI:**

```bash
node scripts/ideai-db-manager.mjs connect --env production --app ideai-capabilities
# Copy the DATABASE_URL from output
```

### Step 4: Sync to Production

**⚠️ WARNING**: This overwrites production database with local data!

**Via UI:**

1. Click "Sync DB → Production"
2. Confirm the warning dialog
3. Wait for sync to complete

**Via CLI:**

```bash
# Using production URL from connect command
node scripts/ideai-db-manager.mjs sync \
  --source local \
  --target production \
  --target-url "postgresql://production-url-here"
```

**What gets synced:**

- ✅ All workflows (with their configurations)
- ✅ All workflow executions and logs
- ✅ All users and sessions
- ✅ All integrations and API keys
- ✅ All other database tables

---

## How Sync Works

The sync process:

1. **Dumps local database** using `pg_dump`
2. **Restores to production** using `psql`
3. **Replaces all production data** with local data
4. **Cleans up** temporary dump files

**Technical Details:**

- Uses `pg_dump` for full database export
- Uses `psql` for database restore
- Temporary files stored in `/tmp/` (auto-cleaned)
- Full database replacement (not incremental)

---

## Safety and Best Practices

### ⚠️ Critical Warnings

1. **Backup Production First**

   ```bash
   node scripts/ideai-db-manager.mjs backup --env production --output prod-backup-$(date +%Y%m%d).sql
   ```

2. **Test Locally Thoroughly**
   - Ensure workflows work correctly locally
   - Test all integrations
   - Verify data integrity

3. **Sync During Low-Traffic Times**
   - Production will be unavailable during sync
   - Users will see errors if they use the app during sync

4. **Never Sync in Reverse**
   - Local → Production is the intended direction
   - Production → Local would overwrite your work

### Pre-Sync Checklist

- [ ] Local workflows tested and working
- [ ] Production database backed up
- [ ] Low-traffic time window chosen
- [ ] Production `DATABASE_URL` obtained
- [ ] Ready to confirm sync operation

---

## CLI Reference

### Sync Command

```bash
node scripts/ideai-db-manager.mjs sync [options]
```

**Options:**

- `--source <env>` - Source environment (local|production|preview) [default: local]
- `--target <env>` - Target environment (local|production|preview) [default: production]
- `--source-url <url>` - Source DATABASE_URL (overrides --source)
- `--target-url <url>` - Target DATABASE_URL (required for production)
- `--app <app>` - App name (ideai-capabilities|ideai-workflow) [default: ideai-capabilities]

**Examples:**

```bash
# Sync local to production (requires target-url)
node scripts/ideai-db-manager.mjs sync \
  --target-url "postgresql://user:pass@host:port/db"

# Sync with explicit source and target
node scripts/ideai-db-manager.mjs sync \
  --source local \
  --target production \
  --target-url "postgresql://..."

# Sync between different environments
node scripts/ideai-db-manager.mjs sync \
  --source preview \
  --target production \
  --source-url "postgresql://preview-url" \
  --target-url "postgresql://production-url"
```

---

## Common Workflows

### Workflow: Local Development → Production Demo

```bash
# 1. Develop locally
cd apps/ideai-capabilities
pnpm dev
# Create workflows, test them

# 2. Get production connection
node scripts/ideai-db-manager.mjs connect --env production --app ideai-capabilities

# 3. Backup production (safety first!)
node scripts/ideai-db-manager.mjs backup \
  --env production \
  --output backup-before-sync-$(date +%Y%m%d_%H%M%S).sql \
  --target-url "production-url-here"

# 4. Sync to production
node scripts/ideai-db-manager.mjs sync \
  --target-url "production-url-here"

# 5. Verify on production
# Visit: https://ideai-capabilities.vercel.app
# Check workflows are visible and working
```

### Workflow: Quick Demo Push

```bash
# One-liner after getting production URL
PROD_URL=$(node scripts/ideai-db-manager.mjs connect --env production --app ideai-capabilities | grep "postgresql://" | head -1)
node scripts/ideai-db-manager.mjs sync --target-url "$PROD_URL"
```

---

## Troubleshooting

### Sync Fails with Connection Error

**Problem**: Can't connect to production database

**Solutions:**

1. Verify production `DATABASE_URL` is correct
2. Check database firewall/network allows your IP
3. Ensure database credentials haven't expired
4. Test connection first: `node scripts/ideai-db-manager.mjs status --url "production-url"`

### Sync Partially Completes

**Problem**: Sync starts but fails partway through

**Solutions:**

1. Check database disk space on production
2. Verify production database isn't locked
3. Check network stability
4. Retry sync (will start from beginning)

### Production Data Missing After Sync

**Problem**: Production data disappeared after sync

**Solutions:**

1. Restore from backup:
   ```bash
   node scripts/ideai-db-manager.mjs restore \
     --file backup-before-sync-YYYYMMDD.sql \
     --target-url "production-url"
   ```
2. Check backup was created before sync
3. Verify you synced from the correct local database

---

## Future Enhancements

This sync feature is the foundation for a broader Vercel dashboard control system:

### Planned Features

1. **Selective Sync**
   - Sync only specific tables (workflows, users, etc.)
   - Exclude sensitive data during sync
   - Merge strategies (additive vs. replacement)

2. **Incremental Sync**
   - Sync only changes since last sync
   - Track sync history
   - Rollback capability

3. **Vercel Environment Variable Sync**
   - Sync environment variables from local to Vercel
   - Manage secrets via CLI/UI
   - Validate before syncing

4. **Automated Sync Workflows**
   - Scheduled syncs
   - CI/CD integration
   - Pre-sync validation hooks

5. **Multi-Environment Management**
   - Sync between any environments
   - Environment comparison tools
   - Conflict resolution

### Architecture Pattern

The sync system follows this pattern for future expansion:

```
Local → API Route → CLI/UI → Vercel
  ↓         ↓         ↓         ↓
 Data    Server   Client   Cloud
```

All management operations (database, env vars, deployments) will follow this same pattern:

- **Local**: Source of truth for development
- **API Route**: Secure server-side operations
- **CLI/UI**: User interface (CLI for automation, UI for visual management)
- **Vercel**: Target for production deployment

---

## Related Documentation

- [Database Management Guide](./database-management.md) - Complete database operations
- [IdeaI Management System](./ideai-management-system.md) - Unified management system
- [Cloud Manager Architecture](../../architecture/cloud-manager.md) - Cloud Manager details

---

**Next Steps**: Use this sync workflow to push your local workflows to production and showcase them to users!
