/**
 * @fileoverview Tasks Data - Centralized task list
 *
 * All tasks extracted from TODOS.md and codebase @todo comments.
 * Organized by category and priority.
 */

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: "high" | "medium" | "low";
  status: "pending" | "in-progress" | "blocked";
  category: string;
  assignee?: string;
  tags?: string[];
  markdown?: string;
}

export const tasks: Task[] = [
  // Architecture - High Priority
  {
    id: "unified-mode-packages",
    title: "Extract Capabilities to Packages for True Unified Mode",
    description:
      "Transform IdeaI from separate apps into true shared codebase where capabilities are packages",
    priority: "high",
    status: "pending",
    category: "Architecture",
    tags: ["unified-mode", "packages", "shared-codebase"],
    markdown: `
### Goal
Transform IdeaI into true shared codebase:
- Extract workflow builder to @repo/workflow package
- Extract lead agent to @repo/lead-agent package  
- Extract app builder to @repo/app-builder package
- All apps become thin wrappers using shared packages

### Implementation Steps
1. Create @repo/workflow package from ideai-workflow app
2. Create @repo/lead-agent package from lead-processing-agent app
3. Create @repo/app-builder package from ideai-builder app
4. Refactor apps to use packages
5. Implement true unified mode (remove iframes/rewrites)
6. Update build system for component imports

**Estimated**: 13-19 days
    `,
  },
  {
    id: "submodule-deployment",
    title: "Submodule Deployment Strategy Decision",
    description: "Decide how submodules should be deployed to Vercel",
    priority: "high",
    status: "pending",
    category: "Architecture",
    tags: ["submodules", "deployment", "vercel"],
  },
  {
    id: "submodule-development",
    title: "Submodule Development Workflow Research",
    description:
      "Research proper submodule development workflow for IdeaI alignment",
    priority: "high",
    status: "pending",
    category: "Architecture",
    tags: ["submodules", "development", "v0"],
  },

  // Build System
  {
    id: "build-memory-monitoring",
    title: "Real-time Memory Monitoring in Build UI",
    priority: "medium",
    status: "pending",
    category: "Build System",
    tags: ["build", "monitoring", "ui"],
  },
  {
    id: "build-history",
    title: "Build History Tracking and Reporting",
    priority: "medium",
    status: "pending",
    category: "Build System",
    tags: ["build", "tracking", "history"],
  },
  {
    id: "auto-dependency-sync",
    title: "Automatic Dependency Sync on Build",
    priority: "medium",
    status: "pending",
    category: "Build System",
    tags: ["build", "dependencies", "automation"],
  },
  {
    id: "auto-submodule-updates",
    title: "Automatic Submodule Updates Before Build",
    priority: "medium",
    status: "pending",
    category: "Build System",
    tags: ["build", "submodules", "automation"],
  },
  {
    id: "build-docs-verification",
    title: "Enhanced Documentation Verification (Code Snippet Testing)",
    priority: "medium",
    status: "pending",
    category: "Build System",
    tags: ["build", "documentation", "verification"],
  },
  {
    id: "build-rules-ui",
    title: "Rules Management UI Integration",
    priority: "medium",
    status: "pending",
    category: "Build System",
    tags: ["build", "rules", "ui"],
  },

  // Infrastructure
  {
    id: "centralized-cache",
    title: "Implement Centralized Cache Management",
    description: "Move from per-app caches to centralized .cache/ location",
    priority: "medium",
    status: "pending",
    category: "Infrastructure",
    tags: ["cache", "performance", "cleanup"],
    markdown: `
### Goal
Create centralized cache location to improve disk space management.

### Current State
- Each app has .next/ cache (200MB+ per app)
- 13 apps × 200MB = potential 2.6GB+ cache
- No centralized cleanup mechanism

### Proposed Solution
- Create .cache/ at repo root
- Configure Next.js/Turbopack to use centralized cache
- Update cleanup scripts
- Shared cache across apps (faster builds)

**Estimated**: 4-6 hours
    `,
  },

  // UI Components - v0 Review
  {
    id: "v0-components-review",
    title: "Review and Apply IdeaI Standards to v0 Components",
    description:
      "Review all v0 components and ensure they meet IdeaI standards",
    priority: "medium",
    status: "pending",
    category: "UI Components",
    tags: ["v0", "standards", "review"],
    markdown: `
### Components Needing Review
- ideai-icon.tsx
- kute-logo.tsx
- motion-one-logo.tsx
- react-spring-logo.tsx
- particles-logo.tsx
- vivus-logo.tsx
- svg-selector.tsx
- animation-controls.tsx
- rocket-icon.tsx
- music-icon.tsx
- cat-icon.tsx
- brain-icon.tsx
- geometric-icon.tsx
- circle-icon.tsx
- framer-motion-logo.tsx
- logo-preview.tsx

All have @todo: Review and apply IdeaI standards
    `,
  },

  // UniFrame Components
  {
    id: "uf-button-enhancements",
    title: "UF Button: Add icon support, loading spinner, size variants",
    priority: "low",
    status: "pending",
    category: "UniFrame Components",
    tags: ["uniframe", "button", "enhancements"],
  },
  {
    id: "uf-badge-variants",
    title: "UF Badge: Add color variants, size variants, dismissible option",
    priority: "low",
    status: "pending",
    category: "UniFrame Components",
    tags: ["uniframe", "badge", "enhancements"],
  },
  {
    id: "uf-form-field-types",
    title: "UF Form Field: Add textarea, select, checkbox/radio group support",
    priority: "low",
    status: "pending",
    category: "UniFrame Components",
    tags: ["uniframe", "form", "enhancements"],
  },
  {
    id: "uf-input-enhancements",
    title: "UF Input: Add validation states, size variants, icon support",
    priority: "low",
    status: "pending",
    category: "UniFrame Components",
    tags: ["uniframe", "input", "enhancements"],
  },
  {
    id: "uf-card-layouts",
    title: "UF Card: Add custom layouts, framework transitions",
    priority: "low",
    status: "pending",
    category: "UniFrame Components",
    tags: ["uniframe", "card", "enhancements"],
  },
  {
    id: "uf-header-enhancements",
    title: "UF Header: Add custom layouts, icon support",
    priority: "low",
    status: "pending",
    category: "UniFrame Components",
    tags: ["uniframe", "header", "enhancements"],
  },
  {
    id: "uf-body-enhancements",
    title: "UF Body: Add custom layouts, grid/flex options",
    priority: "low",
    status: "pending",
    category: "UniFrame Components",
    tags: ["uniframe", "body", "enhancements"],
  },
  {
    id: "uf-footer-enhancements",
    title: "UF Footer: Add footer actions, timestamp/date display",
    priority: "low",
    status: "pending",
    category: "UniFrame Components",
    tags: ["uniframe", "footer", "enhancements"],
  },

  // Documentation
  {
    id: "docs-inline-help",
    title: "Add Inline Help for Each Action",
    priority: "medium",
    status: "pending",
    category: "Documentation",
    tags: ["documentation", "help", "ui"],
  },
  {
    id: "docs-tooltips",
    title: "Add Tooltips for Options",
    priority: "medium",
    status: "pending",
    category: "Documentation",
    tags: ["documentation", "tooltips", "ui"],
  },
  {
    id: "docs-context-help",
    title: "Add Context-Sensitive Help",
    priority: "low",
    status: "pending",
    category: "Documentation",
    tags: ["documentation", "help", "ui"],
  },
  {
    id: "docs-video-tutorials",
    title: "Video Tutorials (Future)",
    priority: "low",
    status: "pending",
    category: "Documentation",
    tags: ["documentation", "video", "future"],
  },

  // Performance
  {
    id: "perf-ui-rendering",
    title: "Optimize UI Rendering",
    priority: "medium",
    status: "pending",
    category: "Performance",
    tags: ["performance", "rendering", "optimization"],
  },
  {
    id: "perf-lazy-load",
    title: "Lazy Load Modules",
    priority: "medium",
    status: "pending",
    category: "Performance",
    tags: ["performance", "lazy-loading", "optimization"],
  },
  {
    id: "perf-cache-status",
    title: "Cache Status Data",
    priority: "medium",
    status: "pending",
    category: "Performance",
    tags: ["performance", "caching", "optimization"],
  },
  {
    id: "perf-reduce-memory",
    title: "Reduce Memory Usage",
    priority: "medium",
    status: "pending",
    category: "Performance",
    tags: ["performance", "memory", "optimization"],
  },

  // Testing
  {
    id: "test-comprehensive",
    title: "Comprehensive Test Suite",
    priority: "low",
    status: "pending",
    category: "Testing",
    tags: ["testing", "coverage", "quality"],
  },
  {
    id: "test-integration",
    title: "Integration Tests",
    priority: "low",
    status: "pending",
    category: "Testing",
    tags: ["testing", "integration", "quality"],
  },
  {
    id: "test-e2e",
    title: "E2E Tests for UI",
    priority: "low",
    status: "pending",
    category: "Testing",
    tags: ["testing", "e2e", "ui"],
  },
  {
    id: "test-performance",
    title: "Performance Benchmarks",
    priority: "low",
    status: "pending",
    category: "Testing",
    tags: ["testing", "performance", "benchmarks"],
  },

  // Code Quality
  {
    id: "eslint-warning",
    title: "Fix Remaining ESLint Warning (1 false positive)",
    description: "1 warning in ideai-icon.tsx - prop-types false positive",
    priority: "low",
    status: "pending",
    category: "Code Quality",
    tags: ["eslint", "typescript", "cleanup"],
  },

  // Boot System
  {
    id: "boot-log-viewer",
    title: "Log Viewer Integration in UI",
    priority: "medium",
    status: "pending",
    category: "Boot System",
    tags: ["boot", "logs", "ui"],
  },
  {
    id: "boot-health-monitoring",
    title: "Health Monitoring Display",
    priority: "medium",
    status: "pending",
    category: "Boot System",
    tags: ["boot", "monitoring", "health"],
  },
  {
    id: "boot-memory-monitoring",
    title: "Memory Monitoring Display",
    priority: "medium",
    status: "pending",
    category: "Boot System",
    tags: ["boot", "monitoring", "memory"],
  },
  {
    id: "boot-parallel",
    title: "Parallel Boot Option for Faster Startup",
    priority: "low",
    status: "pending",
    category: "Boot System",
    tags: ["boot", "performance", "parallel"],
  },
  {
    id: "boot-config-file",
    title: "Boot Configuration File Support",
    priority: "low",
    status: "pending",
    category: "Boot System",
    tags: ["boot", "configuration"],
  },
  {
    id: "boot-realtime-status",
    title: "Real-time Server Status",
    priority: "medium",
    status: "pending",
    category: "Boot System",
    tags: ["boot", "status", "realtime"],
  },
  {
    id: "boot-progress-tracking",
    title: "Boot Progress Tracking",
    priority: "low",
    status: "pending",
    category: "Boot System",
    tags: ["boot", "progress", "tracking"],
  },

  // Develop Tools
  {
    id: "dev-deployment-tracking",
    title: "Deployment Tracking and History",
    priority: "medium",
    status: "pending",
    category: "Develop Tools",
    tags: ["deployment", "tracking", "history"],
  },
  {
    id: "dev-aws-integration",
    title: "AWS Integration (Future)",
    priority: "low",
    status: "pending",
    category: "Develop Tools",
    tags: ["aws", "integration", "future"],
  },
  {
    id: "dev-docker-integration",
    title: "Docker Integration (Future)",
    priority: "low",
    status: "pending",
    category: "Develop Tools",
    tags: ["docker", "integration", "future"],
  },
  {
    id: "dev-vercel-enhancements",
    title: "Enhanced Vercel Project Management",
    priority: "medium",
    status: "pending",
    category: "Develop Tools",
    tags: ["vercel", "management", "ui"],
  },
  {
    id: "dev-subdomain-verification",
    title: "Automated Subdomain Verification",
    priority: "medium",
    status: "pending",
    category: "Develop Tools",
    tags: ["vercel", "subdomain", "automation"],
  },
  {
    id: "dev-vercel-linking-ui",
    title: "Vercel Project Linking UI",
    priority: "medium",
    status: "pending",
    category: "Develop Tools",
    tags: ["vercel", "linking", "ui"],
  },
  {
    id: "dev-secrets-ui",
    title: "Secrets Management UI",
    priority: "medium",
    status: "pending",
    category: "Develop Tools",
    tags: ["vercel", "secrets", "ui"],
  },
  {
    id: "dev-subdomain-wizard",
    title: "Subdomain Setup Wizard",
    priority: "medium",
    status: "pending",
    category: "Develop Tools",
    tags: ["vercel", "subdomain", "wizard"],
  },
  {
    id: "dev-sync-status",
    title: "Sync Status Display",
    priority: "low",
    status: "pending",
    category: "Develop Tools",
    tags: ["vercel", "sync", "status"],
  },

  // UI Enhancements
  {
    id: "ui-realtime-status",
    title: "Real-time Status Updates",
    priority: "medium",
    status: "pending",
    category: "UI Enhancements",
    tags: ["ui", "realtime", "status"],
  },
  {
    id: "ui-command-execution",
    title: "Command Execution with Output Capture",
    priority: "medium",
    status: "pending",
    category: "UI Enhancements",
    tags: ["ui", "commands", "output"],
  },
  {
    id: "ui-error-handling",
    title: "Enhanced Error Handling and Display",
    priority: "medium",
    status: "pending",
    category: "UI Enhancements",
    tags: ["ui", "errors", "handling"],
  },
  {
    id: "ui-progress-indicators",
    title: "Progress Indicators for Long Tasks",
    priority: "medium",
    status: "pending",
    category: "UI Enhancements",
    tags: ["ui", "progress", "feedback"],
  },
  {
    id: "ui-keyboard-shortcuts",
    title: "Keyboard Shortcuts Help",
    priority: "low",
    status: "pending",
    category: "UI Enhancements",
    tags: ["ui", "keyboard", "shortcuts"],
  },
  {
    id: "ui-command-formatting",
    title: "Command Output Formatting",
    priority: "medium",
    status: "pending",
    category: "UI Enhancements",
    tags: ["ui", "commands", "formatting"],
  },

  // Integration
  {
    id: "integration-tool-modules",
    title: "Connect All Tool Modules to UI",
    priority: "medium",
    status: "pending",
    category: "Integration",
    tags: ["integration", "tools", "ui"],
  },
  {
    id: "integration-status-polling",
    title: "Real-time Status Polling",
    priority: "medium",
    status: "pending",
    category: "Integration",
    tags: ["integration", "status", "polling"],
  },
  {
    id: "integration-event-driven",
    title: "Event-driven Updates",
    priority: "medium",
    status: "pending",
    category: "Integration",
    tags: ["integration", "events", "updates"],
  },
  {
    id: "integration-config-management",
    title: "Configuration Management",
    priority: "medium",
    status: "pending",
    category: "Integration",
    tags: ["integration", "configuration", "management"],
  },
  {
    id: "integration-state-persistence",
    title: "State Persistence",
    priority: "medium",
    status: "pending",
    category: "Integration",
    tags: ["integration", "state", "persistence"],
  },

  // Advanced Features
  {
    id: "advanced-plugin-system",
    title: "Plugin System",
    priority: "low",
    status: "pending",
    category: "Advanced Features",
    tags: ["plugins", "extensibility", "future"],
  },
  {
    id: "advanced-command-history",
    title: "Command History",
    priority: "low",
    status: "pending",
    category: "Advanced Features",
    tags: ["commands", "history", "ux"],
  },
  {
    id: "advanced-favorites",
    title: "Favorites/Bookmarks",
    priority: "low",
    status: "pending",
    category: "Advanced Features",
    tags: ["favorites", "bookmarks", "ux"],
  },
  {
    id: "advanced-search",
    title: "Search Functionality",
    priority: "low",
    status: "pending",
    category: "Advanced Features",
    tags: ["search", "functionality", "ux"],
  },

  // Legacy Code Cleanup
  {
    id: "legacy-mappings-cleanup",
    title: "Remove Legacy Action Mappings",
    description:
      "Remove legacy-mappings.ts once all workflows migrated to new format",
    priority: "medium",
    status: "pending",
    category: "Code Cleanup",
    tags: ["legacy", "migration", "cleanup"],
    markdown: `
### Location
\`apps/ideai-capabilities/plugins/legacy-mappings.ts\`

### Action
Remove this file once all workflows have been migrated to new namespaced format.

### Current State
Maps old action type names to new namespaced action IDs for backward compatibility.

**TODO**: Remove this file once all workflows have been migrated to the new format.
    `,
  },
];
