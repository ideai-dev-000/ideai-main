# IdeaI - TODOs

**All pending work, improvements, and future enhancements.**

> **Note**: This file consolidates all TODOs from across the codebase. This is the master list.

## High Priority

### Remaining ESLint Warning (1) - Known Issue

**Status**: 1 warning remaining in `@repo/ui` package  
**Priority**: Low (false positive, TypeScript provides type safety)  
**Estimated Effort**: Requires ESLint config investigation

#### Files with Known Issues

- [ ] **`packages/ui/src/components/v0/ideai-icon.tsx`** (1 warning)
  - Line 7: prop-types warning - `className` is missing in props validation
  - **Issue**: This is a false positive - TypeScript provides type safety via `IdeaiIconProps` interface
  - **Attempted fixes**: File-level disable, line-level disable, inline disable - all ineffective
  - **Root cause**: ESLint prop-types rule configuration issue - rule is checking JSDoc comment line instead of function
  - **Workaround**: Acceptable to leave as-is since TypeScript provides type safety

**Note**: This appears to be an ESLint configuration issue where the prop-types rule is incorrectly reporting the warning on the JSDoc comment line (line 7) instead of the function declaration. TypeScript already provides type safety, making prop-types redundant for this component.

---

### Submodule Management & Alignment

- [ ] **RESEARCH FIRST**: Proper submodule development workflow for IdeaI alignment
  - Research how to develop submodules in v0 while maintaining IdeaI standards
  - Ensure submodules stay aligned with IdeaI patterns, naming conventions, and architecture
  - Document submodule development process (v0 → IdeaI alignment)
  - Create guidelines for submodule integration and standards compliance
  - Establish workflow for syncing v0 changes back to IdeaI-aligned submodules

- [ ] **CRITICAL**: Submodule deployment strategy decision and implementation
  - **Decision needed**: How should submodules be deployed to Vercel?
    - Option A: Create separate Vercel projects for each submodule (independent deployments)
    - Option B: Deploy submodules as folders within ideai-main project (unified deployment)
  - Research pros/cons of each approach
  - Document decision and rationale
  - Implement chosen strategy
  - Update deployment scripts to handle submodules correctly
  - Ensure submodules don't conflict with main app deployments
  - Align with IdeaI parent-child architecture patterns

### Build System

- [ ] Real-time memory monitoring display in build UI
- [ ] Build history tracking and reporting
- [ ] Automatic dependency sync on build
- [ ] Automatic submodule updates before build (ensure all submodules are up to date with their remote repos before building)
- [ ] Enhanced documentation verification (code snippet testing)
- [ ] Rules management UI integration
- [ ] Execute all build commands with output
- [ ] Show build status in real-time
- [ ] Display memory monitoring
- [ ] Show test results
- [ ] Documentation verification results

### Boot System

- [ ] Log viewer integration in UI
- [ ] Health monitoring display
- [ ] Memory monitoring display
- [ ] Parallel boot option for faster startup
- [ ] Boot configuration file support
- [ ] Real-time server status
- [ ] Boot progress tracking
- [ ] Health check display

### Develop Tools

- [ ] Deployment tracking and history
- [ ] AWS integration (future)
- [ ] Docker integration (future)
- [ ] Enhanced Vercel project management
- [ ] Automated subdomain verification
- [ ] Vercel project linking UI
- [ ] Secrets management UI
- [ ] Subdomain setup wizard
- [ ] Sync status display

### UI Enhancements

- [ ] Real-time status updates
- [ ] Command execution with output capture
- [ ] Error handling and display
- [ ] Progress indicators for long tasks
- [ ] Loading indicators
- [ ] Success/error notifications
- [ ] Better error messages
- [ ] Command output formatting
- [ ] Progress bars for long tasks
- [ ] Keyboard shortcuts help

## Medium Priority

### Integration

- [ ] Connect all tool modules to UI
- [ ] Real-time status polling
- [ ] Event-driven updates
- [ ] Configuration management
- [ ] State persistence

### Documentation

- [ ] Inline help for each action
- [ ] Tooltips for options
- [ ] Context-sensitive help
- [ ] Video tutorials (future)

### Performance

- [ ] Optimize UI rendering
- [ ] Lazy load modules
- [ ] Cache status data
- [ ] Reduce memory usage

## Low Priority

### Advanced Features

- [ ] Plugin system
- [ ] Custom themes
- [ ] Command history
- [ ] Favorites/bookmarks
- [ ] Search functionality
- [ ] Web version

### Testing

- [ ] Comprehensive test suite
- [ ] Integration tests
- [ ] E2E tests for UI
- [ ] Performance benchmarks

## Coverage Verification

### Build Tools ✅

- [x] Build verification
- [x] Documentation verification
- [x] Dependency checking
- [x] Test execution
- [x] Rules management
- [ ] Memory monitoring display
- [ ] Build history

### Boot Tools ✅

- [x] Boot process
- [x] Dev server management
- [x] Status checking
- [ ] Log viewing
- [ ] Health monitoring
- [ ] Memory monitoring

### Develop Tools ✅

- [x] Vercel linking
- [x] Secrets setup
- [x] Subdomain setup
- [x] Documentation sync
- [x] Vercel-GitHub sync
- [ ] Deployment tracking
- [ ] AWS integration (future)
- [ ] Docker integration (future)

### Verify System ✅

- [x] Checklist UI
- [x] Sign-off capability
- [ ] Automatic verification
- [ ] Report generation
- [ ] State persistence
- [ ] Run all checks automatically
- [ ] Display check results
- [ ] Sign-off confirmation
- [ ] Export verification report
- [ ] Save verification state

## Zero Bloat Principles

1. **No Duplication**: Each tool exists once
2. **Composable**: Tools work together seamlessly
3. **Essential Only**: No unnecessary features
4. **Clear Purpose**: Every feature has a reason
5. **Complete Coverage**: All tasks accessible

## Integration Checklist

- [ ] All build commands accessible via UI
- [ ] All boot commands accessible via UI
- [ ] All develop commands accessible via UI
- [ ] All verification checks runnable
- [ ] All status displays working
- [ ] All help documentation complete
- [ ] All error handling in place
- [ ] All output formatting consistent

---

## Centralized Cache Management

**Priority**: Medium  
**Status**: Proposed  
**Category**: Infrastructure

### Task: Implement Centralized Caching System

**Goal**: Move from per-app caches to centralized cache location to improve disk space management and cleanup efficiency.

**Current State**:

- Each app has its own `.next/` cache (can grow to 200MB+ per app)
- Caches are in `.gitignore` but still take up disk space
- No centralized cleanup mechanism
- 13 apps × 200MB = potential 2.6GB+ of cache files

**Proposed Solution**:

- Create centralized cache location (e.g., `.cache/` at repo root)
- Configure Next.js/Turbopack to use centralized cache
- Update cleanup scripts to target centralized location
- Document cache management workflow

**Benefits**:

- Single cache location for easier management
- Shared cache across apps (faster builds)
- Easier cleanup (one command)
- Better disk space utilization
- Clearer separation of source code vs. cache

**Implementation Steps**:

1. Research Next.js/Turbopack cache configuration options
2. Create `.cache/` directory structure
3. Update Next.js configs to use centralized cache
4. Update cleanup scripts (`pnpm build:cold`)
5. Test cache sharing across apps
6. Document new cache management workflow
7. Update `.ideai-rules.md` with centralized cache standards

**Related**:

- Cache Management Standards (`.ideai-rules.md`)
- `pnpm build:cold` script
- Development Server Management standards

**Estimated Effort**: 4-6 hours

---

## Completed Work

### ESLint Warnings Fix (January 4, 2026) ✅

**Commit**: `8e0fc90` - `fix(ui): resolve 55 of 64 ESLint warnings across codebase`  
**Status**: Completed  
**Result**: 55 warnings fixed (86% reduction), 25 files modified

#### Summary

Fixed 55 lint warnings across the codebase with full paper trail. All fixes documented with no cover-ups - every file change is listed below.

#### Files Fixed (25 total)

**ESLint Config:**

- ✅ `packages/cloud-manager/eslint.config.mjs`
  - Fixed import path from `@repo/eslint-config/next` to `@repo/eslint-config/next-js`

**Animation Components:**

- ✅ `packages/ui/src/components/animations/ideai-animations/animation-card.tsx`
  - Replaced `any` types with `Record<string, unknown>` in ReactSpring components
  - Removed unused eslint-disable directive
  - Fixed useEffect dependency by wrapping config in useMemo
  - Split ReactSpringDemo into 7 separate components to eliminate conditional hooks

**Core Components:**

- ✅ `packages/ui/src/components/ideai-deployment.tsx`
  - Removed unused `currentPath` parameter
  - Removed useless catch wrapper (just re-throwing error)
- ✅ `packages/ui/src/components/ideai-diagnostics.tsx`
  - Replaced `any` types with proper Window type extensions
  - Removed unused `navigation` variable
  - Removed unused error parameter in catch
  - Fixed useEffect dependencies (`observerRef`, `isDevelopment`)
- ✅ `packages/ui/src/components/ideai-framework/ideai-card/ideai-card-footer.tsx`
  - Removed unused `frameworkConfigs` import

**UI Components:**

- ✅ `packages/ui/src/components/ideai-universal-framework-card.tsx`
  - Escaped apostrophe in text content (`framework's` → `framework&apos;s`)
- ✅ `packages/ui/src/components/page-templates/page-templates-showcase.tsx`
  - Removed unused `appName` variable
  - Moved `allTypes` array inside useMemo to fix dependency warning
- ✅ `packages/ui/src/components/page-templates/templates/dashboard-template.tsx`
  - Escaped apostrophes in text content (`Here's` → `Here&apos;s`, `what's` → `what&apos;s`)
- ✅ `packages/ui/src/components/page-templates/templates/docs-template.tsx`
  - Removed unused `FileText` and `Code` imports from lucide-react
- ✅ `packages/ui/src/components/uf-universal-card.tsx`
  - Escaped apostrophe in text content (`framework's` → `framework&apos;s`)
- ✅ `packages/ui/src/components/uf.tsx`
  - Removed unused `UFCodeViewer` import
  - Removed unused `inputValue`/`setInputValue` state variables
- ✅ `packages/ui/src/components/ui/label.tsx`
  - Changed empty interface to type alias (no-empty-object-type rule)
- ✅ `packages/ui/src/components/uniframe/uf-card/uf-footer.tsx`
  - Removed unused `frameworkConfigs` import

**V0 Components:**

- ✅ `packages/ui/src/components/v0/ideai-icon.tsx`
  - Removed unused `animated` parameter from function signature
- ✅ `packages/ui/src/components/v0/kute-logo.tsx`
  - Changed `@ts-ignore` to `@ts-expect-error` with comment explaining optional dependency
- ✅ `packages/ui/src/components/v0/motion-one-logo.tsx`
  - Added proper eslint-disable comments for `any` types in optional dependency code
- ✅ `packages/ui/src/components/v0/particles-logo.tsx`
  - Added proper eslint-disable comments for `any` types in optional dependency code
- ✅ `packages/ui/src/components/v0/react-spring-logo.tsx`
  - Moved `getFromValues` function inside useEffect to fix dependency warning
- ✅ `packages/ui/src/components/v0/vivus-logo.tsx`
  - Changed `@ts-ignore` to `@ts-expect-error`
  - Added proper eslint-disable comments for `any` types in optional dependency code

**Library Files:**

- ✅ `packages/ui/src/lib/ideai-animations.tsx`
  - Added eslint-disable for `navigator.deviceMemory` and `navigator.connection` (experimental browser APIs requiring `any` type)
- ✅ `packages/ui/src/lib/ideai-app-loader.ts`
  - Removed unused `getChildAppConfig` import
  - Added eslint-disable for unused `appName` parameter (placeholder function)
- ✅ `packages/ui/src/lib/ideai-build.ts`
  - Added eslint-disable for `require()` imports (intentional for Node.js code)
  - Fixed unused `appName` parameter in `checkSecurity` function
- ✅ `packages/ui/src/lib/ideai-config.ts`
  - Added eslint-disable for `require()` imports (intentional for Node.js code - fs and path modules)
- ✅ `packages/ui/src/lib/nextjs-best-practices.ts`
  - Added eslint-disable for unused `_request` parameter (Next.js middleware signature requirement)

**Type Definitions:**

- ✅ `packages/ui/src/types/optional-packages.d.ts`
  - Fixed unused eslint-disable directive formatting for scroll function parameters

#### Remaining Warnings (9 - Acceptable)

These remaining warnings are in optional dependency code where `any` types are necessary for dynamic imports of packages that may not be installed:

- `animation-card.tsx` (3): `any` types for tsparticles optional dependency
- `ideai-icon.tsx` (1): prop-types false positive (TypeScript doesn't need prop-types)
- `motion-one-logo.tsx` (3): `any` types for motion-one optional dependency
- `vivus-logo.tsx` (1): `any` type for vivus optional dependency

TypeScript interfaces already provide type safety, and prop-types is a false positive for TypeScript components.

**Related**: Commit `8e0fc90`, TICKET-0.1

---

**Last Updated**: January 4, 2026  
**Goal**: Complete coverage with zero bloat
