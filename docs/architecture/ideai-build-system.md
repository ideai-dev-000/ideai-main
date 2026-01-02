---
title: IdeaI Build System
description: Secure 2026 best practices for building parent/child apps with dependency tracking
---

# IdeaI Build System

Secure 2026 best practices for building parent/child apps with automatic dependency management and build tracking.

## Overview

The IdeaI build system:
- ✅ Automatically detects child app dependencies
- ✅ Verifies parent has all required dependencies
- ✅ Tracks builds for better visibility
- ✅ Uses secure 2026 best practices (pnpm, lock files, workspace protocol)

## Quick Start

### Check Dependencies

\`\`\`bash
# Check if parent has all child dependencies
pnpm --filter web build:check

# Or directly
node scripts/ideai-build-check.mjs web
\`\`\`

### Sync Dependencies

\`\`\`bash
# Auto-sync child dependencies to parent
pnpm --filter web build:sync

# Or with dry-run first
node scripts/ideai-build-sync.mjs web --dry-run
node scripts/ideai-build-sync.mjs web
\`\`\`

### Track Builds

\`\`\`bash
# Track a build
pnpm --filter web build:track

# Generate build report
node scripts/ideai-build-track.mjs web report
\`\`\`

## How It Works

### 1. Dependency Detection

The system reads `.ideai.json` configs to:
- Identify parent app
- List all child apps
- Read each child's `package.json`
- Collect all dependencies

### 2. Dependency Verification

Checks if parent has all dependencies its children need:
- Compares parent `package.json` with child dependencies
- Reports missing dependencies
- Shows which child uses which dependency

### 3. Auto-Sync (Optional)

Can automatically add missing dependencies to parent:
- Reads all child dependencies
- Adds missing ones to parent `package.json`
- Preserves existing versions
- Uses latest version if conflicts

### 4. Build Tracking

Tracks each build with metadata:
- Timestamp
- Parent and child apps
- All dependencies (parent + children)
- Saved to `.ideai/builds/`

## Configuration

### Parent App `.ideai.json`

\`\`\`json
{
  "role": "parent",
  "name": "IdeaI",
  "childApps": ["docs", "all", "nocss"],
  "build": {
    "includeChildDependencies": true,
    "verifyDependencies": true,
    "securityCheck": true,
    "trackBuilds": true
  }
}
\`\`\`

### Child App `.ideai.json`

\`\`\`json
{
  "role": "child",
  "name": "Documentation",
  "parentApp": "web",
  "localPort": 3001
}
\`\`\`

## Security Best Practices (2026)

### 1. Package Manager: pnpm

- ✅ Secure by default
- ✅ Lock file: `pnpm-lock.yaml`
- ✅ Workspace protocol for internal packages
- ✅ Faster installs

### 2. Lock File Verification

\`\`\`bash
# In CI/CD
pnpm install --frozen-lockfile
\`\`\`

### 3. Vulnerability Scanning

\`\`\`bash
# Regular security audits
pnpm audit

# Fix vulnerabilities
pnpm audit --fix
\`\`\`

### 4. Dependency Verification

- ✅ All dependencies tracked
- ✅ Version conflicts detected
- ✅ Missing dependencies identified
- ✅ Build metadata stored

## Build Workflow

### Development

\`\`\`bash
# 1. Check dependencies
pnpm --filter web build:check

# 2. Sync if needed (dry-run first)
pnpm --filter web build:sync --dry-run
pnpm --filter web build:sync

# 3. Install
pnpm install

# 4. Build
pnpm --filter web build

# 5. Track build
pnpm --filter web build:track
\`\`\`

### CI/CD

\`\`\`bash
# 1. Verify dependencies
pnpm --filter web build:check

# 2. Install with lock file
pnpm install --frozen-lockfile

# 3. Security audit
pnpm audit

# 4. Build
pnpm --filter web build

# 5. Track build
pnpm --filter web build:track
\`\`\`

## Build Tracking

Build metadata is saved to `.ideai/builds/`:

\`\`\`json
{
  "timestamp": "2026-01-01T16:39:17.276Z",
  "parentApp": "web",
  "childApps": ["docs", "all", "nocss"],
  "parentDependencies": { ... },
  "childDependencies": { ... },
  "totalDependencies": 24
}
\`\`\`

### View Build History

\`\`\`bash
# Latest build
node scripts/ideai-build-track.mjs web report

# All builds
ls .ideai/builds/
\`\`\`

## Scripts Reference

### `ideai-build-check.mjs`

Checks if parent has all child dependencies.

\`\`\`bash
node scripts/ideai-build-check.mjs [parent-app]
\`\`\`

**Output**:
- Parent dependencies count
- Child dependencies per app
- Missing dependencies list
- Security status

### `ideai-build-sync.mjs`

Auto-syncs child dependencies to parent.

\`\`\`bash
# Dry run
node scripts/ideai-build-sync.mjs [parent-app] --dry-run

# Actual sync
node scripts/ideai-build-sync.mjs [parent-app]
\`\`\`

**What it does**:
- Finds missing dependencies
- Adds them to parent `package.json`
- Preserves existing versions

### `ideai-build-track.mjs`

Tracks builds and generates reports.

\`\`\`bash
# Track build
node scripts/ideai-build-track.mjs [parent-app] build

# Generate report
node scripts/ideai-build-track.mjs [parent-app] report

# Check dependencies
node scripts/ideai-build-track.mjs [parent-app] check
\`\`\`

## Integration with package.json

Add scripts to parent app's `package.json`:

\`\`\`json
{
  "scripts": {
    "build:check": "node ../../scripts/ideai-build-check.mjs web",
    "build:sync": "node ../../scripts/ideai-build-sync.mjs web",
    "build:track": "node ../../scripts/ideai-build-track.mjs web build"
  }
}
\`\`\`

Then use:
\`\`\`bash
pnpm --filter web build:check
pnpm --filter web build:sync
pnpm --filter web build:track
\`\`\`

## Benefits

1. **Easier Compilation**: Parent automatically has all child dependencies
2. **Better Tracking**: Build metadata for debugging and optimization
3. **Security**: Lock files, audits, dependency verification
4. **Automation**: Auto-sync reduces manual work
5. **Visibility**: Clear view of all dependencies

## Notes

- Iframe approach: Parent doesn't need all child dependencies (each child loads its own)
- Unified build: If moving away from iframes, sync dependencies first
- Security: Always run `pnpm audit` before production builds
- Lock files: Never commit without `pnpm-lock.yaml`
