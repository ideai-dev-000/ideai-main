# V0 Auto-Export Workflow - Frictionless Component Usage

**Date**: January 3, 2026  
**Status**: Implemented  
**Priority**: High

## The Goal

**Frictionless workflow**: Build UI in v0 → Immediately available in all apps → Test in situ across multiple apps.

## The Solution

**Auto-export system** that makes v0 components immediately available in all apps via `@repo/ui` imports.

## How It Works

### 1. Create in v0
```bash
# v0 generates component
apps/v0-ideai/components/ui/new-button.tsx
```

### 2. Sync to Staging
```bash
pnpm v0:sync
# → apps/web/components/v0-staging/components/ui/new-button.tsx
```

### 3. Auto-Export (Immediate Availability)
```bash
pnpm v0:export
# → packages/ui/src/components/v0/new-button.tsx
# → Updated packages/ui/src/index.ts
# → Available in ALL apps immediately!
```

### 4. Use in Any App
```tsx
// In ANY app (web, docs, all, etc.)
import { NewButton } from "@repo/ui";

export default function Page() {
  return <NewButton />;
}
```

**No manual steps** - components are immediately available!

## Workflow Options

### Option A: Manual Export
```bash
# After syncing
pnpm v0:sync
pnpm v0:export
# Components now available in all apps
```

### Option B: Watch Mode (Recommended)
```bash
# Start watch mode (runs in background)
pnpm v0:export:watch

# Now any changes in v0-staging auto-export
# Components available immediately in all apps
```

### Option C: Integrated Sync + Export
```bash
# Sync and export in one command (can be added)
pnpm v0:sync:export
```

## Directory Structure

```
apps/v0-ideai/
└── components/ui/new-button.tsx

↓ (sync)

apps/web/components/v0-staging/
└── components/ui/new-button.tsx

↓ (auto-export)

packages/ui/src/components/v0/
└── new-button.tsx

↓ (exported in index.ts)

packages/ui/src/index.ts
export { NewButton } from "./components/v0/new-button";

↓ (available everywhere)

apps/web/app/page.tsx
import { NewButton } from "@repo/ui"; ✅
```

## Benefits

1. **Frictionless**: Create → Sync → Export → Use (3 commands)
2. **Immediate**: Components available in all apps instantly
3. **Test in Situ**: Use in multiple apps to test compatibility
4. **No Manual Steps**: Auto-export handles everything
5. **Watch Mode**: Auto-export on changes (set and forget)

## Commands

```bash
# Sync v0-ideai → v0-staging
pnpm v0:sync

# Export v0-staging → packages/ui (make available)
pnpm v0:export

# Watch mode (auto-export on changes)
pnpm v0:export:watch

# Promote to production (when ready)
pnpm v0:promote components/ui/new-button.tsx --to ui
```

## Example Workflow

```bash
# 1. v0 generates component
# apps/v0-ideai/components/ui/awesome-card.tsx

# 2. Sync to staging
pnpm v0:sync

# 3. Export (make available in all apps)
pnpm v0:export
# ✅ Component now available!

# 4. Use in any app
# apps/web/app/page.tsx
import { AwesomeCard } from "@repo/ui";

# 5. Test in multiple apps
# apps/docs/app/page.tsx
import { AwesomeCard } from "@repo/ui";

# 6. When ready, promote to production
pnpm v0:promote components/ui/awesome-card.tsx --to ui
```

## Watch Mode (Recommended)

**Start once, forget about it**:

```bash
# Terminal 1: Start watch mode
pnpm v0:export:watch

# Terminal 2: Work normally
# - Generate in v0
# - Sync: pnpm v0:sync
# - Components auto-export and available immediately!
```

## Staging for Updates

**Same-named components**:
- New version syncs to `v0-staging/`
- Auto-export updates existing export
- All apps get updated version immediately
- Test before promoting to production

## Testing Across Apps

**Frictionless testing**:

```tsx
// Test in web app
// apps/web/app/test/page.tsx
import { NewComponent } from "@repo/ui";

// Test in docs app
// apps/docs/app/test/page.tsx
import { NewComponent } from "@repo/ui";

// Test in all app
// apps/all/app/test/page.tsx
import { NewComponent } from "@repo/ui";
```

**Same import, works everywhere!**

## Production Promotion

When component is tested and ready:

```bash
# Promote from staging to production
pnpm v0:promote components/ui/new-button.tsx --to ui

# Or to shared
pnpm v0:promote components/shared-header.tsx --to shared
```

## Summary

**Complete Workflow**:
1. **Create** in v0 → `apps/v0-ideai/`
2. **Sync** to staging → `apps/web/components/v0-staging/`
3. **Export** (auto) → `packages/ui/src/components/v0/`
4. **Use** in any app → `import { Component } from "@repo/ui"`
5. **Test** across apps → Frictionless testing
6. **Promote** when ready → Production location

**Result**: Frictionless, immediate, testable across all apps!

---

## Related

- [V0 Staging Workflow](./v0-staging-workflow.md)
- [V0 Sync Strategy](./v0-sync-strategy.md)

