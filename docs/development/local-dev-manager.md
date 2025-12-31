---
title: Local Development Server Manager
description: Modern dev server management script for IdeaI monorepo - start, stop, restart, and monitor all apps
---

# Local Development Server Manager

## Overview

The dev manager script (`scripts/dev-manager.mjs`) provides a modern, zero-bloat way to manage all local development servers in the IdeaI monorepo. It automatically discovers apps, manages their lifecycle, and provides status monitoring.

## Features

- ✅ **Auto-discovery** - Automatically finds all apps from `apps/` folder
- ✅ **Port detection** - Extracts ports from `package.json` dev scripts
- ✅ **Status monitoring** - Checks if apps are running via port detection
- ✅ **Lifecycle management** - Start, stop, restart individual or all apps
- ✅ **Clean output** - Beautiful status table with URLs
- ✅ **Modern** - ES modules, no dependencies, 2027-facing
- ✅ **Non-blocking** - Starts apps in background, exits immediately

## Quick Commands

```bash
# Check status of all apps
pnpm dev:status

# Start all apps
pnpm dev:start

# Start specific app
pnpm dev:start web

# Stop all apps
pnpm dev:stop

# Stop specific app
pnpm dev:stop docs

# Restart all apps
pnpm dev:restart

# Restart specific app
pnpm dev:restart landing
```

## Direct Usage

You can also use the script directly:

```bash
node scripts/dev-manager.mjs status
node scripts/dev-manager.mjs start
node scripts/dev-manager.mjs start web
node scripts/dev-manager.mjs stop docs
node scripts/dev-manager.mjs restart
```

## Status Output

The status command shows a clean table:

```
📊 IdeaI Monorepo - Dev Server Status

┌─────────────┬──────────┬─────────┬─────────────────────────┐
│ App         │ Port     │ Status  │ URL                     │
├─────────────┼──────────┼─────────┼─────────────────────────┤
│ web         │ 3000     │ 🟢 Running │ http://localhost:3000   │
│ docs        │ 3001     │ 🟢 Running │ http://localhost:3001   │
│ all         │ 3002     │ 🔴 Stopped │ http://localhost:3002   │
└─────────────┴──────────┴─────────┴─────────────────────────┘

2/8 apps running
```

## How It Works

### Auto-Discovery

The script automatically:
1. Scans `apps/` directory for all subdirectories
2. Reads each app's `package.json`
3. Extracts port from dev script (e.g., `next dev --port 3000`)
4. Discovers all apps with their ports

### Port Detection

Ports are extracted from dev scripts using regex:
- `next dev --port 3000` → port 3000
- `next dev -p 3007` → port 3007

### Status Checking

Uses `lsof` to check if a port is in use:
- Port in use = app running
- Port free = app stopped

### Process Management

- **Start**: Spawns detached background processes (non-blocking)
- **Stop**: Kills processes using the port
- **Restart**: Stops then starts the app

## Available Apps

| App | Port | URL |
|-----|------|-----|
| web | 3000 | http://localhost:3000 |
| docs | 3001 | http://localhost:3001 |
| all | 3002 | http://localhost:3002 |
| nocss | 3003 | http://localhost:3003 |
| mvp | 3004 | http://localhost:3004 |
| tailwind | 3005 | http://localhost:3005 |
| allcss | 3006 | http://localhost:3006 |
| landing | 3007 | http://localhost:3007 |

## Best Practices

1. **Check status first**: `pnpm dev:status` before starting
2. **Start specific apps**: Only start what you need (e.g., `pnpm dev:start web`)
3. **Stop when done**: `pnpm dev:stop` to free up ports
4. **Use restart**: `pnpm dev:restart` if an app gets stuck

## Troubleshooting

### App Won't Start

1. Check if port is already in use: `lsof -ti:3000`
2. Stop any conflicting processes
3. Try restart: `pnpm dev:restart web`

### Port Already in Use

```bash
# Find what's using the port
lsof -ti:3000

# Kill it manually if needed
kill -9 $(lsof -ti:3000)
```

### Script Hangs

The script should exit immediately after starting apps. If it hangs:
1. Check for errors in the output
2. Verify Node.js version (requires Node 18+)
3. Try running directly: `node scripts/dev-manager.mjs status`

## Implementation Details

- **Language**: JavaScript (ES modules)
- **Dependencies**: None (uses Node.js built-ins only)
- **Process management**: `spawn` with `detached: true` for background processes
- **Port checking**: `lsof` command (Unix/macOS)
- **Exit behavior**: Exits immediately after starting (processes run in background)

## Related Documentation

- [Getting Started](./getting-started.md) - Initial development setup
- [Deployment Overview](../deployment/overview.md) - Production deployment








