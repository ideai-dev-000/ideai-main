# V0 Instructions for IdeaI Monorepo

**Instructions for creating components in v0 that work perfectly with IdeaI monorepo.**

## ⚠️ CRITICAL: V0 Preview Limitation

**v0.dev preview cannot resolve workspace dependencies like `@repo/ui`.**

**Error you'll see:**
\`\`\`
Failed to load "@repo/ui" from "blob:...". Modules must be served with a valid MIME type.
\`\`\`

**Solution for v0.dev upload:**

1. **Remove `@repo/ui` imports** before uploading to v0.dev
2. **Use only standard packages** (shadcn, framer-motion, etc.)
3. **Copy needed components locally** if required
4. **See `V0-WORKSPACE-FIX.md`** for detailed instructions

**In monorepo**: `@repo/ui` works perfectly - keep it here!

## 🎯 What You Can Use

### Available Libraries

1. **@repo/ui** - Shared IdeaI components
   - `IdeAIPageTemplate`, `IdeaIButton`, `ThemeProvider`
   - All v0-exported components (BrainIcon, LogoPreview, etc.)

2. **@/components/ui/\*** - Shadcn/UI components
   - `Button`, `Card`, `Label`, `RadioGroup`, `Slider`, `Switch`, `Separator`, `Tooltip`, `Badge`

3. **framer-motion** - Animation library
   - `import { motion } from "framer-motion"`

4. **Radix UI** - Available via shadcn components

### Import Paths

- ✅ `import { Component } from "@repo/ui"` - Shared components
- ✅ `import { Button } from "@/components/ui/button"` - Shadcn components
- ✅ `import { motion } from "framer-motion"` - Animations
- ❌ Don't use `@/components/svgs/*` - Use `@repo/ui` instead
- ❌ Don't use `@/components/logos/*` - Use `@repo/ui` instead

## 🎨 Theming System

**Themes work independently of UI components!**

### How Theming Works

1. **Themes are defined** in `themes/*.ts` files
2. **CSS variables are set** dynamically (--primary, --secondary, etc.)
3. **UI components automatically adapt** - no code changes needed
4. **Works with v0** - just use standard Tailwind color classes

### Using Theme Colors in Components

\`\`\`tsx
// ✅ Correct - Uses theme colors automatically
<Button className="bg-primary text-primary-foreground">
Click me
</Button>

// ❌ Incorrect - Hardcoded colors don't respect themes
<Button className="bg-blue-500 text-white">
Click me
</Button>
\`\`\`

### Available Theme Classes

Use these Tailwind classes - they automatically use theme colors:

- `bg-primary`, `text-primary-foreground`
- `bg-secondary`, `text-secondary-foreground`
- `bg-accent`, `text-accent-foreground`
- `bg-muted`, `text-muted-foreground`
- `bg-destructive`, `text-destructive-foreground`
- `bg-background`, `text-foreground`
- `bg-card`, `text-card-foreground`
- `border-border`

### Creating Themes in v0

When v0 creates a new theme:

1. Define colors in HSL format
2. Include both `colors` (light) and `dark` variants
3. Use standard color tokens (primary, secondary, etc.)
4. Add to `themes/index.ts` registry
5. All components automatically use the new theme!

## 📝 Component Creation Guidelines

### 1. Function Names

- ✅ Use PascalCase: `export function MyComponent()`
- ❌ Don't use kebab-case: `export function my-component()` (will be auto-fixed)

### 2. File Structure

- **UI Elements**: `components/ui/your-component.tsx`
- **Blocks**: `blocks/your-block.tsx`
- **Pages**: `app/your-page/page.tsx`
- **Themes**: `themes/your-theme.ts`

### 3. Component Types

**UI Elements** (Simple, reusable):
\`\`\`tsx
// components/ui/my-icon.tsx
interface MyIconProps {
className?: string;
}

export function MyIcon({ className = "" }: MyIconProps) {
return <div className={className}>...</div>;
}
\`\`\`

**Blocks** (Layout + UI):
\`\`\`tsx
// blocks/my-block.tsx
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function MyBlock() {
return (
<Card className="bg-card text-card-foreground">
<Button className="bg-primary text-primary-foreground">Click me</Button>
</Card>
);
}
\`\`\`

## 🎨 Styling

- Use Tailwind CSS classes
- Use theme color classes (`bg-primary`, `text-foreground`, etc.)
- Dark mode is automatic via ThemeProvider
- Themes are applied via CSS variables

## 🚀 After Creating Components

1. Components are automatically synced to `v0-staging`
2. Run `pnpm v0:export` to make them available in all apps
3. Import: `import { YourComponent } from "@repo/ui"`

## ✅ Checklist

- [ ] Function names use PascalCase
- [ ] Imports use correct paths (`@repo/ui` or `@/components/ui/*`)
- [ ] Components are properly typed
- [ ] Uses Tailwind CSS for styling
- [ ] Uses theme color classes (not hardcoded colors)
- [ ] Works in both light and dark mode
- [ ] Works with all themes

---

**Follow these guidelines and your components will work perfectly in IdeaI with any theme!**
