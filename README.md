# Turborepo Next.js Starter Kit

A modern monorepo starter built with **Turborepo**, **Next.js 16**, and **pnpm workspaces**.

## 🚀 What's Inside?

This monorepo includes the following packages and apps:

### Apps
- `web`: Main Next.js application (port 3000)
- `docs`: Documentation Next.js application (port 3001)

### Packages
- `@repo/ui`: Shared React component library
- `@repo/typescript-config`: Shared TypeScript configurations

## 📦 Installation

This monorepo uses **pnpm** as the package manager.

```bash
# Install dependencies
pnpm install

# Run all apps in development mode
pnpm dev

# Build all apps and packages
pnpm build

# Lint all apps and packages
pnpm lint
```

## 🛠️ Development

Each app can be run independently:

```bash
# Run the web app only
cd apps/web
pnpm dev

# Run the docs app only
cd apps/docs
pnpm dev
```

## 📁 Project Structure

```
.
├── apps
│   ├── web          # Main Next.js app
│   └── docs         # Documentation app
├── packages
│   ├── ui           # Shared UI components
│   └── typescript-config  # Shared TS configs
├── turbo.json       # Turborepo configuration
└── package.json     # Root package.json with workspaces
```

## 🔧 Adding New Packages

To add a new shared package:

1. Create a new directory in `packages/`
2. Add it to the `workspaces` in root `package.json`
3. Import it in your apps using `@repo/package-name`

## 🌟 Features

- ⚡ **Turborepo** - High-performance build system
- 📦 **pnpm Workspaces** - Fast, disk-space efficient package management
- 🎨 **Shared UI Components** - Reusable components across apps
- 🔒 **TypeScript** - Type-safe development
- 🎯 **Next.js 16** - Latest Next.js with App Router
- 🚀 **Fast Builds** - Intelligent caching and parallel execution

## 📚 Learn More

- [Turborepo Documentation](https://turbo.build/repo/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [pnpm Documentation](https://pnpm.io/)
```

```tsx file="app/layout.tsx" isDeleted="true"
...deleted...
