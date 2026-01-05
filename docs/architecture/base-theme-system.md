# Base Theme System - IdeaI Design System

## Overview

The IdeaI base theme system combines common assets and UI patterns into a unified, reusable design system built on Tailwind CSS and shadcn/ui. All components work offline with local packages.

## Architecture

### Three-Layer System

1. **Base Layer**: `normalize.css` - Browser reset/normalize
2. **Framework Layer**: Tailwind CSS (exclusive) or MVP.css (exclusive)
3. **Theme Layer**: `base-theme.css` + `ideai.css` - Custom IdeaI design tokens and components

### Theme Files

- `packages/ui/src/styles/base-theme.css` - Base theme variables and utilities
- `packages/ui/src/styles/ideai.css` - IdeaI custom layer (imports base-theme.css)
- `packages/ui/src/styles/ideai-components.css` - Component-specific styles

## Features

### 1. Dark/Light Mode Toggle

**Component**: `ThemeToggle`
**Provider**: `ThemeProvider` (next-themes)
**Location**: Header top-right

\`\`\`tsx
import { ThemeProvider, ThemeToggle } from "@repo/ui";

// In layout.tsx
<ThemeProvider
  attribute="class"
  defaultTheme="system"
  enableSystem
  disableTransitionOnChange
>
  {children}
</ThemeProvider>

// In header
<ThemeToggle />
\`\`\`

**Best Practices**:
- Uses `next-themes` for Next.js 16 compatibility
- System preference detection
- Prevents hydration mismatches
- Smooth transitions

### 2. Mobile Touch Navigation

**Component**: `MobileNav`
**Library**: Radix UI Dialog (Sheet)
**Location**: Header (mobile only)

\`\`\`tsx
import { MobileNav } from "@repo/ui";

<MobileNav navItems={navItems} />
\`\`\`

**Features**:
- Touch-optimized swipe gestures
- Smooth animations
- Full accessibility (ARIA labels, keyboard navigation)
- Auto-closes on navigation
- Responsive

### 3. Base Theme Variables

All theme variables are defined in `base-theme.css`:

\`\`\`css
:root {
  /* Color System */
  --ideai-background: 0 0% 100%;
  --ideai-foreground: 222.2 84% 4.9%;
  --ideai-primary: 222.2 47.4% 11.2%;
  /* ... more colors ... */
  
  /* Spacing */
  --ideai-spacing-xs: 0.25rem;
  --ideai-spacing-sm: 0.5rem;
  /* ... more spacing ... */
  
  /* Typography */
  --ideai-font-sans: ui-sans-serif, system-ui, ...;
  --ideai-font-mono: ui-monospace, SFMono-Regular, ...;
  
  /* Animation */
  --ideai-duration-fast: 150ms;
  --ideai-duration-normal: 200ms;
  --ideai-duration-slow: 300ms;
}
\`\`\`

### 4. Next.js 16 Best Practices

**File**: `packages/ui/src/lib/nextjs-best-practices.ts`

Includes:
- Security headers (CSP, XSS protection, etc.)
- Performance optimizations
- SEO metadata helpers
- Resource hints

\`\`\`tsx
import { getSecurityHeaders, getSEOMetadata } from "@repo/ui/lib/nextjs-best-practices";

export const headers = getSecurityHeaders();
export const metadata = getSEOMetadata({ ... });
\`\`\`

## Usage

### Setting Up Theme in App

1. **Wrap app with ThemeProvider** (in `layout.tsx`):

\`\`\`tsx
import { ThemeProvider } from "@repo/ui/components/theme-provider";

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
\`\`\`

2. **Import styles** (in `globals.css`):

\`\`\`css
@import "../../../packages/ui/src/styles/globals.css";
@import "../../../packages/ui/src/styles/ideai.css";
\`\`\`

3. **Use components**:

\`\`\`tsx
import { ThemeToggle, MobileNav } from "@repo/ui";
\`\`\`

## Dependencies

All dependencies are **local packages** (offline-capable):

- `next-themes` - Dark mode provider
- `@radix-ui/react-dialog` - Mobile navigation
- `lucide-react` - Icons (Sun, Moon, Menu, X)
- `tailwindcss` - CSS framework
- `shadcn/ui` - Component library

## Tailwind Configuration

The theme uses Tailwind's `class` strategy for dark mode:

\`\`\`ts
// tailwind.config.ts
export default {
  darkMode: ["class"],
  // ...
};
\`\`\`

This allows `next-themes` to toggle the `dark` class on the `<html>` element.

## Component Integration

### Header Integration

The header automatically includes:
- Theme toggle (top-right)
- Mobile navigation (mobile only)
- Desktop navigation (desktop only)

\`\`\`tsx
import { IdeaIHeader } from "@repo/ui";

<IdeaIHeader
  siteName="IdeaI"
  mainNav={[...]}
  extraNav={[...]}
  accountLinks={[...]}
/>
\`\`\`

## Best Practices

1. **Always use `suppressHydrationWarning`** on `<html>` when using ThemeProvider
2. **Use semantic CSS classes** from `ideai-components.css` for consistency
3. **Import base-theme.css** via `ideai.css` (don't import directly)
4. **Test dark mode** in all components
5. **Ensure mobile nav** works on touch devices

## Future Enhancements

- [ ] Add more theme variants (e.g., high contrast)
- [ ] Add theme persistence (localStorage)
- [ ] Add theme customization API
- [ ] Add animation preferences (reduce motion)
- [ ] Add color scheme customization
