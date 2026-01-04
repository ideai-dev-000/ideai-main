# V0 Reference Guide - Working Examples

**Complete reference for creating components that work identically in v0 and IdeaI monorepo.**

## 📁 Component Structure

```
apps/v0-000/
├── components/
│   ├── ui/              # Simple UI elements
│   │   ├── demo-button.tsx
│   │   └── demo-card.tsx
│   ├── blocks/          # Composite layouts
│   │   ├── feature-card-block.tsx
│   │   └── stats-block.tsx
│   └── tools/            # Interactive utilities
│       ├── copy-button.tsx
│       └── toggle-switch.tsx
```

## 🎯 Import Patterns

### ✅ Correct Imports

**Shadcn Components (app-specific):**
```tsx
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
```

**Shared IdeaI Components:**
```tsx
import { BrainIcon, CatIcon } from "@repo/ui";
import { IdeAIPageTemplate } from "@repo/ui";
```

**Animation Libraries:**
```tsx
import { motion } from "framer-motion";
```

### ❌ Incorrect Imports

```tsx
// DON'T use @/components/ui/* in packages/ui components
// DON'T use @repo/ui for shadcn components
// DON'T use relative paths when aliases exist
```

## 📦 Component Types

### 1. UI Components (Simple Elements)

**Example: `components/ui/demo-button.tsx`**
```tsx
"use client";

import { Button } from "@/components/ui/button";

interface DemoButtonProps {
  label?: string;
  variant?: "default" | "destructive" | "outline";
}

export function DemoButton({ label = "Click me", variant = "default" }: DemoButtonProps) {
  return <Button variant={variant}>{label}</Button>;
}
```

**Key Points:**
- Use `@/components/ui/*` for shadcn
- Include TypeScript interfaces
- Add `"use client"` if using hooks/events

### 2. Blocks (Composite Layouts)

**Example: `components/blocks/feature-card-block.tsx`**
```tsx
"use client";

import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { BrainIcon } from "@repo/ui";  // Shared component

interface FeatureCardBlockProps {
  icon: "brain" | "cat" | "music" | "rocket";
  title: string;
  description: string;
}

export function FeatureCardBlock({ icon, title, description }: FeatureCardBlockProps) {
  return (
    <Card>
      <CardHeader>
        <BrainIcon className="w-6 h-6" />
        <CardTitle>{title}</CardTitle>
      </CardHeader>
    </Card>
  );
}
```

**Key Points:**
- Combine multiple UI elements
- Mix `@/components/ui/*` and `@repo/ui`
- Create complete, reusable layouts

### 3. Tools (Interactive Utilities)

**Example: `components/tools/copy-button.tsx`**
```tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

interface CopyButtonProps {
  text: string;
  label?: string;
}

export function CopyButton({ text, label = "Copy" }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Button onClick={handleCopy}>
      {copied ? "✓ Copied!" : label}
    </Button>
  );
}
```

**Key Points:**
- Use React hooks (`useState`, `useEffect`)
- Include interactive behavior
- Always `"use client"` for tools

## ✅ Checklist for v0 Components

- [ ] Function names use PascalCase (not kebab-case)
- [ ] Imports use `@/components/ui/*` for shadcn
- [ ] Imports use `@repo/ui` for shared components
- [ ] TypeScript interfaces defined
- [ ] `"use client"` directive if using hooks/events
- [ ] Works in both v0 and monorepo
- [ ] No app-specific Next.js files (layout.tsx, page.tsx)

## 🚀 Workflow

1. **Create in v0** → Components saved to `apps/v0-ideai/`
2. **Sync** → `pnpm v0:sync` → Copies to `apps/web/components/v0-staging/`
3. **Export** → `pnpm v0:export` → Makes available via `@repo/ui`
4. **Use** → `import { Component } from "@repo/ui"`

## 📚 See Working Examples

All demo components are live at: **http://localhost:3015**

- **UI Components**: Buttons, Cards
- **Blocks**: Feature cards, Stats grid
- **Tools**: Copy button, Toggle switch

---

**These examples work identically in v0 and the monorepo. Use them as reference!**

