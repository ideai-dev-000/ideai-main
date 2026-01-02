---
title: Unified vs Individual Mode Testing Results
description: Complete test results for both unified and individual modes
---

# Unified vs Individual Mode Testing Results

## Test Date: 2026-01-01

## ✅ Unified Mode (All on Port 3000)

### Setup
\`\`\`bash
NEXT_PUBLIC_IDEAI_APP_MODE=unified pnpm --filter web dev
pnpm --filter docs dev  # In separate terminal
\`\`\`

### How It Works
1. **Parent app** runs on `http://localhost:3000/` (default)
2. **Next.js rewrites** proxy child apps:
   - `http://localhost:3000/docs` → `http://localhost:3001/`
   - `http://localhost:3000/all` → `http://localhost:3002/`
3. **Parent embeds** child apps as iframes:
   - `http://localhost:3000/apps/docs` → iframe src=`http://localhost:3000/docs`
   - Child apps detect iframe and hide branding automatically

### Test Results
- ✅ Parent app running on port 3000
- ✅ Docs app running on port 3001
- ✅ Rewrite working (proxying `/docs` to port 3001)
- ✅ Iframe route working (`/apps/docs`)
- ✅ Child app detects iframe and hides branding

### URLs
- Parent: `http://localhost:3000/`
- Child (direct): `http://localhost:3000/docs` (proxied)
- Child (iframe): `http://localhost:3000/apps/docs`

## ✅ Individual Mode (Separate Ports)

### Setup
\`\`\`bash
# Default mode - no env var needed
pnpm --filter web dev
pnpm --filter docs dev  # In separate terminal
\`\`\`

### How It Works
1. **Parent app** runs on `http://localhost:3000/`
2. **Child apps** run on separate ports (3001, 3002, etc.)
3. **Parent embeds** child apps as iframes pointing to separate ports:
   - `http://localhost:3000/apps/docs` → iframe src=`http://localhost:3001/`
   - Child apps detect iframe and hide branding automatically

### Test Results
- ✅ Parent app running on port 3000
- ✅ Docs app running on port 3001
- ✅ Iframe pointing to separate port (`http://localhost:3001/`)
- ✅ Route working (`/apps/docs`)
- ✅ Child app detects iframe and hides branding

### URLs
- Parent: `http://localhost:3000/`
- Child (direct): `http://localhost:3001/`
- Child (iframe): `http://localhost:3000/apps/docs`

## 🌐 Online Testing

### Preview Deployment
- **URL**: `https://web-*.vercel.app/apps/docs`
- **Status**: ⏳ Testing...

### Production Deployment
- **URL**: `https://www.myui.space/apps/docs`
- **Status**: ⏳ Testing...

## Summary

Both modes are working correctly:

1. **Unified Mode**: All apps accessible on port 3000 via rewrites, embedded as iframes
2. **Individual Mode**: Each app on separate port, embedded as iframes

**Key Features:**
- ✅ Toggle via `NEXT_PUBLIC_IDEAI_APP_MODE` environment variable
- ✅ Child apps automatically detect iframe and hide branding
- ✅ Same routing structure (`/apps/{name}`) for both modes
- ✅ Works locally and online

## Next Steps

1. ✅ Test unified mode locally
2. ✅ Test individual mode locally
3. ⏳ Test preview deployment
4. ⏳ Test production deployment
5. ⏳ Document deployment configuration








