# Animation & Drawing Libraries

**Date**: 2026-01-02  
**Status**: All libraries configured and available

## Animation Libraries

IdeaI supports **6 animation libraries** for rich, performant animations:

### 1. Framer Motion

- **Type**: React Fiber-based animations
- **Use Case**: Declarative animations, layout animations, gesture support
- **Examples**: 6+ examples available
- **Route**: `/animations` (filter by "Framer Motion")

### 2. React Spring

- **Type**: Physics-based animations
- **Use Case**: Natural motion, spring physics, trail animations
- **Examples**: 6+ examples available
- **Route**: `/animations` (filter by "React Spring")

### 3. KUTE.js

- **Type**: JavaScript animation engine
- **Use Case**: SVG morphing, property animations, logo animations
- **Examples**: 3+ examples available
- **Route**: `/animations` (filter by "KUTE.js")

### 4. Motion One

- **Type**: Lightweight animation library
- **Use Case**: Fast, performant animations, scroll-triggered animations
- **Examples**: 3+ examples available
- **Route**: `/animations` (filter by "Motion One")

### 5. tsParticles

- **Type**: Particle animation library
- **Use Case**: Particle effects, backgrounds, interactive particles
- **Examples**: 2+ examples available
- **Route**: `/animations` (filter by "tsParticles")

### 6. Vivus

- **Type**: SVG drawing animations
- **Use Case**: SVG path drawing, logo reveals, illustration animations
- **Examples**: 3+ examples available
- **Route**: `/animations` (filter by "Vivus") or `/drawings`

## Drawing Libraries

IdeaI supports **2 drawing libraries** for SVG drawing animations:

### 1. Vivus

- **Type**: SVG path drawing
- **Use Case**: Animate SVG paths being drawn
- **Animation Types**:
  - `oneByOne` - Draw paths sequentially
  - `delayed` - Draw with delay between paths
  - `sync` - Draw all paths simultaneously
  - `scenario` - Custom timing
  - `scenario-sync` - Synchronized scenario
- **Route**: `/drawings` (Vivus section)

### 2. SVG Artista

- **Type**: CSS-based SVG animations
- **Use Case**: Stroke and fill animations using CSS
- **Animation Types**:
  - `stroke` - Animate stroke drawing
  - `fill` - Animate fill appearance
  - `both` - Animate both stroke and fill
- **Route**: `/drawings` (SVG Artista section)

## Configuration

### Enable Animation Libraries

Add to your `.ideai.json`:

```json
{
  "animationLibraries": [
    "framer-motion",
    "react-spring",
    "kute",
    "motion-one",
    "tsparticles",
    "vivus"
  ]
}
```

### Web App Configuration

The web app (`apps/web/.ideai.json`) has all 6 animation libraries enabled:

```json
{
  "animationLibraries": [
    "framer-motion",
    "react-spring",
    "kute",
    "motion-one",
    "tsparticles",
    "vivus"
  ]
}
```

## Routes

### Animations Showcase

- **Route**: `/animations`
- **Component**: `AnimationsShowcase`
- **Features**:
  - Filter by library
  - View all examples
  - Code snippets
  - Interactive demos

### Drawings Showcase

- **Route**: `/drawings`
- **Component**: `DrawingsShowcase`
- **Features**:
  - Vivus examples (3 types)
  - SVG Artista examples (3 types)
  - Interactive demos

## Usage

### Using Animation Libraries

```tsx
import { AnimationCard } from "@repo/ui/components/animations";
import type { AnimationExample } from "@repo/ui/components/animations";

<AnimationCard example={exampleData} library="framer-motion" />;
```

### Using Drawing Libraries

```tsx
import { VivusDraw, SVGArtistaDraw } from "@repo/ui/components/drawings";

// Vivus
<VivusDraw
  svgId="my-logo"
  type="oneByOne"
  duration={200}
/>

// SVG Artista
<SVGArtistaDraw
  svgContent={svgString}
  animationType="stroke"
  duration={2}
/>
```

## Dependencies

All libraries are installed in `@repo/ui`:

```json
{
  "dependencies": {
    "framer-motion": "^11.5.4",
    "@react-spring/web": "^10.0.3",
    "kute.js": "^2.2.4",
    "@motionone/react": "^11.11.1",
    "@tsparticles/react": "^3.7.1",
    "@tsparticles/slim": "^3.7.1",
    "@tsparticles/engine": "^3.7.1",
    "vivus": "^0.4.6"
  }
}
```

## Best Practices

1. **Lazy load animations** - All animation components are lazy-loaded
2. **Use config to enable** - Only enable libraries you need
3. **Respect performance** - Use `useIdeAIAnimations()` hook
4. **Test compilation** - Verify routes compile after adding libraries

## Related Documentation

- [Lazy Loading Strategy](./lazy-loading-strategy.md)
- [Animations Demo System](./animations-demo-system.md)
- [Performance Optimization](./performance-optimization.md)
