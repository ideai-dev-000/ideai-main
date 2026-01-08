# IdeaI Management System

**Last Updated**: January 8, 2026

Complete guide for the unified IdeaI management system - a single UI and CLI for managing databases, deployments, sites, and packages on Vercel and locally.

## Overview

The IdeaI Management System provides:

- **Unified UI**: Web-based dashboard for managing everything
- **CLI Tools**: Command-line interface for advanced operations
- **Local & Production**: Manage both local and production resources
- **Database Management**: Migrations, backups, status checks
- **Cloud Management**: Vercel projects, deployments, settings
- **Package Management**: (Coming soon) Manage packages and dependencies

---

## Access

### UI Dashboard

**Local Development:**

```
http://localhost:3000/cloud
```

**Features:**

- Cloud Provider Management (Vercel, AWS, GCP, Azure, Hostinger)
- Database Management (Status, Migrations, Connections)
- Package Management (Coming soon)

### CLI Tools

**Database Management:**

```bash
node scripts/ideai-db-manager.mjs [command] [options]
```

**Available Commands:**

- `status` - Show database connection status
- `migrate` - Run pending migrations
- `generate` - Generate migration from schema changes
- `push` - Push schema changes directly (dev-only)
- `studio` - Open Drizzle Studio (visual database browser)
- `backup` - Backup database
- `restore` - Restore database from backup
- `query` - Run SQL query
- `tables` - List all tables
- `connect` - Get connection string from Vercel

---

## Database Management

### Via UI (Recommended)

1. **Navigate to Cloud Manager**: `http://localhost:3000/cloud`
2. **Select "Database" tab**
3. **Choose App & Environment**:
   - App: `ideai-capabilities` or `ideai-workflow`
   - Environment: `local`, `production`, or `preview`
4. **Connect to Production** (if needed):
   - Click "Connect to Vercel" button
   - Automatically fetches `DATABASE_URL` from Vercel
5. **Check Status**: Click "Check Status" to see connection info
6. **Run Migrations**: Click "Run Migrations" to apply pending migrations

### Via CLI

**Basic Commands:**

```bash
# Check database status
node scripts/ideai-db-manager.mjs status

# Run migrations locally
node scripts/ideai-db-manager.mjs migrate

# Run migrations on production
node scripts/ideai-db-manager.mjs migrate --env production

# Get production DATABASE_URL from Vercel
node scripts/ideai-db-manager.mjs connect --env production

# Open Drizzle Studio
node scripts/ideai-db-manager.mjs studio

# Backup database
node scripts/ideai-db-manager.mjs backup --output backup.sql

# List all tables
node scripts/ideai-db-manager.mjs tables
```

**Advanced Usage:**

```bash
# Use production database with custom URL
node scripts/ideai-db-manager.mjs status --url "postgresql://..."

# Generate migration from schema changes
node scripts/ideai-db-manager.mjs generate --app ideai-capabilities

# Run SQL query
node scripts/ideai-db-manager.mjs query --sql "SELECT COUNT(*) FROM users"

# Restore from backup
node scripts/ideai-db-manager.mjs restore --file backup.sql
```

**Options:**

- `--env <env>` - Environment (local|production|preview) [default: local]
- `--app <app>` - App name (ideai-capabilities|ideai-workflow) [default: ideai-capabilities]
- `--url <url>` - Custom DATABASE_URL (overrides --env)
- `--output <file>` - Output file for backup/query results
- `--file <file>` - Input file for restore
- `--sql <query>` - SQL query to execute

---

## Cloud Provider Management

### Vercel Management

**Via UI:**

1. Navigate to `http://localhost:3000/cloud`
2. Select "Cloud Providers" tab
3. Select "Vercel" provider
4. Choose project from dropdown
5. View/edit project settings
6. Auto-configure new projects

**Features:**

- List all Vercel projects
- View project settings (Root Directory, Build Command, etc.)
- Update project settings via UI
- Auto-configure new projects
- Validation of monorepo settings

**Setup:**

1. Get Vercel token from: https://vercel.com/account/tokens
2. Add to `.env.local`:
   ```env
   VERCEL_TOKEN=your_token_here
   ```
3. Restart dev server: `pnpm --filter web dev`

---

## API Routes

All management operations use secure API routes that proxy requests server-side.

### Database API Routes

**GET `/api/database/status`**

- Get database connection status
- Query params: `env`, `app`, `url` (for production)

**GET `/api/database/connect`**

- Get `DATABASE_URL` from Vercel
- Query params: `env`, `app`

**POST `/api/database/migrate`**

- Run database migrations
- Body: `{ env, app, url? }`

### Vercel API Routes

**GET `/api/vercel/projects`**

- List all Vercel projects
- Query params: `teamId`

**GET `/api/vercel/projects/[projectId]/settings`**

- Get project settings
- Query params: `teamId`

**PATCH `/api/vercel/projects/[projectId]/settings`**

- Update project settings
- Body: Project settings object

---

## Security

### ⚠️ Development-Only Access

The management UI is **DEV-ONLY** and will return 404 in production:

- Runtime check: `NODE_ENV === "development"`
- Navigation hidden in production
- API routes protected with environment checks

### Credentials

- **Vercel Token**: Stored in `.env.local` (server-side only)
- **Database URLs**: Never stored client-side
- **Production Access**: Requires explicit connection via Vercel CLI

### Best Practices

1. **Never commit secrets**: All credentials in `.env.local` (gitignored)
2. **Use CLI for production**: Safer for production operations
3. **Test locally first**: Always test migrations locally before production
4. **Backup before changes**: Always backup production database before migrations

---

## Workflow Examples

### Daily Development Workflow

```bash
# 1. Check local database status
node scripts/ideai-db-manager.mjs status

# 2. Make schema changes in apps/ideai-capabilities/lib/db/schema.ts

# 3. Generate migration
node scripts/ideai-db-manager.mjs generate

# 4. Review migration SQL
cat apps/ideai-capabilities/drizzle/*.sql

# 5. Apply migration locally
node scripts/ideai-db-manager.mjs migrate

# 6. Verify in Drizzle Studio
node scripts/ideai-db-manager.mjs studio
```

### Production Deployment Workflow

```bash
# 1. Get production DATABASE_URL
node scripts/ideai-db-manager.mjs connect --env production

# 2. Backup production database
node scripts/ideai-db-manager.mjs backup --env production --output backup_$(date +%Y%m%d).sql

# 3. Test migration locally with production URL
export DATABASE_URL="production-url-here"
node scripts/ideai-db-manager.mjs migrate --env production

# 4. Run migration on production (via UI or CLI)
# Via UI: http://localhost:3000/cloud → Database → Run Migrations
# Via CLI: node scripts/ideai-db-manager.mjs migrate --env production --url "production-url"
```

### Vercel Project Setup Workflow

```bash
# 1. Navigate to Cloud Manager UI
# http://localhost:3000/cloud

# 2. Select "Cloud Providers" → "Vercel"

# 3. Select project from dropdown

# 4. Click "Auto-Configure" to set up monorepo settings

# 5. Verify settings are correct:
# - Root Directory: apps/{app-name}
# - Build Command: next build
# - Include files outside root: Enabled
```

---

## Troubleshooting

### Database Connection Issues

**Problem**: Can't connect to database

**Solutions:**

1. Check `DATABASE_URL` is set correctly
2. For production: Use `connect` command to get URL from Vercel
3. Verify network/firewall allows connection
4. Test with CLI: `node scripts/ideai-db-manager.mjs status`

### Vercel API Issues

**Problem**: Can't load Vercel projects

**Solutions:**

1. Verify `VERCEL_TOKEN` is set in `.env.local`
2. Check token has correct permissions (Team scope)
3. Verify logged into Vercel CLI: `vercel login`
4. Check token is valid: `vercel whoami`

### Migration Issues

**Problem**: Migration fails

**Solutions:**

1. Check migration SQL for errors
2. Verify database connection is working
3. Test migration locally first
4. Check for conflicting migrations
5. Review migration output in UI or CLI

---

## Related Documentation

- [Database Management Guide](./database-management.md) - Complete database operations guide
- [Cloud Manager Architecture](../../architecture/cloud-manager.md) - Architecture details
- [Vercel Deployment](./vercel.md) - Vercel-specific deployment guide
- [Environment Variables](../../security/environment-variables.md) - Environment setup

---

## Future Enhancements

### Planned Features

1. **Package Management UI**
   - View all packages in monorepo
   - Update dependencies
   - Check for updates
   - Audit security vulnerabilities

2. **Deployment Management**
   - View deployment history
   - Rollback deployments
   - Monitor deployment status
   - View build logs

3. **Environment Variable Management**
   - View/edit environment variables via UI
   - Sync variables across environments
   - Validate required variables

4. **Multi-Provider Support**
   - AWS management
   - GCP management
   - Azure management
   - Hostinger management

5. **Advanced Database Features**
   - Visual schema editor
   - Query builder
   - Data export/import
   - Backup scheduling

---

**Need Help?** Check the individual guides or use `--help` flag with CLI commands.
