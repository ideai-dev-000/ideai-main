# IdeaI DB Manager Package

## Overview

The `@repo/ideai-db-manager` package provides a lightweight, dev-only interface for viewing and editing users in the IdeaI platform. It is designed exclusively for development use and includes multiple safeguards to prevent accidental production deployment.

## Purpose

- **User Management**: View and edit user data from the shared IdeaI database
- **Development Tool**: Assist with testing and debugging user-related features
- **Database Inspection**: Quick access to user data without direct database access

## Architecture

### Package Structure

```
packages/super-admin/
├── src/
│   ├── components/
│   │   └── super-admin-panel.tsx    # Main UI component
│   ├── hooks/
│   │   └── use-super-admin-auth.ts  # Authentication hook
│   ├── utils/
│   │   ├── dev-check.ts             # Production guards
│   │   └── password-creation.ts     # Password utilities
│   └── index.ts                     # Package exports
├── scripts/
│   └── create-password.mjs         # Password generation script
└── README.md
```

### Key Components

1. **SuperAdminPanel**: Main UI component displaying user list and edit interface
2. **useSuperAdminAuth**: React hook managing authentication state
3. **dev-check utilities**: Runtime checks preventing production use
4. **password-creation utilities**: Secure password generation and hashing

## Security Model

### Authentication

- **Super User**: Access restricted to `ideai-super-user`
- **Password Protection**: SHA-256 hashed passwords
- **Session Storage**: Authentication stored in sessionStorage (cleared on close)
- **No Persistent Sessions**: Must re-authenticate on each browser session

### Production Guards

Multiple layers of protection:

1. **Runtime Checks**: All functions check `NODE_ENV` and `VERCEL_ENV`
2. **Production Blocking**: Throws errors if used in production
3. **Environment Guards**: Multiple validation layers
4. **Package-Level Guards**: Package itself prevents production import

### Password Security

- **Generation**: Cryptographically secure random bytes (32 characters)
- **Hashing**: SHA-256 one-way hash
- **Storage**: Hash stored in environment variables
- **Verification**: Server-side password verification

## Usage

### Setup

1. **Generate Password**:

   ```bash
   cd packages/super-admin
   node scripts/create-password.mjs
   ```

2. **Configure Environment**:

   ```env
   SUPER_ADMIN_PASSWORD_HASH=<generated-hash>
   NEXT_PUBLIC_SUPER_ADMIN_PASSWORD_HASH=<generated-hash>
   ```

3. **Add Page**:

   ```tsx
   // apps/web/app/super-admin/page.tsx
   import { SuperAdminPanel } from "@repo/super-admin";
   export default function SuperAdminPage() {
     return <SuperAdminPanel />;
   }
   ```

4. **Add API Routes**:
   - `GET /api/super-admin/users` - Fetch all users
   - `PATCH /api/super-admin/users/:id` - Update user

### Access

Navigate to: `http://localhost:3000/super-admin`

Login with the password generated in setup step 1.

## API Integration

### Required API Routes

The super admin panel requires two API routes:

#### GET `/api/super-admin/users`

Returns list of all users:

```typescript
{
  users: Array<{
    id: string;
    name: string | null;
    email: string | null;
    emailVerified: boolean;
    isAnonymous: boolean;
    createdAt: Date;
    updatedAt: Date;
  }>;
}
```

#### PATCH `/api/super-admin/users/:id`

Updates a user:

```typescript
Request Body: {
  name?: string | null;
  email?: string | null;
}

Response: {
  success: boolean;
}
```

## Database Access

The super admin package accesses the shared IdeaI database:

- **Connection**: Uses same `DATABASE_URL` as other apps
- **Schema**: Accesses `users` table from shared schema
- **Read/Write**: Can read and update user data
- **Scope**: Limited to user management (no other tables)

## Development Workflow

1. **Local Development**: Full access to super admin panel
2. **Preview Deployments**: Blocked (production guard)
3. **Production**: Completely blocked (multiple safeguards)

## Future Enhancements

- [ ] User search and filtering
- [ ] Bulk operations (delete, update multiple)
- [ ] Audit logging for all actions
- [ ] Role-based access control
- [ ] Database query interface
- [ ] Export functionality (CSV, JSON)
- [ ] User activity tracking
- [ ] Session management interface

## Security Considerations

### Current Safeguards

✅ Multiple runtime checks  
✅ Production blocking  
✅ Password protection  
✅ Session-based auth  
✅ Dev-only documentation

### Known Limitations

⚠️ API routes need explicit production blocking  
⚠️ No audit logging  
⚠️ No rate limiting  
⚠️ Client-side password hash exposure (acceptable for dev-only)

### Future Security Improvements

- [ ] Server-side only password verification
- [ ] Comprehensive audit logging
- [ ] Rate limiting for login attempts
- [ ] IP whitelist for super admin access
- [ ] Two-factor authentication

## Related Documentation

- [Security Risks](../security/risks.md) - Detailed risk assessment
- [Unified Auth System](./unified-auth-system.md) - Shared authentication
- [Package README](../../packages/ideai-db-manager/README.md) - Package documentation

## Support

For issues or questions:

1. Check [Security Risks](../security/risks.md) for known issues
2. Review package README for setup instructions
3. Verify environment configuration
4. Check console for production guard errors
