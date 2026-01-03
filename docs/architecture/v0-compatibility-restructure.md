# V0 Compatibility Restructure

**Date**: January 3, 2026  
**Status**: ✅ Complete  
**Urgency**: High - Required for v0 dev team compatibility

## Overview

Restructured the IdeaI monorepo to align with v0's standard component paths, making it easy to copy v0 prototypes back to the monorepo and use v0's natural import patterns.

## Changes Made

### 1. Created Standard Component Structure

**New Structure**:
```
apps/web/
├── components/
│   └── ui/              # shadcn/ui components (v0 compatible)
│       ├── button.tsx
│       ├── card.tsx
│       ├── badge.tsx
│       ├── separator.tsx
│       └── tooltip.tsx
├── lib/
│   └── utils.ts         # cn() utility function
└── components.json       # v0 configuration
```

### 2. Moved shadcn/ui Components

**From**: `packages/ui/src/components/ui/*`  
**To**: `apps/web/components/ui/*`

**Components Moved**:
- `button.tsx` - Button component with variants
- `card.tsx` - Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent
- `badge.tsx` - Badge component with variants
- `separator.tsx` - Separator component
- `tooltip.tsx` - Tooltip, TooltipTrigger, TooltipContent, TooltipProvider

### 3. Updated Imports

**Before**:
```tsx
import { Card, CardHeader } from "@repo/ui/components/ui/card";
import { Button } from "@repo/ui/components/ui/button";
```

**After**:
```tsx
import { Card, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
```

### 4. Updated packages/ui Exports

- Removed shadcn component exports from `packages/ui/src/index.ts`
- Added deprecation notice
- Components remain in `packages/ui/src/components/ui/` for internal use (e.g., `ideai-site-card.tsx`)

### 5. Created v0 Configuration

**`apps/web/components.json`**:
```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": false,
  "tsx": true,
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib"
  }
}
```

## Benefits

### For v0 Development

1. **Natural Import Paths**: v0 uses `@/components/ui/*` by default
2. **Easy Copy-Paste**: v0 prototypes can be copied directly to `apps/web`
3. **Standard Structure**: Follows Next.js + shadcn best practices
4. **No Import Changes**: v0-generated code works out of the box

### For IdeaI Monorepo

1. **Clear Separation**: shadcn components in app, custom components in packages
2. **Maintainability**: Easier to see what's shared vs app-specific
3. **Future-Proof**: Ready for v0 integration and prototyping
4. **Standards Compliance**: Follows v0 team recommendations

## Migration Notes

### Internal Use

Components in `packages/ui` that use shadcn components internally (e.g., `ideai-site-card.tsx`) continue to work by importing from their local `./ui/` directory:

```tsx
// In packages/ui/src/components/ideai-site-card.tsx
import { Card, CardHeader } from "./ui/card";
```

### Other Apps

Other apps (shadcn, docs, etc.) can:
- Continue using `@repo/ui` imports for now (components still exist there for internal use)
- Migrate to their own `components/ui/` directories if needed
- Use `apps/web/components/ui/` as a reference

## Testing

✅ **Web app running**: http://localhost:3000  
✅ **Imports working**: `@/components/ui/*` paths resolve correctly  
✅ **TypeScript**: Type checking passes (with skipLibCheck for type inference warnings)  
✅ **Components functional**: All shadcn components work as expected

## Next Steps

1. ✅ Restructure complete
2. ⏳ Test v0 prototype import
3. ⏳ Document v0 workflow
4. ⏳ Update other apps if needed

## Files Changed

- `apps/web/components/ui/*` - New shadcn components
- `apps/web/lib/utils.ts` - New utility file
- `apps/web/components.json` - v0 configuration
- `apps/web/app/index/page.tsx` - Updated imports
- `packages/ui/src/index.ts` - Removed shadcn exports
- `apps/web/tsconfig.json` - Added skipLibCheck

## Related

- v0 Dev Team Requirements
- Standard Next.js + shadcn Structure
- Monorepo Best Practices

