# Quick Start - Use New Features in 5 Minutes

## 1. Install Dependencies (30 seconds)

```bash
pnpm install
```

## 2. Run Your App (same as before)

```bash
pnpm dev
```

That's it! Security headers and optimizations are already working.

---

## 3. Use New Utils (optional)

```typescript
// In any file
import { cn, formatDate } from '@repo/utils'

// Combine Tailwind classes
<div className={cn('text-base', isActive && 'font-bold')} />

// Format dates
const date = formatDate(new Date(), 'PP')
```

## 4. Add Monitoring to Other Apps (optional)

```tsx
// In apps/docs/app/layout.tsx (or any other app)
import { Analytics } from "@repo/monitoring/analytics";
import { SpeedInsights } from "@repo/monitoring/speed-insights";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
```

## 5. Use Security Headers in Other Apps (optional)

```typescript
// Copy apps/web/proxy.js to apps/docs/proxy.js
// Or import from the package:

import { applySecurityHeaders } from "@repo/security";

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  applySecurityHeaders(response.headers);
  return response;
}
```

---

## That's All!

No complex setup, no breaking changes. Everything else works automatically.

**Questions?** Check `IMPLEMENTATION-GUIDE.md` for detailed docs.
