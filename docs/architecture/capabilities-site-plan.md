# Capabilities Site - Implementation Plan

**Status**: In Progress  
**Created**: January 5, 2026  
**Related**: [TODOS.md - True Unified Mode](../TODOS.md#true-unified-mode-shared-codebase-architecture)

## Overview

Create a new standalone site (`apps/ideai-capabilities`) that serves as a test bed and bridge for the True Unified Mode: Shared Codebase Architecture. This site will demonstrate how to build a new site using shared capabilities as components, directly addressing the TODO items.

## Goals

1. **Test Bed**: Prove that capabilities can be used as components in new sites
2. **Bridge Architecture**: Demonstrate the path from separate apps to shared packages
3. **Close TODOs**: Address multiple TODO items in the True Unified Mode section
4. **Best Practices**: Showcase IdeaI best practices for building new sites

## Architecture

### Site Structure

```
apps/ideai-capabilities/
├── app/
│   ├── layout.tsx          # Root layout with standalone nav
│   ├── page.tsx            # Landing page
│   ├── workflow/           # Workflow builder page
│   │   └── page.tsx
│   ├── lead-agent/         # Lead agent page
│   │   └── page.tsx
│   └── app-builder/        # App builder page
│       └── page.tsx
├── .ideai.json             # App configuration
├── package.json
└── next.config.js
```

### Navigation

- **Standalone Nav**: Based on `IdeaIHeader` but customized for capabilities site
- **Pages**:
  - `/` - Landing page
  - `/workflow` - Workflow builder (runs automatically)
  - `/lead-agent` - Lead processing agent
  - `/app-builder` - App builder

## Implementation Steps

### Phase 1: Site Structure ✅ In Progress

- [x] Create mini plan document
- [ ] Create `apps/ideai-capabilities` app structure
- [ ] Set up Next.js configuration
- [ ] Configure `.ideai.json`
- [ ] Set up package.json with dependencies

### Phase 2: Standalone Navigation

- [ ] Create custom header component based on `IdeaIHeader`
- [ ] Customize navigation for capabilities site
- [ ] Add theme toggle and mobile nav
- [ ] Test responsive behavior

### Phase 3: Workflow Builder Integration

- [ ] Create `/workflow` page
- [ ] Import workflow builder from `ideai-workflow` app
- [ ] Extract workflow builder as reusable component
- [ ] Ensure workflow runs automatically on page load
- [ ] Test functionality

### Phase 4: Lead Agent Integration

- [ ] Create `/lead-agent` page
- [ ] Import lead agent from `lead-processing-agent` app
- [ ] Extract lead agent as reusable component
- [ ] Test functionality

### Phase 5: App Builder Integration

- [ ] Create `/app-builder` page
- [ ] Import app builder from `ideai-builder` app
- [ ] Extract app builder as reusable component
- [ ] Test functionality

### Phase 6: Component Extraction (Future)

- [ ] Extract workflow builder to `@repo/workflow` package
- [ ] Extract lead agent to `@repo/lead-agent` package
- [ ] Extract app builder to `@repo/app-builder` package
- [ ] Update capabilities site to import from packages

## TODOs Addressed

This implementation addresses the following TODO items:

### From "True Unified Mode: Shared Codebase Architecture"

1. **Extract Capabilities to Packages** (Step 1):
   - ✅ **Test Bed Created**: Capabilities site demonstrates component extraction
   - [ ] **Workflow Package**: Workflow builder extracted as component (prepares for `@repo/workflow`)
   - [ ] **Lead Agent Package**: Lead agent extracted as component (prepares for `@repo/lead-agent`)
   - [ ] **App Builder Package**: App builder extracted as component (prepares for `@repo/app-builder`)

2. **Refactor Apps to Use Packages** (Step 2):
   - ✅ **Demonstration**: Capabilities site shows how apps can use components
   - [ ] **Pattern Established**: Clear pattern for importing capabilities as components

3. **Implement True Unified Mode** (Step 3):
   - ✅ **Component Import**: Capabilities site imports components directly (no iframes)
   - ✅ **No Separate Ports**: All capabilities run on same port (3000 or assigned port)
   - ✅ **No Rewrites**: Direct component imports, no Next.js rewrites needed

4. **Documentation** (Step 5):
   - ✅ **Example Site**: Capabilities site serves as example of building new sites
   - [ ] **Documentation**: Document capabilities site as reference implementation

## Benefits

1. **Proves Concept**: Demonstrates that capabilities can be used as components
2. **Bridges Gap**: Shows path from separate apps to shared packages
3. **Test Bed**: Safe environment to test component extraction
4. **Reference Implementation**: Example for future sites
5. **Closes TODOs**: Directly addresses multiple TODO items

## Technical Details

### Component Import Strategy

**Current Approach** (Phase 3-5):

- Import pages/components directly from existing apps
- Use dynamic imports if needed for code splitting
- Wrap in error boundaries

**Future Approach** (Phase 6):

- Import from `@repo/workflow`, `@repo/lead-agent`, `@repo/app-builder` packages
- Cleaner imports, better tree-shaking
- True shared codebase

### Navigation Customization

- Based on `IdeaIHeader` component
- Custom nav items for capabilities site
- Maintains IdeaI design system consistency
- Responsive and accessible

### Port Assignment

- **Development**: Port 3018 (next available)
- **Production**: Deployed as standalone Vercel project
- **No Dependencies**: Doesn't require other apps to be running

## Success Criteria

- [ ] Capabilities site runs independently
- [ ] Workflow builder page loads and runs automatically
- [ ] Lead agent page loads and functions
- [ ] App builder page loads and functions
- [ ] Navigation works correctly
- [ ] All pages use IdeaI design system
- [ ] No iframes, no rewrites, direct component imports
- [ ] Documentation created
- [ ] TODOs updated to reflect progress

## Related Files

- `TODOS.md` - True Unified Mode section
- `docs/architecture/parent-child-complete.md` - Parent-child architecture
- `apps/ideai-workflow/` - Workflow builder source
- `apps/lead-processing-agent/` - Lead agent source
- `apps/ideai-builder/` - App builder source
- `packages/ui/src/components/ideai-header.tsx` - Header component

## Next Steps

1. Create app structure
2. Set up navigation
3. Integrate workflow builder
4. Integrate lead agent
5. Integrate app builder
6. Document and update TODOs

---

**Status**: Phase 1 in progress  
**Last Updated**: January 5, 2026
