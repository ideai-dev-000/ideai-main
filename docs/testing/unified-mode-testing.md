---
title: Unified Mode Testing Guide
description: Testing guide for unified mode (all apps on port 3000)
---

# Unified Mode Testing Guide

## Status: ✅ Setup Complete, ⏳ Testing Needed

### What's Working

1. **Registry System**: Child apps imported and registered in `apps/web/app/apps/[app]/registry.ts`
2. **Mode Detection**: `NEXT_PUBLIC_IDEAI_APP_MODE=unified` toggles unified mode
3. **Iframe Detection**: Updated to detect `/apps/{name}` routes and hide branding
4. **Routing**: Routes return 200 OK

### Current Issue

Child app components are loading but not rendering. The page shows "Loading..." indefinitely.

**Possible Causes**:
- Child app pages have their own layouts that conflict
- Component import/export mismatch
- React hydration mismatch

### Test URLs (Unified Mode)

\`\`\`bash
# Start unified mode
NEXT_PUBLIC_IDEAI_APP_MODE=unified pnpm --filter web dev

# Test URLs
http://localhost:3000/apps/docs
http://localhost:3000/apps/all
http://localhost:3000/apps/tailwind
\`\`\`

### Next Steps

1. **Debug component rendering** - Check browser console for errors
2. **Test individual mode** - Verify iframe mode still works
3. **Deploy to preview** - Test on Vercel preview
4. **Deploy to production** - Test on myui.space

### Individual Mode Testing

\`\`\`bash
# Start individual mode (default)
pnpm --filter web dev
pnpm --filter docs dev  # In separate terminal

# Test URLs
http://localhost:3000/apps/docs  # Should use iframe to localhost:3001
\`\`\`








