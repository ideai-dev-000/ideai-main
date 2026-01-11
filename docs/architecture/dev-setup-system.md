# Dev Setup System Architecture

## Overview

Automated dev setup validation system integrated into `@repo/cloud-manager`. Ensures zero setup issues for new developers and reduces onboarding complexity.

## Components

### 1. Dev Setup Checker (`packages/cloud-manager/src/dev-setup-checker.ts`)

Core validation logic that checks:

- Database migrations (user_service_keys table)
- Auth configuration (BETTER_AUTH_SECRET, BETTER_AUTH_URL)
- Service keys setup (has user configured keys)
- Environment variables (fallback keys)
- Key sync CLI setup (IDEAI_USER_ID configured)

**Exports:**

- `runSetupChecks(userId?)`: Main function to run all checks
- `SetupCheckResult`: Type for individual check results
- `SetupStatus`: Type for overall status

### 2. API Endpoints (`apps/ideai-capabilities/app/api/dev-setup/`)

- **GET `/api/dev-setup/check`**: Returns setup status
- **POST `/api/dev-setup/migrate`**: Runs database migration (authenticated)

### 3. UI Page (`apps/ideai-capabilities/app/dev-setup/page.tsx`)

Visual setup checker with:

- Real-time status display
- Auto-fix migration button
- Inline fix steps
- Link to service keys management

### 4. CLI Tool (`scripts/ideai-dev-setup.mjs`)

Command-line interface:

- `pnpm dev-setup check`: Run checks (via API)
- `pnpm dev-setup migrate`: Run database migration

## Integration Points

### Cloud Manager Package

The dev setup checker is exported from `@repo/cloud-manager`:

```typescript
export * from "./dev-setup-checker";
```

This ensures:

- **Zero bloat**: Reuses existing cloud infrastructure
- **Reduced complexity**: Single source of truth
- **Consistency**: Same checks across all IdeaI apps

### Auth System

Integrated with `@repo/ideai-user/auth`:

- Checks user session for service keys validation
- Requires authentication for migration endpoint
- Gracefully handles unauthenticated state (skip checks)

### Database

Uses existing Drizzle ORM setup:

- Checks for `user_service_keys` table existence
- Can run migrations via `drizzle-kit push`
- Handles connection errors gracefully

## Workflow

### For New Developers

1. Clone repo → `pnpm install`
2. Configure `.env.local`
3. Run `pnpm dev-setup check` OR visit `/dev-setup`
4. Fix any failures (auto-fix available for migrations)
5. Start developing

### During Development

- Setup check can be run anytime via CLI or UI
- Migration check ensures schema is up-to-date
- Service keys check verifies API access

## Design Principles

1. **Zero Bloat**: Leverages existing infrastructure
2. **Reduce Complexity**: Single source of truth for validation
3. **Self-Service**: Auto-fix where possible, clear instructions otherwise
4. **Graceful Degradation**: Works even if database unavailable (local mode)
5. **Developer-Friendly**: Clear status, actionable fix steps

## Future Enhancements

- [ ] Auto-run on first app start
- [ ] Integration into CI/CD pipeline
- [ ] Team-wide setup dashboard
- [ ] Auto-fix for all issues (currently only migration)
- [ ] Setup checklist export for documentation

## Files

- `packages/cloud-manager/src/dev-setup-checker.ts` - Core checker logic
- `apps/ideai-capabilities/app/api/dev-setup/check/route.ts` - Check API
- `apps/ideai-capabilities/app/api/dev-setup/migrate/route.ts` - Migration API
- `apps/ideai-capabilities/app/dev-setup/page.tsx` - UI page
- `scripts/ideai-dev-setup.mjs` - CLI tool
- `docs/onboarding/dev-setup-guide.md` - User guide
