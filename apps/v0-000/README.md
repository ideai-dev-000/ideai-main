# V0-000 - Perfect V0-Compatible Template

**Perfect v0-compatible template app for IdeaI monorepo experiments.**

## ⚠️ V0 Preview Limitation

**v0.dev preview cannot resolve workspace dependencies (`@repo/ui`).**

**Before uploading to v0.dev:**
- See `V0-WORKSPACE-FIX.md` for instructions
- Remove `@repo/ui` imports temporarily
- Use standard packages only in v0 preview

**In monorepo**: `@repo/ui` works perfectly - keep it here!

This is the base template for all v0 experiments. It's pre-configured with all the correct dependencies, import paths, and structure to work seamlessly with v0 and the IdeaI monorepo.

## 🎯 Purpose

- **V0 Experiments**: Create components in v0 and sync them seamlessly
- **Template Base**: Use as a starting point for new v0 prototypes
- **Learning**: Understand how v0 components integrate with IdeaI
- **Testing**: Test v0-created components before promoting to production

## 📦 Available Libraries

### @repo/ui (Shared IdeaI Components)

Import from `@repo/ui` for shared components:

```tsx
import { 
  IdeAIPageTemplate,
  IdeaIButton,
  ThemeProvider,
  // V0 Components
  BrainIcon,
  CatIcon,
  LogoPreview,
  SvgSelector,
  AnimationControls
} from "@repo/ui";
```

**Available V0 Components:**
- **Icons**: `BrainIcon`, `CatIcon`, `MusicIcon`, `RocketIcon`, `IdeaiIcon`, `GeometricIcon`, `CircleIcon`
- **Blocks**: `LogoPreview`, `SvgSelector`, `AnimationControls`
- **Logos**: `FramerMotionLogo`, `ReactSpringLogo`, `KuteLogo`, `MotionOneLogo`, `ParticlesLogo`, `VivusLogo`

### @/components/ui/* (Shadcn/UI Components)

Import from `@/components/ui/*` for app-specific shadcn components:

```tsx
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
```

**Available Shadcn Components:**
- `Button`, `Card`, `Label`
- `RadioGroup`, `RadioGroupItem`
- `Slider`, `Switch`
- `Separator`, `Tooltip`

### Animation Libraries

- **framer-motion**: `12.23.26` - For animations
- Import: `import { motion } from "framer-motion"`

### Radix UI Primitives

All Radix UI primitives are available via shadcn components:
- `@radix-ui/react-label`
- `@radix-ui/react-radio-group`
- `@radix-ui/react-slider`
- `@radix-ui/react-switch`
- `@radix-ui/react-separator`
- `@radix-ui/react-tooltip`

## 🚀 V0 Workflow

### 1. Create Components in V0

Use v0 to create components. They will be saved in `apps/v0-ideai/`.

### 2. Sync to Staging

```bash
pnpm v0:sync
```

This syncs components from `apps/v0-ideai/` to `apps/web/components/v0-staging/` (like-for-like structure).

### 3. Export to All Apps

```bash
pnpm v0:export
```

This exports components from `v0-staging` to `packages/ui/src/components/v0/` and makes them available in ALL apps via `@repo/ui`.

### 4. Use in Your App

```tsx
import { YourComponent } from "@repo/ui";
```

## 📁 Project Structure

```
apps/v0-000/
├── app/
│   ├── globals.css          # Imports centralized IdeaI styles
│   ├── layout.tsx           # Root layout with ThemeProvider
│   └── page.tsx             # Home page example
├── components/
│   ├── ui/                  # Shadcn/UI components (app-specific)
│   └── v0-staging/          # V0-created components (for testing)
├── lib/
│   └── utils.ts             # Utility functions (cn helper)
├── .ideai.json              # IdeaI app configuration
├── components.json           # V0/shadcn configuration
├── package.json             # Dependencies
├── tsconfig.json            # TypeScript config
└── tailwind.config.ts       # Tailwind config
```

## ⚙️ Configuration

### .ideai.json

```json
{
  "name": "v0-000",
  "role": "child",
  "localPort": 3015,
  "v0Integration": true,
  "sharedLibraries": true
}
```

### Import Paths

- `@/*` → `./*` (app root)
- `@/components/ui/*` → Shadcn components
- `@repo/ui` → Shared IdeaI components

### TypeScript

Extends `@repo/typescript-config/nextjs.json` with:
- `jsx: "react-jsx"`
- Path aliases configured
- Next.js plugin enabled

## 🎨 Styling

- **Tailwind CSS 4**: Using `@tailwindcss/postcss`
- **Centralized Styles**: Imports from `@repo/ui/src/styles/`
- **CSS Variables**: Uses IdeaI design system variables
- **Dark Mode**: Automatic via ThemeProvider

## 📝 Best Practices

1. **Use @repo/ui for shared components**: Import v0-exported components from `@repo/ui`
2. **Use @/components/ui for shadcn**: Import shadcn components from `@/components/ui/*`
3. **Follow v0 structure**: Keep components in `components/v0-staging/` for testing
4. **Sync regularly**: Run `pnpm v0:sync` after creating components in v0
5. **Export when ready**: Run `pnpm v0:export` to make components available everywhere

## 🔧 Development

```bash
# Start dev server
pnpm --filter v0-000 dev

# Check types
pnpm --filter v0-000 check-types

# Lint
pnpm --filter v0-000 lint

# Build
pnpm --filter v0-000 build
```

## 📚 Learn More

- See `apps/web/app/v0-test/page.tsx` for component examples
- Check `docs/architecture/v0-*.md` for detailed workflow docs
- Review `scripts/ideai-v0-sync.mjs` and `ideai-v0-export.mjs` for sync logic

## 🎯 Next Steps

1. Start creating components in v0
2. Sync them: `pnpm v0:sync`
3. Export them: `pnpm v0:export`
4. Use them: `import { Component } from "@repo/ui"`

---

**This template is perfect for v0 experiments. Everything is pre-configured and ready to go!**

