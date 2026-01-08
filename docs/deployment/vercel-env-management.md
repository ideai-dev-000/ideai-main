# Vercel Environment Variable Management

**Last Updated**: January 8, 2026

**CRITICAL**: This document must NEVER be deleted. It contains the standard method for managing Vercel environment variables via CLI.

## Goal: Codify Dashboard Clicks

**Primary Goal**: Cloud Manager UI should codify (automate) all manual Vercel dashboard operations.

**Strategy**:

- **Short-term**: Use CLI directly to fast-track Vercel operations
- **Long-term**: Cloud Manager UI automates all CLI operations (no more dashboard clicks)
- **Result**: No manual dashboard navigation - everything automated through Cloud Manager

**Learning Documentation Rule**:
⚠️ **MANDATORY**: Every time we use CLI for a new Vercel operation, document it here so Cloud Manager can automate it later.

---

## Standard Method: CLI-Based Environment Variable Management

**⚠️ THIS IS THE IDEAI STANDARD METHOD - NEVER FORGET THIS**

### Why CLI Method?

- ✅ **Faster**: No manual clicking in dashboard
- ✅ **Automated**: Can be scripted and automated
- ✅ **Version Control**: Can track which env vars are set
- ✅ **Reproducible**: Same command works every time
- ✅ **Bulk Operations**: Easy to set multiple variables

---

## Setting Environment Variables via CLI

### Basic Command

```bash
# Format
echo "VALUE" | vercel env add KEY_NAME ENVIRONMENT

# Example: Set DATABASE_URL for production
echo "postgresql://user:pass@host/db" | vercel env add DATABASE_URL production
```

### Set for All Environments

```bash
# Set the same value for production, preview, and development
echo "VALUE" | vercel env add KEY_NAME production
echo "VALUE" | vercel env add KEY_NAME preview
echo "VALUE" | vercel env add KEY_NAME development
```

### Extract from Local .env.local

```bash
# Extract DATABASE_URL from local config and set in Vercel
cd apps/ideai-capabilities
DB_URL=$(grep "^DATABASE_URL=" .env.local | sed 's/DATABASE_URL=//' | sed 's/^"//' | sed 's/"$//' | sed 's/\\n$//' | tr -d '\n')
echo "$DB_URL" | vercel env add DATABASE_URL production
echo "$DB_URL" | vercel env add DATABASE_URL preview
echo "$DB_URL" | vercel env add DATABASE_URL development
```

### Real Example: Setting DATABASE_URL

```bash
# Step 1: Navigate to app directory
cd apps/ideai-capabilities

# Step 2: Extract DATABASE_URL from local config
DB_URL=$(grep "^DATABASE_URL=" .env.local | sed 's/DATABASE_URL=//' | sed 's/^"//' | sed 's/"$//' | sed 's/\\n$//' | tr -d '\n')

# Step 3: Set for all environments
echo "$DB_URL" | vercel env add DATABASE_URL production
echo "$DB_URL" | vercel env add DATABASE_URL preview
echo "$DB_URL" | vercel env add DATABASE_URL development

# Step 4: Verify
vercel env ls | grep DATABASE_URL
```

---

## List Environment Variables

```bash
# List all environment variables
vercel env ls

# List for specific project (if in project directory)
cd apps/ideai-capabilities
vercel env ls
```

---

## Remove Environment Variables

```bash
# Remove from specific environment
vercel env rm KEY_NAME production

# Remove from all environments
vercel env rm KEY_NAME production
vercel env rm KEY_NAME preview
vercel env rm KEY_NAME development
```

---

## Pull Environment Variables to Local

```bash
# Pull all environment variables to .env file
vercel env pull .env.production --environment production

# Or pull all environments
vercel env pull .env.production --environment production
vercel env pull .env.preview --environment preview
```

---

## Bulk Operations

### Set Multiple Variables from .env.local

```bash
#!/bin/bash
# Script to sync all env vars from local to Vercel production

cd apps/ideai-capabilities

while IFS='=' read -r key value; do
  # Skip comments and empty lines
  [[ $key =~ ^#.*$ ]] && continue
  [[ -z "$key" ]] && continue

  # Remove quotes from value
  value=$(echo "$value" | sed 's/^"//' | sed 's/"$//' | sed 's/\\n$//')

  # Set in Vercel
  echo "$value" | vercel env add "$key" production
  echo "✓ Set $key"
done < .env.local
```

---

## Project-Specific Commands

### IdeaI Capabilities

```bash
cd apps/ideai-capabilities

# Set DATABASE_URL
DB_URL=$(grep "^DATABASE_URL=" .env.local | sed 's/DATABASE_URL=//' | sed 's/^"//' | sed 's/"$//' | tr -d '\n')
echo "$DB_URL" | vercel env add DATABASE_URL production

# Set BETTER_AUTH_SECRET
AUTH_SECRET=$(grep "^BETTER_AUTH_SECRET=" .env.local | sed 's/BETTER_AUTH_SECRET=//' | sed 's/^"//' | sed 's/"$//' | tr -d '\n')
echo "$AUTH_SECRET" | vercel env add BETTER_AUTH_SECRET production
```

---

## Automation Script

### Recommended: Create Reusable Script

**File**: `scripts/ideai-vercel-env-sync.mjs`

```javascript
/**
 * Sync environment variables from local .env.local to Vercel
 *
 * Usage:
 * node scripts/ideai-vercel-env-sync.mjs --app ideai-capabilities --env production
 */

// This script should:
// 1. Read .env.local from specified app
// 2. Extract environment variables
// 3. Set them in Vercel for specified environment(s)
// 4. Verify they were set correctly
```

**Status**: ⏳ TODO - To be implemented in Cloud Manager

---

## Common Patterns

### Pattern 1: Sync Single Variable

```bash
# Use case: Update DATABASE_URL
cd apps/ideai-capabilities
grep "^DATABASE_URL=" .env.local | cut -d'=' -f2- | sed 's/^"//' | sed 's/"$//' | vercel env add DATABASE_URL production
```

### Pattern 2: Sync All Variables

```bash
# Use case: Full environment sync
cd apps/ideai-capabilities
for var in DATABASE_URL BETTER_AUTH_SECRET BETTER_AUTH_URL; do
  value=$(grep "^$var=" .env.local | cut -d'=' -f2- | sed 's/^"//' | sed 's/"$//')
  echo "$value" | vercel env add "$var" production
done
```

### Pattern 3: Copy Between Environments

```bash
# Use case: Copy production env vars to preview
vercel env pull .env.production --environment production
# Then set from .env.production to preview
```

---

## Integration with Cloud Manager

**GOAL**: Automate all dashboard clicks - Cloud Manager UI should codify (automate) all manual Vercel dashboard operations.

**Planned Feature**: Cloud Manager UI should include:

1. **Environment Variable Management Tab**
   - View all env vars for a project
   - Set/update env vars via UI (using CLI under the hood)
   - Sync from local .env.local
   - Bulk operations

2. **Automated Sync**
   - One-click sync local .env.local → Vercel
   - Selective sync (choose which variables)
   - Environment targeting (prod/preview/dev)

3. **CLI Command Integration**
   - UI buttons trigger CLI commands (codifies dashboard clicks)
   - Show command output in UI
   - Log all operations

**Implementation Pattern**:

```typescript
// Cloud Manager UI executes CLI commands (automating dashboard clicks)
execSync(`echo "${value}" | vercel env add ${key} ${environment}`, {
  cwd: `apps/${appName}`,
  stdio: "inherit",
});
```

**Why This Matters**:

- **Short-term**: Use CLI directly to fast-track Vercel operations
- **Long-term**: Cloud Manager UI codifies all CLI operations
- **Result**: No more manual dashboard clicks - everything automated

**Status**: ⏳ TODO - See Cloud Manager tasks

**Learning Documentation Rule**: Every time we use CLI for a new operation, document it here so Cloud Manager can automate it later.

---

## Best Practices

### 1. Always Use CLI for Bulk Operations

❌ **Bad**: Manually clicking in dashboard for multiple variables
✅ **Good**: Script it using CLI commands

### 2. Extract from Local Config

❌ **Bad**: Manually copying/pasting values
✅ **Good**: Extract from `.env.local` automatically

### 3. Set for All Environments When Appropriate

```bash
# If a variable applies to all environments, set it for all
echo "$VALUE" | vercel env add KEY production
echo "$VALUE" | vercel env add KEY preview
echo "$VALUE" | vercel env add KEY development
```

### 4. Verify After Setting

```bash
# Always verify the variable was set correctly
vercel env ls | grep KEY_NAME
```

### 5. Document in Code

```bash
# Add to scripts or README:
# To sync DATABASE_URL:
#   cd apps/ideai-capabilities && \
#   grep "^DATABASE_URL=" .env.local | cut -d'=' -f2- | vercel env add DATABASE_URL production
```

---

## Troubleshooting

### Error: "unknown or unexpected option: --yes"

**Issue**: `vercel env add` doesn't support `--yes` flag

**Solution**: Use piping instead:

```bash
echo "VALUE" | vercel env add KEY production
```

### Error: "Project not found"

**Issue**: Not in correct project directory or project name mismatch

**Solution**:

```bash
# Make sure you're in the app directory
cd apps/ideai-capabilities

# Or specify project explicitly
vercel env add KEY production --scope team-name
```

### Error: "Not logged in"

**Issue**: Not authenticated with Vercel CLI

**Solution**:

```bash
vercel login
```

---

## Reference: Vercel CLI Commands

```bash
# Add environment variable
echo "VALUE" | vercel env add KEY ENVIRONMENT

# List environment variables
vercel env ls

# Remove environment variable
vercel env rm KEY ENVIRONMENT

# Pull environment variables
vercel env pull FILE --environment ENVIRONMENT

# Help
vercel env --help
```

---

## Related Documentation

- [Database Management](./database-management.md) - Database setup
- [Database Architecture](./database-architecture.md) - Architecture overview
- [Setup Production Database](./setup-production-database.md) - Production setup
- [Cloud Manager Architecture](../../architecture/cloud-manager.md) - Cloud Manager details

---

## Critical Reminder

**⚠️ THIS METHOD MUST NEVER BE FORGOTTEN**

- Always use CLI for environment variable management
- Document CLI commands in scripts and documentation
- Integrate CLI methods into Cloud Manager UI
- Never rely solely on dashboard clicks - CLI is faster and automatable

**This is an IdeaI standard practice.**
