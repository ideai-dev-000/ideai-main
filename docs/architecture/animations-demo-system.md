# Animation Demo System

## Overview

The IdeaI Animation Demo System provides shared, lazy-loaded animation demonstration pages that can be used across all IdeaI apps. The system includes:

- **Framer Motion** - React Fiber-based animations
- **React Spring** - Physics-based animations

All components are code-split and only load when accessed for optimal performance.

## Architecture

### File Structure

```
packages/ui/src/components/animations/
├── framer-motion-demo.tsx    # Framer Motion demo component
├── react-spring-demo.tsx     # React Spring demo component
└── index.ts                   # Centralized exports

apps/*/app/animations/
├── page.tsx                   # Index page (navigation)
├── framer-motion/
│   └── page.tsx              # Framer Motion demo route
└── react-spring/
    └── page.tsx              # React Spring demo route
```

### Routes

- `/animations` - Index page with navigation
- `/animations/framer-motion` - Framer Motion demonstrations
- `/animations/react-spring` - React Spring demonstrations

## Usage

### Adding to an App

To add animation demos to any IdeaI app:

1. **Create the animations directory structure:**

```bash
mkdir -p apps/[app-name]/app/animations/framer-motion
mkdir -p apps/[app-name]/app/animations/react-spring
```

2. **Create the index page** (`apps/[app-name]/app/animations/page.tsx`):

```tsx
import { IdeAIPageTemplate } from "@repo/ui/components/ideai-page-template";
import Link from "next/link";

export default function AnimationsPage() {
  const vercelProjectName = process.env.NEXT_PUBLIC_VERCEL_PROJECT_NAME || "[app-name]";
  const vercelOrgId = process.env.NEXT_PUBLIC_VERCEL_ORG_ID || "team_vhjzlMi6CfNow0IfBXnv2Yn2";

  return (
    <IdeAIPageTemplate
      siteName="IdeaI"
      vercelProjectName={vercelProjectName}
      vercelOrgId={vercelOrgId}
    >
      {/* Copy from apps/web/app/animations/page.tsx */}
    </IdeAIPageTemplate>
  );
}
```

3. **Create Framer Motion page** (`apps/[app-name]/app/animations/framer-motion/page.tsx`):

```tsx
import { lazy, Suspense } from "react";

const FramerMotionDemo = lazy(() =>
  import("@repo/ui/components/animations/framer-motion-demo").then(
    (module) => ({ default: module.FramerMotionDemo })
  )
);

export default function FramerMotionPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <FramerMotionDemo />
    </Suspense>
  );
}
```

4. **Create React Spring page** (`apps/[app-name]/app/animations/react-spring/page.tsx`):

```tsx
import { lazy, Suspense } from "react";

const ReactSpringDemo = lazy(() =>
  import("@repo/ui/components/animations/react-spring-demo").then(
    (module) => ({ default: module.ReactSpringDemo })
  )
);

export default function ReactSpringPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <ReactSpringDemo />
    </Suspense>
  );
}
```

## Features

### Code Splitting

All animation demo components are lazy-loaded using React's `lazy()` and `Suspense`:

- Components only load when the route is accessed
- Reduces initial bundle size
- Improves page load performance

### Performance Awareness

All animations respect the IdeaI animation system:

- Automatically detects device performance
- Disables animations on low-end devices
- Respects `prefers-reduced-motion`
- Uses hardware acceleration when available

### Semantic Structure

- Clear file organization
- Descriptive component names
- Comprehensive JSDoc headers
- Type-safe exports

## Dependencies

### Required Packages

- `framer-motion` - Already in `@repo/ui`
- `@react-spring/web` - Already in `@repo/ui`

### No Additional Setup Required

All dependencies are already installed in the shared UI package. No additional configuration needed.

## Best Practices

1. **Always use lazy loading** - Never import animation demos directly
2. **Provide loading states** - Use Suspense fallbacks
3. **Respect performance settings** - Use `useIdeAIAnimations()` hook
4. **Keep components focused** - Each demo component should showcase one library
5. **Use semantic naming** - Clear, descriptive file and component names

## Examples

### Framer Motion Demo

The Framer Motion demo includes:
- Basic animations (fade, scale, rotate)
- Gesture animations (hover, drag)
- Layout animations (list reordering)
- Scroll-triggered animations

### React Spring Demo

The React Spring demo includes:
- Spring physics animations
- Number animations
- Color transitions
- Trail effects
- Parallax effects

## Future Enhancements

- [ ] Add more animation libraries (e.g., GSAP, Lottie)
- [ ] Add animation performance metrics
- [ ] Add animation presets library
- [ ] Add animation playground/editor

