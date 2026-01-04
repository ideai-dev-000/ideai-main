# V0 Instructions for IdeaI Monorepo

**Instructions for creating components in v0 that work perfectly with IdeaI monorepo.**

## 🎯 What You Can Use

### Available Libraries

1. **@repo/ui** - Shared IdeaI components
   - `IdeAIPageTemplate`, `IdeaIButton`, `ThemeProvider`
   - All v0-exported components (BrainIcon, LogoPreview, etc.)

2. **@/components/ui/*** - Shadcn/UI components
   - `Button`, `Card`, `Label`, `RadioGroup`, `Slider`, `Switch`, `Separator`, `Tooltip`

3. **framer-motion** - Animation library
   - `import { motion } from "framer-motion"`

4. **Radix UI** - Available via shadcn components

### Import Paths

- ✅ `import { Component } from "@repo/ui"` - Shared components
- ✅ `import { Button } from "@/components/ui/button"` - Shadcn components
- ✅ `import { motion } from "framer-motion"` - Animations
- ❌ Don't use `@/components/svgs/*` - Use `@repo/ui` instead
- ❌ Don't use `@/components/logos/*` - Use `@repo/ui` instead

## 📝 Component Creation Guidelines

### 1. Function Names

- ✅ Use PascalCase: `export function MyComponent()`
- ❌ Don't use kebab-case: `export function my-component()` (will be auto-fixed)

### 2. File Structure

- **UI Elements**: `components/ui/your-component.tsx`
- **Blocks**: `blocks/your-block.tsx`
- **Pages**: `app/your-page/page.tsx`

### 3. Component Types

**UI Elements** (Simple, reusable):
```tsx
// components/ui/my-icon.tsx
interface MyIconProps {
  className?: string;
}

export function MyIcon({ className = "" }: MyIconProps) {
  return <div className={className}>...</div>;
}
```

**Blocks** (Layout + UI):
```tsx
// blocks/my-block.tsx
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function MyBlock() {
  return (
    <Card>
      <Button>Click me</Button>
    </Card>
  );
}
```

## 🎨 Styling

- Use Tailwind CSS classes
- Use CSS variables from IdeaI design system
- Dark mode is automatic via ThemeProvider

## 🚀 After Creating Components

1. Components are automatically synced to `v0-staging`
2. Run `pnpm v0:export` to make them available in all apps
3. Import: `import { YourComponent } from "@repo/ui"`

## ✅ Checklist

- [ ] Function names use PascalCase
- [ ] Imports use correct paths (`@repo/ui` or `@/components/ui/*`)
- [ ] Components are properly typed
- [ ] Uses Tailwind CSS for styling
- [ ] Works in both light and dark mode

---

**Follow these guidelines and your components will work perfectly in IdeaI!**

