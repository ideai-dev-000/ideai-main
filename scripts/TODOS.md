# IdeaI Scripts - TODOs

**All pending work, improvements, and future enhancements.**

> **Note**: This file consolidates all TODOs from across the codebase. This is the master list.

## High Priority

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

**Last Updated**: January 1, 2026  
**Goal**: Complete coverage with zero bloat
