# Unified Auth System Across IdeaI Apps

## Overview

All IdeaI apps share the **same database and authentication system**, enabling users to sign up once and access their workflows, sessions, and data across all IdeaI applications.

## Architecture

### Shared Database

Both `ideai-workflow` and `ideai-capabilities` (and future apps) use:

- **Same Database Connection**: Both apps read from `DATABASE_URL` environment variable
- **Same Schema**: Identical table structures (`users`, `sessions`, `accounts`, `workflows`, etc.)
- **Same Auth System**: Better Auth with Drizzle adapter

### Database Tables

All apps share these core tables:

- `users` - User accounts (email, name, image, etc.)
- `sessions` - Active user sessions
- `accounts` - OAuth provider accounts (GitHub, Google, etc.)
- `verifications` - Email verification tokens
- `workflows` - User workflows (linked via `userId`)
- `workflow_executions` - Workflow run history
- `workflow_execution_logs` - Detailed execution logs
- `integrations` - User API keys and credentials
- `api_keys` - User API keys

### Auth Configuration

Both apps use identical Better Auth configuration:

```typescript
// apps/ideai-capabilities/lib/auth.ts
// apps/ideai-workflow/lib/auth.ts

export const auth = betterAuth({
  baseURL: getBaseURL(), // App-specific URL
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: users,
      session: sessions,
      account: accounts,
      verification: verifications,
      // ... workflow tables
    },
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
  socialProviders: {
    github: {
      /* ... */
    },
    google: {
      /* ... */
    },
  },
  plugins: [anonymous() /* ... */],
});
```

## How It Works

### User Sign Up Flow

1. **User signs up in any IdeaI app** (e.g., `ideai-capabilities`)
2. **User record created** in shared `users` table
3. **Session created** in shared `sessions` table
4. **User can now access all IdeaI apps** with the same credentials

### Cross-App Session Sharing

- **Same Session Token**: Better Auth uses HTTP-only cookies, so sessions work across subdomains
- **Same User ID**: All apps reference the same `users.id`
- **Workflows Linked**: All workflows are linked via `userId`, so they're accessible from any app

### Example Flow

```
User signs up in ideai-capabilities
  ↓
User record created in shared database
  ↓
User creates workflow in ideai-capabilities
  ↓
Workflow stored with userId in shared database
  ↓
User can access same workflow from ideai-workflow (or any future app)
```

## Environment Variables

### Required for All Apps

```env
# Database (MUST be the same across all apps)
DATABASE_URL=postgresql://user:password@host:5432/database

# Better Auth (can be app-specific for baseURL, but same secret)
BETTER_AUTH_SECRET=your-secret-key
BETTER_AUTH_URL=http://localhost:3018  # App-specific URL
NEXT_PUBLIC_APP_URL=http://localhost:3018  # App-specific URL
```

### App-Specific URLs

Each app has its own `BETTER_AUTH_URL` and `NEXT_PUBLIC_APP_URL`:

- `ideai-workflow`: `http://localhost:3013`
- `ideai-capabilities`: `http://localhost:3018`

But they all use the **same `DATABASE_URL`** to access the shared database.

## Benefits

1. **Single Sign-On**: Users sign up once, access all apps
2. **Unified Workflows**: Workflows created in one app are accessible in others
3. **Shared Sessions**: No need to re-authenticate when switching apps
4. **Centralized User Management**: All user data in one place
5. **Consistent Auth Logic**: Same authentication rules across all apps

## Future: Shared Auth Package

**TODO**: Create `@repo/auth` package to:

- Centralize auth configuration
- Share auth utilities
- Provide consistent auth hooks
- Enable easy addition of new apps

This will make it even easier to add new IdeaI apps that automatically share the same auth system.

## Verification

To verify both apps are using the same database:

1. **Sign up in `ideai-capabilities`**
2. **Check database**: User should appear in `users` table
3. **Sign in to `ideai-workflow`** with same credentials
4. **Should work**: User can access their workflows from both apps

## Migration Notes

When migrating from separate databases to unified:

1. **Use same `DATABASE_URL`** in both apps
2. **Run migrations** in one app (creates tables)
3. **Other apps** will use existing tables
4. **Users from both apps** will be in same `users` table
5. **Workflows** will be accessible from both apps

## Security

- **Same security standards** across all apps
- **Shared encryption keys** for sensitive data
- **Consistent session management**
- **Unified access control** via `userId` foreign keys
