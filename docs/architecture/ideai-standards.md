# IdeaI Development Standards

**Last Updated**: January 8, 2026

**CRITICAL**: This document contains IdeaI standards that must NEVER be forgotten. These are core practices that define how IdeaI operates.

---

## Environment Variable Management Standard

### ⚠️ CRITICAL: Vercel Environment Variables MUST Use CLI

**Standard Method**: Always use Vercel CLI for environment variable management.

**Why**:

- ✅ Faster than dashboard clicks
- ✅ Automatable and scriptable
- ✅ Reproducible across environments
- ✅ Version-controllable

**Command Pattern**:

```bash
# Extract from local .env.local and set in Vercel
cd apps/[app-name]
VALUE=$(grep "^KEY=" .env.local | cut -d'=' -f2- | sed 's/^"//' | sed 's/"$//')
echo "$VALUE" | vercel env add KEY production
```

**Real Example (DATABASE_URL)**:

```bash
cd apps/ideai-capabilities
DB_URL=$(grep "^DATABASE_URL=" .env.local | sed 's/DATABASE_URL=//' | sed 's/^"//' | sed 's/"$//' | tr -d '\n')
echo "$DB_URL" | vercel env add DATABASE_URL production
echo "$DB_URL" | vercel env add DATABASE_URL preview
echo "$DB_URL" | vercel env add DATABASE_URL development
```

**Documentation**: See `docs/deployment/vercel-env-management.md` for complete guide.

**Cloud Manager Task**: This must be integrated into Cloud Manager UI as a one-click operation.

---

## Database Management Standard

### Single Cloud Database (Current Setup)

**Standard**: Use single shared cloud database (Neon Postgres) for both local and production.

**Current Configuration**:

- **Provider**: Neon Postgres
- **Connection**: `postgresql://...@ep-cold-band-absecb56-pooler.eu-west-2.aws.neon.tech/neondb`
- **Usage**: Shared across local dev and production

**Implications**:

- Local and production share the same data
- Changes made locally immediately appear in production
- No data isolation (by design for current setup)

**Future Standard**: Database separation is planned - local and production will have separate databases.

**Documentation**: See `docs/deployment/database-architecture.md`

---

## Cloud Manager Standards

### Goal: Codify All Dashboard Clicks

**Primary Goal**: Cloud Manager UI should codify (automate) all manual Vercel dashboard operations.

**Strategy**:

- **Short-term**: Use CLI directly to fast-track Vercel operations
- **Long-term**: Cloud Manager UI automates all CLI operations
- **Result**: No more manual dashboard clicks - everything automated

### Environment Variable Management Integration

**Requirement**: Cloud Manager MUST include environment variable management that:

1. **Uses CLI Under the Hood** (Codifies Dashboard Clicks)
   - UI actions must trigger Vercel CLI commands
   - Never use manual dashboard clicks
   - All operations should be CLI-based
   - UI codifies the CLI commands

2. **Sync from Local .env.local**
   - One-click sync from local config to Vercel
   - Extract variables from `.env.local`
   - Set them in Vercel automatically

3. **Bulk Operations**
   - Set multiple variables at once
   - Set for all environments (prod/preview/dev)
   - Verify after setting

**Implementation Pattern**:

```typescript
// Cloud Manager should execute (codifying dashboard clicks):
execSync(`echo "${value}" | vercel env add ${key} ${environment}`, {
  cwd: `apps/${appName}`,
  stdio: "inherit",
});
```

**Learning Documentation Rule**:

- ⚠️ **MANDATORY**: Document every CLI operation used
- Add to `docs/deployment/vercel-env-management.md`
- Include: command, use case, why it's needed
- This ensures Cloud Manager can automate it later

**Status**: ⏳ TODO - Must be implemented

**Reference**: See `docs/deployment/vercel-env-management.md`

---

## Documentation Standards

### Never Delete Critical Method Documentation

**Files That Must Never Be Deleted**:

- `docs/deployment/vercel-env-management.md` - CLI method for env vars
- `docs/deployment/database-architecture.md` - Database setup
- `docs/architecture/ideai-standards.md` - This file (standards)

**Why**: These contain critical methods that define IdeaI's operational practices.

---

## Naming Standards

### Brand Name: IdeaI

- Always: **IdeaI** (capital I, lowercase dea, capital I)
- Never: IDEAI, Ideai, ideai, or any other variation

### File Naming: Semantic Kebab-Case

- ✅ Good: `database-manager.tsx`, `vercel-env-sync.mjs`
- ❌ Bad: `utils.ts`, `helper.js`, `component1.tsx`

---

## Code Standards

### TypeScript Strict Mode

- All functions typed
- No `any` types
- Error handling for async operations

### File Headers

All code files must include:

- `@fileoverview`: Brief description
- `@module`: Module name
- `@description`: Detailed explanation
- `@example`: Usage examples

---

## Commit Standards

**Format**:

```
type(scope): detailed subject line

Detailed explanation of what changed and why.

- Specific change 1
- Specific change 2

Related: TICKET-XXX
```

---

## Related Documentation

- [Vercel Environment Variable Management](../deployment/vercel-env-management.md) - CLI method (MUST READ)
- [Database Architecture](../deployment/database-architecture.md) - Database setup
- [Cloud Manager Architecture](./cloud-manager.md) - Cloud Manager details
- [.ideai-rules.md](../../.ideai-rules.md) - Complete rules reference

---

**Remember**: These standards define IdeaI. They must be followed and never forgotten.
