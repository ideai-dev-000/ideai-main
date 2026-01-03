#!/bin/bash

# Script to sync documentation from docs/ to apps/docs/content/
# Automatically syncs markdown documentation files from the docs/ directory
# to apps/docs/content/ for the documentation site.
#
# @location scripts/ideai-develop-sync-docs.sh

set -e

echo "📚 Syncing documentation files..."
echo ""

# Source and destination directories
SOURCE_DIR="docs"
DEST_DIR="apps/docs/content"

# Create destination directories if they don't exist
mkdir -p "$DEST_DIR"/{deployment,setup,development,tools,tasks}

# Copy main documentation files
echo "📄 Copying main docs..."
cp "$SOURCE_DIR"/README.md "$DEST_DIR"/index.mdx 2>/dev/null || true
cp "$SOURCE_DIR"/PROJECT-SUMMARY.md "$DEST_DIR"/project-summary.mdx 2>/dev/null || true
cp "$SOURCE_DIR"/CONTRIBUTING.md "$DEST_DIR"/contributing.mdx 2>/dev/null || true

# Copy subdirectories
echo "📁 Copying deployment docs..."
cp "$SOURCE_DIR"/deployment/*.md "$DEST_DIR"/deployment/ 2>/dev/null || true

echo "📁 Copying setup docs..."
cp "$SOURCE_DIR"/setup/*.md "$DEST_DIR"/setup/ 2>/dev/null || true

echo "📁 Copying development docs..."
cp "$SOURCE_DIR"/development/*.md "$DEST_DIR"/development/ 2>/dev/null || true

echo "📁 Copying tools docs..."
cp "$SOURCE_DIR"/tools/*.md "$DEST_DIR"/tools/ 2>/dev/null || true

echo "📁 Copying tasks docs..."
cp "$SOURCE_DIR"/tasks/*.md "$DEST_DIR"/tasks/ 2>/dev/null || true

# Convert .md to .mdx
echo "🔄 Converting .md to .mdx..."
find "$DEST_DIR" -name "*.md" -exec sh -c 'mv "$1" "${1%.md}.mdx"' _ {} \; 2>/dev/null || true

echo ""
echo "✅ Documentation sync complete!"
echo "   Source: $SOURCE_DIR/"
echo "   Destination: $DEST_DIR/"
echo ""
echo "📝 Next steps:"
echo "   1. Review changes in apps/docs/content/"
echo "   2. Test locally: pnpm dev --filter=docs"
echo "   3. Commit changes if ready"


