# V0 Sync Discussion - Automagical Component Sync

**Date**: January 3, 2026  
**Status**: Proposal - Ready for Discussion  
**Priority**: High

## The Goal

Enable v0 to generate compatible components/modules/blocks that automatically sync into IdeaI when v0 updates them.

## Current Achievement

✅ **V0 Compatibility**: Monorepo structure now matches v0's standard paths
- `apps/web/components/ui/` - shadcn components
- `@/components/ui/*` imports work naturally
- v0 prototypes can be copied directly

## The Vision

**Workflow**:
1. **Prototype in v0** → Generate components in `apps/v0-ideai/`
2. **Sync automagically** → Components flow into `apps/web/`
3. **Zero import changes** → v0 code works out of the box
4. **IdeaI alignment** → Standards applied automatically

## Proposed Approaches

### 🎯 Recommended: Hybrid Approach

**Combines**:
- **File Watcher** (optional) - Real-time sync during development
- **Manual Sync** (always available) - Explicit control when ready
- **Build-time Sync** (automatic) - Safety net before build/deploy

**Why**: Best balance of automation and control.

---

## Implementation Status

### ✅ Created

1. **Sync Script** (`scripts/ideai-v0-sync.mjs`):
   - Scans `apps/v0-ideai/` for compatible files
   - Applies IdeaI alignment automatically
   - Syncs to `apps/web/`
   - Preview mode available

2. **Package Commands**:
   - `pnpm v0:sync` - Sync compatible files
   - `pnpm v0:sync:preview` - Preview what would sync
   - `pnpm v0:watch` - Watch mode (real-time)

3. **Documentation**:
   - `v0-sync-strategy.md` - Detailed proposal
   - `v0-sync-workflow.md` - Workflow guide
   - `v0-sync-discussion.md` - This file

### ⏳ Next Steps

1. **Test with real v0 components**
2. **Refine sync rules** based on usage
3. **Add build integration** (optional)
4. **Add watcher mode** (optional)

---

## Key Questions to Discuss

### 1. Where does v0 generate code?

**Current assumption**: `apps/v0-ideai/`

**Options**:
- ✅ `apps/v0-ideai/` (current structure)
- Alternative directory
- Separate Git repo (submodule)

**Recommendation**: Keep `apps/v0-ideai/` as v0 workspace

---

### 2. What triggers sync?

**Options**:
- **A. File Watcher** - Real-time, background process
- **B. Manual Command** - `pnpm v0:sync` when ready
- **C. Build-time** - Automatic before `pnpm build`
- **D. Git Hooks** - On commit/push
- **E. Hybrid** - All of the above (recommended)

**Recommendation**: Option E (Hybrid) - Flexible workflow

---

### 3. Conflict Resolution?

**When**: Destination file already exists

**Options**:
- **A. Auto-overwrite** - Force sync (dangerous)
- **B. Skip** - Don't overwrite (safe, but may miss updates)
- **C. Backup + Overwrite** - Backup first, then overwrite
- **D. Manual Review** - Show diff, ask to proceed

**Recommendation**: Option C - Backup before overwrite

---

### 4. What Gets Synced?

**Current Rules**:
- ✅ Components: `components/*` → `apps/web/components/*`
- ✅ UI Components: `components/ui/*` → `apps/web/components/ui/*`
- ✅ Pages: `app/**/*.tsx` → `apps/web/app/`
- ❌ Config files (package.json, tsconfig.json, etc.)
- ❌ node_modules, .next, build artifacts

**Question**: Should we sync:
- Modules/blocks to separate directory?
- Only components, or pages too?
- Custom sync rules per file type?

---

### 5. Alignment Automation Level?

**What gets applied automatically**:
- ✅ File naming (kebab-case)
- ✅ Import paths (`@/components/ui/*`)
- ✅ Basic brand replacement
- ✅ Code headers (basic)

**What needs manual review**:
- ⚠️ Complex TypeScript types
- ⚠️ Architecture patterns
- ⚠️ Custom logic

**Question**: How much automation vs. manual review?

---

## Testing the Sync

### Test 1: Preview Mode

```bash
# See what would sync
pnpm v0:sync:preview
```

**Result**: Shows 3 files (app/globals.css, app/layout.tsx, app/page.tsx)

### Test 2: Actual Sync

```bash
# Sync compatible files
pnpm v0:sync
```

**Result**: Syncs files with IdeaI alignment applied

### Test 3: Watch Mode

```bash
# Watch for changes
pnpm v0:watch
```

**Result**: Watches `apps/v0-ideai/` and syncs on change

---

## Recommended Workflow

### Daily Development

1. **Develop in v0**: Create components in `apps/v0-ideai/components/`
2. **Preview**: `pnpm v0:sync:preview` to see what would sync
3. **Sync**: `pnpm v0:sync` when ready
4. **Review**: Check synced files, apply IdeaI standards if needed
5. **Commit**: Commit synced components

### Continuous Sync (Optional)

1. **Start watcher**: `pnpm v0:watch` (runs in background)
2. **Develop in v0**: Make changes
3. **Auto-sync**: Watcher syncs compatible files automatically
4. **Review periodically**: Check synced files
5. **Commit**: Commit when ready

### Build/Deploy

1. **Build triggers sync**: Automatic before build (if integrated)
2. **Review**: Check what synced
3. **Continue**: Normal build process

---

## Next Steps

1. **Test sync script** with real v0-generated components
2. **Discuss approach** - Choose preferred method
3. **Refine sync rules** - Define exact behavior
4. **Add build integration** - Optional automatic sync
5. **Add watcher mode** - Optional real-time sync
6. **Document workflow** - Create user guide

---

## Files Created

- `scripts/ideai-v0-sync.mjs` - Sync script (proof of concept)
- `docs/architecture/v0-sync-strategy.md` - Detailed proposal
- `docs/architecture/v0-sync-workflow.md` - Workflow guide
- `docs/architecture/v0-sync-discussion.md` - This discussion doc

---

## Ready for Discussion! 🚀

The sync script is working and ready to test. Let's discuss:
- Which approach works best for your workflow?
- What sync rules make sense?
- How much automation vs. control?

