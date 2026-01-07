---
title: Parent-Child App Verification Guide
description: Complete verification and testing guide for parent/child app architecture
---

# Parent-Child App Verification Guide

Complete guide to verify and test the parent/child app architecture.

## Quick Verification

### 1. Test Defaults (No Config Files)

\`\`\`bash

# Test that defaults work without .ideai.json files

node scripts/test-parent-child.js
\`\`\`

**Expected Output**:

- ✅ Parent App (web): Role: parent, URL: /
- ✅ Child Apps: Role: child (default), URLs: /apps/{name}
- ✅ All ports correct (3001-3009)

### 2. Check Dependencies

\`\`\`bash

# Verify parent has all child dependencies

pnpm --filter web build:check

# Or: node scripts/ideai-build-check.mjs web

\`\`\`

**Expected Output**:

- Shows parent dependencies count
- Shows child dependencies per app
- Lists missing dependencies (if any)
- Security status

### 3. Build Test

\`\`\`bash

# Build parent app

pnpm --filter web build
\`\`\`

**Expected**:

- ✅ Build succeeds
- ✅ Routes generated correctly
- ✅ No TypeScript errors
- ✅ No lint errors

### 4. Track Build

\`\`\`bash

# Track build metadata

pnpm --filter web build:track

# View report

node scripts/ideai-build-track.mjs web report
\`\`\`

**Expected**:

- Build metadata saved to `.ideai/builds/`
- Report shows parent and child dependencies
- Timestamp recorded

## Complete Test Checklist

### Configuration Tests

- [ ] Defaults work (no .ideai.json files)
      \`\`\`bash
      node scripts/test-parent-child.js
      \`\`\`
- [ ] Config files work (with .ideai.json)
      \`\`\`bash
  # Remove some configs, test defaults
  # Add configs back, test custom configs
  \`\`\`
- [ ] Parent/child detection correct
      \`\`\`bash
  # web = parent ✅
  # All others = child ✅
  \`\`\`

### Dependency Tests

- [ ] Dependency checker works
      \`\`\`bash
      pnpm --filter web build:check
      \`\`\`
- [ ] Dependency sync works (dry-run)
      \`\`\`bash
      pnpm --filter web build:sync --dry-run
      \`\`\`
- [ ] Build tracking works
      \`\`\`bash
      pnpm --filter web build:track
      \`\`\`

### Build Tests

- [ ] TypeScript compiles
      \`\`\`bash
      pnpm --filter web check-types
      \`\`\`
- [ ] Linter passes
      \`\`\`bash
      pnpm --filter web lint
      \`\`\`
- [ ] Build succeeds
      \`\`\`bash
      pnpm --filter web build
      \`\`\`
- [ ] Routes generated correctly
      \`\`\`bash
  # Check build output for routes
  \`\`\`

### Runtime Tests (Development)

- [ ] Parent app starts
      \`\`\`bash
      pnpm --filter web dev
  # Visit http://localhost:3000
  \`\`\`
- [ ] Child app routes work
      \`\`\`bash
  # Start child: pnpm --filter docs dev
  # Visit http://localhost:3000/apps/docs
  # Should show child app in iframe
  \`\`\`
- [ ] Iframe detection works
      \`\`\`bash
  # Child app header/footer should be hidden
  # Only <main> content visible
  \`\`\`

## Test Results

### ✅ Verified Working

1. **Defaults System**
   - ✅ web defaults to parent
   - ✅ All other apps default to children
   - ✅ URLs correct: /apps/{name}
   - ✅ Ports correct: 3001-3009

2. **Build System**
   - ✅ Dependency checker works
   - ✅ Dependency sync works (dry-run)
   - ✅ Build tracking works
   - ✅ Build metadata saved

3. **Configuration**
   - ✅ .ideai.json files read correctly
   - ✅ Defaults work when config missing
   - ✅ Custom configs override defaults

4. **TypeScript & Build**
   - ✅ TypeScript compiles
   - ✅ No type errors
   - ✅ Build succeeds
   - ✅ Routes generated

### ⚠️ Known Limitations

1. **Production Build**
   - Child apps not yet integrated in production build
   - Currently shows placeholder message
   - Future: Unified build strategy needed

2. **Missing Dependencies**
   - Parent doesn't have all child dependencies
   - Expected (iframe isolation)
   - Can sync if needed for unified build

## Verification Commands

### Full Verification Script

\`\`\`bash
#!/bin/bash

# scripts/verify-all.sh

echo "🧪 Running Full Verification..."

echo "1. Testing defaults..."
node scripts/test-parent-child.js

echo "2. Checking dependencies..."
node scripts/ideai-build-check.mjs web

echo "3. Checking TypeScript..."
pnpm --filter web check-types

echo "4. Checking linter..."
pnpm --filter web lint

echo "5. Building..."
pnpm --filter web build

echo "6. Tracking build..."
node scripts/ideai-build-track.mjs web build

echo "✅ All verification complete!"
\`\`\`

## Troubleshooting

### Issue: TypeScript Errors

**Solution**: Check `packages/ui/src/lib/ideai-build.ts` for type issues.

### Issue: Missing Dependencies

**Solution**: Run `pnpm --filter web build:sync` to auto-sync.

### Issue: Build Fails

**Solution**:

1. Check TypeScript: `pnpm --filter web check-types`
2. Check linter: `pnpm --filter web lint`
3. Check dependencies: `pnpm --filter web build:check`

### Issue: Defaults Not Working

**Solution**: Verify `packages/ui/src/lib/ideai-config.ts` has correct defaults.

## Documentation

- [IdeaI Config System](./ideai-config.md)
- [Build System](./ideai-build-system.md)
- [Parent-Child Status](./parent-child-status.md)
- [CSS Compatibility](./parent-child-css.md)


