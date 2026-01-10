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

### Shared Components

#### AuthDialog

Flexible authentication dialog that works with any UI library:

```typescript
import { AuthDialog } from "@repo/ideai-user/components/auth";
import { Button, Dialog } from "@/components/ui";
import { toast } from "sonner";

<AuthDialog
  Button={Button}
  Dialog={Dialog}
  DialogContent={DialogContent}
  Input={Input}
  Label={Label}
  toast={toast}
>
  <Button>Sign In</Button>
</AuthDialog>
```

#### IdeAIHeader

Shared header component for consistent navigation:

```typescript
import { IdeAIHeader } from "@repo/ideai-user/components/header";
import { UserMenu } from "@/components/user-menu";

<IdeAIHeader
  siteName="Capabilities"
  navItems={[
    { label: "Home", href: "/", icon: <Home /> },
    { label: "Workflows", href: "/workflow" },
  ]}
  rightContent={<UserMenu />}
/>
```

## Documentation

See `apps/ideai-user-module/` for:

- AUDIT.md - Complete audit report
- TODO.md - Implementation plan
- docs/schema-design.md - Database schema
- docs/patterns.md - Common patterns

## License

Private - IdeaI Internal
