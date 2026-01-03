# Implementation Guide - 2026 Upgrades

This guide walks through implementing the audit recommendations in priority order.

## Quick Start

```bash
# Install new dependencies
pnpm install

# Setup git hooks
pnpm prepare

# Run development servers
pnpm dev

# Run tests
pnpm test
```

---

## Phase 1: Critical Security & Performance (COMPLETED ✅)

### 1.1 Security Headers via Proxy Middleware

**Status:** ✅ Implemented

**Files:**

- `apps/web/proxy.js` - Next.js 16 proxy with comprehensive security headers
- `packages/security/` - Reusable security package

**What it does:**

- Content Security Policy with nonce support
- XSS Protection headers
- MIME type sniffing prevention
- Clickjacking protection
- HTTPS enforcement (HSTS)
- Modern Permissions Policy

**Usage in other apps:**

```typescript
// Copy proxy.js to any app
cp apps/web/proxy.js apps/docs/proxy.js
```

### 1.2 Vercel Analytics & Speed Insights

**Status:** ✅ Implemented

**Files:**

- `packages/monitoring/` - Monitoring package
- `apps/web/app/layout.tsx` - Analytics integration

**What it does:**

- Automatic page view tracking
- Web Vitals monitoring (CLS, FID, LCP, FCP, TTFB)
- Real user monitoring
- Performance insights

**Verify:**
Visit your Vercel dashboard to see analytics data flowing in.

### 1.3 Next.js 16 Performance Features

**Status:** ✅ Implemented

**Files:**

- `apps/web/next.config.ts` - Enhanced configuration

**Features enabled:**

- **React Compiler:** Automatic memoization (`reactCompiler: true`)
- **Partial Prerendering (PPR):** Instant loading UIs (`ppr: true`)
- **Cache Components:** Next.js 16 caching (`cacheComponents: true`)
- **Optimized Imports:** Reduced bundle size
- **AVIF Images:** Better compression than WebP

---

## Phase 2: Next.js 16 Caching Features

### 2.1 Cache Components with `use cache`

**Priority:** High
**Estimated Time:** 2-3 hours

**Implementation:**

```typescript
// Example: Cached component
'use cache'

export async function ProductList() {
  const products = await fetchProducts()
  return <div>{/* render products */}</div>
}
```

**Where to use:**

- Data-heavy components (product lists, blog posts)
- Expensive computations
- External API calls

**Files to update:**

- Any component fetching data
- API route handlers
- Server actions

### 2.2 Update to Async Params

**Priority:** High
**Estimated Time:** 1-2 hours

**Before:**

```typescript
export default function Page({ params, searchParams }) {
  const { id } = params;
  const { query } = searchParams;
}
```

**After:**

```typescript
export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ query?: string }>;
}) {
  const { id } = await params;
  const { query } = await searchParams;
}
```

**Files to update:**

- All page.tsx files with dynamic routes
- All route.ts API handlers

### 2.3 Implement Cache Revalidation

**Priority:** Medium
**Estimated Time:** 1 hour

```typescript
import { revalidateTag, updateTag } from "next/cache";

// Server Action
export async function updateProduct(id: string) {
  "use server";

  await database.products.update(id, data);

  // Use updateTag for read-your-writes
  updateTag(`product-${id}`);

  // Or revalidateTag with cacheLife
  revalidateTag("products", "max");
}
```

---

## Phase 3: Developer Experience

### 3.1 Git Hooks Setup

**Status:** ✅ Implemented

**Files:**

- `.husky/pre-commit` - Pre-commit linting
- `package.json` - lint-staged configuration

**What happens:**

- Code is automatically linted and formatted before commit
- Type errors are caught early
- Consistent code style enforced

**Test it:**

```bash
git add .
git commit -m "test: git hooks"
# Should run linting automatically
```

### 3.2 Testing Setup

**Status:** ✅ Configured (needs test files)

**Next steps:**

1. Create test files for utilities
2. Add integration tests for components
3. Setup Playwright for e2e tests

**Example test:**

```typescript
// packages/utils/src/format.test.ts
import { describe, it, expect } from "vitest";
import { formatCurrency, formatDate } from "./format";

describe("formatCurrency", () => {
  it("formats USD correctly", () => {
    expect(formatCurrency(1234.56)).toBe("$1,234.56");
  });
});
```

### 3.3 Changesets for Versioning

**Status:** ✅ Configured

**Usage:**

```bash
# Create a changeset
pnpm changeset

# Version packages
pnpm changeset version

# Publish (if public)
pnpm changeset publish
```

---

## Phase 4: Optional Enhancements

### 4.1 Environment Variable Validation

**Priority:** Medium
**Package:** `@t3-oss/env-nextjs`

```typescript
// env.mjs
import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().url(),
    API_KEY: z.string().min(1),
  },
  client: {
    NEXT_PUBLIC_APP_URL: z.string().url(),
  },
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    API_KEY: process.env.API_KEY,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  },
});
```

### 4.2 Bundle Analysis

```bash
# Add to package.json scripts
"analyze": "ANALYZE=true pnpm build"

# In next.config.ts
import bundleAnalyzer from '@next/bundle-analyzer'

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})

export default withBundleAnalyzer(nextConfig)
```

### 4.3 Authentication Package

**If needed, create:**

- `packages/auth/` with NextAuth.js v5
- Pluggable providers (credentials, OAuth, magic link)
- Session management utilities

### 4.4 Database Package

**If needed, create:**

- `packages/database/` with Drizzle ORM
- Connection pooling
- Migration utilities
- Type-safe query builders

---

## Verification Checklist

### Security ✅

- [ ] Security headers visible in browser DevTools (Network tab)
- [ ] CSP not blocking legitimate resources
- [ ] HTTPS redirect working (in production)
- [ ] No console warnings about insecure resources

### Performance ✅

- [ ] Vercel Analytics showing data
- [ ] Speed Insights tracking Web Vitals
- [ ] Build times improved with Turbo cache
- [ ] No unnecessary re-renders (React DevTools)

### Developer Experience ✅

- [ ] Git hooks run on commit
- [ ] Linting catches errors
- [ ] TypeScript strict mode passes
- [ ] Tests run successfully

---

## Common Issues & Solutions

### Issue: CSP blocking inline styles

**Solution:**

```typescript
// Use nonce for inline styles
const nonce = crypto.randomUUID();
response.headers.set(
  "Content-Security-Policy",
  `style-src 'self' 'nonce-${nonce}'`,
);
```

### Issue: Analytics not showing

**Solution:**

- Verify Analytics is enabled in Vercel dashboard
- Check components are client-side (`'use client'`)
- Ensure NEXT_PUBLIC_VERCEL_ANALYTICS_ID is set (auto in Vercel)

### Issue: Turbo cache not working

**Solution:**

```bash
# Clear cache and rebuild
pnpm turbo clean
pnpm install
pnpm build
```

---

## Next Steps

1. Review the audit document: `AUDIT-2026.md`
2. Test all new features locally
3. Deploy to Vercel preview environment
4. Monitor analytics and performance
5. Implement Phase 2 (caching features) incrementally
6. Add tests as you build new features

## Support

- [Next.js 16 Docs](https://nextjs.org/docs)
- [Turborepo Docs](https://turbo.build/repo/docs)
- [Vercel Platform Docs](https://vercel.com/docs)
