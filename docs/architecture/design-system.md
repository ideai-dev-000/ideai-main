# IdeaI Design System Architecture

This document describes the centralized design system architecture for the IdeaI monorepo, designed for scalability and multi-framework support.

## Overview

The IdeaI design system is built on a **centralized, shared component library** approach that allows:
- ✅ Single source of truth for all UI components
- ✅ Consistent branding across all applications
- ✅ Easy updates that benefit all apps
- ✅ Future support for multiple frameworks (React, Svelte, etc.)
- ✅ Integration with multiple UI libraries (shadcn, Radix, Chakra UI, etc.)

## Architecture

```
packages/ui/                    # Centralized design system
├── src/
│   ├── components/
│   │   ├── ui/                # shadcn/ui components
│   │   └── ...                # Custom IdeaI components
│   ├── lib/
│   │   └── utils.ts           # Shared utilities (cn, etc.)
│   ├── hooks/                 # Shared React hooks
│   └── styles/
│       └── globals.css        # Design tokens & CSS variables
├── components.json            # shadcn configuration
├── tailwind.config.ts         # Shared Tailwind config
└── package.json
```

## Design Tokens

All design tokens are centralized in `packages/ui/src/styles/globals.css`:

- **Colors**: HSL-based color system with dark mode support
- **Spacing**: Consistent spacing scale
- **Typography**: Font families and sizes
- **Border Radius**: Unified radius values
- **Brand Colors**: IdeaI-specific color palette

## Component Structure

### shadcn/ui Components

shadcn/ui components are installed in `packages/ui/src/components/ui/`:

```bash
# Add a new component (from packages/ui directory)
cd packages/ui
pnpm dlx shadcn@latest add button
```

Components are then exported from `@repo/ui`:

```tsx
import { Button } from "@repo/ui/components/ui/button";
```

### Custom IdeaI Components

Custom components live in `packages/ui/src/components/`:

```tsx
// packages/ui/src/components/ideai-header.tsx
export const IdeaIHeader = () => { ... }
```

## Usage in Apps

### Web App (CSS Modules)

The web app uses CSS modules with shared design tokens:

```css
/* apps/web/app/globals.css */
:root {
  --background: #ffffff;
  --foreground: #171717;
  /* ... shared tokens ... */
}
```

### Docs App (Tailwind)

The docs app uses Tailwind with the shared design system:

```css
/* apps/docs/app/globals.css */
@import "../../../packages/ui/src/styles/globals.css";
```

### Using Shared Components

Both apps can use shared components:

```tsx
import { Button } from "@repo/ui/components/ui/button";
import { IdeaIHeader } from "@repo/ui/components/ideai-header";
```

### Using Shared Utilities

```tsx
import { cn } from "@repo/ui/lib/utils";

<div className={cn("base-class", conditional && "conditional-class")} />
```

## Future Scalability

### Multi-Framework Support

The architecture is designed to support multiple frameworks:

```
packages/
├── ui/                        # React components (current)
├── ui-svelte/                 # Svelte components (future)
├── ui-vue/                    # Vue components (future)
└── design-tokens/             # Framework-agnostic tokens (future)
```

### Multi-Library Integration

Components can integrate with multiple UI libraries:

- **shadcn/ui**: Primary component library (current)
- **Radix UI**: Primitive components (can be added)
- **Chakra UI**: Alternative component system (can be added)
- **Bootstrap**: Utility-first components (can be added)

### Design Token Extraction

Future: Extract design tokens to a separate package:

```
packages/
└── design-tokens/
    ├── colors.json
    ├── spacing.json
    └── typography.json
```

## Best Practices

### ✅ DO

- Add all new components to `packages/ui`
- Use shared design tokens from `globals.css`
- Import components from `@repo/ui`
- Keep app-specific styles minimal
- Use `cn()` utility for className merging

### ❌ DON'T

- Don't duplicate components in individual apps
- Don't create app-specific design tokens
- Don't install shadcn in individual apps
- Don't bypass the shared component library

## Adding New Components

### shadcn/ui Components

```bash
cd packages/ui
pnpm dlx shadcn@latest add [component-name]
```

### Custom Components

1. Create component in `packages/ui/src/components/`
2. Export from `packages/ui/src/index.ts` (if needed)
3. Use in apps via `@repo/ui/components/[component-name]`

## Updating Components

When you update a component in `packages/ui`:
- ✅ All apps automatically get the update
- ✅ No need to update multiple files
- ✅ Consistent behavior across all apps

## Migration Path

### Current State
- ✅ shadcn/ui in `packages/ui`
- ✅ Shared styles in `packages/ui/src/styles/globals.css`
- ✅ Both apps import from shared package
- ✅ Web app: CSS modules with shared tokens
- ✅ Docs app: Tailwind with shared design system

### Future Enhancements
- 🔮 Extract design tokens to separate package
- 🔮 Add Svelte component library
- 🔮 Add Radix UI primitives
- 🔮 Add Chakra UI components
- 🔮 Framework-agnostic token system

## Related Documentation

- [Component Development Guide](../development/getting-started.md)
- [Turborepo Architecture](../PROJECT-SUMMARY.md)
- [Shared Packages](../README.md)
