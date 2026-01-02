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
│   │   │   └── button.tsx    # shadcn Button component
│   │   ├── ideai-button.tsx  # IdeaI custom button
│   │   ├── ideai-header.tsx  # Header with site name support
│   │   ├── ideai-footer.tsx  # Footer component
│   │   ├── ideai-content.tsx # Documentation index content
│   │   ├── ideai-logo.tsx    # Logo with SEO metadata
│   │   └── ideai-html-test.tsx # HTML5 test page component
│   ├── lib/
│   │   └── utils.ts           # Shared utilities (cn, etc.)
│   ├── hooks/                 # Shared React hooks
│   └── styles/
│       ├── globals.css        # Normalize.css + Tailwind base + explicit colors
│       ├── ideai.css          # IdeaI custom layer (imports ideai-components.css)
│       └── ideai-components.css # Shared component styles (explicit RGB)
├── components.json            # shadcn configuration
├── tailwind.config.ts         # Shared Tailwind config
└── package.json               # Includes normalize.css dependency
```

## Design Tokens

All design tokens are centralized in `packages/ui/src/styles/`:

### Base Stylesheet (MVP.css)

**MVP.css v1.17.2** is included as the base stylesheet for all IdeaI applications:
- **File Size**: ~10KB (unminified), ~3KB (gzipped)
- **Purpose**: Provides clean, minimal styling for semantic HTML elements without requiring class names
- **Location**: Imported in each app's `globals.css` before centralized IdeaI CSS
- **Reference**: [MVP.css Documentation](https://andybrewer.github.io/mvp/)

MVP.css is a minimalist stylesheet that styles root HTML elements, so you don't need to learn a new CSS framework or naming conventions. It works with semantic HTML only - no class names required. Perfect for rapid prototyping and MVPs.

### Color System

**CRITICAL**: Colors use **explicit RGB values** to ensure perfect consistency and prevent dark mode auto-application.

- **Base Layer** (`globals.css`): Tailwind base with explicit RGB colors for `body` and `html`
- **Component Layer** (`ideai-components.css`): All shared component styles use explicit RGB values
- **Color Values**: 
  - Text: `rgb(15 23 42)` (slate-900)
  - Background: `rgb(255 255 255)` (white)
  - Borders: `rgb(203 213 225)` (slate-300)
  - Hover: `rgb(241 245 249)` (slate-100)

### Other Tokens

- **Spacing**: Consistent spacing scale (80px desktop, 32px mobile)
- **Typography**: Font families (`var(--font-geist-sans)`, `var(--font-geist-mono)`)
- **Border Radius**: Unified radius values (128px for buttons)
- **Brand Colors**: IdeaI-specific color palette (explicit RGB values)

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

**Current Components**:
- `IdeaIHeader` - Header component with `siteName` prop support
  - Displays "IdeaI {siteName}" (e.g., "IdeaI /web", "IdeaI /docs", "IdeaI /all")
  - Accepts `subtitle` and `children` props
- `IdeAIFooter` - Footer component with consistent styling
- `IdeAIButton` - Button component with app-specific alert messages
- `IdeAIContent` - Documentation index content (same as `/docs` page)
- `IdeAILogo` - Logo component with SEO metadata and structured data
- `IdeAIHTMLTest` - Comprehensive HTML5 test page component
  - Includes all HTML5 elements (forms, tables, lists, media)
  - Includes documentation index section
  - Used in `/all` app for UI testing

**Usage**:
```tsx
import { IdeaIHeader, IdeAIFooter, IdeAIButton } from "@repo/ui";

<IdeaIHeader siteName="/web" subtitle="Welcome to IdeaI">
  <IdeAIButton appName="web">Open alert</IdeAIButton>
</IdeaIHeader>
```

## Usage in Apps

### All Apps (Centralized CSS)

All apps use the same centralized CSS architecture:

```css
/* apps/*/app/globals.css */
@import "../../../packages/ui/src/styles/globals.css";
@import "../../../packages/ui/src/styles/ideai.css";
```

**Key Points**:
- Both `globals.css` and `ideai.css` are imported in every app
- `globals.css` provides Tailwind base + explicit RGB colors
- `ideai.css` provides IdeaI custom layer (imports `ideai-components.css`)
- CSS modules are minimal - only app-specific layout adjustments
- NO custom CSS in app `globals.css` files

### Using Shared Components

All apps use shared components:

```tsx
// From @repo/ui package exports
import { IdeaIHeader, IdeAIFooter, IdeAIButton, IdeAIContent, IdeAILogo, IdeAIHTMLTest } from "@repo/ui";

// Or direct imports
import { IdeaIHeader } from "@repo/ui/components/ideai-header";
import { Button } from "@repo/ui/components/ui/button"; // shadcn component
```

**All three apps** (`/web`, `/docs`, `/all`) use the same shared components for perfect consistency.

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
- ✅ shadcn/ui in `packages/ui` (Button component)
- ✅ Shared styles in `packages/ui/src/styles/` (globals.css, ideai.css, ideai-components.css)
- ✅ All three apps (`/web`, `/docs`, `/all`) import from shared package
- ✅ Explicit RGB colors for perfect consistency
- ✅ Centralized CSS architecture (no app-specific styling)
- ✅ Shared components: Header, Footer, Button, Content, Logo, HTMLTest
- ✅ Site name support via `siteName` prop

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
