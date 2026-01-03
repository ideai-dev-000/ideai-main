# V0 Sync - Staging Workflow (Trial → Production)

**Date**: January 3, 2026  
**Status**: Proposed Implementation  
**Priority**: High

## The Problem

v0 generates components that need:
1. **Trial/Staging area** - Test before production
2. **Review process** - Sign-off before use
3. **Production location** - Final destination after approval

## Proposed Structure

### Staging Area (Trials)

```
apps/web/components/trials/
├── components/          # v0-generated components
│   ├── button-v2.tsx
│   ├── card-enhanced.tsx
│   └── ...
├── pages/               # v0-generated pages
│   ├── dashboard-v2.tsx
│   └── ...
└── blocks/             # v0-generated blocks
    ├── hero-section.tsx
    └── ...
```

**Purpose**: 
- All v0 components sync here first
- No conflicts (always new files)
- Review and test before production

### Production Locations

**After sign-off, components move to**:

1. **App-specific components**: `apps/web/components/`
   - Components only used in `web` app
   - Example: `apps/web/components/dashboard-card.tsx`

2. **Shared UI components**: `packages/ui/src/components/`
   - Components used across multiple apps
   - Example: `packages/ui/src/components/ideai-button.tsx`

3. **shadcn UI components**: `apps/web/components/ui/`
   - Standard shadcn components
   - Example: `apps/web/components/ui/button.tsx`

## Workflow

### Phase 1: Sync to Staging

```bash
# v0 generates component
apps/v0-ideai/components/new-button.tsx

# Sync to staging
pnpm v0:sync

# Result: 
apps/web/components/trials/components/new-button.tsx
```

**No conflicts** - staging is always new files.

### Phase 2: Review & Test

1. **Review component** in staging
2. **Test in app** (import from trials)
3. **Check IdeaI standards** compliance
4. **Verify functionality**

### Phase 3: Sign-Off & Promote

```bash
# Promote to production
pnpm v0:promote trials/components/new-button.tsx --to shared

# Or manually move:
# From: apps/web/components/trials/components/new-button.tsx
# To:   packages/ui/src/components/new-button.tsx
```

**Options**:
- `--to shared` → `packages/ui/src/components/`
- `--to app` → `apps/web/components/`
- `--to ui` → `apps/web/components/ui/` (shadcn)

### Phase 4: Cleanup

```bash
# Remove from staging after promotion
pnpm v0:cleanup --promoted

# Or keep for reference
# (manual cleanup later)
```

## Implementation

### Sync Script Updates

**Current**: Syncs directly to `apps/web/components/`  
**New**: Syncs to `apps/web/components/trials/`

**Benefits**:
- ✅ No conflicts in staging
- ✅ Clear separation
- ✅ Easy to review
- ✅ Can test before production

### Promote Script

**New command**: `pnpm v0:promote <path> --to <location>`

**Example**:
```bash
# Promote to shared components
pnpm v0:promote trials/components/new-button.tsx --to shared

# Promote to app components
pnpm v0:promote trials/pages/dashboard.tsx --to app

# Promote to UI components
pnpm v0:promote trials/components/ui/dialog.tsx --to ui
```

## Directory Structure

```
apps/web/
├── components/
│   ├── ui/              # shadcn components (production)
│   ├── trials/          # v0 staging area (NEW)
│   │   ├── components/
│   │   ├── pages/
│   │   └── blocks/
│   └── [app-specific]/  # App-specific components
│
packages/ui/src/components/
├── [shared]/            # Shared components (production)
└── trials/              # Optional: shared trials (if needed)
```

## Benefits

1. **No Conflicts**: Staging always accepts new files
2. **Review Process**: Clear separation for review
3. **Testing**: Can test in staging before production
4. **Flexibility**: Choose production location per component
5. **Safety**: Never overwrites production accidentally

## Commands

```bash
# Sync v0 components to staging
pnpm v0:sync

# Preview what would sync
pnpm v0:sync:preview

# Watch mode (auto-sync to staging)
pnpm v0:watch

# Promote from staging to production
pnpm v0:promote <path> --to <location>

# List components in staging
pnpm v0:list

# Cleanup promoted components
pnpm v0:cleanup --promoted
```

## Questions

1. **Staging location**: `apps/web/components/trials/` or separate?
2. **Promote process**: Automatic or manual?
3. **Review workflow**: How to sign-off?
4. **Cleanup**: When to remove from staging?

