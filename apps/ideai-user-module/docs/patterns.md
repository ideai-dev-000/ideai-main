# Common Patterns & Best Practices

**Version**: 1.0.0  
**Purpose**: Document reusable patterns for IdeaI user module

---

## 1. Access Control Pattern

### Standard Ownership Check

```typescript
async function canAccess(
  userId: string,
  resourceId: string,
  capability: string,
) {
  // 1. Get resource
  const resource = await db.query[`${capability}_items`].findFirst({
    where: eq(id, resourceId),
  });

  if (!resource) return false;

  // 2. Check ownership
  if (resource.userId !== userId) {
    // 3. Check visibility
    if (resource.visibility === "private") return false;
    // Future: Check team permissions if visibility === "team"
  }

  return true;
}
```

### Usage

```typescript
// In API route
const session = await auth.api.getSession({ headers });
if (!session?.user) return unauthorized();

const hasAccess = await canAccess(session.user.id, workflowId, "workflow");
if (!hasAccess) return forbidden();
```

---

## 2. Capability Query Pattern

### Get User's Items

```typescript
async function getUserCapabilityItems(
  userId: string,
  capability: string,
  includePublic: boolean = false,
) {
  const table = getCapabilityTable(capability, "items");

  return await db.query[table].findMany({
    where: and(
      eq(userId, userId),
      includePublic
        ? or(eq(visibility, "private"), eq(visibility, "public"))
        : eq(visibility, "private"),
    ),
    orderBy: desc(createdAt),
  });
}
```

### Get Public Items

```typescript
async function getPublicCapabilityItems(capability: string) {
  const table = getCapabilityTable(capability, "items");

  return await db.query[table].findMany({
    where: eq(visibility, "public"),
    orderBy: desc(createdAt),
    limit: 100,
  });
}
```

---

## 3. Session Sharing Pattern

### Cross-App Session

```typescript
// Session cookie works across all IdeaI subdomains
// myui.space, workflows.myui.space, vibecoder.myui.space

// Validate session in middleware
export async function middleware(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (!session?.user && requiresAuth(request.path)) {
    return redirect("/sign-in");
  }

  return next();
}
```

### Anonymous Session Handling

```typescript
// Create anonymous session if no session exists
async function getOrCreateSession(request: Request) {
  let session = await auth.api.getSession({ headers: request.headers });

  if (!session?.user) {
    // Create anonymous session
    session = await auth.api.signInAnonymous({ headers: request.headers });
  }

  return session;
}
```

---

## 4. Capability Registration Pattern

### Register New Capability

```typescript
async function registerCapability(capability: {
  key: string;
  name: string;
  description: string;
  schema: {
    itemsTable: string;
    executionsTable?: string;
    logsTable?: string;
    fields: Record<string, any>;
  };
  config?: Record<string, any>;
}) {
  await db.insert(capabilityRegistry).values({
    capabilityKey: capability.key,
    capabilityName: capability.name,
    description: capability.description,
    enabled: true,
    schema: capability.schema,
    config: capability.config || {},
    version: "1.0.0",
  });
}
```

### Discover Capabilities

```typescript
async function getAvailableCapabilities() {
  return await db.query.capabilityRegistry.findMany({
    where: eq(enabled, true),
    orderBy: asc(capabilityName),
  });
}
```

---

## 5. User Profile Pattern

### Get User with Preferences

```typescript
async function getUserWithPreferences(userId: string) {
  const user = await db.query.users.findFirst({
    where: eq(id, userId),
    with: {
      preferences: true,
    },
  });

  return {
    ...user,
    preferences: user?.preferences || defaultPreferences,
  };
}
```

### Update User Preferences

```typescript
async function updateUserPreferences(
  userId: string,
  preferences: Partial<UserPreferences>,
) {
  await db
    .insert(userPreferences)
    .values({ userId, ...preferences })
    .onConflictDoUpdate({
      target: userId,
      set: preferences,
    });
}
```

---

## 6. API Key Pattern

### Generate API Key

```typescript
async function generateApiKey(
  userId: string,
  capability: string,
  name?: string,
) {
  const key = `wf_${nanoid(32)}`;
  const keyHash = await hash(key);
  const keyPrefix = key.substring(0, 8);

  await db.insert(apiKeys).values({
    userId,
    name: name || `${capability} API Key`,
    keyHash,
    keyPrefix,
    capability,
  });

  // Return key only once (store securely)
  return key;
}
```

### Validate API Key

```typescript
async function validateApiKey(key: string, capability: string) {
  const keyHash = await hash(key);

  const apiKey = await db.query.apiKeys.findFirst({
    where: and(eq(keyHash, keyHash), eq(capability, capability)),
    with: {
      user: true,
    },
  });

  if (!apiKey) return null;

  // Update last used
  await db
    .update(apiKeys)
    .set({ lastUsedAt: new Date() })
    .where(eq(id, apiKey.id));

  return apiKey.user;
}
```

---

## 7. Execution Tracking Pattern

### Start Execution

```typescript
async function startExecution(
  userId: string,
  itemId: string,
  capability: string,
  input: any,
) {
  const executionsTable = getCapabilityTable(capability, "executions");

  const execution = await db
    .insert(executionsTable)
    .values({
      [`${capability}Id`]: itemId,
      userId,
      status: "running",
      input,
      startedAt: new Date(),
    })
    .returning();

  return execution[0];
}
```

### Complete Execution

```typescript
async function completeExecution(
  executionId: string,
  capability: string,
  status: "success" | "error",
  output?: any,
  error?: string,
) {
  const executionsTable = getCapabilityTable(capability, "executions");
  const startedAt = await getExecutionStartedAt(executionId, capability);
  const duration = Date.now() - startedAt.getTime();

  await db
    .update(executionsTable)
    .set({
      status,
      output,
      error,
      completedAt: new Date(),
      duration: `${duration}ms`,
    })
    .where(eq(id, executionId));
}
```

---

## 8. Error Handling Pattern

### Standard Error Response

```typescript
export function createErrorResponse(error: Error, status: number = 500) {
  return NextResponse.json(
    {
      error: error.message,
      code: error.name,
      timestamp: new Date().toISOString(),
    },
    { status },
  );
}
```

### Usage

```typescript
try {
  // ... operation
} catch (error) {
  if (error instanceof AuthError) {
    return createErrorResponse(error, 401);
  }
  if (error instanceof PermissionError) {
    return createErrorResponse(error, 403);
  }
  return createErrorResponse(error, 500);
}
```

---

## 9. Type Safety Pattern

### Capability Type Helper

```typescript
type CapabilityKey = "workflows" | "vibecoder" | string;

type CapabilityTable<T extends CapabilityKey> = T extends "workflows"
  ? Workflow
  : T extends "vibecoder"
    ? CodeProject
    : never;

function getCapabilityTable<T extends CapabilityKey>(
  capability: T,
  type: "items" | "executions" | "logs",
): CapabilityTable<T> {
  // Implementation
}
```

---

## 10. Testing Pattern

### Test Setup

```typescript
async function setupTestDatabase() {
  // Create test database
  // Run migrations
  // Seed test data
  // Return test user
}

async function teardownTestDatabase() {
  // Clean up test data
  // Drop test database
}
```

### Test Example

```typescript
describe("User Module", () => {
  let testUser: User;

  beforeAll(async () => {
    testUser = await setupTestDatabase();
  });

  afterAll(async () => {
    await teardownTestDatabase();
  });

  test("can create workflow", async () => {
    const workflow = await createWorkflow(testUser.id, {
      name: "Test Workflow",
    });

    expect(workflow.userId).toBe(testUser.id);
  });
});
```

---

## Summary

These patterns ensure:

- ✅ Consistent access control
- ✅ Standard query patterns
- ✅ Cross-app session sharing
- ✅ Dynamic capability discovery
- ✅ Type safety
- ✅ Testable code
- ✅ Error handling

All patterns are designed to be reusable across all IdeaI capabilities.
