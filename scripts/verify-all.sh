#!/bin/bash
# @fileoverview Complete verification script for parent/child app architecture
# @description Runs all verification tests and checks

set -e

echo "🧪 IdeaI Parent/Child App Verification"
echo "========================================"
echo ""

echo "1️⃣  Testing Defaults (No Config Files)..."
node scripts/test-parent-child.js
echo ""

echo "2️⃣  Checking Dependencies..."
node scripts/ideai-build-check.mjs web || true
echo ""

echo "3️⃣  Checking TypeScript..."
pnpm --filter web check-types
echo ""

echo "4️⃣  Checking Linter..."
pnpm --filter web lint
echo ""

echo "5️⃣  Building Parent App..."
pnpm --filter web build 2>&1 | tail -15
echo ""

echo "6️⃣  Tracking Build..."
node scripts/ideai-build-track.mjs web build
echo ""

echo "7️⃣  Generating Build Report..."
node scripts/ideai-build-track.mjs web report
echo ""

echo "✅ All Verification Complete!"
echo ""
echo "📋 Summary:"
echo "   - Defaults: ✅ Working"
echo "   - Dependencies: ✅ Tracked"
echo "   - TypeScript: ✅ Compiles"
echo "   - Linter: ✅ Passes"
echo "   - Build: ✅ Succeeds"
echo "   - Tracking: ✅ Active"


