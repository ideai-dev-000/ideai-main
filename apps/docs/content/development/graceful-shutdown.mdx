# Graceful Shutdown - Clean Dev Server Termination

**Version**: 1.0.0  
**Last Updated**: January 3, 2026  
**Purpose**: Gracefully shut down all IdeaI dev servers without data loss

---

## Overview

The graceful shutdown script cleanly stops all IdeaI dev servers by sending SIGTERM first (allowing processes to exit naturally), then SIGKILL only if needed. This ensures no data loss or corruption.

---

## Quick Start

```bash
# Graceful shutdown (default)
pnpm dev:stop

# Force kill (immediate)
pnpm dev:stop:force

# Direct script usage
node scripts/ideai-develop-graceful-shutdown.mjs
```

---

## What It Does

### 1. Graceful Shutdown (Default)

1. **Sends SIGTERM** to all dev server processes
   - Allows processes to exit naturally
   - Saves state, closes connections cleanly
   - No data loss

2. **Waits for Exit** (5 seconds for ports, 3 seconds for Node processes)
   - Gives processes time to shut down gracefully
   - Monitors which processes exit

3. **Sends SIGKILL if Needed**
   - Only if processes don't exit after SIGTERM
   - Ensures all processes are stopped

### 2. Force Kill Mode

- Skips graceful shutdown
- Immediately sends SIGKILL
- Use only if graceful shutdown fails

---

## Usage

### Graceful Shutdown (Recommended)

```bash
pnpm dev:stop
```

**What happens**:

1. ✅ Sends SIGTERM to all dev servers (ports 3000-3013)
2. ✅ Sends SIGTERM to all Node.js dev processes
3. ✅ Waits for graceful exit (5 seconds)
4. ✅ Sends SIGKILL only to processes that didn't exit
5. ✅ Verifies all processes are stopped

### Force Kill

```bash
pnpm dev:stop:force
```

**What happens**:

1. ✅ Immediately sends SIGKILL to all processes
2. ✅ No waiting, no graceful shutdown
3. ✅ Use only if graceful shutdown fails

### Direct Script Usage

```bash
# Graceful shutdown
node scripts/ideai-develop-graceful-shutdown.mjs

# Force kill
node scripts/ideai-develop-graceful-shutdown.mjs --force

# Quiet mode (CI/CD)
node scripts/ideai-develop-graceful-shutdown.mjs --quiet
```

---

## Integration

### Cold Refresh

The cold refresh script (`pnpm build:cold`) automatically uses graceful shutdown before cleaning and rebuilding.

### Manual Cleanup

Use graceful shutdown before manual cleanup:

```bash
# Stop all servers gracefully
pnpm dev:stop

# Then clean manually if needed
rm -rf apps/*/.next
```

---

## When to Use

### Use Graceful Shutdown When:

- ✅ **Normal development shutdown** - Clean exit, no data loss
- ✅ **Before cold refresh** - Ensures clean state
- ✅ **Before deployment** - Stops all dev servers cleanly
- ✅ **End of development session** - Proper cleanup

### Use Force Kill When:

- ⚠️ **Graceful shutdown failed** - Processes won't exit
- ⚠️ **Emergency shutdown** - Need immediate stop
- ⚠️ **Hanging processes** - Processes stuck and unresponsive

---

## Example Output

```bash
$ pnpm dev:stop

=== IdeaI Graceful Shutdown ===

Graceful mode: Sending SIGTERM first, then SIGKILL if needed

=== Stopping Dev Servers (Ports 3000-3013) ===
Sending graceful shutdown signal (SIGTERM)...
  → Sent SIGTERM to PID 12345 (port 3000)
  → Sent SIGTERM to PID 12346 (port 3001)
Waiting for graceful shutdown (5 seconds)...
✅ Stopped 2 dev server process(es)

=== Stopping Node.js Dev Processes ===
Sending graceful shutdown signal (SIGTERM)...
  → Sent SIGTERM to PID 12347 (pnpm.*dev)
Waiting for graceful shutdown (3 seconds)...
✅ Stopped 1 Node.js process(es)

=== Shutdown Complete ===
  Stopped 2 dev server(s)
  Stopped 1 Node.js process(es)
```

---

## Benefits

✅ **No Data Loss**: SIGTERM allows processes to save state  
✅ **Clean Exit**: Connections closed properly  
✅ **Fast**: Usually completes in 1-2 seconds  
✅ **Reliable**: Falls back to SIGKILL if needed  
✅ **Integrated**: Works with cold refresh automatically

---

## Troubleshooting

### Issue: Processes don't exit after SIGTERM

**Solution**: Script automatically sends SIGKILL after waiting period. If this fails, use force mode:

```bash
pnpm dev:stop:force
```

### Issue: Some processes still running

**Solution**: Run again or use force mode:

```bash
pnpm dev:stop:force
```

### Issue: Permission denied

**Solution**: Some processes may require elevated permissions. The script handles this gracefully.

---

## Related Documentation

- **`docs/development/cold-refresh.md`**: Cold refresh uses graceful shutdown
- **`docs/development/getting-started.md`**: Development workflow
- **`docs/HANDOVER-NOTE.md`**: Command reference

---

## Script Details

**Location**: `scripts/ideai-develop-graceful-shutdown.mjs`

**Options**:

- `--force`: Skip graceful shutdown, kill immediately
- `--quiet`: Suppress output (for CI/CD)

**Exit Codes**:

- `0`: Success (all processes stopped or none running)
- `1`: Error (should not occur in normal operation)

---

**Last Updated**: January 3, 2026
