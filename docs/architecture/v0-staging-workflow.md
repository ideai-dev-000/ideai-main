# V0 Staging Workflow - Like-for-Like Structure

**Date**: January 3, 2026  
**Status**: Implemented  
**Priority**: High

## The Solution

**v0-staging folder** with **identical structure** to `apps/v0-ideai/` so v0 can edit directly in staging with perfect like-for-like paths.

## Structure

### V0 Source
```
apps/v0-ideai/
├── components/
│   ├── ui/
│   │   └── button.tsx
│   └── dashboard-card.tsx
├── app/
│   └── page.tsx
└── lib/
    └── utils.ts
```

### V0 Staging (Identical Structure)
```
apps/web/components/v0-staging/
├── components/
│   ├── ui/
│   │   └── button.tsx  ← Same path, v0 can edit directly
│   └── dashboard-card.tsx
├── app/
│   └── page.tsx
└── lib/
    └── utils.ts
```

**Key**: Structure is **identical** - v0 can work in either location with same paths!

## Workflow

### Phase 1: Sync to v0-staging

```bash
# v0 generates in apps/v0-ideai/
apps/v0-ideai/components/ui/button.tsx

# Sync to v0-staging (like-for-like)
pnpm v0:sync

# Result: Same structure
apps/web/components/v0-staging/components/ui/button.tsx
```

**Benefits**:
- ✅ Identical paths - v0 can edit in staging too
- ✅ No path changes needed
- ✅ Perfect like-for-like structure
- ✅ v0 can work in both locations seamlessly

### Phase 2: Edit in Staging (Optional)

v0 can now edit directly in `apps/web/components/v0-staging/`:
- Same paths as `apps/v0-ideai/`
- Same imports work
- Perfect compatibility

### Phase 3: Promote to Production

```bash
# Promote to shared components (all apps)
pnpm v0:promote components/ui/button.tsx --to shared
# → packages/ui/src/components/button.tsx

# Promote to app components (web only)
pnpm v0:promote components/dashboard-card.tsx --to app
# → apps/web/components/dashboard-card.tsx

# Promote to UI components (shadcn)
pnpm v0:promote components/ui/dialog.tsx --to ui
# → apps/web/components/ui/dialog.tsx
```

## Production Locations

### `--to shared`
**Destination**: `packages/ui/src/components/`  
**Use**: Components shared across all apps  
**Example**: `IdeAIHeader`, `IdeAIFooter`, shared utilities

### `--to app`
**Destination**: `apps/web/components/`  
**Use**: Components specific to web app  
**Example**: `DashboardCard`, `WebNav`, app-specific features

### `--to ui`
**Destination**: `apps/web/components/ui/`  
**Use**: shadcn/ui components  
**Example**: `Button`, `Card`, `Dialog`, standard UI primitives

## Commands

```bash
# Sync v0-ideai → v0-staging (like-for-like)
pnpm v0:sync

# Preview what would sync
pnpm v0:sync:preview

# Watch mode (auto-sync)
pnpm v0:watch

# Promote from staging to production
pnpm v0:promote <path> --to <location>

# Examples
pnpm v0:promote components/ui/button.tsx --to ui
pnpm v0:promote components/dashboard-card.tsx --to app
pnpm v0:promote components/shared-header.tsx --to shared
```

## Benefits

1. **Like-for-Like**: Identical structure, v0 can edit in staging
2. **No Path Changes**: Same imports work in both locations
3. **Perfect Compatibility**: v0 works seamlessly in staging
4. **Clear Separation**: Staging vs production
5. **Easy Promotion**: Simple command to move to production

## Example Workflow

```bash
# 1. v0 generates component
# apps/v0-ideai/components/ui/new-button.tsx

# 2. Sync to staging (like-for-like)
pnpm v0:sync
# → apps/web/components/v0-staging/components/ui/new-button.tsx

# 3. v0 can edit in staging (same paths!)
# Edit: apps/web/components/v0-staging/components/ui/new-button.tsx
# Imports work identically

# 4. Review and test in staging

# 5. Promote to production when ready
pnpm v0:promote components/ui/new-button.tsx --to ui
# → apps/web/components/ui/new-button.tsx

# 6. Commit and deploy
```

## Why This Works

**Identical Structure**:
- `apps/v0-ideai/components/ui/button.tsx`
- `apps/web/components/v0-staging/components/ui/button.tsx`

**Same Imports**:
```tsx
// Works in both locations
import { Button } from "@/components/ui/button";
```

**v0 Can Edit Both**:
- Generate in `v0-ideai/`
- Edit in `v0-staging/`
- Same paths, same imports, perfect compatibility

---

## Related

- [V0 Sync Strategy](./v0-sync-strategy.md)
- [V0 Sync Workflow](./v0-sync-workflow.md)
- [V0 Conflict Resolution](./v0-sync-conflict-resolution.md)

