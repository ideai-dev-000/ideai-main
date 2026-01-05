# Cold Refresh - Complete Cleanup and Rebuild

**Version**: 1.0.0  
**Last Updated**: January 3, 2026  
**Purpose**: Complete cleanup and rebuild process for IdeaI monorepo

---

## Overview

The cold refresh script performs a complete cleanup of all dev servers, caches, and build artifacts, then rebuilds everything from scratch. This ensures a completely fresh build with no cached artifacts or running processes.

---

## Quick Start

```bash
# Full cold refresh with rebuild
pnpm build:cold

# Clean only, no rebuild
pnpm build:clean
```

---

## What It Does

### 1. Stops All Dev Servers

- Kills all processes on ports 3000-3013
- Stops all Node.js dev processes (pnpm, next, turbo)
- Ensures clean slate for rebuild

### 2. Cleans All Caches

- Removes all `.next` directories (frees disk space)
- Cleans `node_modules/.cache` directories
- Cleans `.turbo` cache directory
- Removes build artifacts (dist, build, out)

### 3. Syncs Submodules

- Updates all Git submodules to latest commits
- Initializes submodules if needed
- Ensures submodules are up to date

### 4. Rebuilds Everything

- Runs `pnpm build` to rebuild all apps
- Fresh build with no cached artifacts
- All 13 apps built from scratch

---

## Usage

### Full Cold Refresh

```bash
pnpm build:cold
```

**What happens**:

1. ✅ Stops all dev servers
2. ✅ Kills all Node.js processes
3. ✅ Cleans all `.next` directories
4. ✅ Cleans all caches
5. ✅ Cleans build artifacts
6. ✅ Syncs submodules to latest
7. ✅ Rebuilds all apps

### Clean Only (No Rebuild)

```bash
pnpm build:clean
```

**What happens**:

1. ✅ Stops all dev servers
2. ✅ Kills all Node.js processes
3. ✅ Cleans all `.next` directories
4. ✅ Cleans all caches
5. ✅ Cleans build artifacts
6. ⏭️ Skips rebuild

### Direct Script Usage

```bash
# Full cold refresh
node scripts/ideai-build-cold-refresh.mjs

# Clean only
node scripts/ideai-build-cold-refresh.mjs --no-build

# Quiet mode (CI/CD)
node scripts/ideai-build-cold-refresh.mjs --quiet
```

---

## When to Use

### Use Cold Refresh When:

- ✅ **After major dependency updates** - Ensures clean build
- ✅ **When builds are failing** - Eliminates cache issues
- ✅ **Before important deployments** - Guarantees fresh build
- ✅ **After long development sessions** - Clears accumulated cache
- ✅ **When disk space is low** - Frees up GB of cache files
- ✅ **After submodule updates** - Ensures latest submodule code

### Use Regular Build When:

- ✅ **Normal development** - Faster, uses cache
- ✅ **Quick iteration** - No need to clean everything
- ✅ **CI/CD pipelines** - Usually have clean environments

---

## Disk Space Savings

Cold refresh can free significant disk space:

- **`.next` directories**: ~150-300MB per app (13 apps = ~2-4GB)
- **`.turbo` cache**: ~5-10GB (depends on build history)
- **`node_modules/.cache`**: ~100-500MB

**Total potential savings**: ~7-15GB

---

## Example Output

```bash
$ pnpm build:cold

=== IdeaI Cold Refresh ===

This will:
  1. Stop all dev servers (ports 3000-3013)
  2. Kill all Node.js dev processes
  3. Clean all .next directories
  4. Clean node_modules/.cache
  5. Clean build artifacts
  6. Sync submodules to latest
  7. Rebuild all apps

=== Stopping All Dev Servers ===
✅ Stopped 3 process(es) on dev ports

=== Stopping All Node Processes ===
✅ Stopped all Node.js dev processes

=== Cleaning .next Directories ===
  ✅ Removed web/.next (333MB)
  ✅ Removed docs/.next (200MB)
  ...
✅ Cleaned 14 .next directory(ies) (~2745MB)

=== Cleaning Node Modules Cache ===
  ✅ Removed .turbo (5407MB)
✅ Cleaned 1 cache directory(ies)

=== Syncing Submodules ===
✅ apps/ideai-designer updated to 22e222c

=== Building All Apps ===
...
✅ Build completed successfully

✅ === Cold Refresh Complete ===
```

---

## Integration

### Automatic Submodule Sync

Cold refresh automatically syncs submodules before building, ensuring you always build with the latest submodule code.

### Build Process

The regular `pnpm build` command also syncs submodules automatically, but doesn't clean caches. Use `pnpm build:cold` when you need a completely fresh build.

---

## Troubleshooting

### Issue: Script fails to kill processes

**Solution**: Run with elevated permissions if needed:

```bash
sudo node scripts/ideai-build-cold-refresh.mjs
```

### Issue: Build fails after cold refresh

**Solution**: This is expected - cold refresh removes all caches. The build should succeed on retry:

```bash
pnpm build:cold  # Try again
```

### Issue: Submodule sync fails

**Solution**: Submodule sync failures are non-critical for optional submodules. Required submodules (like `ideai-designer`) must succeed.

---

## Related Documentation

- **`docs/deployment/submodule-automation.md`**: Automatic submodule updates
- **`docs/development/getting-started.md`**: Development workflow
- **`docs/deployment/QUICK-REFERENCE.md`**: Quick command reference

---

## Script Details

**Location**: `scripts/ideai-build-cold-refresh.mjs`

**Options**:

- `--no-build`: Clean only, skip rebuild
- `--quiet`: Suppress output (for CI/CD)

**Exit Codes**:

- `0`: Success
- `1`: Build failed (if not using `--no-build`)

---

**Last Updated**: January 3, 2026
