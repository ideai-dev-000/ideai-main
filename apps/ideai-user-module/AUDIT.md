# IdeaI Centralized User Module - Audit Report

**Date**: January 10, 2026  
**Status**: Initial Audit Complete  
**Purpose**: Document current auth/user/access patterns to design centralized module

---

## Executive Summary

Both **ideai-capabilities** (workflows) and **ideai-vibecoder** (code generation) use identical authentication systems but have separate databases and duplicate code. This audit identifies all patterns needed for a centralized user module that can support both apps as modular capabilities.

---

## 1. Authentication System Audit

### 1.1 Technology Stack

- **Auth Library**: Better Auth
- **Database**: PostgreSQL (via Drizzle ORM)
- **Auth Methods**:
  - Email/Password
  - GitHub OAuth
  - Google OAuth
  - Anonymous sessions (temporary users)

### 1.2 Common Auth Tables (Both Apps Identical)

#### `users` Table

```typescript
{
  id: string (primary key)
  name: string | null
  email: string (unique, nullable)
  emailVerified: boolean (default: false)
  image: string | null (profile picture URL)
  createdAt: timestamp
  updatedAt: timestamp
  isAnonymous: boolean (default: false) // Critical for temporary users
}
```

#### `sessions` Table

```typescript
{
  id: string (primary key)
  expiresAt: timestamp
  token: string (unique)
  createdAt: timestamp
  updatedAt: timestamp
  ipAddress: string | null
  userAgent: string | null
  userId: string (references users.id)
}
```

#### `accounts` Table

```typescript
{
  id: string (primary key)
  accountId: string (provider's user ID)
  providerId: string (e.g., "github", "google", "credential")
  userId: string (references users.id)
  accessToken: string | null
  refreshToken: string | null
  idToken: string | null
  accessTokenExpiresAt: timestamp | null
  refreshTokenExpiresAt: timestamp | null
  scope: string | null
  password: string | null (hashed, for email/password)
  createdAt: timestamp
  updatedAt: timestamp
}
```

#### `verifications` Table

```typescript
{
  id: string (primary key)
  identifier: string (email/phone)
  value: string (verification code)
  expiresAt: timestamp
  createdAt: timestamp
  updatedAt: timestamp
}
```

### 1.3 Auth Configuration Patterns

Both apps use identical configuration patterns:

1. **Base URL Detection** (priority order):
   - `BETTER_AUTH_URL` (explicit)
   - `NEXT_PUBLIC_APP_URL`
   - `VERCEL_URL` (for preview deployments)
   - Fallback to app-specific port (3018 or 3020)

2. **Plugins**:
   - Anonymous auth (enables temporary users)
   - Generic OAuth (GitHub, Google)

3. **Client-Side Hook**:
   - Both export `useSession()` hook
   - Both support anonymous client plugin
   - Session state synced across app

---

## 2. App-Specific Tables (Capability Modules)

### 2.1 IdeaI Capabilities (Workflows Module)

#### `workflows` Table

```typescript
{
  id: string (primary key, auto-generated)
  name: string
  description: string | null
  userId: string (references users.id) // Owner
  nodes: jsonb (array of workflow nodes)
  edges: jsonb (array of workflow edges)
  visibility: "private" | "public"
  createdAt: timestamp
  updatedAt: timestamp
}
```

#### `workflow_executions` Table

```typescript
{
  id: string (primary key)
  workflowId: string (references workflows.id)
  userId: string (references users.id) // Who executed it
  status: "pending" | "running" | "success" | "error" | "cancelled"
  input: jsonb (input data)
  output: jsonb (result data)
  error: string | null
  startedAt: timestamp
  completedAt: timestamp | null
  duration: string | null (milliseconds)
}
```

#### `workflow_execution_logs` Table

```typescript
{
  id: string (primary key)
  executionId: string (references workflow_executions.id)
  nodeId: string
  nodeName: string
  nodeType: string
  status: "pending" | "running" | "success" | "error"
  input: jsonb
  output: jsonb
  error: string | null
  startedAt: timestamp
  completedAt: timestamp | null
  duration: string | null
  timestamp: timestamp
}
```

#### `integrations` Table

```typescript
{
  id: string (primary key)
  userId: string (references users.id) // Credential owner
  name: string (display name)
  type: IntegrationType (e.g., "slack", "linear", "github")
  config: jsonb (encrypted credentials)
  isManaged: boolean (OAuth vs manual)
  createdAt: timestamp
  updatedAt: timestamp
}
```

#### `api_keys` Table

```typescript
{
  id: string (primary key)
  userId: string (references users.id) // Key owner
  name: string | null (label)
  keyHash: string (hashed key)
  keyPrefix: string (first few chars for display)
  createdAt: timestamp
  lastUsedAt: timestamp | null
}
```

### 2.2 IdeaI Vibecoder (Code Generation Module)

#### `chat_ownerships` Table

```typescript
{
  id: string (primary key)
  v0_chat_id: string (unique, from v0 SDK)
  user_id: string (references users.id) // Owner
  created_at: timestamp
}
```

#### `anonymous_chat_logs` Table

```typescript
{
  id: string (primary key)
  ip_address: string (for rate limiting)
  v0_chat_id: string
  created_at: timestamp
}
```

**Note**: Vibecoder previously had `project_ownerships` table but it was removed (migration 0002).

---

## 3. Access Control Patterns

### 3.1 Ownership Pattern

- **All user data tables include `userId` field**
- Pattern: `user_id` or `userId` (snake_case vs camelCase inconsistency)
- **Standardize**: Use `userId` (camelCase) for consistency

### 3.2 Anonymous User Support

- Both apps support anonymous users via `isAnonymous` flag
- Anonymous users have temporary sessions
- Can be converted to authenticated users later
- Used for "try before sign up" flow

### 3.3 Visibility/Sharing

- Workflows have `visibility: "private" | "public"`
- Code projects (in vibecoder) appear to be private-only
- **Future**: Need sharing/collaboration patterns

### 3.4 API Key Authentication

- Workflows module supports API keys for webhook authentication
- Pattern: Hash storage + prefix display
- Used for programmatic access without sessions

---

## 4. Shared UI Components

### 4.1 Header Components (Both Apps)

- Both use IdeaI branding
- Both have theme toggle
- Both have user menu
- Both have mobile navigation

**Pattern to Extract**:

```typescript
<IdeAIHeader
  siteName="Capabilities" | "Vibecoder"
  navItems={[...]}
  userMenu={UserMenu}
/>
```

### 4.2 Auth Components

- AuthDialog (sign in/sign up modal)
- UserMenu (profile dropdown)
- Session provider wrapper

---

## 5. Database Schema Patterns

### 5.1 Common Patterns Identified

1. **Primary Keys**: All use `text` type with custom ID generation
2. **Timestamps**: All tables have `createdAt` and `updatedAt`
3. **User References**: All capability tables reference `users.id`
4. **JSONB Usage**: Flexible data stored as JSONB (nodes, edges, config, input/output)
5. **Soft Deletes**: Not currently implemented (consider adding `deletedAt`)

### 5.2 Semantic Naming Conventions

**Current Inconsistencies**:

- `userId` vs `user_id` (mixed camelCase/snake_case)
- Table names: `workflow_executions` vs `chat_ownerships` (inconsistent)

**Recommended Standard**:

- Tables: snake_case (`workflows`, `workflow_executions`, `code_projects`)
- Fields: camelCase (`userId`, `createdAt`, `workflowId`)
- Relations: camelCase (`user`, `workflow`, `execution`)

---

## 6. Required Centralized Module Structure

### 6.1 Core User Module (`@repo/ideai-user`)

**Tables**:

- `users` (core user data)
- `sessions` (auth sessions)
- `accounts` (OAuth/linked accounts)
- `verifications` (email/phone verification)
- `user_preferences` (new - user settings)
- `user_roles` (new - for future RBAC)
- `user_permissions` (new - for future fine-grained access)

**Services**:

- Auth service (Better Auth wrapper)
- User service (CRUD operations)
- Session service (session management)
- Permission service (access control)

### 6.2 Capability Module Pattern

Each capability (workflows, vibecoder, etc.) will have:

**Tables**:

- `{capability}_items` (e.g., `workflows`, `code_projects`)
- `{capability}_executions` (e.g., `workflow_executions`, `code_runs`)
- `{capability}_logs` (optional - execution logs)
- `{capability}_integrations` (optional - capability-specific integrations)

**Pattern**:

```typescript
{
  id: string
  userId: string (references users.id)
  name: string
  // ... capability-specific fields
  visibility: "private" | "public" | "team"
  createdAt: timestamp
  updatedAt: timestamp
}
```

### 6.3 Boilerplate Table (`capability_registry`)

For dynamic capability discovery:

```typescript
{
  id: string
  capabilityKey: string (e.g., "workflows", "vibecoder")
  capabilityName: string (display name)
  description: string
  enabled: boolean
  schema: jsonb (table schema definitions)
  config: jsonb (capability configuration)
  createdAt: timestamp
  updatedAt: timestamp
}
```

This allows IdeaI to:

1. Discover available capabilities at runtime
2. Generate UI based on schema
3. Enable/disable capabilities without code changes
4. Support plugin-based capabilities

---

## 7. Identified Common Patterns

### 7.1 Auth Flow Pattern

```
1. User visits app → Check session
2. No session → Create anonymous session (if enabled)
3. User signs up/signs in → Upgrade to authenticated session
4. Session persisted in cookie + database
```

### 7.2 Data Access Pattern

```
1. Get session from request
2. Verify user owns resource (userId check)
3. Apply visibility rules (private/public)
4. Return data
```

### 7.3 API Authentication Pattern

```
1. Session-based (cookies) - for UI
2. API key-based - for webhooks/programmatic
3. Both validated in middleware
```

---

## 8. Migration Strategy

### Phase 1: Create Centralized Module

- [ ] Create `@repo/ideai-user` package
- [ ] Move common auth code
- [ ] Create unified schema

### Phase 2: Extract Capability Tables

- [ ] Move workflows tables to module pattern
- [ ] Move vibecoder tables to module pattern
- [ ] Create capability registry

### Phase 3: Unify Access

- [ ] Single auth endpoint
- [ ] Shared session across apps
- [ ] Unified permission system

### Phase 4: Refactor Apps

- [ ] Update capabilities app to use module
- [ ] Update vibecoder app to use module
- [ ] Remove duplicate code

---

## 9. Open Questions

1. **Shared vs Separate Databases**: Single shared DB or separate DBs per app?
2. **Session Sharing**: Should sessions work across all IdeaI apps?
3. **User Profiles**: Centralized profile or per-app profiles?
4. **Billing**: How to track usage per capability?
5. **Teams/Organizations**: When to add multi-tenancy?

---

## 10. Next Steps

1. ✅ Complete audit (this document)
2. ⏳ Create TODO list (next)
3. ⏳ Design unified schema
4. ⏳ Create module package structure
5. ⏳ Implement core user module
6. ⏳ Create tests
7. ⏳ Migrate workflows module
8. ⏳ Migrate vibecoder module
