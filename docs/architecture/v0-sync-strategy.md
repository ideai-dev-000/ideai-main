# V0 Sync Strategy - Automagical Component Sync

**Version**: 1.0.0  
**Date**: January 3, 2026  
**Status**: Proposal - Discussion Needed  
**Priority**: High - Enables seamless v0 → IdeaI workflow

## Vision

Create an "automagical" sync system that allows v0 to generate compatible components/modules/blocks that automatically flow into IdeaI when v0 updates them.

## Current State

✅ **V0 Compatibility Achieved**:
- `apps/web/components/ui/` - Standard shadcn components
- `@/components/ui/*` imports work naturally
- v0 prototypes can be copied directly

✅ **Existing Sync Patterns**:
- Submodule sync: `ideai-build-sync-submodules.mjs`
- Docs sync: `ideai-develop-sync-docs.sh`
- Build-time automation: Integrated into build/deploy

## Proposed Approaches

### Approach 1: File Watcher + Auto-Sync (Recommended)

**How it works**:
- Watch `apps/v0-ideai/` directory for changes
- Detect new/updated components, modules, blocks
- Automatically sync compatible files to `apps/web/`
- Run IdeaI alignment checks
- Commit changes automatically (with review)

**Pros**:
- ✅ Real-time sync
- ✅ Minimal manual intervention
- ✅ Works with v0's natural workflow
- ✅ Can filter what to sync

**Cons**:
- ⚠️ Requires file watcher process
- ⚠️ Need conflict resolution
- ⚠️ May sync unwanted files

**Implementation**:
```javascript
// scripts/ideai-v0-sync-watcher.mjs
// Watches apps/v0-ideai/ and syncs to apps/web/
```

---

### Approach 2: Git-Based Sync (Submodule Pattern)

**How it works**:
- Make `apps/v0-ideai` a Git submodule pointing to v0's repo
- v0 commits changes to its repo
- IdeaI pulls latest via `git submodule update --remote`
- Sync script processes changes and aligns with IdeaI

**Pros**:
- ✅ Version controlled
- ✅ Clear change history
- ✅ Works with existing submodule infrastructure
- ✅ Can review changes before syncing

**Cons**:
- ⚠️ Requires v0 to have its own Git repo
- ⚠️ Two-step process (v0 commit → IdeaI sync)
- ⚠️ More complex setup

**Implementation**:
```bash
# Add v0-ideai as submodule
git submodule add <v0-repo-url> apps/v0-ideai

# Sync script processes changes
node scripts/ideai-v0-sync.mjs
```

---

### Approach 3: Build-Time Sync

**How it works**:
- Sync runs automatically during `pnpm build`
- Checks `apps/v0-ideai/` for changes since last build
- Syncs compatible files to `apps/web/`
- Applies IdeaI alignment
- Continues with build

**Pros**:
- ✅ Integrated into existing workflow
- ✅ No separate process needed
- ✅ Syncs before every build/deploy

**Cons**:
- ⚠️ Only syncs during build
- ⚠️ Not real-time
- ⚠️ May slow down builds

**Implementation**:
```json
// package.json
"build": "node scripts/ideai-v0-sync.mjs && node scripts/ideai-build-sync-submodules.mjs --init --quiet && turbo run build"
```

---

### Approach 4: Manual Sync Command (Explicit)

**How it works**:
- Developer runs sync command when ready
- Script scans `apps/v0-ideai/` for changes
- Shows preview of what will sync
- Applies IdeaI alignment
- Commits changes

**Pros**:
- ✅ Full control
- ✅ Review before sync
- ✅ No background processes
- ✅ Simple to implement

**Cons**:
- ⚠️ Manual step required
- ⚠️ Not "automagical"
- ⚠️ Easy to forget

**Implementation**:
```bash
# Manual sync
pnpm v0:sync

# Or with preview
pnpm v0:sync --preview
```

---

### Approach 5: Hybrid - Watcher + Manual Override (Best of Both)

**How it works**:
- File watcher runs in background (optional)
- Detects changes and queues for sync
- Developer can review and approve
- Manual sync command always available
- Build-time sync as fallback

**Pros**:
- ✅ Real-time detection
- ✅ Manual control when needed
- ✅ Build-time safety net
- ✅ Flexible workflow

**Cons**:
- ⚠️ More complex
- ⚠️ Multiple sync mechanisms

**Implementation**:
```bash
# Start watcher (optional)
pnpm v0:watch

# Manual sync (always available)
pnpm v0:sync

# Build-time sync (automatic)
pnpm build  # Includes v0 sync
```

---

## Recommended: Hybrid Approach

**Why**: Best balance of automation and control.

### Components

1. **Sync Script** (`ideai-v0-sync.mjs`):
   - Scans `apps/v0-ideai/` for compatible files
   - Applies IdeaI alignment
   - Syncs to `apps/web/`
   - Handles conflicts

2. **File Watcher** (`ideai-v0-watcher.mjs` - Optional):
   - Watches `apps/v0-ideai/` for changes
   - Queues files for sync
   - Notifies developer

3. **Build Integration**:
   - Runs sync before build
   - Ensures latest v0 components

4. **Manual Command**:
   - `pnpm v0:sync` - Explicit sync
   - `pnpm v0:sync --preview` - Preview changes
   - `pnpm v0:watch` - Start watcher

---

## Sync Rules

### What Gets Synced

**Components** (`apps/v0-ideai/components/`):
- ✅ New components → `apps/web/components/`
- ✅ Updated components → Overwrite if compatible
- ✅ UI components → `apps/web/components/ui/`

**Pages** (`apps/v0-ideai/app/`):
- ✅ New pages → `apps/web/app/`
- ✅ Updated pages → Merge or overwrite

**Modules/Blocks**:
- ✅ Reusable modules → `apps/web/components/`
- ✅ Page blocks → `apps/web/components/blocks/`

### What Gets Filtered

- ❌ `node_modules/`
- ❌ `.next/`
- ❌ Config files (unless explicitly allowed)
- ❌ Test files (unless in sync config)

### IdeaI Alignment Applied

1. **File Naming**: Convert to kebab-case
2. **Code Headers**: Add IdeaI headers
3. **Imports**: Update to use `@/components/ui/*`
4. **Brand**: Replace with "IdeaI"
5. **Types**: Fix TypeScript types
6. **Standards**: Apply IdeaI patterns

---

## Implementation Plan

### Phase 1: Core Sync Script
- [ ] Create `ideai-v0-sync.mjs`
- [ ] Implement file scanning
- [ ] Implement IdeaI alignment
- [ ] Add conflict resolution

### Phase 2: Build Integration
- [ ] Add to build process
- [ ] Add to deploy process
- [ ] Test with real v0 components

### Phase 3: Watcher (Optional)
- [ ] Create file watcher
- [ ] Add notification system
- [ ] Add queue management

### Phase 4: Documentation
- [ ] Document sync workflow
- [ ] Create examples
- [ ] Add troubleshooting guide

---

## Questions to Discuss

1. **Where does v0 generate code?**
   - In `apps/v0-ideai/`?
   - In a separate directory?
   - In v0's own repo?

2. **What triggers sync?**
   - File changes?
   - Git commits?
   - Manual command?
   - Build time?

3. **Conflict resolution?**
   - Auto-merge?
   - Manual review?
   - Backup before overwrite?

4. **What gets synced?**
   - All files?
   - Only components?
   - Only specific patterns?

5. **Alignment automation?**
   - Fully automatic?
   - Review required?
   - Hybrid approach?

---

## Next Steps

1. **Discuss approach** - Choose preferred method
2. **Define sync rules** - What syncs, what doesn't
3. **Implement core script** - Basic sync functionality
4. **Test with v0** - Real-world testing
5. **Iterate** - Refine based on usage

---

## Related

- [V0 Compatibility Restructure](./v0-compatibility-restructure.md)
- [Submodule Development Workflow](../development/submodule-development-workflow.md)
- [Submodule Automation](../deployment/submodule-automation.md)

