# V0 Component Creation Guide

**Date**: January 3, 2026  
**Purpose**: Instructions for creating components in v0 that work frictionlessly in IdeaI

## Quick Start

### For V0 (Copy This):

```
Create components in apps/v0-ideai/ with this structure:

1. UI Elements → apps/v0-ideai/components/ui/
2. Blocks → apps/v0-ideai/blocks/

Use these imports:
- @/components/ui/button (shadcn components)
- @/components/ui/card (shadcn components)
- @repo/ui (IdeaI shared components)

Requirements:
- "use client" directive for interactive components
- TypeScript (.tsx files)
- Named exports
- Tailwind CSS for styling
- kebab-case file names
- PascalCase component names
```

## Detailed Instructions

### Test 1: Create a UI Element

**Prompt for V0**:
```
Create a custom button component at apps/v0-ideai/components/ui/custom-button.tsx.

Requirements:
- Use the shadcn Button component from @/components/ui/button
- Add custom styling with Tailwind CSS (e.g., gradient background, hover effects)
- Export as a named export: export function CustomButton()
- Use TypeScript with proper types (no 'any')
- Include "use client" directive
- File name: custom-button.tsx (kebab-case)
- Component name: CustomButton (PascalCase)
```

**Expected Result**:
```tsx
// apps/v0-ideai/components/ui/custom-button.tsx
"use client";

import { Button } from "@/components/ui/button";
import { ButtonProps } from "@/components/ui/button";

export function CustomButton({ children, className, ...props }: ButtonProps) {
  return (
    <Button 
      className={`bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 ${className}`}
      {...props}
    >
      {children}
    </Button>
  );
}
```

### Test 2: Create a Block (Layout + UI)

**Prompt for V0**:
```
Create a hero section block at apps/v0-ideai/blocks/hero-section.tsx.

Requirements:
- Use shadcn components: Button from @/components/ui/button, Card from @/components/ui/card
- Include: title (h1), description (p), and CTA button
- Use Tailwind CSS for layout (centered, max-width, padding)
- Export as a named export: export function HeroSection()
- Use TypeScript with proper types
- Include "use client" directive
- File name: hero-section.tsx (kebab-case)
- Component name: HeroSection (PascalCase)
```

**Expected Result**:
```tsx
// apps/v0-ideai/blocks/hero-section.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

export function HeroSection() {
  return (
    <section className="py-20 px-4 bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
      <div className="max-w-6xl mx-auto">
        <Card>
          <CardHeader>
            <h1 className="text-4xl font-bold text-center">
              Welcome to IdeaI
            </h1>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-lg text-muted-foreground">
              Build amazing UIs with frictionless component workflow
            </p>
            <Button size="lg">Get Started</Button>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
```

## After Creation - Workflow

### Step 1: Sync to Staging
```bash
# From monorepo root
pnpm v0:sync
```

**Result**: Components copied to `apps/web/components/v0-staging/` with identical structure

### Step 2: Export (Make Available)
```bash
pnpm v0:export
```

**Result**: 
- Components exported to `packages/ui/src/components/v0/`
- Updated `packages/ui/src/index.ts` with exports
- Available in ALL apps immediately!

### Step 3: Use in Any App
```tsx
// In apps/web/app/page.tsx (or any app)
import { CustomButton, HeroSection } from "@repo/ui";

export default function Page() {
  return (
    <div>
      <HeroSection />
      <CustomButton>Click Me</CustomButton>
    </div>
  );
}
```

### Step 4: Test Across Apps
```tsx
// Test in apps/web/app/test/page.tsx
import { CustomButton, HeroSection } from "@repo/ui";

// Test in apps/docs/app/test/page.tsx
import { CustomButton, HeroSection } from "@repo/ui";

// Test in apps/all/app/test/page.tsx
import { CustomButton, HeroSection } from "@repo/ui";
```

**Same import works everywhere!**

## Watch Mode (Optional)

For automatic export on changes:

```bash
# Terminal 1: Start watch mode
pnpm v0:export:watch

# Terminal 2: Work normally
# - Create in v0
# - Sync: pnpm v0:sync
# - Auto-exported immediately!
```

## File Structure

```
apps/v0-ideai/
├── components/
│   └── ui/
│       └── custom-button.tsx    ← UI Element
├── blocks/
│   └── hero-section.tsx          ← Block (Layout + UI)
└── app/
    └── page.tsx                  ← Pages
```

## Import Reference

### Available in v0-ideai:
```tsx
// shadcn/ui components
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tooltip } from "@/components/ui/tooltip";

// IdeaI shared components
import { IdeAIPageTemplate } from "@repo/ui";
import { IdeaIButton } from "@repo/ui";
```

## Checklist

Before syncing, ensure:
- [ ] Component has "use client" if interactive
- [ ] Uses TypeScript (no 'any' types)
- [ ] Named export (not default)
- [ ] File name is kebab-case
- [ ] Component name is PascalCase
- [ ] Uses correct import paths
- [ ] Uses Tailwind CSS for styling

## Troubleshooting

### Component not found after export?
- Check: `packages/ui/src/components/v0/` has the file
- Check: `packages/ui/src/index.ts` has the export
- Run: `pnpm v0:export` again

### Import errors?
- Ensure: Component is exported from `packages/ui/src/index.ts`
- Check: Component name matches export name
- Verify: Using `import { ComponentName } from "@repo/ui"`

### Styling issues?
- Ensure: Using Tailwind classes
- Check: Dark mode classes if needed
- Verify: CSS imports in app's `globals.css`

---

## Related

- [V0 Auto-Export Workflow](../architecture/v0-auto-export-workflow.md)
- [V0 Staging Workflow](../architecture/v0-staging-workflow.md)

