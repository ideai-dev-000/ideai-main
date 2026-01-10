# Capability App Auth Migration Plan

**Status**: In Progress  
**Date**: 2025-01-XX  
**Goal**: Migrate capability app to use shared auth from `@repo/ideai-user`

---

## Migration Overview

Migrate `apps/capability2.0` from local auth to shared auth system, then extend shared auth with capability-specific features.

---

## Phase 1: Migrate Capability to Shared Auth

### Step 1.1: Update Auth Imports

**File**: `apps/capability2.0/lib/auth.ts`

- Replace local `betterAuth` config with re-export from shared
- Temporarily note missing features (Vercel OAuth, anonymous migration)

**Changes**:

```typescript
// OLD
import { betterAuth } from "better-auth";
// ... local config

// NEW
export { auth } from "@repo/ideai-user/auth";
// Note: Vercel OAuth and anonymous migration will be added in Phase 2
```

### Step 1.2: Update Auth Client

**File**: `apps/capability2.0/lib/auth-client.ts`

- Replace local auth client with shared one

**Changes**:

```typescript
// OLD
import { createAuthClient } from "better-auth/react";
// ... local config

// NEW
export {
  authClient,
  signIn,
  signOut,
  signUp,
  useSession,
} from "@repo/ideai-user/auth-client";
```

### Step 1.3: Update All Auth References

**Files to update**:

- `apps/capability2.0/middleware.ts` - Update auth import
- All components using `useSession` - Update import
- All API routes using `auth.api.*` - Update import

### Step 1.4: Update Database Imports (if needed)

**Files**: Any files using local schema

- Update to use shared schema from `@repo/ideai-user/schema`
- Check table name compatibility

### Step 1.5: Test Basic Auth

- ✅ Login/logout
- ✅ GitHub OAuth
- ✅ Google OAuth
- ⚠️ Vercel OAuth (will be broken until Phase 2)
- ⚠️ Anonymous migration (will be broken until Phase 2)

---

## Phase 2: Extend Shared Auth - Vercel OAuth

### Step 2.1: Add Vercel OAuth to Shared Auth

**File**: `packages/ideai-user/src/lib/auth.ts`

- Add `genericOAuth` plugin with Vercel configuration
- Copy logic from capability app's auth.ts

**Changes**:

```typescript
import { genericOAuth } from "better-auth/plugins";

const plugins = [
  anonymous(),
  ...(process.env.VERCEL_CLIENT_ID
    ? [
        genericOAuth({
          config: [
            {
              providerId: "vercel",
              clientId: process.env.VERCEL_CLIENT_ID,
              clientSecret: process.env.VERCEL_CLIENT_SECRET || "",
              // ... rest of config
            },
          ],
        }),
      ]
    : []),
];
```

### Step 2.2: Test Vercel OAuth

- ✅ Vercel OAuth login works
- ✅ Vercel account linking works

---

## Phase 3: Extend Shared Auth - Anonymous Migration

### Step 3.1: Add Anonymous Migration Logic

**File**: `packages/ideai-user/src/lib/auth.ts`

- Add `onLinkAccount` handler to anonymous plugin
- Migrate workflows, executions, integrations when anonymous user signs up

**Changes**:

```typescript
import { db } from "./db";
import {
  workflows,
  workflowExecutions,
  workflowIntegrations,
} from "./db/schema";
import { eq } from "drizzle-orm";

anonymous({
  async onLinkAccount(data) {
    const fromUserId = data.anonymousUser.user.id;
    const toUserId = data.newUser.user.id;

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
});
```

### Step 3.2: Test Anonymous Migration

- ✅ Create workflow as anonymous user
- ✅ Sign up/log in
- ✅ Workflow migrates to real account
- ✅ Workflow executions migrate
- ✅ Integrations migrate

---

## Files to Modify

### Phase 1: Capability Migration

1. `apps/capability2.0/lib/auth.ts` - Replace with re-export
2. `apps/capability2.0/lib/auth-client.ts` - Replace with shared client
3. `apps/capability2.0/middleware.ts` - Update auth import
4. `apps/capability2.0/app/api/auth/[...all]/route.ts` - Update auth import
5. All components using `useSession` - Update imports
6. All API routes using `auth.api.*` - Update imports

### Phase 2: Vercel OAuth

1. `packages/ideai-user/src/lib/auth.ts` - Add Vercel OAuth plugin

### Phase 3: Anonymous Migration

1. `packages/ideai-user/src/lib/auth.ts` - Add migration logic

---

## Testing Checklist

### Phase 1 Tests

- [ ] Login with email/password
- [ ] Logout
- [ ] GitHub OAuth login
- [ ] Google OAuth login
- [ ] Session persistence
- [ ] Protected routes work
- [ ] Anonymous access works

### Phase 2 Tests

- [ ] Vercel OAuth login
- [ ] Vercel account linking
- [ ] Vercel integration works

### Phase 3 Tests

- [ ] Create workflow as anonymous
- [ ] Create execution as anonymous
- [ ] Create integration as anonymous
- [ ] Sign up/log in
- [ ] Verify data migrated
- [ ] Verify old anonymous user deleted

---

## Rollback Plan

If migration fails:

1. Revert commits in reverse order
2. Restore local auth files from git history
3. Restore environment variables if changed

---

## Notes

- Capability app will temporarily lose Vercel OAuth and anonymous migration in Phase 1
- These features will be restored in Phases 2 and 3
- All commits should be atomic and testable
