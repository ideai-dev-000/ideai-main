#!/bin/bash
# Cleanup old framework projects from Vercel
# Run: bash scripts/vercel-cleanup-old-frameworks.sh

echo "=== Removing Old Framework Projects from Vercel ==="
echo ""

OLD_APPS=("tailwind" "allcss" "bootstrap" "unocss" "shadcn" "material" "chakra" "radix")

for app in "${OLD_APPS[@]}"; do
  echo "Removing $app..."
  vercel projects rm "$app" --yes 2>&1 | grep -E "(Removed|not found|Error)" || echo "  ✅ Removed or not found"
done

echo ""
echo "✅ Cleanup complete"
