# IdeaI Centralized User Module - Summary

**Date**: January 10, 2026  
**Status**: Planning Complete ✅

---

## What We Did

1. ✅ **Audited both apps** (capabilities & vibecoder)
   - Identified all auth/user/access patterns
   - Documented all database tables
   - Found common patterns and inconsistencies

2. ✅ **Created comprehensive documentation**
   - `AUDIT.md` - Full audit report with all findings
   - `TODO.md` - Complete implementation plan
   - `docs/schema-design.md` - Unified schema design
   - `docs/patterns.md` - Common patterns & best practices

3. ✅ **Identified key requirements**
   - Centralized auth system (Better Auth)
   - Modular capability pattern
   - Semantic table naming
   - Boilerplate pattern for new capabilities
   - Shared UI components

---

## Key Findings

### Current State

- Both apps use **identical auth systems** (Better Auth)
- Both have **duplicate code** (auth, sessions, users)
- Both support **anonymous users** (`isAnonymous` flag)
- **Separate databases** per app (should be unified)
- **Inconsistent naming** (snake_case vs camelCase)

### Capabilities Identified

**Workflows (Capabilities App)**:

- `workflows` - User's workflow definitions
- `workflow_executions` - Execution history
- `workflow_execution_logs` - Detailed logs
- `workflow_integrations` - Integration credentials
- `workflow_api_keys` - API keys for webhooks

**Vibecoder (Vibecoder App)**:

- `code_projects` - Code generation projects (semantic name)
- `code_chat_ownerships` - v0 SDK chat ownership
- `code_anonymous_logs` - Anonymous usage tracking

### Common Auth Tables (Both Apps)

- `users` - User accounts
- `sessions` - Auth sessions
- `accounts` - OAuth/linked accounts
- `verifications` - Email/phone verification

---

## Proposed Solution

### Architecture

```
@repo/ideai-user (Core Module)
├── Auth System
├── User Management
├── Permission System
└── Capability Registry

Capability Modules
├── workflows (existing)
├── vibecoder (existing)
└── {future} (via registry)
```

### Key Features

1. **Centralized Auth**: Single sign-on across all IdeaI apps
2. **Modular Capabilities**: Each capability is a separate module
3. **Semantic Naming**: Clear, consistent table and field names
4. **Dynamic Discovery**: Capabilities register themselves
5. **Shared Components**: Common UI (header, auth dialog, etc.)

### Standard Capability Pattern

Every capability follows this pattern:

- `{capability}_items` - Main items table (e.g., `workflows`, `code_projects`)
- `{capability}_executions` - Execution tracking (optional)
- `{capability}_logs` - Detailed logs (optional)
- All reference `users.id` for ownership
- All support `visibility: "private" | "public" | "team"`

---

## Implementation Plan

### Phase 1: Foundation ✅

- [x] Audit complete
- [x] Documentation created
- [x] TODO list created

### Phase 2: Core Module (Next)

- [ ] Create `@repo/ideai-user` package
- [ ] Implement unified schema
- [ ] Create auth/user/permission services

### Phase 3: Capability Modules

- [ ] Migrate workflows tables
- [ ] Migrate vibecoder tables
- [ ] Create capability registry

### Phase 4: Integration

- [ ] Update capabilities app
- [ ] Update vibecoder app
- [ ] Test everything

### Phase 5: Testing

- [ ] Unit tests
- [ ] Integration tests
- [ ] E2E tests
- [ ] Test automation

---

## Naming Conventions

### Tables

- Format: `snake_case`
- Pattern: `{capability}_{entity}`
- Examples: `workflows`, `code_projects`, `workflow_executions`

### Fields

- Format: `camelCase`
- Standard: `userId`, `createdAt`, `updatedAt`
- Pattern: All capability tables include `userId` reference

### Relations

- Format: `camelCase`
- Pattern: Singular form of table name
- Examples: `user`, `workflow`, `execution`

---

## Shared Assets Identified

### UI Components

- `IdeAIHeader` - Unified header (both apps use similar)
- `AuthDialog` - Sign in/sign up modal
- `UserMenu` - Profile dropdown
- `ThemeToggle` - Dark/light mode
- `MobileNav` - Mobile navigation

### Assets

- IdeaI logo (SVG)
- Favicon metadata
- Brand colors/styling

---

## Next Steps

1. **Review Documentation**
   - Read `AUDIT.md` for detailed findings
   - Review `docs/schema-design.md` for schema
   - Check `docs/patterns.md` for patterns

2. **Start Implementation**
   - Follow `TODO.md` step by step
   - Create package structure
   - Implement core module

3. **Test as We Go**
   - Write tests for each component
   - Run tests on every change
   - Ensure nothing breaks

---

## Files Created

```
apps/ideai-user-module/
├── README.md - Overview
├── AUDIT.md - Complete audit report
├── TODO.md - Implementation plan
├── SUMMARY.md - This file
└── docs/
    ├── schema-design.md - Unified schema
    └── patterns.md - Common patterns
```

---

## Questions to Answer

1. **Database Strategy**: Single shared DB or separate DBs per app?
2. **Session Sharing**: Should sessions work across all IdeaI subdomains?
3. **Migration Timing**: Migrate both apps simultaneously or one at a time?
4. **Backward Compatibility**: How long to support old structure?

---

Ready to start implementation! 🚀
