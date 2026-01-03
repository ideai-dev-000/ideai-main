# Fix: IFrame Hydration Errors & Legacy Code Cleanup

## 🎯 Summary

Fixed critical React hydration errors in iframe-embedded IdeaI sites and removed legacy component files. All iframes now load without errors.

## 🐛 Problem

When IdeaI sites were embedded in iframes (e.g., on the `/index` page), they showed React hydration errors (red error buttons). This was caused by:

- **Server-side**: Rendered with header/footer visible (no `window` object available)
- **Client-side**: Tried to conditionally render based on iframe detection
- **Result**: Different HTML structure → React hydration mismatch → errors

## ✅ Solution

### Hydration-Safe Implementation

Changed from conditional rendering to CSS-based hiding:

**Before** (Problematic):
\`\`\`tsx
{showHeader && <IdeaIHeader />}
\`\`\`

**After** (Fixed):
\`\`\`tsx

<div style={{ display: shouldHideHeader ? "none" : "block" }}>
  <IdeaIHeader />
</div>
\`\`\`

**Key Changes**:

1. Always render header/footer (same HTML structure on server/client)
2. Use CSS `display: none` to hide (no structural changes)
3. Detect iframe context after mount with `useEffect` (prevents server/client mismatch)
4. Start with everything visible (matches server render)

### Legacy Code Cleanup

Removed unused legacy component files:

- `ideai-header-new.tsx` - Unused legacy header
- `ideai-footer-new.tsx` - Unused legacy footer
- `uniframe.tsx` - Replaced by `uf.tsx`
- `uniframe-code-viewer.tsx` - Replaced by `uf-code-viewer.tsx`

### Build Fixes

- Restored `uf.tsx` (402 lines) - Was accidentally cleared
- Restored `uf-code-viewer.tsx` (122 lines) - Was accidentally cleared
- Fixed `/api/apps-index` route - Inlined functions to avoid external dependencies

## 📝 Changes

### Modified Files

- `packages/ui/src/components/ideai-page-template.tsx` - Switched to CSS-based hiding
- `docs/architecture/iframe-detection.md` - Added hydration-safe implementation details

### Deleted Files

- `packages/ui/src/components/ideai-header-new.tsx`
- `packages/ui/src/components/ideai-footer-new.tsx`
- `packages/ui/src/components/uniframe.tsx`
- `packages/ui/src/components/uniframe-code-viewer.tsx`

### New Files

- `docs/architecture/iframe-detection.md` - Comprehensive iframe detection documentation
- `COMMIT_SUMMARY.md` - Detailed commit summary
- `PR_DESCRIPTION.md` - PR description
- `FINAL_AUDIT.md` - Comprehensive repository audit

## ✅ Testing

- ✅ All iframes on `/index` page load without errors
- ✅ Header/footer hide correctly in iframe context
- ✅ No React hydration warnings in console
- ✅ All 13 apps stable when embedded
- ✅ Verified in browser (ports 3000, 3002, 3003, 3004)

## 🎯 Impact

- **Breaking Changes**: None
- **Backward Compatibility**: Maintained
- **Performance**: No impact (CSS hiding is efficient)
- **Developer Experience**: Improved (no more red buttons in iframes)

## 📚 Documentation

- Updated iframe detection docs with hydration-safe implementation details
- Added notes about server/client rendering strategy
- Documented CSS-based hiding approach

## 🔗 Related

- Fixes hydration errors in iframe-embedded sites
- Resolves "red buttons" (Next.js error overlay) in all iframes
- Improves stability of embedded IdeaI apps
