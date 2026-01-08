# Database Architecture

**Last Updated**: January 8, 2026

Complete overview of IdeaI's database architecture, current setup, and future plans.

---

## Current Architecture (January 2026)

### Single Shared Cloud Database

**Configuration**:

- **Provider**: Neon Postgres (cloud-hosted)
- **Location**: AWS eu-west-2 region
- **Connection String**: `postgresql://...@ep-cold-band-absecb56-pooler.eu-west-2.aws.neon.tech/neondb`
- **Usage**: Shared across all environments (local dev, preview, production)

**Production Deployment**:

- **Domain**: https://www.myui.space/ (and https://myui.space/)
- **Vercel Project**: `ideai-capabilities`
- **Database**: Uses same Neon cloud database (if `DATABASE_URL` is set in Vercel environment variables)

**Why This Setup**:

- ✅ Simplified initial development
- ✅ No local database setup required
- ✅ Easy testing and deployment
- ✅ Single source of truth for all data

**Configuration File**:

- `apps/ideai-capabilities/.env.local` contains the `DATABASE_URL`
- All IdeaI apps (when configured) use the same database URL
- Default fallback (`postgres://localhost:5432/workflow`) is not currently used

**Implications**:

- Local development and production share the same data
- Changes made locally immediately affect production
- No data isolation between environments
- Sync feature currently operates on the same database (validates sync process)

---

## Database Schema

### Shared Schema Across Apps

All IdeaI apps share the same database schema:

- **Users & Authentication**: `users`, `sessions`, `accounts`, `verifications`
- **Workflows**: `workflows`, `workflow_executions`, `workflow_execution_logs`
- **Integrations**: `integrations`, `api_keys`

**Benefits**:

- Unified authentication across all apps
- Shared workflow data
- Consistent user experience

**Schema Location**:

- `apps/ideai-capabilities/lib/db/schema.ts`

---

## Future Architecture (Planned)

### Separate Databases for Local and Production

**Planned Changes** (See TODOs):

- **Local Database**: Separate database for local development
- **Production Database**: Separate database for production
- **Preview Database**: Optional separate database for preview deployments
- **Sync Mechanism**: Database sync will copy data from local → production

**Benefits When Implemented**:

- ✅ Data isolation between environments
- ✅ Safe testing without affecting production
- ✅ Ability to reset local database without affecting production
- ✅ Better development workflow

**Migration Path**:

1. Create separate production database
2. Update production `DATABASE_URL` in Vercel
3. Keep local using current cloud DB or switch to local database
4. Update sync mechanism to work between separate databases
5. Test sync thoroughly before full migration

**Status**: ⏳ Planned - Not yet implemented

---

## Database Management

### Tools

- **Drizzle ORM**: Type-safe queries and migrations
- **Drizzle Studio**: Visual database browser (`pnpm db:studio`)
- **Cloud Manager UI**: Web-based management (`http://localhost:3000/cloud`)
- **CLI Tools**: `node scripts/ideai-db-manager.mjs`

### Operations

**Migrations**:

```bash
# Generate migration from schema changes
pnpm db:generate

# Run migrations
pnpm db:migrate
```

**Sync** (Current - same DB):

```bash
# Via UI: http://localhost:3000/cloud → Database → Sync
# Via CLI: node scripts/ideai-db-manager.mjs sync --target-url "DATABASE_URL"
```

**Backup**:

```bash
node scripts/ideai-db-manager.mjs backup --output backup.sql
```

---

## Connection Configuration

### Environment Variables

**Current Setup**:

```env
# apps/ideai-capabilities/.env.local
DATABASE_URL=postgresql://neondb_owner:...@ep-cold-band-absecb56-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require
```

**Production (Vercel)**:

- Same `DATABASE_URL` set in Vercel environment variables
- Accessed via: `https://vercel.com/idea-i/ideai-capabilities/settings/environment-variables`

### Connection String Format

```
postgresql://[user]:[password]@[host]:[port]/[database]?sslmode=require
```

**Current Values**:

- **Host**: `ep-cold-band-absecb56-pooler.eu-west-2.aws.neon.tech`
- **Database**: `neondb`
- **SSL**: Required (Neon enforces SSL connections)

---

## Security Considerations

### Current Setup

- **Shared Database**: All environments use the same database
- **Access Control**: Managed via Neon dashboard
- **Credentials**: Stored in environment variables (never committed)

### Future (When Separated)

- **Environment Isolation**: Separate databases per environment
- **Access Control**: Different credentials per environment
- **Network Security**: Production database may require IP whitelisting

---

## Related Documentation

- [Database Management Guide](./database-management.md) - Complete management guide
- [Database Sync Workflow](./database-sync-workflow.md) - Sync process details
- [IdeaI Management System](./ideai-management-system.md) - Unified management system

---

**Status**: This architecture reflects the current simplified setup. Database separation is planned for future implementation.
