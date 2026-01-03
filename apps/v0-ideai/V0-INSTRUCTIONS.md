# Instructions for V0 - IdeaI Component Creation

**Purpose**: Create components in v0 that work frictionlessly in the IdeaI monorepo.

## Where to Create

**Location**: `apps/v0-ideai/`

**Structure**:
```
apps/v0-ideai/
├── components/
│   ├── ui/              # UI components (buttons, cards, etc.)
│   └── [other]/         # Other components
├── app/
│   └── page.tsx         # Pages
└── blocks/              # Page blocks (sections, layouts)
```

## Import Paths to Use

### For shadcn/ui Components
```tsx
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
```

### For Shared IdeaI Components
```tsx
import { IdeAIPageTemplate } from "@repo/ui";
import { IdeaIButton } from "@repo/ui";
```

### For Other Components in Same Project
```tsx
import { ComponentName } from "@/components/component-name";
```

## Component Patterns

### 1. UI Element (Simple Component)

**Example**: A button, card, input, etc.

**Location**: `apps/v0-ideai/components/ui/`

**Pattern**:
```tsx
// apps/v0-ideai/components/ui/custom-button.tsx
"use client";

import { Button } from "@/components/ui/button";

export function CustomButton({ children, ...props }) {
  return (
    <Button {...props}>
      {children}
    </Button>
  );
}
```

### 2. Block (Layout + UI)

**Example**: Hero section, feature grid, CTA section, etc.

**Location**: `apps/v0-ideai/blocks/`

**Pattern**:
```tsx
// apps/v0-ideai/blocks/hero-section.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

export function HeroSection() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <Card>
          <CardHeader>
            <h1 className="text-4xl font-bold">Hero Title</h1>
          </CardHeader>
          <CardContent>
            <p>Hero description</p>
            <Button>Get Started</Button>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
```

## Requirements

### 1. Use "use client" Directive
All components that use interactivity or hooks must have:
```tsx
"use client";
```

### 2. Use TypeScript
- Use `.tsx` extension
- Add proper types
- No `any` types

### 3. Use Tailwind CSS
- Use Tailwind utility classes
- Follow existing patterns
- Use design tokens from IdeaI

### 4. Export Components
```tsx
// Named export (preferred)
export function ComponentName() { }

// Or default export
export default function ComponentName() { }
```

## What to Create

### Test 1: UI Element
**Create**: A custom button component
- Location: `apps/v0-ideai/components/ui/custom-button.tsx`
- Use: `@/components/ui/button` from shadcn
- Add: Custom styling or behavior
- Export: Named export

### Test 2: Block (Layout + UI)
**Create**: A hero section block
- Location: `apps/v0-ideai/blocks/hero-section.tsx`
- Use: Multiple UI components (Button, Card, etc.)
- Include: Layout structure
- Export: Named export

## After Creation

1. **Sync**: Run `pnpm v0:sync` (from monorepo root)
2. **Export**: Run `pnpm v0:export` (makes available in all apps)
3. **Use**: Import in any app: `import { ComponentName } from "@repo/ui"`

## Example Prompts for V0

### For UI Element:
```
Create a custom button component in apps/v0-ideai/components/ui/custom-button.tsx.
Use the shadcn Button component from @/components/ui/button.
Add custom styling with Tailwind CSS.
Export as a named export.
Use TypeScript with proper types.
Include "use client" directive.
```

### For Block:
```
Create a hero section block in apps/v0-ideai/blocks/hero-section.tsx.
Use shadcn components: Button from @/components/ui/button and Card from @/components/ui/card.
Include a title, description, and CTA button.
Use Tailwind CSS for layout and styling.
Export as a named export.
Use TypeScript with proper types.
Include "use client" directive.
```

## Notes

- **File naming**: Use kebab-case (e.g., `custom-button.tsx`, `hero-section.tsx`)
- **Component naming**: Use PascalCase (e.g., `CustomButton`, `HeroSection`)
- **Imports**: Always use `@/components/ui/*` for shadcn components
- **Structure**: Follow the directory structure above
- **Exports**: Use named exports for better tree-shaking

