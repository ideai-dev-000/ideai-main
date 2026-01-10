# IdeaI Centralized User Module - TODO List

**Goal**: Create a centralized user/auth/access module that supports workflows and vibecoder as modular capabilities, with semantically named tables and a boilerplate pattern for onboarding new capabilities.

---

## Phase 1: Foundation & Planning ✅

- [x] Audit both apps for auth/user/access patterns
- [x] Document findings in AUDIT.md
- [x] Create TODO list
- [ ] Design unified schema
- [ ] Create package structure

---

## Phase 2: Core User Module Package

### 2.1 Package Structure

- [ ] Create `packages/ideai-user` package
- [ ] Setup TypeScript config
- [ ] Setup Drizzle ORM
- [ ] Setup Better Auth integration

### 2.2 Core Tables Schema

- [ ] `users` table (enhanced with preferences)
- [ ] `sessions` table
- [ ] `accounts` table
- [ ] `verifications` table
- [ ] `user_preferences` table (new)
- [ ] `user_roles` table (new - for future RBAC)
- [ ] `capability_registry` table (new - for dynamic capabilities)

### 2.3 Core Services

- [ ] Auth service wrapper
- [ ] User service (CRUD)
- [ ] Session service
- [ ] Permission service (basic)

### 2.4 Type Definitions

- [ ] User types
- [ ] Session types
- [ ] Permission types
- [ ] Capability types

---

## Phase 3: Capability Module Pattern

### 3.1 Standard Capability Schema Pattern

- [ ] Document standard pattern:
  - `{capability}_items` table
  - `{capability}_executions` table (optional)
  - `{capability}_logs` table (optional)
  - All include `userId` reference

### 3.2 Workflows Module Migration

- [ ] Create `workflows` table (migrate from capabilities app)
- [ ] Create `workflow_executions` table
- [ ] Create `workflow_execution_logs` table
- [ ] Create `workflow_integrations` table (from integrations)
- [ ] Create `workflow_api_keys` table (from api_keys)
- [ ] Register workflows in `capability_registry`

### 3.3 Vibecoder Module Migration

- [ ] Create `code_projects` table (semantic name)
- [ ] Create `code_project_executions` table (if needed)
- [ ] Create `code_chat_ownerships` table (from chat_ownerships)
- [ ] Create `code_anonymous_logs` table (from anonymous_chat_logs)
- [ ] Register vibecoder in `capability_registry`

### 3.4 Boilerplate Pattern

- [ ] Document capability onboarding process
- [ ] Create example capability schema
- [ ] Create capability registration utility
- [ ] Create capability discovery service

---

## Phase 4: Shared UI Components

### 4.1 Header Component

- [ ] Extract shared IdeAIHeader component
- [ ] Support dynamic site name
- [ ] Support dynamic nav items
- [ ] Include theme toggle
- [ ] Include user menu
- [ ] Include mobile navigation

### 4.2 Auth Components

- [ ] AuthDialog component (sign in/sign up)
- [ ] UserMenu component (profile dropdown)
- [ ] SessionProvider wrapper
- [ ] ProtectedRoute wrapper

### 4.3 Shared Assets

- [ ] IdeaI logo (SVG component)
- [ ] IdeaI favicon metadata
- [ ] Theme toggle icons
- [ ] Brand colors/styling

---

## Phase 5: Integration & Migration

### 5.1 Database Migration

- [ ] Create unified database schema
- [ ] Migration scripts for capabilities app
- [ ] Migration scripts for vibecoder app
- [ ] Data migration scripts

### 5.2 Update Capabilities App

- [ ] Replace auth code with module
- [ ] Update imports
- [ ] Update database queries
- [ ] Test all workflows functionality

### 5.3 Update Vibecoder App

- [ ] Replace auth code with module
- [ ] Update imports
- [ ] Update database queries
- [ ] Test all vibecoder functionality

---

## Phase 6: Testing & Validation

### 6.1 Unit Tests

- [ ] Test auth service
- [ ] Test user service
- [ ] Test permission service
- [ ] Test capability registry

### 6.2 Integration Tests

- [ ] Test workflows module access
- [ ] Test vibecoder module access
- [ ] Test shared session across apps
- [ ] Test anonymous user flow

### 6.3 E2E Tests

- [ ] Test sign up flow
- [ ] Test sign in flow
- [ ] Test workflow creation (capabilities)
- [ ] Test code project creation (vibecoder)
- [ ] Test user profile updates
- [ ] Test session persistence

### 6.4 Test Automation

- [ ] Setup test runner
- [ ] Create test database setup
- [ ] Create test fixtures
- [ ] Run tests on every change (CI)

---

## Phase 7: Documentation

### 7.1 API Documentation

- [ ] Document auth API
- [ ] Document user API
- [ ] Document capability API
- [ ] Document permission API

### 7.2 Integration Guide

- [ ] How to use user module
- [ ] How to create new capability
- [ ] How to register capability
- [ ] How to add shared UI components

### 7.3 Migration Guide

- [ ] How to migrate existing app
- [ ] Common pitfalls
- [ ] Rollback procedures

---

## Phase 8: Optimization & Polish

### 8.1 Performance

- [ ] Database query optimization
- [ ] Session caching
- [ ] Permission caching

### 8.2 Security

- [ ] Security audit
- [ ] Rate limiting
- [ ] Input validation
- [ ] SQL injection prevention

### 8.3 Developer Experience

- [ ] Better error messages
- [ ] TypeScript types
- [ ] Development tools
- [ ] Debug utilities

---

## Patterns to Document

### Access Control Pattern

```typescript
// Standard pattern for checking access
async function canAccess(
  userId: string,
  resourceId: string,
  capability: string,
) {
  // 1. Check ownership
  // 2. Check visibility (private/public/team)
  // 3. Check permissions
  // 4. Return boolean
}
```

### Capability Query Pattern

```typescript
// Standard pattern for querying capability data
async function getUserCapabilityItems(userId: string, capability: string) {
  // Query capability_items table filtered by userId
  // Apply visibility rules
  // Return items
}
```

### Session Sharing Pattern

```typescript
// Standard pattern for shared sessions
// Session cookie works across all IdeaI subdomains
// Session validated against central user module
```

---

## Notes

- Keep all tables semantically named
- Use consistent naming conventions (camelCase for fields, snake_case for tables)
- All capability tables must include `userId` reference
- Support anonymous users throughout
- Design for extensibility (new capabilities without code changes)
- Maintain backward compatibility during migration
