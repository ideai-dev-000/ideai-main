# Auth Compatibility Analysis: Capability App → Shared Auth

**Status**: Analysis in progress  
**Date**: 2025-01-XX  
**Goal**: Migrate capability app to shared auth, enabling combination of workflows + vibecoder as modules

---

## Executive Summary

**✅ YES - Capability app CAN be made compatible with shared auth**

Both apps already use:

- Better Auth library
- Same database structure (users, sessions, accounts, verifications)
- Anonymous auth support
- OAuth providers (GitHub, Google)

**Key Requirements**:

1. Extend shared auth to support Vercel OAuth (capability-specific)
2. Add anonymous migration logic (workflows/integrations)
3. Align database table names (minor differences)
4. Migrate capability to use shared auth

---

## Current State

### Capability App Auth (`apps/capability2.0/lib/auth.ts`)

- ✅ Better Auth with drizzle adapter
- ✅ Anonymous plugin with **custom migration logic**
- ✅ Vercel OAuth via `genericOAuth` plugin
- ✅ GitHub/Google OAuth
- ✅ Local database connection
- ✅ Base URL detection for Vercel

**Custom Features**:

- Anonymous migration: Migrates workflows, executions, integrations when anonymous user signs up
- Vercel OAuth: Custom OAuth provider for Vercel integration

### Shared Auth (`packages/ideai-user/src/lib/auth.ts`)

- ✅ Better Auth with drizzle adapter
- ✅ Anonymous plugin (no migration logic)
- ❌ No Vercel OAuth support
- ✅ GitHub/Google OAuth
- ✅ Unified database connection
- ✅ Base URL detection for Vercel

### Vibecoder App

- ✅ Uses shared auth (`@repo/ideai-user/auth`)
- ✅ Unified database
- ✅ Working with shared sessions

---

## Database Schema Comparison

### Core Auth Tables (✅ Compatible)

| Table           | Capability | Shared | Status     |
| --------------- | ---------- | ------ | ---------- |
| `users`         | ✅         | ✅     | Compatible |
| `sessions`      | ✅         | ✅     | Compatible |
| `accounts`      | ✅         | ✅     | Compatible |
| `verifications` | ✅         | ✅     | Compatible |

### Capability Tables

| Table                     | Capability | Shared                  | Status          |
| ------------------------- | ---------- | ----------------------- | --------------- |
| `workflows`               | ✅         | ✅                      | Compatible      |
| `workflow_executions`     | ✅         | ✅                      | Compatible      |
| `workflow_execution_logs` | ✅         | ✅                      | Compatible      |
| `integrations`            | ✅         | `workflow_integrations` | ⚠️ Name differs |
| `api_keys`                | ✅         | `workflow_api_keys`     | ⚠️ Name differs |

### Vibecoder Tables

| Table                 | Vibecoder (local) | Shared                 | Status          |
| --------------------- | ----------------- | ---------------------- | --------------- |
| `chat_ownerships`     | ✅                | `code_chat_ownerships` | ⚠️ Name differs |
| `anonymous_chat_logs` | ✅                | `code_anonymous_logs`  | ⚠️ Name differs |

**Note**: Both apps use the **same database** (unified DATABASE_URL), so table names must align.

---

## Required Changes

### 1. Extend Shared Auth - Vercel OAuth ⚠️ HIGH PRIORITY

**What**: Add Vercel OAuth support to shared auth

**Why**: Capability app uses Vercel OAuth for deployments

**How**:

```typescript
// packages/ideai-user/src/lib/auth.ts
const plugins = [
  anonymous(),
  // Add Vercel OAuth conditionally
  ...(process.env.VERCEL_CLIENT_ID
    ? [
        genericOAuth({
          config: [
            {
              providerId: "vercel",
              clientId: process.env.VERCEL_CLIENT_ID,
              clientSecret: process.env.VERCEL_CLIENT_SECRET || "",
              authorizationUrl: "https://vercel.com/oauth/authorize",
              tokenUrl: "https://api.vercel.com/login/oauth/token",
              userInfoUrl: "https://api.vercel.com/login/oauth/userinfo",
              scopes: ["openid", "email", "profile"],
              pkce: true,
              getUserInfo: async (tokens) => {
                // ... existing logic from capability app
              },
            },
          ],
        }),
      ]
    : []),
];
```

**Impact**: Low - Only enabled if env vars present

---

### 2. Extend Shared Auth - Anonymous Migration ⚠️ HIGH PRIORITY

**What**: Add anonymous migration logic to shared auth

**Why**: Capability app needs to migrate workflows/integrations when anonymous users sign up

**How**:

```typescript
// packages/ideai-user/src/lib/auth.ts
const plugins = [
  anonymous({
    async onLinkAccount(data) {
      // When anonymous user links to real account, migrate data
      const fromUserId = data.anonymousUser.user.id;
      const toUserId = data.newUser.user.id;

      // Import db and schema from shared package
      import { db } from "./db";
      import {
        workflows,
        workflowExecutions,
        workflowIntegrations,
      } from "./db/schema";
      import { eq } from "drizzle-orm";

      // Migrate workflows
      await db
        .update(workflows)
        .set({ userId: toUserId })
        .where(eq(workflows.userId, fromUserId));

      // Migrate workflow executions
      await db
        .update(workflowExecutions)
        .set({ userId: toUserId })
        .where(eq(workflowExecutions.userId, fromUserId));

      // Migrate workflow integrations
      await db
        .update(workflowIntegrations)
        .set({ userId: toUserId })
        .where(eq(workflowIntegrations.userId, fromUserId));
    },
  }),
];
```

**Impact**: Medium - Affects anonymous signup flow

---

### 3. Align Database Table Names ⚠️ MEDIUM PRIORITY

**Options**:

**Option A: Migrate Capability to Shared Names** (Recommended)

- Rename `integrations` → `workflow_integrations`
- Rename `api_keys` → `workflow_api_keys`
- Update all queries in capability app
- Create migration script

**Option B: Keep Both Tables** (Not Recommended)

- Creates confusion and duplication

**Option C: Use Views** (Complex)

- Create views to map old names to new names
- More complex to maintain

**Recommendation**: **Option A** - Migrate to shared names for consistency

---

### 4. Migrate Capability to Shared Auth ⚠️ HIGH PRIORITY

**Steps**:

1. Update `apps/capability2.0/lib/auth.ts`:

   ```typescript
   // OLD
   export const auth = betterAuth({ ... });

   // NEW
   export { auth } from "@repo/ideai-user/auth";
   ```

2. Update `apps/capability2.0/lib/auth-client.ts`:

   ```typescript
   // Use shared auth client
   export {
     authClient,
     signIn,
     signOut,
     signUp,
     useSession,
   } from "@repo/ideai-user/auth-client";
   ```

3. Update imports across capability app:
   - Replace `@/lib/auth` → `@repo/ideai-user/auth`
   - Replace `@/lib/auth-client` → `@repo/ideai-user/auth-client`
   - Update database queries to use shared schema

4. Test:
   - Login/logout
   - OAuth flows (GitHub, Google, Vercel)
   - Anonymous signup with migration
   - Workflow creation/execution
   - Integration management

---

## Migration Plan

### Phase 1: Extend Shared Auth ✅ Ready

1. Add Vercel OAuth support to shared auth
2. Add anonymous migration logic to shared auth
3. Test shared auth with both features

### Phase 2: Align Database Schemas ⚠️ Required First

1. Decide on table naming strategy (Option A recommended)
2. Create migration script to rename tables
3. Update all queries in capability app
4. Update shared schema if needed

### Phase 3: Migrate Capability ⚠️ After Phase 2

1. Update capability auth imports
2. Update database imports (use shared schema)
3. Update all auth references
4. Test thoroughly

### Phase 4: Combine Apps (Future) 🎯 Goal

1. Create unified app with workflows + vibecoder modules
2. Use shared auth for both modules
3. Share user accounts and sessions
4. Unified navigation and UI

---

## Benefits of Migration

1. **Shared Sessions**: Users logged into workflows can access vibecoder without re-login
2. **Unified User Accounts**: One account for all IdeaI capabilities
3. **Easier Maintenance**: One auth system to maintain
4. **Better UX**: Seamless experience across modules
5. **Future Expansion**: Easy to add more modules (e.g., ideai-designer)

---

## Risks & Mitigation

| Risk                              | Impact | Mitigation                             |
| --------------------------------- | ------ | -------------------------------------- |
| Breaking existing capability auth | High   | Thorough testing, gradual rollout      |
| Table name conflicts              | Medium | Migrate tables before switching auth   |
| Vercel OAuth not working          | Medium | Test Vercel OAuth in shared auth first |
| Anonymous migration breaking      | Medium | Test migration logic thoroughly        |

---

## Next Steps

1. ✅ **Analyze compatibility** (this document)
2. ⏳ **Extend shared auth** with Vercel OAuth + migration
3. ⏳ **Align database schemas** (rename tables)
4. ⏳ **Migrate capability** to shared auth
5. ⏳ **Test thoroughly** (all flows)
6. ⏳ **Combine apps** as modules (future)

---

## References

- [Capability Auth](./apps/capability2.0/lib/auth.ts)
- [Shared Auth](./packages/ideai-user/src/lib/auth.ts)
- [Shared Schema](./packages/ideai-user/src/lib/db/schema.ts)
- [Capability Schema](./apps/capability2.0/lib/db/schema.ts)
