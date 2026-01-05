# @repo/ideai-db-manager

**⚠️ CRITICAL: DEV-ONLY PACKAGE - NEVER DEPLOY TO PRODUCTION**

Lightweight super admin panel for viewing and editing users in IdeaI. This package is designed for development use only and includes multiple safeguards to prevent accidental production deployment.

## Features

- **User Management**: View and edit user data from the shared IdeaI database
- **Secure Authentication**: Password-protected access via `ideai-super-user`
- **Dev-Only Guards**: Multiple runtime checks prevent production deployment
- **Safe Password Creation**: Secure password generation and hashing utilities

## Installation

This package is part of the IdeaI monorepo and is automatically available to all apps.

## Usage

### 1. Create Super Admin Password

First, generate a secure password:

```bash
# In packages/ideai-db-manager
node scripts/create-password.mjs
```

This will:

- Generate a secure random password
- Create a SHA-256 hash
- Provide instructions for storing in `.env.local`

### 2. Configure Environment Variables

Add to your `.env.local`:

```env
# Super Admin Password Hash (dev-only)
SUPER_ADMIN_PASSWORD_HASH=your-hash-here

# Make hash available to client (dev-only)
NEXT_PUBLIC_SUPER_ADMIN_PASSWORD_HASH=your-hash-here
```

### 3. Add Super Admin Page

In your app (e.g., `apps/web`):

```tsx
// app/super-admin/page.tsx
import { SuperAdminPanel } from "@repo/ideai-db-manager";

export default function SuperAdminPage() {
  return <SuperAdminPanel />;
}
```

### 4. Access Super Admin

Navigate to: `http://localhost:3000/super-admin`

Login with the password you generated in step 1.

## Security

### Dev-Only Safeguards

1. **Runtime Checks**: All functions check `NODE_ENV` and `VERCEL_ENV`
2. **Production Blocking**: Throws errors if used in production
3. **Environment Guards**: Multiple layers of protection
4. **Session Storage**: Authentication stored only in sessionStorage (cleared on close)

### Password Security

- Passwords are hashed using SHA-256
- Plain passwords are never stored
- Password hashes are safe to commit (one-way hash)
- Plain passwords should be stored in a secure password manager

## API Routes

The super admin panel requires API routes in your app:

### GET `/api/super-admin/users`

Returns list of all users:

```json
{
  "users": [
    {
      "id": "user-id",
      "name": "User Name",
      "email": "user@example.com",
      "emailVerified": true,
      "isAnonymous": false,
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

### PATCH `/api/super-admin/users/:id`

Updates a user:

```json
{
  "name": "Updated Name",
  "email": "updated@example.com"
}
```

## Development

### Creating Password Script

Create `scripts/create-password.mjs`:

```javascript
import { createSuperUserPassword } from "../src/utils/password-creation.js";

const { password, hash, instructions } = createSuperUserPassword();
console.log(instructions);
```

### Testing

```bash
# Check types
pnpm check-types

# Lint
pnpm lint
```

## ⚠️ Important Warnings

1. **NEVER deploy to production**: This package will not work in production (by design)
2. **NEVER commit plain passwords**: Only commit password hashes
3. **NEVER expose in client bundles**: Use API routes for database access
4. **NEVER use in CI/CD**: Only for local development

## Future Improvements

- [ ] Add user search and filtering
- [ ] Add bulk operations
- [ ] Add audit logging
- [ ] Add role-based access control
- [ ] Add database query interface
- [ ] Add export functionality

## Related Documentation

- [Unified Auth System](../../docs/architecture/unified-auth-system.md)
- [Security Risks](../../docs/security/risks.md)
