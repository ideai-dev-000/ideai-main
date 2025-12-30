# Getting Started

Welcome to the IdeaI monorepo! This guide will help you get started with development.

## Prerequisites

- **Node.js**: >= 20 (required for Next.js 16)
- **pnpm**: 9.0.0 (installed automatically)
- **Git**: For version control

## Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/ideai-dev-000/ideai-main.git
cd ideai-main
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Start Development Server

```bash
# Start all apps
pnpm dev

# Start specific app
pnpm dev --filter=web
pnpm dev --filter=docs
```

### 4. Access Applications

- **Web App**: http://localhost:3000
  - Landing page with "IdeaI" heading
  - Shared Button component
- **Docs App**: http://localhost:3001
  - Landing page with "IdeaI Docs" heading
  - Same design as web app
  - Shared Button component

Both apps share the same clean landing page design, with the only difference being the H1 heading.

## Project Structure

```
ideai-main/
├── apps/
│   ├── web/          # Main web application
│   └── docs/         # Documentation site
├── packages/
│   ├── ui/           # Shared UI components
│   ├── eslint-config/ # Shared ESLint config
│   └── typescript-config/ # Shared TypeScript config
└── docs/             # Documentation
```

## Available Scripts

### Root Level

- `pnpm dev` - Start all development servers
- `pnpm build` - Build all applications
- `pnpm lint` - Lint all packages
- `pnpm check-types` - Type check all packages
- `pnpm format` - Format code with Prettier

### App Level

Each app has its own scripts (run from app directory or with `--filter`):

- `dev` - Start development server
- `build` - Build for production
- `start` - Start production server
- `lint` - Run ESLint
- `check-types` - Type check

## Development Workflow

### Making Changes

1. Create a feature branch
2. Make your changes
3. Run linting and type checking
4. Test locally
5. Commit and push
6. Create pull request

### Code Quality

Before committing:

```bash
# Lint code
pnpm lint

# Type check
pnpm check-types

# Format code
pnpm format
```

## Monorepo Features

### Turborepo

This project uses Turborepo for:
- Fast builds with caching
- Parallel task execution
- Dependency graph management

### Shared Packages

- **@repo/ui**: Reusable React components
- **@repo/eslint-config**: Shared linting rules
- **@repo/typescript-config**: Shared TypeScript configs

## Environment Setup

### Environment Variables

Apps can use environment variables via `.env.local`:

```bash
# Example
cd apps/web
cp .env.example .env.local
```

### Vercel Environment Variables

Pull from Vercel:

```bash
cd apps/web
vercel env pull .env.local
```

## Testing

### Run Tests

```bash
# All tests
pnpm test

# Specific package
pnpm test --filter=web
```

## Building

### Local Build

```bash
pnpm build
```

### Production Build

Builds are optimized for production:
- Code minification
- Tree shaking
- Static optimization (Next.js)

## Troubleshooting

### Port Already in Use

```bash
# Find and kill process
lsof -ti:3000 | xargs kill -9
```

### Dependency Issues

```bash
# Clean install
rm -rf node_modules
pnpm install
```

### Type Errors

```bash
# Regenerate types
pnpm check-types
```

## Next Steps

- [Deployment Guide](../deployment/overview.md)
- [CI/CD Documentation](../deployment/ci-cd.md)
- [Contributing Guidelines](./CONTRIBUTING.md)

## Getting Help

- Check [Troubleshooting](../deployment/troubleshooting.md)
- Review [Documentation Index](../README.md)
- Open an issue on GitHub

