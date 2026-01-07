---
title: Live Testing Results
description: Test results for parent/child app architecture on local, preview, and production
---

# Live Testing Results

## Test Date: 2026-01-01

### Test Environments

1. **Local Development**: `http://localhost:3000`
2. **Preview**: `https://web-*.vercel.app`
3. **Production**: `https://www.myui.space`

## Test Results

### ✅ Local Development

**Setup**:

- Parent app (`web`) running on port 3000
- Child app (`docs`) running on port 3001

**Test**: `http://localhost:3000/apps/docs`

**Expected**:

- Should show docs app in iframe
- Iframe src: `http://localhost:3001`
- Header/footer hidden in iframe

**Status**: ⏳ Testing...

### ✅ Preview Deployment

**URL**: `https://web-hvjrpj9rn-idea-i.vercel.app/apps/docs`

**Expected**:

- Should show placeholder message (production build not yet unified)
- Or show child app if unified build works

**Status**: ⏳ Testing...

### ✅ Production Deployment

**URL**: `https://www.myui.space/apps/docs`

**Expected**:

- Should show placeholder message (production build not yet unified)
- Or show child app if unified build works

**Status**: ⏳ Testing...

## Notes

- Removed `NEXT_PUBLIC_DOCS_URL` to test unified app approach
- Local development uses iframe with localhost URLs
- Production needs unified build strategy (future work)


