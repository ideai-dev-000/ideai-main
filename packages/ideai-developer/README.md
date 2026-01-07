# @repo/ideai-developer

**Centralized developer tools package for IdeaI monorepo.**

## Overview

This package provides all developer tools and utilities, ensuring tight coupling between scripts and implementation. All tools are **dev-only** and will never run in production.

## Architecture

```
packages/ideai-developer/
├── src/
│   ├── index.ts                    # Main exports (TypeScript consumers)
│   ├── local/                      # LOCAL-ONLY (never in prod)
│   │   ├── cli/                    # CLI functions (.mjs for direct import)
│   │   │   ├── ui.mjs              # Developer UI
│   │   │   ├── port.mjs            # Port manager
│   │   │   ├── script.mjs          # Script runner
│   │   │   └── build.mjs           # Build status
│   │   ├── components/              # React components (.tsx)
│   │   │   └── [future components]
│   │   └── utils/                   # Utilities
│   │       └── dev-check.mjs       # Dev-only validation
│   └── types/                       # TypeScript types
└── package.json
```

## Usage

### From Scripts (Node.js)

Import directly from `.mjs` files:

```javascript
// In scripts/ideai-developer.mjs
import { getPortStatus } from "../packages/ideai-developer/src/local/cli/port.mjs";
```

### From React Components (TypeScript)

Import from package:

```typescript
import { isDevelopment } from "@repo/ideai-developer";
```

## Entry Point

All tools are accessed via the single entry point:

```bash
node scripts/ideai-developer.mjs <command> [subcommand] [options]
```

This ensures:

- ✅ Single source of truth (package)
- ✅ Scripts are thin wrappers
- ✅ Tight coupling maintained
- ✅ Easy to maintain

## Commands

### UI

```bash
node scripts/ideai-developer.mjs ui [--mode=build|boot|develop]
```

### Port Management

```bash
node scripts/ideai-developer.mjs port status
node scripts/ideai-developer.mjs port start
node scripts/ideai-developer.mjs port stop
```

### Script Runner

```bash
node scripts/ideai-developer.mjs script <name> [args...]
```

### Build Status

```bash
node scripts/ideai-developer.mjs build status
```

## Dev-Only Safety

All functions use `assertDevelopment()` to ensure they never run in production:

```javascript
import { assertDevelopment } from "../utils/dev-check.mjs";

export function myDevFunction() {
  assertDevelopment(); // Throws if not in dev
  // ... dev-only code
}
```

## Adding New Tools

1. Create function in `src/local/cli/` (`.mjs` for CLI, `.tsx` for components)
2. Add dev check: `assertDevelopment()`
3. Export from `src/index.ts` (if TypeScript consumer)
4. Add route in `scripts/ideai-developer.mjs`
5. Update this README

## Principles

- **Tight Coupling**: Scripts call package functions, not duplicate logic
- **Dev-Only**: All tools are development-only, never in production
- **Single Entry Point**: `scripts/ideai-developer.mjs` routes to package
- **Type Safety**: TypeScript for components, `.mjs` for CLI functions
- **Maintainability**: All logic in package, scripts are thin wrappers


