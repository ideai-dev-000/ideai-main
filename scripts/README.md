# IdeaI Scripts

**Complete, semantic script organization with flat structure and unified UI.**

## Quick Start

### Unified UI (Recommended)

Access all tools through the unified UI:

```bash
node scripts/ideai-ui-main.mjs
```

The UI provides:

- 🔨 **Build**: Verification, testing, documentation
- 🚀 **Boot**: Dev server management
- 🛠️ **Develop**: Deployment and sync tools
- ✅ **Verify**: Complete system verification and sign-off

### Direct CLI Access

All scripts are in `scripts/` root with semantic naming: `ideai-[main]-[sub]`

```bash
# Build tools
node scripts/ideai-build.mjs verify
node scripts/ideai-build.mjs rules list
node scripts/ideai-build-checker-dependency.mjs
node scripts/ideai-build-sync-dependency.mjs

# Boot tools
node scripts/ideai-boot-manager.mjs
node scripts/ideai-boot-dev-server-manager.mjs start

# Develop tools
node scripts/ideai-develop-vercel-link.mjs web
node scripts/ideai-develop-setup-secrets.sh
node scripts/ideai-develop-sync-docs.sh
```

## Structure

All scripts are in `scripts/` root with flat naming pattern:

```
scripts/
├── ideai-build.mjs                    # Main CLI entry point
├── ideai-build-*.mjs                  # Build tools (14 files)
├── ideai-boot-*.mjs                   # Boot tools (3 files)
├── ideai-develop-*.mjs                # Develop tools (6 files)
├── ideai-ui-main.mjs                  # Unified UI main entry
├── ideai-ui-test.mjs                  # UI test script
├── ideai-useful-test-local.mjs        # Local testing script
├── README.md                          # This file
└── TODOS.md                           # All TODOs consolidated
```

## Scripts by Category

### Build Scripts (14 files)

**Core:**

- `ideai-build.mjs` - Main CLI
- `ideai-build-ui.mjs` - Build verification UI
- `ideai-build-docs-verifier.mjs` - Documentation verification

**Dependencies:**

- `ideai-build-checker-dependency.mjs` - Dependency checker
- `ideai-build-sync-dependency.mjs` - Dependency sync

**Logging & Monitoring:**

- `ideai-build-logger.mjs` - Unified logger
- `ideai-build-monitor-memory.mjs` - Memory monitor

**Management:**

- `ideai-build-manager-rules.mjs` - Rules manager
- `ideai-build-tracker.mjs` - Build tracker
- `ideai-build-metadata-read.mjs` - Metadata reader

**Testing:**

- `ideai-build-test-minimal.mjs` - Minimal test
- `ideai-build-test-parent-child.mjs` - Parent/child test
- `ideai-build-test-quick.mjs` - Quick test
- `ideai-build-verify-all.sh` - Verify all script

### Boot Scripts (3 files)

- `ideai-boot-logger-boot.mjs` - Boot session logger
- `ideai-boot-logger-cleanup.mjs` - Log cleanup utility
- `ideai-boot-logger-dev.mjs` - Dev server operation logger

### Develop Scripts (6 files)

**Vercel:**

- `ideai-develop-vercel-link.mjs` - Link apps to Vercel projects
- `ideai-develop-vercel-setup-subdomain.sh` - Subdomain DNS setup

**GitHub:**

- `ideai-develop-github-sync-vercel.sh` - Sync Vercel CLI to GitHub

**Sync:**

- `ideai-develop-sync-docs.sh` - Sync documentation files

**Setup:**

- `ideai-develop-setup-secrets.sh` - Setup GitHub secrets
- `ideai-develop-ignore-build-web.sh` - Ignore build step for web

## Naming Pattern

All scripts follow the pattern: `ideai-[main function]-[sub function].[ext]`

**Examples:**

- `ideai-build-checker-dependency.mjs` - Build → Dependency Checker
- `ideai-boot-logger-dev.mjs` - Boot → Dev Logger
- `ideai-develop-vercel-link.mjs` - Develop → Vercel Link

## Key Principles

1. **Zero Bloat**: Only essential tools, no duplication
2. **Composable**: Tools work together seamlessly
3. **Semantic**: Clear, descriptive names (`ideai-[main]-[sub]`)
4. **Flat Structure**: All scripts in root (no nested modules)
5. **Complete Coverage**: All tasks accessible via UI or CLI

## Usage Examples

### Build Verification

```bash
# Full verification with UI
node scripts/ideai-build.mjs verify

# Documentation only
node scripts/ideai-build.mjs verify --docs

# No UI (silent)
node scripts/ideai-build.mjs verify --no-ui
```

### Boot Process

```bash
# Boot logging
node scripts/ideai-boot-logger-boot.mjs

# Dev server logging
node scripts/ideai-boot-logger-dev.mjs

# Cleanup logs
node scripts/ideai-boot-logger-cleanup.mjs
```

### Development Tools

```bash
# Link app to Vercel
node scripts/ideai-develop-vercel-link.mjs web

# Setup subdomain
./scripts/ideai-develop-vercel-setup-subdomain.sh docs docs myui.space

# Sync docs
./scripts/ideai-develop-sync-docs.sh
```

## Integration

All tools integrate with:

- **Memory Monitoring**: Prevents 70GB memory leaks
- **Health Checks**: Automatic bail-out on hangs
- **Logging**: Comprehensive operation logs
- **Rules Management**: Centralized development rules
- **Documentation Verification**: OCD-level accuracy checks

## TODOs

See `TODOS.md` in root for all pending work and improvements.

---

**Status**: Active Development  
**Last Updated**: January 1, 2026
