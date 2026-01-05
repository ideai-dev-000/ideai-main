# V0 Prototype - IdeaI Boilerplate

Minimal V0 boilerplate for creating IdeaI-compatible prototypes.

## What is This?

This is a minimal Next.js 16 boilerplate that:
- ✅ Follows IdeaI standards and patterns
- ✅ Uses @repo/ui workspace dependency
- ✅ Compatible with V0 for rapid prototyping
- ✅ Ready for experimentation and new features

## Quick Start

```bash
# Install dependencies (from monorepo root)
pnpm install

# Start development server
pnpm --filter v0-prototype dev

# Access at http://localhost:3014
```

## Features

- **Next.js 16** with React 19
- **Tailwind CSS** + IdeaI Design System
- **TypeScript** with strict mode
- **ESLint** with IdeaI config
- **Minimal code** - ready for V0 prototyping

## Structure

```
v0-prototype/
├── app/
│   ├── layout.tsx    # Root layout
│   ├── page.tsx      # Home page
│   └── globals.css  # Global styles
├── .ideai.json       # IdeaI configuration
├── package.json      # Dependencies
└── README.md         # This file
```

## IdeaI Configuration

This app is configured as a **child app** in `.ideai.json`:
- Port: 3014
- Parent: web
- V0 Integration: enabled
- Shared Libraries: enabled

## Usage in V0

1. Copy this boilerplate structure
2. Use it as a starting point in V0
3. Build your prototype with IdeaI components
4. Deploy as part of the IdeaI monorepo

## Next Steps

- Add your prototype code to `app/page.tsx`
- Use IdeaI components from `@repo/ui`
- Follow IdeaI commit standards
- Deploy when ready

