# IdeaI Centralized User Module

**Status**: Planning Phase  
**Goal**: Centralized auth/user/access module supporting workflows and vibecoder as modular capabilities.

---

## Overview

This module provides a unified authentication, user management, and access control system for all IdeaI apps. It enables:

- **Single Sign-On** across all IdeaI capabilities
- **Modular Capabilities** (workflows, vibecoder, etc.) without code duplication
- **Semantic Table Naming** for clarity and maintainability
- **Boilerplate Pattern** for onboarding new capabilities dynamically

---

## Architecture

```
@repo/ideai-user (Core Module)
├── Auth System (Better Auth)
├── User Management
├── Permission System
└── Capability Registry

Capability Modules (Use Core Module)
├── workflows (IdeaI Capabilities)
├── vibecoder (IdeaI Vibecoder)
└── {future} (Plugged in via registry)
```

---

## Quick Links

- [Audit Report](./AUDIT.md) - Detailed analysis of current systems
- [TODO List](./TODO.md) - Implementation plan
- [Schema Design](./docs/schema.md) - Database schema (coming soon)
- [API Documentation](./docs/api.md) - API reference (coming soon)

---

## Current Status

✅ **Completed**:

- Audit of both apps
- Documentation of patterns
- TODO list creation

⏳ **In Progress**:

- Schema design
- Package structure

📋 **Planned**:

- Core module implementation
- Migration of existing apps
- Testing suite

---

## Key Concepts

### Capability Modules

Each IdeaI capability (workflows, vibecoder, etc.) follows a standard pattern:

- **Items Table**: Stores capability-specific items (e.g., `workflows`, `code_projects`)
- **Executions Table**: Tracks executions/runs (optional)
- **Logs Table**: Detailed execution logs (optional)
- **All reference `users.id`** for ownership

### Boilerplate Pattern

The `capability_registry` table allows dynamic capability discovery:

- Capabilities register themselves
- IdeaI can discover available capabilities
- UI can be generated from schema
- New capabilities can be added without code changes

### Shared Components

Common UI components shared across all apps:

- `IdeAIHeader` - Unified header with branding
- `AuthDialog` - Sign in/sign up modal
- `UserMenu` - Profile dropdown
- Theme toggle, mobile nav, etc.

---

## Getting Started

This module is in planning phase. See [TODO.md](./TODO.md) for implementation plan.

---

## Contributing

1. Review [AUDIT.md](./AUDIT.md) for current state
2. Check [TODO.md](./TODO.md) for next steps
3. Follow semantic naming conventions
4. Write tests for all new functionality
5. Update documentation

---

## Related Apps

- **IdeaI Capabilities** (`apps/ideai-capabilities`) - Workflow automation
- **IdeaI Vibecoder** (`apps/ideai-vibecoder`) - AI code generation
