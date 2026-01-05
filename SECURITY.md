# Security Best Practices

This document outlines security implementations and best practices for the IdeaI monorepo.

## Overview

Security is implemented at multiple layers:
1. **Transport Layer:** HTTPS enforcement, HSTS
2. **Application Layer:** Security headers, CSP, input validation
3. **Data Layer:** Environment variable protection, secrets management

---

## 1. Security Headers

### Implementation

All apps use the `proxy.js` middleware to apply security headers:

```typescript
// apps/web/proxy.js
export function middleware(request) {
  const response = NextResponse.next()
  
  // Headers applied automatically
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value)
  })
  
  return response
}
```

### Headers Applied

#### Content-Security-Policy (CSP)
Prevents XSS attacks by controlling resource loading.

**Configuration:**
- `default-src 'self'` - Only allow same-origin by default
- `script-src 'self' 'nonce-XXX'` - Scripts with nonce or same-origin
- `style-src 'self' 'unsafe-inline'` - Styles (inline allowed for Tailwind)
- `img-src 'self' data: https:` - Images from secure sources
- `connect-src 'self' https: wss:` - API calls and WebSockets

**Customization:**
Edit `packages/security/src/headers.ts` to adjust policies.

#### X-Frame-Options
Prevents clickjacking by controlling iframe embedding.

**Value:** `SAMEORIGIN`

#### X-Content-Type-Options
Prevents MIME type sniffing attacks.

**Value:** `nosniff`

#### Referrer-Policy
Controls referrer information sent with requests.

**Value:** `strict-origin-when-cross-origin`

#### Permissions-Policy
Controls browser feature access.

**Disabled features:**
- Camera, microphone (unless needed)
- Geolocation
- Payment API
- USB, Bluetooth

---

## 2. Environment Variables

### Protection Strategy

1. **Never commit secrets** - Use `.env.local` (gitignored)
2. **Use `.env.example`** - Template for required vars
3. **Type validation** - Consider `@t3-oss/env-nextjs`

### .env.example

```env
# Public vars (embedded in client bundle)
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Private vars (server-only)
DATABASE_URL=postgresql://...
API_SECRET_KEY=...

# Vercel vars (auto-populated)
VERCEL_URL=
VERCEL_ENV=
```

### Best Practices

- Prefix client vars with `NEXT_PUBLIC_`
- Never log sensitive environment variables
- Rotate secrets regularly
- Use Vercel's encrypted env vars for production

---

## 3. Input Validation

### Zod Schemas

Use `packages/utils/src/validation.ts` for common validations:

```typescript
import { emailSchema, passwordSchema } from '@repo/utils/validation'

const result = emailSchema.safeParse(userInput)
if (!result.success) {
  // Handle validation error
}
```

### Server Actions

Always validate inputs in Server Actions:

```typescript
'use server'

export async function createUser(formData: FormData) {
  const email = formData.get('email')
  
  // Validate
  const validEmail = emailSchema.parse(email)
  
  // Sanitize
  const sanitized = validEmail.toLowerCase().trim()
  
  // Use validated data
  await db.users.create({ email: sanitized })
}
```

---

## 4. Rate Limiting

### Implementation

Use `packages/security/src/rate-limit.ts`:

```typescript
import { rateLimit } from '@repo/security/rate-limit'

export async function POST(request: Request) {
  const ip = request.headers.get('x-forwarded-for') || 'anonymous'
  
  const { success, remaining, reset } = rateLimit(ip, {
    interval: 60000, // 1 minute
    maxRequests: 10,  // 10 requests
  })
  
  if (!success) {
    return new Response('Too many requests', { 
      status: 429,
      headers: {
        'X-RateLimit-Reset': reset.toString(),
      },
    })
  }
  
  // Process request
}
```

### Vercel Edge Config

For production, consider Vercel's built-in rate limiting:

```typescript
import { next } from '@vercel/edge'

export const config = {
  matcher: '/api/:path*',
}

export default next({
  rateLimit: {
    limit: 100,
    duration: 60,
  },
})
```

---

## 5. HTTPS & Certificates

### Local Development

Use Vercel CLI for HTTPS in development:

```bash
vercel dev --listen 3000
# Automatically provides HTTPS via localhost proxy
```

### Production

- Vercel automatically provides SSL certificates
- HSTS header enforces HTTPS
- HTTP requests auto-redirect to HTTPS

---

## 6. Authentication (When Added)

### Recommendations

1. **Use NextAuth.js v5** for flexibility
2. **Hash passwords** with bcrypt (cost factor 12+)
3. **Session management** with HTTP-only cookies
4. **Token expiration** - Short-lived access tokens
5. **Refresh tokens** - Secure, long-lived

### Example Structure

```typescript
// packages/auth/src/config.ts
import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { type: 'email' },
        password: { type: 'password' },
      },
      authorize: async (credentials) => {
        const user = await db.users.findByEmail(credentials.email)
        
        if (!user) return null
        
        const valid = await bcrypt.compare(
          credentials.password,
          user.passwordHash
        )
        
        if (!valid) return null
        
        return { id: user.id, email: user.email }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  cookies: {
    sessionToken: {
      name: '__Secure-next-auth.session-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: true,
      },
    },
  },
})
```

---

## 7. Database Security

### When using SQL

1. **Parameterized queries** - Always use placeholders
2. **Row-level security** - Enable RLS in Supabase/Postgres
3. **Principle of least privilege** - Limited DB permissions
4. **Connection pooling** - Prevent connection exhaustion

### Example (Drizzle ORM)

```typescript
import { db } from './db'
import { users } from './schema'
import { eq } from 'drizzle-orm'

// ✅ Safe - parameterized
const user = await db.select()
  .from(users)
  .where(eq(users.email, userInput))

// ❌ Unsafe - SQL injection risk
const unsafe = await db.execute(
  `SELECT * FROM users WHERE email = '${userInput}'`
)
```

---

## 8. Dependency Security

### Automated Scanning

Enable in GitHub:
1. Settings → Security → Dependabot
2. Enable "Dependency graph"
3. Enable "Dependabot alerts"
4. Enable "Dependabot security updates"

### Manual Audits

```bash
# Check for vulnerabilities
pnpm audit

# Fix automatically
pnpm audit --fix

# Update all dependencies
pnpm update --recursive --latest
```

---

## 9. Vercel Security Features

### Enable in Dashboard

1. **Attack Challenge Mode** - Block suspicious traffic
2. **DDoS Protection** - Automatic mitigation
3. **Web Application Firewall** - Custom rules
4. **Edge Config** - Encrypted secrets at edge

### Vercel Firewall Rules

Example rules:
- Block traffic from specific countries
- Rate limit by IP
- Block known bad user agents
- Require authentication headers

---

## 10. Incident Response

### If Security Issue Discovered

1. **Assess severity** - Critical, high, medium, low
2. **Isolate affected systems** - Disable features if needed
3. **Patch immediately** - Deploy fix ASAP
4. **Notify users** - If data breach occurred
5. **Document incident** - Postmortem analysis
6. **Update security measures** - Prevent recurrence

### Security Contact

Create `SECURITY.md` in repo root:

```markdown
# Security Policy

## Reporting a Vulnerability

Email: security@yourdomain.com

Please include:
- Description of vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

We will respond within 48 hours.
```

---

## Checklist

Use this checklist for each app:

- [ ] Security headers applied via proxy.js
- [ ] CSP configured and tested
- [ ] HTTPS enforced in production
- [ ] Environment variables secured
- [ ] Input validation on all user inputs
- [ ] Rate limiting on API routes
- [ ] Authentication implements best practices
- [ ] Database uses parameterized queries
- [ ] Dependencies scanned regularly
- [ ] Vercel security features enabled

---

## Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Next.js Security](https://nextjs.org/docs/app/building-your-application/configuring/security)
- [Vercel Security](https://vercel.com/docs/security)
- [CSP Evaluator](https://csp-evaluator.withgoogle.com/)
