# Architecture Documentation

This directory contains architecture documentation for the IdeaI monorepo.

## Contents

- **[Design System](./design-system.md)** - Centralized component library and design system architecture
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
- Both `apps/web` and `apps/docs` use the same components
- Consistent branding and behavior across all apps
- Easy to maintain and update

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

