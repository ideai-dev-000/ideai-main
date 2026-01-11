# Centralized User API Key Management System

## Overview

A centralized system for storing and managing user API keys (AI Gateway, OpenAI, V0, etc.) that works across all IdeaI apps, with automatic Vercel integration and secure encryption.

## Architecture

### Design Principles

1. **Centralized Storage**: All user API keys stored in shared database
2. **Per-User Scope**: Each user manages their own keys
3. **Environment Fallback**: Falls back to env vars if user key not set (for local dev)
4. **Encrypted Storage**: All keys encrypted using existing `INTEGRATION_ENCRYPTION_KEY`
5. **Vercel Integration**: Auto-sync keys to/from Vercel environment variables
6. **Multi-App Support**: Works across capabilities, workflows, vibecoder, etc.

## Database Schema

### New Table: `user_service_keys`

```sql
CREATE TABLE user_service_keys (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  service_type TEXT NOT NULL, -- 'ai_gateway', 'openai', 'v0', etc.
  encrypted_key TEXT NOT NULL, -- Encrypted using INTEGRATION_ENCRYPTION_KEY
  key_prefix TEXT, -- Last 4 chars for display (e.g., "...xyz")
  environment TEXT DEFAULT 'production', -- 'local', 'production', 'preview'
  vercel_project_id TEXT, -- If synced to Vercel project
  vercel_team_id TEXT, -- If synced to Vercel team
  vercel_env_id TEXT, -- Vercel env var ID if synced
  is_active BOOLEAN DEFAULT true,
  last_used_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),

  UNIQUE(user_id, service_type, environment)
);
```

### Service Types

- `ai_gateway` - Vercel AI Gateway API key
- `openai` - OpenAI API key
- `v0` - V0.dev API key
- `anthropic` - Anthropic Claude API key
- `firecrawl` - Firecrawl API key
- `exa` - Exa API key
- Custom service types can be added

## Implementation Plan

### 1. Database Schema (Priority: High)

**File**: `apps/ideai-capabilities/lib/db/schema.ts`

Add to existing schema:

```typescript
export const userServiceKeys = pgTable("user_service_keys", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => generateId()),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  serviceType: text("service_type").notNull(), // 'ai_gateway', 'openai', etc.
  encryptedKey: text("encrypted_key").notNull(), // Encrypted value
  keyPrefix: text("key_prefix"), // Last 4 chars for display
  environment: text("environment").default("production"), // 'local', 'production', 'preview'
  vercelProjectId: text("vercel_project_id"), // If synced to Vercel
  vercelTeamId: text("vercel_team_id"),
  vercelEnvId: text("vercel_env_id"), // Vercel env var ID
  isActive: boolean("is_active").default(true),
  lastUsedAt: timestamp("last_used_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Unique constraint: one key per user/service/environment
// Add via migration
```

### 2. Service Layer (Priority: High)

**File**: `apps/ideai-capabilities/lib/services/user-keys.ts`

```typescript
import { eq, and } from "drizzle-orm";
import { db } from "../db";
import { userServiceKeys } from "../db/schema";
import { encrypt, decrypt } from "../db/integrations";

export type ServiceType =
  | "ai_gateway"
  | "openai"
  | "v0"
  | "anthropic"
  | "firecrawl"
  | "exa";

export interface UserKeyConfig {
  userId: string;
  serviceType: ServiceType;
  key: string;
  environment?: "local" | "production" | "preview";
  vercelProjectId?: string;
  vercelTeamId?: string;
}

/**
 * Save user API key (encrypted)
 */
export async function saveUserKey(config: UserKeyConfig) {
  const encrypted = encrypt(config.key);
  const keyPrefix = config.key.slice(-4);

  await db
    .insert(userServiceKeys)
    .values({
      userId: config.userId,
      serviceType: config.serviceType,
      encryptedKey: encrypted,
      keyPrefix: keyPrefix,
      environment: config.environment || "production",
      vercelProjectId: config.vercelProjectId,
      vercelTeamId: config.vercelTeamId,
    })
    .onConflictDoUpdate({
      target: [
        userServiceKeys.userId,
        userServiceKeys.serviceType,
        userServiceKeys.environment,
      ],
      set: {
        encryptedKey: encrypted,
        keyPrefix: keyPrefix,
        updatedAt: new Date(),
      },
    });
}

/**
 * Get user API key (decrypted) with environment fallback
 * Priority: User key > Environment variable
 */
export async function getUserKey(
  userId: string,
  serviceType: ServiceType,
  environment: "local" | "production" | "preview" = "production",
): Promise<string | null> {
  // Try user key first
  const userKey = await db.query.userServiceKeys.findFirst({
    where: and(
      eq(userServiceKeys.userId, userId),
      eq(userServiceKeys.serviceType, serviceType),
      eq(userServiceKeys.environment, environment),
      eq(userServiceKeys.isActive, true),
    ),
  });

  if (userKey) {
    try {
      const decrypted = decrypt(userKey.encryptedKey);
      // Update last used
      await db
        .update(userServiceKeys)
        .set({ lastUsedAt: new Date() })
        .where(eq(userServiceKeys.id, userKey.id));
      return decrypted;
    } catch (error) {
      console.error(
        `[UserKeys] Failed to decrypt key for ${serviceType}:`,
        error,
      );
    }
  }

  // Fallback to environment variable
  const envVarName = getEnvVarName(serviceType);
  return process.env[envVarName] || null;
}

/**
 * Get all user keys (for UI)
 */
export async function getUserKeys(userId: string) {
  const keys = await db.query.userServiceKeys.findMany({
    where: eq(userServiceKeys.userId, userId),
    orderBy: (keys, { desc }) => [desc(keys.updatedAt)],
  });

  return keys.map((key) => ({
    id: key.id,
    serviceType: key.serviceType,
    keyPrefix: key.keyPrefix,
    environment: key.environment,
    isActive: key.isActive,
    lastUsedAt: key.lastUsedAt,
    createdAt: key.createdAt,
    // Don't return encrypted key - UI should fetch individual key if needed
  }));
}

/**
 * Map service type to environment variable name
 */
function getEnvVarName(serviceType: ServiceType): string {
  const mapping: Record<ServiceType, string> = {
    ai_gateway: "AI_GATEWAY_API_KEY",
    openai: "OPENAI_API_KEY",
    v0: "V0_API_KEY",
    anthropic: "ANTHROPIC_API_KEY",
    firecrawl: "FIRECRAWL_API_KEY",
    exa: "EXA_API_KEY",
  };
  return mapping[serviceType];
}
```

### 3. API Endpoints (Priority: High)

**File**: `apps/ideai-capabilities/app/api/user-keys/route.ts`

```typescript
// GET /api/user-keys - List all user keys
// POST /api/user-keys - Create/update user key
// DELETE /api/user-keys/[id] - Delete user key
```

### 4. Update Existing Code (Priority: Medium)

**Files to update**:

- `apps/ideai-capabilities/app/api/ai/generate/route.ts` - Use `getUserKey()` instead of env vars
- `apps/ideai-capabilities/lib/steps/credentials.ts` - Add user key support
- `apps/ideai-capabilities/lib/codegen-registry.ts` - Use user keys

**Pattern**:

```typescript
// Before
const apiKey = process.env.AI_GATEWAY_API_KEY || process.env.OPENAI_API_KEY;

// After
const apiKey =
  (await getUserKey(session.user.id, "ai_gateway")) ||
  process.env.AI_GATEWAY_API_KEY ||
  process.env.OPENAI_API_KEY;
```

### 5. UI Component (Priority: Medium)

**File**: `apps/ideai-capabilities/app/settings/service-keys/page.tsx`

Settings page with:

- List of user's service keys
- Add/Edit/Delete functionality
- Show last 4 chars of key
- Environment selector (local/production/preview)
- Vercel sync toggle

### 6. Vercel Integration (Priority: Low)

**File**: `apps/ideai-capabilities/lib/services/vercel-key-sync.ts`

Optional: Auto-sync keys to Vercel environment variables when:

- User connects Vercel account
- User enables sync for a key
- User deploys to Vercel

## Migration Strategy

1. **Phase 1**: Create schema and service layer
2. **Phase 2**: Create API endpoints
3. **Phase 3**: Update existing code to use service layer (with env fallback)
4. **Phase 4**: Create UI for key management
5. **Phase 5**: Add Vercel integration (optional)

## Security Considerations

1. **Encryption**: All keys encrypted at rest using AES-256-GCM
2. **Access Control**: Users can only access their own keys
3. **Audit Trail**: Track last used timestamp
4. **Environment Isolation**: Separate keys per environment (local/prod)
5. **Never Log**: Keys never logged or exposed in error messages

## Usage Examples

### In Workflow Execution

```typescript
// In workflow step execution
const apiKey = await getUserKey(userId, "ai_gateway", "production");
if (!apiKey) {
  throw new Error(
    "AI Gateway API key not configured. Please add it in Settings > Service Keys.",
  );
}
```

### In API Route

```typescript
// In /api/ai/generate
const session = await auth.api.getSession({ headers: request.headers });
const apiKey =
  (await getUserKey(session.user.id, "ai_gateway")) ||
  process.env.AI_GATEWAY_API_KEY;
```

## Benefits

1. **Single Source of Truth**: All keys in one place
2. **User Isolation**: Each user has their own keys
3. **Easy Management**: UI for adding/removing keys
4. **Environment Support**: Different keys for local/prod
5. **Backward Compatible**: Falls back to env vars for local dev
6. **Vercel Ready**: Can sync to Vercel env vars automatically
7. **Secure**: Encrypted storage with audit trail

## Future Enhancements

1. **Team Keys**: Share keys across team members
2. **Key Rotation**: Automatic key rotation reminders
3. **Usage Analytics**: Track API usage per key
4. **Rate Limiting**: Per-key rate limiting
5. **Webhook Notifications**: Alert on key usage
