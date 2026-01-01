# Commit Summary: IFrame Detection & Hydration Fix

## Overview

Fixed critical hydration errors in iframe-embedded IdeaI sites and cleaned up legacy code. All iframes now load without React hydration mismatches.

## Key Changes

### 🔧 Fixed Hydration Errors

**Problem**: Conditional rendering based on iframe detection caused server/client HTML mismatches, resulting in React hydration errors (red buttons) in all iframes.

**Solution**: 
- Always render header/footer (same HTML structure on server/client)
- Use CSS `display: none` to hide elements instead of conditional rendering
- Detect iframe context after mount using `useEffect` (prevents server/client mismatch)
- Start with everything visible (matches server render)

**Files Changed**:
- `packages/ui/src/components/ideai-page-template.tsx` - Switched from conditional rendering to CSS-based hiding

**Result**: 
- ✅ No more hydration errors
- ✅ Iframes load correctly
- ✅ Header/footer hide properly in iframes
- ✅ All sites stable when embedded

### 🧹 Legacy Code Cleanup

Removed unused legacy component files:
- `packages/ui/src/components/ideai-header-new.tsx` - Unused legacy header
- `packages/ui/src/components/ideai-footer-new.tsx` - Unused legacy footer
- `packages/ui/src/components/uniframe.tsx` - Replaced by `uf.tsx`
- `packages/ui/src/components/uniframe-code-viewer.tsx` - Replaced by `uf-code-viewer.tsx`

### 🔧 Build Fixes

Restored accidentally cleared files:
- `packages/ui/src/components/uf.tsx` - Restored from git (402 lines)
- `packages/ui/src/components/uf-code-viewer.tsx` - Restored from git (122 lines)

Fixed API route:
- `apps/web/app/api/apps-index/route.ts` - Inlined functions to avoid external dependencies

### 📚 Documentation Updates

- Updated `docs/architecture/iframe-detection.md` with hydration-safe implementation details
- Updated `docs/STATUS.md` to reflect 13 apps (was 9)
- Added notes about server/client rendering strategy

## Technical Details

### Before (Problematic)
```tsx
// Conditional rendering - causes hydration mismatch
{showHeader && <IdeaIHeader />}
```

**Issue**: Server renders with header (no `window`), client might hide it (detects iframe) → different HTML structure → hydration error

### After (Fixed)
```tsx
// Always render, hide with CSS - same HTML structure
<div style={{ display: shouldHideHeader ? "none" : "block" }}>
  <IdeaIHeader />
</div>
```

**Solution**: Same HTML structure on server and client, only CSS changes → no hydration errors

## Testing

- ✅ All iframes on `/index` page load without errors
- ✅ Header/footer hide correctly in iframe context
- ✅ No React hydration warnings in console
- ✅ All 13 apps stable when embedded

## Impact

- **Breaking Changes**: None
- **Backward Compatibility**: Maintained
- **Performance**: No impact (CSS hiding is efficient)
- **Developer Experience**: Improved (no more red buttons in iframes)

## Related Issues

- Fixed hydration errors in iframe-embedded sites
- Resolved "red buttons" (Next.js error overlay) in all iframes
- Improved stability of embedded IdeaI apps

## Next Steps

- Consider adding transition animations for header/footer show/hide
- Monitor iframe performance in production
- Document iframe embedding best practices

