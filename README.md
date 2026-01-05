# IdeaI Monorepo

**Future-focused framework for building powerful SaaS applications with parent-child app architecture.**

## What is IdeaI?

IdeaI is a modern monorepo framework that enables:

- **Parent-Child App Architecture**: One parent app serving multiple child apps
- **Unified Deployment**: All apps on one domain with iframe embedding
- **Documentation Integration**: Built-in docs viewer for AI and developers
- **Vercel Ready**: Complete deployment configuration
- **Future-Focused**: No legacy support, 2026+ best practices

## Quick Start

### Prerequisites

- Node.js 20+
- pnpm 9+

### Installation

\`\`\`bash

# Clone repository

git clone <repo-url>
cd ideai-main

# Install dependencies

pnpm install

# Start development

pnpm --filter web dev

# Cold refresh (clean everything and rebuild)

pnpm build:cold
\`\`\`

## Project Structure

\`\`\`
ideai-main/
├── apps/ # Applications
│ ├── web/ # Main parent app (boilerplate)
│ ├── docs/ # Documentation site
│ └── ... # Other child apps
├── packages/ # Shared packages
│ └── ui/ # UI components and utilities
├── docs/ # Documentation files
└── scripts/ # Build and deployment scripts
\`\`\`

## Main App: `apps/web`

The `web` app is:

- **Production App**: Main IdeaI application
- **Boilerplate**: Complete example for new apps
- **Documentation Hub**: Integrated docs viewer

See [apps/web/README.md](apps/web/README.md) for details.

## Documentation

### For Developers

- **Getting Started**: [docs/development/getting-started.md](docs/development/getting-started.md)
- **Architecture**: [docs/architecture/](docs/architecture/)
- **Deployment**: [docs/deployment/](docs/deployment/)

### For AI Assistants

- **Documentation Viewer**: `http://localhost:3000/docs`
- **Filtered Docs**: `http://localhost:3000/docs?category=deployment`
- **App Config**: Check `.ideai.json` files in each app

## Key Features

### 0. Shared Codebase Architecture (Future)

**Vision**: Transform IdeaI into a true shared codebase where any site or capability can be built using shared packages, apps, and components from the `ideai-main` repo.

**Current State**:

- Development mode uses Next.js rewrites (dev-only, temporary)
- Child apps still run on separate ports
- **Framework apps**: ✅ Unified into single `ideai-frameworks` app (87.5% code reduction)
- See [TODOS.md](TODOS.md) for detailed implementation plan

**Target Architecture**:

- **Shared Packages**: Extract capabilities (workflow, lead-agent, app-builder) into `@repo/*` packages
- **Component Reuse**: Any app can import any component from shared packages
- **True Unified Mode**: Child apps imported as React components, no iframes, no separate ports
- **Single Deployment**: All apps bundle into one production deployment

**Recent Progress**:

- ✅ **Framework Unification**: 8 framework apps unified into `ideai-frameworks` (January 5, 2026)
- ✅ **Vercel Cleanup**: All old framework projects removed, alignment complete
- See [Framework Unification Completion](docs/deployment/framework-unification-completion.md) for details
- **Unified Framework Showcase**: One app for all CSS framework demos (instead of 8 duplicate apps)

**Example**:

```typescript
// Build any site using shared capabilities
import { WorkflowBuilder } from "@repo/workflow";
import { LeadAgent } from "@repo/lead-agent";
import { IdeAIPageTemplate } from "@repo/ui";
```

See [TODOS.md](TODOS.md#true-unified-mode-shared-codebase-architecture) for complete implementation plan.

**Vision**: Transform IdeaI into a true shared codebase where any site or capability can be built using shared packages, apps, and components from the `ideai-main` repo.

**Current State**:

- Development mode uses Next.js rewrites (dev-only, temporary)
- Child apps still run on separate ports
- See [TODOS.md](TODOS.md) for detailed implementation plan

**Target Architecture**:

- **Shared Packages**: Extract capabilities (workflow, lead-agent, app-builder) into `@repo/*` packages
- **Component Reuse**: Any app can import any component from shared packages
- **True Unified Mode**: Child apps imported as React components, no iframes, no separate ports
- **Single Deployment**: All apps bundle into one production deployment

**Example**:

```typescript
// Build any site using shared capabilities
import { WorkflowBuilder } from "@repo/workflow";
import { LeadAgent } from "@repo/lead-agent";
import { IdeAIPageTemplate } from "@repo/ui";
```

See [TODOS.md](TODOS.md#true-unified-mode-shared-codebase-architecture) for complete implementation plan.

### 1. Parent-Child Architecture

Configure apps in `.ideai.json`:

\`\`\`json
{
"role": "parent",
"name": "IdeaI",
"childApps": ["docs", "all", "nocss"]
}
\`\`\`

### 2. Unified Deployment

**Current State**: Development mode uses Next.js rewrites to proxy child apps (dev-only, temporary solution).  
**Future**: True unified mode with component imports - all apps bundle into one deployment.

All apps deploy to one Vercel project:

- Parent app: `ideai-main`
- Child apps: Embedded via iframes
- Single domain: `myui.space`

### 3. Documentation Integration

Built-in docs viewer component:
\`\`\`tsx
import { IdeAIDocsViewer } from "@repo/ui";

<IdeAIDocsViewer filter={{ category: "deployment" }} />
\`\`\`

### 4. Page Templates Showcase

Pre-built page templates for common layouts:

- Dashboard, Blog, Social Feed, E-commerce, Landing, Portfolio, Docs, Admin
- JSON-driven configuration for easy extension
- Centralized shadcn theme integration
- Filterable showcase at `/page-templates`

\`\`\`tsx
import { PageTemplatesShowcase } from "@repo/ui/components/page-templates";

<PageTemplatesShowcase />
\`\`\`

### 5. No Legacy Support

- Only current formats (`.ideai.json`)
- No backward compatibility code
- Future-focused architecture

## Development

### Start Development Server

\`\`\`bash

# Parent app (web)

pnpm --filter web dev

# Child app (docs)

pnpm --filter docs dev
\`\`\`

### Build

\`\`\`bash

# Build all apps

pnpm build

# Build specific app

pnpm --filter web build
\`\`\`

### Linting & Type Checking

\`\`\`bash

# Lint

pnpm lint

# Type check

pnpm check-types
\`\`\`

## Deployment

### Vercel Deployment

\`\`\`bash

# Preview

./deploy.sh web

# Production

./deploy.sh --prod web
\`\`\`

### Configuration

Each app's `.ideai.json` specifies Vercel project:

\`\`\`json
{
"vercelProject": {
"projectName": "ideai-main",
"forkToNew": false
}
}
\`\`\`

## Architecture

### Parent-Child Apps

- **Parent**: Serves at root, embeds child apps
- **Child**: Separate Next.js apps, embedded via iframes
- **Configuration**: `.ideai.json` files

### Documentation

- **Docs App**: `apps/docs` (Contentlayer-based)
- **Docs Viewer**: `IdeAIDocsViewer` component
- **Filtering**: By category, path, or search

## Configuration

### App Configuration (`.ideai.json`)

\`\`\`json
{
"role": "parent" | "child",
"name": "App Name",
"childApps": ["app1", "app2"],
"vercelProject": {
"projectName": "project-name",
"forkToNew": false
},
"metadata": {
"id": "app-id",
"port": 3000,
"css": ["Tailwind CSS"],
"capabilities": ["Feature 1", "Feature 2"]
}
}
\`\`\`

## Documentation

### For Developers

- [Getting Started](docs/development/getting-started.md)
- [Architecture Guide](docs/architecture/parent-child-complete.md)
- [Deployment Guide](docs/deployment/overview.md)
- [Vercel Configuration](docs/deployment/vercel.md)

### For AI Assistants

- **Documentation**: Access via `/docs` route
- **App Config**: Check `.ideai.json` in each app
- **Component Docs**: See `packages/ui/src/components/`
- **Architecture**: See `docs/architecture/`

## Contributing

1. Read [docs/CONTRIBUTING.md](docs/CONTRIBUTING.md)
2. Follow code standards in `.cursorrules`
3. No legacy support - use current formats only
4. Update documentation with changes

## License

[License information]

## Support

- **Documentation**: `/docs` or `https://docs.myui.space`
- **Issues**: GitHub Issues
- **Questions**: Check documentation first

---

**Built with IdeaI** - Future-focused framework for modern SaaS applications.
