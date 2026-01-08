# Database Management Guide

**Last Updated**: January 8, 2026

Complete guide for managing IdeaI databases both locally and in production using PostgreSQL with Drizzle ORM.

## Overview

IdeaI uses **PostgreSQL** with **Drizzle ORM** for database management.

### Current Database Setup (January 2026)

**⚠️ IMPORTANT: Currently using a single shared cloud database for both local development and production.**

- **Database Provider**: Neon Postgres (cloud-hosted)
- **Connection**: `postgresql://...@ep-cold-band-absecb56-pooler.eu-west-2.aws.neon.tech/neondb`
- **Usage**: Both local development and production deployments use the same database
- **Why**: Simplified setup for initial development - all apps connect to the same cloud database
- **Future**: Database separation (local vs production) is planned - see TODOs

**Note**: This setup means:

- ✅ No separate local database setup needed
- ✅ Local and production data share the same database
- ✅ Sync between "local" and "production" currently syncs to the same DB
- ⚠️ Changes made locally immediately affect production (they're the same DB)

### Key Features

- **Cloud Database**: Single Neon Postgres database for all environments
- **Drizzle ORM**: Type-safe database queries and migrations
- **Automatic Migrations**: Production migrations run during build
- **Dev Tools**: Drizzle Studio for visual database management
- **Super Admin Panel**: Dev-only user management interface

---

## Deployment Status

**Latest Production Deployment** (checked via Vercel CLI):

```
Status: ● Ready
URL: https://ideai-capabilities.vercel.app
Deployment ID: dpl_FhUbzXmC4NKpuHHQMnSmywDLxg2q
Created: 9 hours ago
```

**To check deployment status:**

```bash
vercel ls
vercel inspect <deployment-url>
```

---

## Database Connection

### Environment Variable

All IdeaI apps use the `DATABASE_URL` environment variable:

```env
DATABASE_URL=postgresql://user:password@host:port/database
```

**Current Configuration (Shared Cloud DB):**

```env
# Both local and production use the same Neon cloud database
DATABASE_URL=postgresql://neondb_owner:...@ep-cold-band-absecb56-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require
```

**Default Fallback (if DATABASE_URL not set):**

```env
# Only used if DATABASE_URL is not configured
DATABASE_URL=postgres://localhost:5432/workflow
```

**Note**: The fallback is not currently used - all apps are configured to use the Neon cloud database.

### Setting Up Database URL

#### Local Development

1. **Automatic Setup** (Recommended):

   ```bash
   pnpm dev:setup-env
   # or
   node scripts/ideai-develop-setup-local-env.mjs
   ```

   This interactive script will help you set up `.env.local` files with shared credentials.

2. **Manual Setup**:
   ```bash
   # In apps/ideai-capabilities/.env.local
   DATABASE_URL=postgresql://user:password@localhost:5432/workflow
   ```

#### Production (Vercel)

1. **Via Vercel Dashboard**:
   - Go to: `https://vercel.com/idea-i/ideai-capabilities/settings/environment-variables`
   - Add `DATABASE_URL` with your production database connection string
   - Select environments: Production, Preview, Development

2. **Via Vercel CLI**:
   ```bash
   vercel env add DATABASE_URL production
   # Paste your database URL when prompted
   ```

#### Getting Production DATABASE_URL

**Option 1: Vercel CLI** (Recommended)

```bash
# List all environment variables
vercel env ls ideai-capabilities --environment production

# Pull environment variables to local file
vercel env pull .env.production
# Then copy DATABASE_URL from .env.production
```

**Option 2: Vercel Dashboard**

1. Go to: `https://vercel.com/idea-i/ideai-capabilities/settings/environment-variables`
2. Find `DATABASE_URL` in Production environment
3. Click to reveal and copy the value

**Option 3: Database Provider Dashboard**

- If using a managed PostgreSQL service (Vercel Postgres, Neon, Supabase, etc.):
  - Log into your database provider dashboard
  - Find the connection string for your database
  - Copy the PostgreSQL connection string

---

## Connecting to Production Database from Local

Since you can't login to production but need to manage the database locally, you can connect directly using the production `DATABASE_URL`.

### Step 1: Get Production DATABASE_URL

```bash
# Via Vercel CLI (recommended)
vercel env pull .env.production
cat .env.production | grep DATABASE_URL

# Or check in Vercel dashboard:
# https://vercel.com/idea-i/ideai-capabilities/settings/environment-variables
```

### Step 2: Set Local Environment Variable

**Temporary (One Command):**

```bash
# Run commands with production database
DATABASE_URL="postgresql://..." pnpm db:studio
DATABASE_URL="postgresql://..." pnpm db:migrate
```

**Persistent (For Session):**

```bash
# Export in your current shell
export DATABASE_URL="postgresql://user:password@host:port/database"

# Now all commands will use production database
pnpm db:studio
pnpm db:migrate
```

**Project-Specific (Recommended):**

```bash
# Create a separate env file (never commit this!)
echo 'DATABASE_URL="postgresql://..."' > apps/ideai-capabilities/.env.production.local

# Drizzle will automatically use it if loaded
```

**⚠️ WARNING**: Never commit production database URLs to git!

### Step 3: Verify Connection

```bash
# Test connection with Drizzle Studio
cd apps/ideai-capabilities
DATABASE_URL="your-production-url" pnpm db:studio

# Or test with a simple query
node -e "
const postgres = require('postgres');
const sql = postgres(process.env.DATABASE_URL);
sql\`SELECT version()\`.then(r => console.log(r)).finally(() => sql.end());
"
```

---

## Database Management Tools

### 1. Drizzle Studio (Visual Database Browser)

Drizzle Studio provides a web-based GUI for browsing and editing your database.

**Start Drizzle Studio:**

```bash
cd apps/ideai-capabilities
pnpm db:studio
```

**Access Studio:**

- Opens automatically at: `http://localhost:4983`
- Browse tables, edit data, run queries visually

**Use Production Database:**

```bash
cd apps/ideai-capabilities
DATABASE_URL="your-production-url" pnpm db:studio
```

**Features:**

- ✅ Browse all tables
- ✅ Edit records (add, update, delete)
- ✅ View table schemas
- ✅ Run SQL queries
- ✅ Export data

### 2. Super Admin Panel (Dev-Only User Management)

The `@repo/ideai-db-manager` package provides a dev-only UI for managing users.

**⚠️ CRITICAL**: This package is **DEV-ONLY** and will not work in production (by design).

**Setup:**

1. **Create Super Admin Password:**

   ```bash
   cd packages/ideai-db-manager
   node scripts/create-password.mjs
   ```

2. **Add Password Hash to `.env.local`:**

   ```env
   SUPER_ADMIN_PASSWORD_HASH=your-hash-here
   NEXT_PUBLIC_SUPER_ADMIN_PASSWORD_HASH=your-hash-here
   ```

3. **Add Super Admin Page** (e.g., in `apps/web`):

   ```tsx
   // app/super-admin/page.tsx
   import { SuperAdminPanel } from "@repo/ideai-db-manager";

   export default function SuperAdminPage() {
     return <SuperAdminPanel />;
   }
   ```

4. **Access:**
   - Navigate to: `http://localhost:3000/super-admin`
   - Login with the password from step 1

**Features:**

- ✅ View all users
- ✅ Edit user data (name, email, etc.)
- ✅ View user details
- ✅ Secure password-protected access

**See**: [`packages/ideai-db-manager/README.md`](../../packages/ideai-db-manager/README.md) for complete documentation.

### 3. Drizzle CLI Commands

All database operations use Drizzle Kit commands:

**Available Commands:**

```bash
cd apps/ideai-capabilities

# Generate migration from schema changes
pnpm db:generate

# Run migrations (apply pending migrations)
pnpm db:migrate

# Push schema changes directly (dev-only, bypasses migrations)
pnpm db:push

# Open Drizzle Studio (visual database browser)
pnpm db:studio
```

---

## Database Migrations

### How Migrations Work

1. **Schema Changes**: Edit `lib/db/schema.ts`
2. **Generate Migration**: `pnpm db:generate` creates SQL migration files
3. **Review Migration**: Check generated SQL in `drizzle/` directory
4. **Apply Migration**: `pnpm db:migrate` runs the migration

### Local Development Workflow

```bash
cd apps/ideai-capabilities

# 1. Edit schema
# Edit apps/ideai-capabilities/lib/db/schema.ts

# 2. Generate migration
pnpm db:generate

# 3. Review generated SQL
# Check apps/ideai-capabilities/drizzle/XXXX_migration_name.sql

# 4. Apply migration locally
pnpm db:migrate

# 5. Verify in Drizzle Studio
pnpm db:studio
```

### Production Migrations

**Automatic (During Build):**

Production migrations run automatically during build via `scripts/migrate-prod.ts`:

```typescript
// Runs if VERCEL_ENV === "production" && DATABASE_URL is set
if (VERCEL_ENV === "production" && DATABASE_URL) {
  execSync("pnpm db:migrate", { stdio: "inherit" });
}
```

**Manual (If Needed):**

If you need to run migrations manually in production:

```bash
# Connect to production database
export DATABASE_URL="your-production-url"

# Run migrations
cd apps/ideai-capabilities
pnpm db:migrate
```

**⚠️ IMPORTANT**:

- Always test migrations locally first
- Review generated SQL before applying to production
- Consider backing up production database before major migrations

### Migration Files

Migrations are stored in:

```
apps/ideai-capabilities/drizzle/
├── 0000_easy_supernaut.sql
├── 0001_dark_human_cannonball.sql
├── 0002_icy_otto_octavius.sql
├── ...
└── meta/
    ├── _journal.json
    └── XXXX_snapshot.json
```

**Never edit migration files manually** - always regenerate with `pnpm db:generate` after schema changes.

---

## Database Schema

### Core Tables

All IdeaI apps share these core tables:

**Authentication Tables:**

- `users` - User accounts (email, name, image, etc.)
- `sessions` - Active user sessions
- `accounts` - OAuth provider accounts (GitHub, Google, etc.)
- `verifications` - Email verification tokens

**Workflow Tables:**

- `workflows` - User workflows (linked via `userId`)
- `workflow_executions` - Workflow run history
- `workflow_execution_logs` - Detailed execution logs

**Integration Tables:**

- `integrations` - User API keys and credentials
- `api_keys` - User API keys

### Schema Location

**Schema Definition:**

```
apps/ideai-capabilities/lib/db/schema.ts
```

**Database Client:**

```
apps/ideai-capabilities/lib/db/index.ts
```

### Viewing Schema

**Option 1: Drizzle Studio**

```bash
pnpm db:studio
# Browse tables visually
```

**Option 2: Schema File**

```bash
cat apps/ideai-capabilities/lib/db/schema.ts
```

**Option 3: Database Directly**

```bash
# Connect to database and list tables
psql $DATABASE_URL -c "\dt"
```

---

## Common Database Operations

### View All Users

**Via Drizzle Studio:**

```bash
pnpm db:studio
# Navigate to "users" table
```

**Via SQL:**

```bash
psql $DATABASE_URL -c "SELECT id, name, email, created_at FROM users;"
```

**Via Super Admin Panel:**

```
http://localhost:3000/super-admin
```

### View All Workflows

**Via Drizzle Studio:**

```bash
pnpm db:studio
# Navigate to "workflows" table
```

**Via SQL:**

```bash
psql $DATABASE_URL -c "SELECT id, name, user_id, created_at FROM workflows;"
```

### Check Database Size

```bash
psql $DATABASE_URL -c "
SELECT
  pg_size_pretty(pg_database_size(current_database())) as database_size;
"
```

### List All Tables

```bash
psql $DATABASE_URL -c "\dt"
```

### Count Records in Tables

```bash
psql $DATABASE_URL -c "
SELECT
  'users' as table_name, COUNT(*) as count FROM users
UNION ALL
SELECT
  'workflows', COUNT(*) FROM workflows
UNION ALL
SELECT
  'sessions', COUNT(*) FROM sessions;
"
```

### Backup Database

**Full Backup:**

```bash
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d_%H%M%S).sql
```

**Schema Only:**

```bash
pg_dump $DATABASE_URL --schema-only > schema_backup.sql
```

**Data Only:**

```bash
pg_dump $DATABASE_URL --data-only > data_backup.sql
```

### Restore Database

```bash
psql $DATABASE_URL < backup_20260108_120000.sql
```

---

## Troubleshooting

### Connection Issues

**Problem**: Can't connect to database

**Solutions:**

1. **Check DATABASE_URL format:**

   ```bash
   echo $DATABASE_URL
   # Should be: postgresql://user:password@host:port/database
   ```

2. **Test connection:**

   ```bash
   psql $DATABASE_URL -c "SELECT version();"
   ```

3. **Check firewall/network:**
   - Production databases may require IP whitelisting
   - Check database provider's connection settings

4. **Verify credentials:**
   - Check Vercel dashboard for correct `DATABASE_URL`
   - Verify password hasn't expired (some providers rotate passwords)

### Migration Issues

**Problem**: Migration fails

**Solutions:**

1. **Check migration SQL:**

   ```bash
   cat apps/ideai-capabilities/drizzle/XXXX_migration_name.sql
   ```

2. **Run migration manually:**

   ```bash
   psql $DATABASE_URL -f apps/ideai-capabilities/drizzle/XXXX_migration_name.sql
   ```

3. **Check for conflicts:**
   - Ensure no other migrations are running
   - Verify schema is up to date

4. **Rollback (if needed):**
   - Restore from backup if migration broke database
   - Fix schema and regenerate migration

### Drizzle Studio Not Starting

**Problem**: `pnpm db:studio` fails

**Solutions:**

1. **Check DATABASE_URL:**

   ```bash
   echo $DATABASE_URL
   ```

2. **Check port availability:**
   - Default port is 4983
   - Kill process if port in use: `lsof -ti:4983 | xargs kill`

3. **Check drizzle.config.ts:**
   ```bash
   cat apps/ideai-capabilities/drizzle.config.ts
   ```

### Production Migration Not Running

**Problem**: Migrations don't run in production build

**Solutions:**

1. **Check build logs:**

   ```bash
   vercel logs <deployment-url>
   ```

2. **Verify environment variables:**
   - Ensure `DATABASE_URL` is set in Vercel
   - Check `VERCEL_ENV` is set to "production"

3. **Run migration manually:**
   ```bash
   # Connect to production and run manually
   export DATABASE_URL="your-production-url"
   cd apps/ideai-capabilities
   pnpm db:migrate
   ```

---

## Security Best Practices

### ⚠️ CRITICAL Rules

1. **Never commit DATABASE_URL to git**
   - Always use `.env.local` (in `.gitignore`)
   - Use Vercel dashboard for production secrets

2. **Never share production database credentials**
   - Use environment variables only
   - Rotate credentials if exposed

3. **Always backup before migrations**

   ```bash
   pg_dump $DATABASE_URL > backup_before_migration.sql
   ```

4. **Test migrations locally first**
   - Never run untested migrations in production
   - Review generated SQL carefully

5. **Use read-only connections when possible**
   - For reporting/analytics
   - Separate read/write credentials if available

6. **Limit production database access**
   - Only connect when necessary
   - Use connection pooling for production
   - Monitor connection counts

---

## Quick Reference

### Essential Commands

```bash
# Connect to production database locally
vercel env pull .env.production
export DATABASE_URL=$(grep DATABASE_URL .env.production | cut -d '=' -f2-)

# Open Drizzle Studio
cd apps/ideai-capabilities
pnpm db:studio

# Run migrations
pnpm db:migrate

# Generate migration from schema changes
pnpm db:generate

# Push schema directly (dev-only)
pnpm db:push

# View database tables
psql $DATABASE_URL -c "\dt"

# Backup database
pg_dump $DATABASE_URL > backup.sql
```

### Important Files

- **Schema**: `apps/ideai-capabilities/lib/db/schema.ts`
- **Database Client**: `apps/ideai-capabilities/lib/db/index.ts`
- **Drizzle Config**: `apps/ideai-capabilities/drizzle.config.ts`
- **Migrations**: `apps/ideai-capabilities/drizzle/*.sql`
- **Migration Script**: `apps/ideai-capabilities/scripts/migrate-prod.ts`

### Useful URLs

- **Vercel Dashboard**: `https://vercel.com/idea-i/ideai-capabilities/settings/environment-variables`
- **Drizzle Studio**: `http://localhost:4983` (when running)
- **Super Admin Panel**: `http://localhost:3000/super-admin` (dev-only)

---

## Related Documentation

- [Unified Auth System](../../architecture/unified-auth-system.md) - How shared database enables unified auth
- [Environment Variables](../../security/environment-variables.md) - Complete env var guide
- [DB Manager Package](../../packages/ideai-db-manager/README.md) - Super admin panel documentation
- [Deployment Status](./DEPLOYMENT-STATUS.md) - Current deployment information

---

**Need Help?** Check build logs, migration files, or database connection strings if you encounter issues.
