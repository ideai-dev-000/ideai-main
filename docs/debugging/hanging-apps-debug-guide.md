# Debugging Hanging Apps: Capabilities & Vibecoder

**Date**: 2026-01-15  
**Issue**: `ideai-capabilities` and `ideai-vibecoder` apps sometimes hang during startup  
**Status**: Debugging in progress

## Problem Description

Both `ideai-capabilities` and `ideai-vibecoder` apps occasionally hang during startup, preventing them from responding on their ports (3018 and 3020 respectively).

## Root Cause Analysis

### Primary Suspect: `discover-plugins` Script (Capabilities Only)

The `ideai-capabilities` app runs `pnpm discover-plugins` before starting the dev server:

```json
{
  "dev": "pnpm discover-plugins && next dev --port 3018"
}
```

**Potential Hang Points in `discover-plugins.ts`**:

1. **Line 163**: `await import("@/plugins/index")`
   - This dynamically imports ALL plugins at once
   - If any plugin has a circular dependency or slow initialization, this can hang
   - The script then tries to import the registry, which may trigger TypeScript compilation

2. **Line 213, 502, 598, 747**: Multiple dynamic imports of `@/plugins/registry`
   - Each import may trigger separate compilation passes
   - If the registry has issues, this can hang

3. **TypeScript AST Processing** (lines 420-441)
   - Parsing step files using TypeScript compiler API
   - If there are many files or complex types, this can be slow

4. **Prettier Formatting** (line 54)
   - Dynamic import of Prettier
   - Formatting code for codegen templates
   - Can hang if Prettier config is missing or invalid

### Secondary Suspect: Next.js/Turbopack Compilation

Both apps use Next.js 16.1.x with Turbopack. Compilation can hang due to:

1. **Heavy root-level imports**
   - Importing large libraries in `layout.tsx` or `page.tsx`
   - Dynamic imports not used where needed

2. **Circular dependencies**
   - Between workspace packages (`@repo/ui`, `@repo/ideai-user`, etc.)
   - In plugin registry or step registry

3. **TypeScript type checking**
   - Complex types in plugin system
   - Large type unions (IntegrationType, etc.)

4. **Missing lazy loading**
   - Heavy components not lazy-loaded
   - See `docs/architecture/lazy-loading-strategy.md`

## Debugging Tools

### 1. Debug Startup Script

Run the debug script to trace startup:

```bash
cd apps/ideai-capabilities
node scripts/debug-startup.mjs
```

This will:

- Time each startup step
- Detect hangs (no output for 30+ seconds)
- Show where the process gets stuck

### 2. Manual Steps

**For Capabilities**:

```bash
# Step 1: Run discover-plugins separately
cd apps/ideai-capabilities
pnpm discover-plugins

# If it hangs, check:
# - plugins/index.ts exists and is valid
# - All plugin directories are valid
# - No circular imports in plugin registry

# Step 2: Start dev server
pnpm next dev --port 3018
```

**For Vibecoder**:

```bash
cd apps/ideai-vibecoder
pnpm next dev --port 3020
```

### 3. Check for Common Issues

**Port Already in Use**:

```bash
lsof -ti:3018,3020 | xargs kill -9
```

**Stuck Processes**:

```bash
ps aux | grep -E "next dev|tsx.*discover-plugins"
```

**Check Compilation**:

- Look for "Compiled successfully" or "Ready" messages
- If stuck on "Starting..." for >30s, likely hanging

## Solutions

### Solution 1: Make discover-plugins Non-Blocking (Recommended)

Modify `discover-plugins` to fail gracefully and not block dev server:

```typescript
// In discover-plugins.ts main()
async function main(): Promise<void> {
  const timeout = setTimeout(() => {
    console.warn("⚠️  discover-plugins taking too long, continuing anyway...");
    process.exit(0); // Exit gracefully, don't fail
  }, 30000); // 30 second timeout

  try {
    // ... existing code ...
    clearTimeout(timeout);
  } catch (error) {
    clearTimeout(timeout);
    console.warn("⚠️  discover-plugins failed, continuing anyway:", error);
    process.exit(0); // Don't fail the dev server
  }
}
```

**Update package.json**:

```json
{
  "dev": "pnpm discover-plugins || true && next dev --port 3018"
}
```

### Solution 2: Cache Plugin Registry

Generate plugin registry once and cache it:

```typescript
// Check if registry files are newer than plugins
const registryNeedsUpdate = checkRegistryAge();
if (!registryNeedsUpdate) {
  console.log("Using cached plugin registry");
  process.exit(0);
}
```

### Solution 3: Parallel Processing

Process plugins in parallel instead of sequentially:

```typescript
// Instead of for loop
await Promise.all(plugins.map(processPlugin));
```

### Solution 4: Lazy Load Heavy Components

Follow the lazy loading strategy:

- Lazy load components with framer-motion
- Lazy load animation components
- Lazy load large UI components

See `docs/architecture/lazy-loading-strategy.md`

### Solution 5: Increase Timeout

If hangs are due to slow compilation (not actual hangs):

```bash
# Increase Next.js timeout
NODE_OPTIONS="--max-old-space-size=8192" pnpm dev
```

## Prevention

1. **Always test startup after changes** to plugin system
2. **Monitor startup times** - if >30s, investigate
3. **Use debug script** before committing changes
4. **Document plugin dependencies** to avoid circular refs
5. **Lazy load heavy imports** in root layout/page

## Related Files

- `apps/ideai-capabilities/scripts/discover-plugins.ts` - Plugin discovery script
- `apps/ideai-capabilities/scripts/debug-startup.mjs` - Debug script
- `apps/ideai-capabilities/package.json` - Dev script configuration
- `docs/architecture/lazy-loading-strategy.md` - Lazy loading guidelines

## Status

- ✅ Debug script created
- 🔄 Investigating specific hang points
- ⏳ Testing solutions
