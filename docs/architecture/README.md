# Architecture Documentation

This directory contains architecture documentation for the IdeaI monorepo.

## Contents

- **[Design System](./design-system.md)** - Centralized component library and design system architecture
- **[UI Consistency Standards](./ui-consistency.md)** - Strict UI consistency rules and DOM inspection workflow
- **[Monorepo Structure](../PROJECT-SUMMARY.md)** - Overall project structure and organization

## Key Architectural Decisions

### Centralized Design System

All UI components and design tokens are centralized in `packages/ui`:
- Single source of truth for all components
- Updates benefit all applications automatically
- Scalable for future frameworks (Svelte, Vue, etc.)
- Ready for multi-library integration (Radix, Chakra UI, etc.)

### Shared Components

Components are shared via the `@repo/ui` package:
- All three apps (`apps/web`, `apps/docs`, `apps/all`) use the same components
- Consistent branding and behavior across all apps
- Site name support via `siteName` prop (e.g., "IdeaI /web", "IdeaI /docs", "IdeaI /all")
- Easy to maintain and update

### UI Consistency

Perfect UI consistency is enforced through:
- **Explicit RGB colors** - No dark mode auto-application
- **Centralized CSS** - All styles in `@repo/ui/src/styles/`
- **DOM inspection workflow** - Mandatory visual testing
- **Three-app testing** - `/web`, `/docs`, and `/all` must render identically

### Documentation Sync

Documentation is synced from `docs/` to `apps/docs/content/`:
- Source of truth: `docs/` directory
- Rendered site: `apps/docs/content/`
- Sync script: `pnpm sync-docs`

## Future Scalability

The architecture is designed to support:
- Multiple frameworks (React, Svelte, Vue)
- Multiple UI libraries (shadcn, Radix, Chakra UI, Bootstrap)
- Framework-agnostic design tokens
- Component library expansion

See [Design System Architecture](./design-system.md) for details.



