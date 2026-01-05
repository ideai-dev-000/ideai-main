# Lazy Loading Strategy

**Date**: 2026-01-02  
**Purpose**: Prevent compilation hangs and optimize bundle size

## Overview

IdeaI uses lazy loading strategically to:
1. **Prevent compilation hangs** - Heavy dependencies don't block root route compilation
2. **Optimize bundle size** - Components only load when needed
3. **Improve performance** - Faster initial page loads

## When to Lazy Load

### ✅ Always Lazy Load

1. **Components with framer-motion** used on root route
   - Example: `IdeAIDiagnostics` (lazy-loaded in `IdeaIHeader`)
   - Reason: Prevents Next.js/Turbopack compilation hang

2. **Animation components**
   - Example: `AnimationsShowcase`, `AnimationCard`
   - Reason: Large dependencies, only needed on specific routes

3. **Drawing components**
   - Example: `DrawingsShowcase`, `VivusDraw`
   - Reason: Heavy SVG processing, only needed on specific routes

4. **Large UI components**
   - Example: `UF` (UniFrame) component
   - Reason: Complex iframe generation, large bundle size

### ❌ Don't Lazy Load

1. **Core layout components** - Used on every page
2. **Small utility components** - Minimal bundle impact
3. **Server components** - No client-side bundle impact

## Implementation Pattern

### Standard Lazy Loading

```tsx
import { lazy, Suspense } from "react";

// Lazy load component
const HeavyComponent = lazy(() => 
  import("@repo/ui/components/heavy-component").then(
    module => ({ default: module.HeavyComponent })
  )
);

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HeavyComponent />
    </Suspense>
  );
}
```

### Lazy Loading in Headers/Layouts

```tsx
// In ideai-header.tsx
import { lazy, Suspense } from "react";

// Lazy load to prevent compilation hang
const IdeAIDiagnostics = lazy(() => 
  import("./ideai-diagnostics").then(
    module => ({ default: module.IdeAIDiagnostics })
  )
);

export const IdeaIHeader = ({ diagnosticsAppName }) => {
  return (
    <header>
      {diagnosticsAppName && (
        <Suspense fallback={null}>
          <IdeAIDiagnostics appName={diagnosticsAppName} />
        </Suspense>
      )}
    </header>
  );
};
```

## Current Lazy-Loaded Components

### Root Route Components
- ✅ `IdeAIDiagnostics` - Lazy-loaded in `IdeaIHeader`
- ✅ `UF` - Lazy-loaded in `page.tsx`

### Route-Specific Components
- ✅ `AnimationsShowcase` - Lazy-loaded in `/animations` route
- ✅ `DrawingsShowcase` - Lazy-loaded in `/drawings` route
- ✅ `PageTemplatesShowcase` - Lazy-loaded in `/page-templates` route

## Troubleshooting

### Compilation Hang

**Symptom**: Next.js/Turbopack compilation hangs on root route

**Cause**: Component with heavy dependencies (e.g., framer-motion) imported directly on root route

**Solution**: Lazy-load the component using `React.lazy()` and `Suspense`

### Bundle Size Too Large

**Symptom**: Initial bundle size is large

**Cause**: All components loaded upfront

**Solution**: Lazy-load route-specific components

## Best Practices

1. **Test compilation** - Verify routes compile after adding dependencies
2. **Monitor bundle size** - Use Next.js bundle analyzer
3. **Provide fallbacks** - Always use Suspense with meaningful fallbacks
4. **Document lazy-loading** - Note why components are lazy-loaded
5. **Keep it simple** - Don't over-optimize small components

## Related Documentation

- [Animations Demo System](./animations-demo-system.md)
- [Performance Optimization](./performance-optimization.md)
- [Component Architecture](./component-architecture.md)

