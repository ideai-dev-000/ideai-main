# V0 Sync Workflow - Discussion & Implementation Guide

**Version**: 1.0.0  
**Date**: January 3, 2026  
**Status**: Proposal - Ready for Discussion

## The Vision

Create an "automagical" sync system where:
1. **v0 generates components** in `apps/v0-ideai/`
2. **Sync script detects changes** and applies IdeaI alignment
3. **Components flow into IdeaI** automatically or on-demand
4. **Zero import changes needed** - v0 code works out of the box

## Current State

✅ **V0 Compatibility**: `apps/web/components/ui/` structure matches v0  
✅ **Import Paths**: `@/components/ui/*` works naturally  
✅ **Sync Script**: `ideai-v0-sync.mjs` created (proof of concept)

## Proposed Approaches

### Option A: File Watcher (Real-time)

**How**: Background process watches `apps/v0-ideai/` and syncs on change.

**Commands**:
```bash
# Start watcher
pnpm v0:watch

# Watcher runs in background, syncs automatically
```

**Pros**: Real-time, minimal manual steps  
**Cons**: Requires background process, may sync unwanted changes

---

### Option B: Build-time Sync (Integrated)

**How**: Sync runs automatically during `pnpm build`.

**Implementation**:
```json
"build": "node scripts/ideai-v0-sync.mjs && turbo run build"
```

**Pros**: Integrated, syncs before every build/deploy  
**Cons**: Only syncs during build, not real-time

---

### Option C: Manual Sync (Explicit)

**How**: Developer runs sync command when ready.

**Commands**:
```bash
# Preview what would sync
pnpm v0:sync:preview

# Sync compatible files
pnpm v0:sync

# Force overwrite
pnpm v0:sync --force
```

**Pros**: Full control, review before sync  
**Cons**: Manual step, easy to forget

---

### Option D: Hybrid (Recommended)

**How**: Combine all approaches - watcher optional, manual always available, build-time safety net.

**Workflow**:
1. **Development**: Optional watcher (`pnpm v0:watch`)
2. **Ready to sync**: Manual command (`pnpm v0:sync`)
3. **Build/Deploy**: Automatic sync before build

**Pros**: Flexible, best of all worlds  
**Cons**: More complex

---

## Sync Rules (What Gets Synced)

### ✅ Sync These

- **Components**: `apps/v0-ideai/components/*` → `apps/web/components/*`
- **UI Components**: `apps/v0-ideai/components/ui/*` → `apps/web/components/ui/*`
- **Pages**: `apps/v0-ideai/app/**/*.tsx` → `apps/web/app/`
- **Modules**: Reusable modules → `apps/web/components/`
- **Blocks**: Page blocks → `apps/web/components/blocks/`

### ❌ Skip These

- `node_modules/`
- `.next/`
- Config files (`package.json`, `tsconfig.json`, etc.)
- Test files (unless configured)
- Build artifacts

### 🔄 IdeaI Alignment Applied

1. **File Naming**: Convert to kebab-case
2. **Code Headers**: Add IdeaI headers
3. **Imports**: Ensure `@/components/ui/*` paths
4. **Brand**: Replace with "IdeaI"
5. **Types**: Fix TypeScript issues
6. **Standards**: Apply IdeaI patterns

---

## Questions to Discuss

### 1. Where does v0 generate code?

**Option A**: In `apps/v0-ideai/` (current structure)  
**Option B**: In a separate directory  
**Option C**: In v0's own Git repo (submodule)

**Recommendation**: Option A - Keep `apps/v0-ideai/` as v0 workspace

---

### 2. What triggers sync?

**Option A**: File watcher (real-time)  
**Option B**: Manual command (explicit)  
**Option C**: Build-time (automatic)  
**Option D**: Git hooks (on commit)

**Recommendation**: Option D (Hybrid) - All of the above

---

### 3. Conflict resolution?

**Option A**: Auto-overwrite (force)  
**Option B**: Skip existing files  
**Option C**: Backup + merge  
**Option D**: Manual review

**Recommendation**: Option C - Backup before overwrite, allow merge

---

### 4. What gets synced automatically?

**Option A**: Everything compatible  
**Option B**: Only components  
**Option C**: Only specific patterns  
**Option D**: Configurable whitelist

**Recommendation**: Option D - Configurable sync rules

---

### 5. Alignment automation level?

**Option A**: Fully automatic (apply all IdeaI standards)  
**Option B**: Basic alignment (imports, naming)  
**Option C**: Manual review required  
**Option D**: Hybrid (auto + review)

**Recommendation**: Option B - Basic auto, manual review for complex

---

## Implementation Plan

### Phase 1: Core Sync (Current)

✅ **Done**:
- Basic sync script created
- File scanning
- IdeaI alignment (basic)
- Preview mode

⏳ **Next**:
- Enhanced alignment rules
- Conflict resolution
- Better error handling

### Phase 2: Integration

- [ ] Add to build process
- [ ] Add to deploy process
- [ ] Create sync config file

### Phase 3: Watcher (Optional)

- [ ] File watcher implementation
- [ ] Change detection
- [ ] Queue management

### Phase 4: Advanced Features

- [ ] Component dependency tracking
- [ ] Automatic import updates
- [ ] Sync history/rollback

---

## Recommended Workflow

### For Daily Development

1. **Develop in v0**: Create components in `apps/v0-ideai/`
2. **Preview sync**: `pnpm v0:sync:preview` to see what would sync
3. **Sync when ready**: `pnpm v0:sync` to sync compatible files
4. **Review changes**: Check synced files, apply IdeaI standards
5. **Commit**: Commit synced components

### For Continuous Sync

1. **Start watcher**: `pnpm v0:watch` (optional)
2. **Develop in v0**: Make changes
3. **Auto-sync**: Watcher syncs compatible files
4. **Review**: Check synced files periodically
5. **Commit**: Commit when ready

### For Build/Deploy

1. **Build triggers sync**: Automatic before build
2. **Review synced files**: Check what changed
3. **Continue build**: Normal build process

---

## Next Steps

1. **Test sync script**: Try with real v0 components
2. **Discuss approach**: Choose preferred method
3. **Refine rules**: Define exact sync behavior
4. **Implement**: Build chosen approach
5. **Document**: Create user guide

---

## Related

- [V0 Compatibility Restructure](./v0-compatibility-restructure.md)
- [V0 Sync Strategy](./v0-sync-strategy.md)
- [Submodule Development Workflow](../development/submodule-development-workflow.md)

