# Unified Schema Design

**Version**: 1.0.0  
**Status**: Design Phase

---

## Core User Tables

### `users`

Central user table - all IdeaI apps share this.

```typescript
{
  id: string (primary key, text)
  name: string | null
  email: string | null (unique)
  emailVerified: boolean (default: false)
  image: string | null (profile picture URL)
  createdAt: timestamp
  updatedAt: timestamp
  isAnonymous: boolean (default: false)
}
```

### `sessions`

Auth sessions - shared across all apps.

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

### `accounts`

OAuth/linked accounts - GitHub, Google, email/password.

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
  password: string | null (hashed)
  createdAt: timestamp
  updatedAt: timestamp
}
```

### `verifications`

Email/phone verification codes.

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

---

## Enhanced User Tables (New)

### `user_preferences`

User settings and preferences.

```typescript
{
  id: string (primary key)
  userId: string (references users.id, unique)
  theme: "light" | "dark" | "system" (default: "system")
  language: string (default: "en")
  notifications: jsonb (notification preferences)
  createdAt: timestamp
  updatedAt: timestamp
}
```

### `user_roles`

Role-based access control (for future multi-tenancy).

```typescript
{
  id: string (primary key)
  userId: string (references users.id)
  role: string (e.g., "admin", "user", "viewer")
  scope: string | null (app-specific scope)
  createdAt: timestamp
  updatedAt: timestamp
}
```

---

## Capability Registry

### `capability_registry`

Dynamic capability discovery - allows IdeaI to discover and enable capabilities.

```typescript
{
  id: string (primary key)
  capabilityKey: string (unique, e.g., "workflows", "vibecoder")
  capabilityName: string (display name, e.g., "Workflows", "VibeCoder")
  description: string
  enabled: boolean (default: true)
  schema: jsonb {
    itemsTable: string (e.g., "workflows")
    executionsTable: string | null (e.g., "workflow_executions")
    logsTable: string | null (e.g., "workflow_execution_logs")
    fields: jsonb (field definitions)
  }
  config: jsonb (capability-specific config)
  version: string (capability version)
  createdAt: timestamp
  updatedAt: timestamp
}
```

---

## Capability Module: Workflows

### `workflows`

User's workflow definitions.

```typescript
{
  id: string (primary key, auto-generated)
  name: string
  description: string | null
  userId: string (references users.id) // Owner
  nodes: jsonb (array of workflow nodes)
  edges: jsonb (array of workflow edges)
  visibility: "private" | "public" | "team" (default: "private")
  createdAt: timestamp
  updatedAt: timestamp
}
```

### `workflow_executions`

Workflow execution history.

```typescript
{
  id: string (primary key)
  workflowId: string (references workflows.id)
  userId: string (references users.id) // Who executed
  status: "pending" | "running" | "success" | "error" | "cancelled"
  input: jsonb (input data)
  output: jsonb (result data)
  error: string | null
  startedAt: timestamp
  completedAt: timestamp | null
  duration: string | null (milliseconds)
}
```

### `workflow_execution_logs`

Detailed node execution logs.

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

### `workflow_integrations`

User's integration credentials for workflows.

```typescript
{
  id: string (primary key)
  userId: string (references users.id) // Credential owner
  name: string (display name)
  type: string (e.g., "slack", "linear", "github")
  config: jsonb (encrypted credentials)
  isManaged: boolean (OAuth vs manual, default: false)
  createdAt: timestamp
  updatedAt: timestamp
}
```

### `workflow_api_keys`

API keys for workflow webhooks.

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

---

## Capability Module: Vibecoder

### `code_projects`

User's code generation projects (semantic name).

```typescript
{
  id: string (primary key)
  name: string
  description: string | null
  userId: string (references users.id) // Owner
  v0ChatId: string | null (v0 SDK chat ID)
  code: jsonb (generated code structure)
  visibility: "private" | "public" | "team" (default: "private")
  createdAt: timestamp
  updatedAt: timestamp
}
```

### `code_chat_ownerships`

Track v0 SDK chat ownership.

```typescript
{
  id: string (primary key)
  v0ChatId: string (unique, from v0 SDK)
  userId: string (references users.id) // Owner
  projectId: string | null (references code_projects.id)
  createdAt: timestamp
}
```

### `code_executions`

Track code generation executions (new, semantic).

```typescript
{
  id: string (primary key)
  projectId: string (references code_projects.id)
  userId: string (references users.id) // Who executed
  status: "pending" | "running" | "success" | "error"
  input: jsonb (prompt/input)
  output: jsonb (generated code)
  error: string | null
  startedAt: timestamp
  completedAt: timestamp | null
  duration: string | null
}
```

### `code_anonymous_logs`

Anonymous usage tracking (rate limiting).

```typescript
{
  id: string (primary key)
  ipAddress: string
  v0ChatId: string
  createdAt: timestamp
}
```

---

## Naming Conventions

### Tables

- **Format**: snake_case
- **Pattern**: `{capability}_{entity}` for capability tables
- **Examples**:
  - `workflows` (capability entity)
  - `workflow_executions` (execution entity)
  - `code_projects` (capability entity)
  - `code_chat_ownerships` (ownership entity)

### Fields

- **Format**: camelCase
- **Pattern**: Standard fields across all tables
- **Examples**:
  - `userId` (owner reference)
  - `createdAt`, `updatedAt` (timestamps)
  - `id` (primary key)

### Relations

- **Format**: camelCase
- **Pattern**: Match table name in singular
- **Examples**:
  - `user` (from users table)
  - `workflow` (from workflows table)
  - `execution` (from workflow_executions table)

---

## Standard Field Patterns

### All Tables Include

```typescript
{
  id: string (primary key)
  createdAt: timestamp
  updatedAt: timestamp
}
```

### All Capability Tables Include

```typescript
{
  userId: string (references users.id) // Owner
  visibility?: "private" | "public" | "team" // Optional, default: "private"
}
```

### All Execution Tables Include

```typescript
{
  userId: string (references users.id) // Who executed
  status: string (execution status)
  input: jsonb (input data)
  output: jsonb (result data)
  error: string | null
  startedAt: timestamp
  completedAt: timestamp | null
  duration: string | null
}
```

---

## Migration Notes

1. **Backward Compatibility**: Keep old table names during migration
2. **Data Migration**: Script to migrate existing data
3. **Gradual Migration**: Migrate one capability at a time
4. **Rollback Plan**: Ability to revert if issues arise

---

## Future Considerations

- **Soft Deletes**: Add `deletedAt` timestamp to all tables?
- **Audit Logs**: Track all changes for compliance?
- **Multi-tenancy**: Add `organizationId` for teams?
- **Billing**: Track usage per capability?
