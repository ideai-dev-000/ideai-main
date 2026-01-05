# V0 Sync - Conflict Resolution Explained

**Date**: January 3, 2026  
**Purpose**: Clear explanation of conflict resolution strategies

## What is a Conflict?

A **conflict** happens when:
- v0 generates a component: `apps/v0-ideai/components/button.tsx`
- IdeaI already has: `apps/web/components/button.tsx`
- Sync script needs to decide: **What to do?**

## Conflict Resolution Options

### Option A: Auto-Overwrite (Dangerous)

**What happens**: New file replaces old file immediately.

**Example**:
```
v0 generates: button.tsx (new version)
IdeaI has: button.tsx (old version)
Result: Old version deleted, new version replaces it
```

**Pros**:
- ✅ Simple
- ✅ Always gets latest from v0

**Cons**:
- ❌ Loses old version (no backup)
- ❌ No way to recover
- ❌ May overwrite custom IdeaI changes

**When to use**: Never recommended for production.

---

### Option B: Skip (Safe but Limited)

**What happens**: If file exists, don't sync it.

**Example**:
```
v0 generates: button.tsx (new version)
IdeaI has: button.tsx (old version)
Result: Old version kept, new version ignored
```

**Pros**:
- ✅ Safe - never loses data
- ✅ Preserves custom changes

**Cons**:
- ❌ May miss important updates
- ❌ Manual work needed to update
- ❌ Can't sync if file exists

**When to use**: When you want to protect existing files.

---

### Option C: Backup + Overwrite (Recommended)

**What happens**: 
1. Backup old file to `.backup/` directory
2. Then overwrite with new file
3. You can review backup later

**Example**:
```
v0 generates: button.tsx (new version)
IdeaI has: button.tsx (old version)

Step 1: Copy old to: apps/web/components/.backup/button.tsx.backup
Step 2: Copy new to: apps/web/components/button.tsx
Result: New version in place, old version backed up
```

**Pros**:
- ✅ Safe - old version backed up
- ✅ Gets latest from v0
- ✅ Can recover if needed
- ✅ Can compare old vs new

**Cons**:
- ⚠️ Creates backup files (need cleanup)
- ⚠️ Slightly more complex

**When to use**: **Recommended for production** - best balance.

---

### Option D: Manual Review (Most Control)

**What happens**: 
1. Show diff (old vs new)
2. Ask developer to choose:
   - Keep old
   - Use new
   - Merge manually

**Example**:
```
v0 generates: button.tsx (new version)
IdeaI has: button.tsx (old version)

Shows:
  === Conflict: button.tsx ===
  Old: [shows old content]
  New: [shows new content]
  
  Choose:
  1. Keep old
  2. Use new
  3. Merge manually
  4. Skip
```

**Pros**:
- ✅ Full control
- ✅ Can see what changed
- ✅ Can merge manually

**Cons**:
- ❌ Requires manual step
- ❌ Slower workflow
- ❌ Not "automagical"

**When to use**: When you need full control over every change.

---

## Recommended: Backup + Overwrite (Option C)

**Why**: Best balance of automation and safety.

**Workflow**:
1. Sync runs
2. If conflict: Backup old file
3. Overwrite with new file
4. Developer reviews later
5. Cleanup backups periodically

**Implementation**:
```javascript
// Pseudo-code
if (destinationExists) {
  backupPath = join(destDir, '.backup', fileName + '.backup');
  copyFile(dest, backupPath);  // Backup old
  copyFile(source, dest);      // Overwrite with new
}
```

---

## For V0 Sync: Staging Area Approach

**Better solution**: Use staging area, so conflicts don't happen in production.

**Workflow**:
1. v0 syncs to: `apps/web/components/trials/` (staging)
2. No conflicts (always new files)
3. Review in staging
4. Sign-off → Move to production: `apps/web/components/` or `packages/ui/components/`

**Benefits**:
- ✅ No conflicts in staging (always new)
- ✅ Review before production
- ✅ Can test in staging
- ✅ Clean separation

---

## Summary

**For Production Files**:
- Use **Backup + Overwrite** (Option C)
- Safe, automated, recoverable

**For Staging/Trials**:
- Use **Auto-Overwrite** (Option A)
- No conflicts (always new files)
- Review before moving to production

**For Critical Files**:
- Use **Manual Review** (Option D)
- Full control when needed

