# @repo/ideai-user

**IdeaI Centralized User Module** - Centralized authentication, user management, and access control for all IdeaI apps.

## Overview

This package provides a unified user and authentication system that supports:

- **Single Sign-On** across all IdeaI capabilities
- **Modular Capabilities** (workflows, vibecoder, etc.)
- **Semantic Table Naming** for clarity
- **Boilerplate Pattern** for onboarding new capabilities

## Installation

```bash
pnpm add @repo/ideai-user
```

## Usage

### Authentication

```typescript
import { auth } from "@repo/ideai-user/auth";

// Get session
const session = await auth.api.getSession({ headers: request.headers });
```

### Client-Side

```typescript
import { useSession, signIn, signOut } from "@repo/ideai-user/auth-client";

function MyComponent() {
  const { data: session } = useSession();
  // ...
}
```

### Database Queries

```typescript
import { db, users } from "@repo/ideai-user/db";
import { eq } from "drizzle-orm";

const user = await db.query.users.findFirst({
  where: eq(users.id, userId),
});
```

### Services

```typescript
import { userService, permissionService } from "@repo/ideai-user/services";

const user = await userService.getById(userId);
const canAccess = await permissionService.canAccessWorkflow(userId, workflowId);
```

## Documentation

See `apps/ideai-user-module/` for:

- AUDIT.md - Complete audit report
- TODO.md - Implementation plan
- docs/schema-design.md - Database schema
- docs/patterns.md - Common patterns

## License

Private - IdeaI Internal
