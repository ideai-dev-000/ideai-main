---
title: CSS Showcase and Best Practices
description: Comparison of different CSS approaches in IdeaI monorepo
---

# CSS Showcase and Best Practices

This document describes the CSS showcase apps and best practice configurations for different CSS approaches in the IdeaI monorepo.

## CSS Showcase Apps

Four dedicated apps demonstrate different CSS approaches:

### 1. `/nocss` - No CSS (Port 3003)
- **Purpose**: Pure HTML browser defaults
- **Use Case**: Baseline comparison, understanding browser defaults
- **Styling**: None - just browser default rendering
- **URL**: http://localhost:3003

### 2. `/mvp` - MVP.css Only (Port 3004)
- **Purpose**: Semantic HTML styling without class names
- **Use Case**: Rapid prototyping, MVPs, semantic HTML projects
- **Styling**: MVP.css v1.17.2 (~10KB)
- **URL**: http://localhost:3004
- **Features**:
  - Styles semantic HTML elements automatically
  - No class names required
  - Mobile-friendly out of the box
  - CSS variables for customization

### 3. `/tailwind` - Tailwind CSS Only (Port 3005)
- **Purpose**: Utility-first CSS framework
- **Use Case**: Component-based development, utility classes
- **Styling**: Tailwind CSS base, components, utilities
- **URL**: http://localhost:3005
- **Features**:
  - Utility-first approach
  - Extensive utility classes
  - Responsive design utilities
  - Customizable via config

### 4. `/allcss` - Tailwind CSS Only (Port 3006)
- **Purpose**: Tailwind CSS showcase (previously combined MVP + Tailwind)
- **Use Case**: Production apps with utility-first styling
- **Styling**: Tailwind CSS + IdeaI custom layer (NO MVP.css - frameworks are exclusive)
- **URL**: http://localhost:3006
- **Features**:
  - Tailwind for utility classes
  - IdeaI custom layer for brand-specific styles
  - Complete styling solution
  - **Note**: This app was renamed from "allcss" but now uses Tailwind exclusively

## Best Practice Configurations

### No CSS Configuration

**File**: `apps/nocss/app/globals.css`

```css
/**
 * No CSS - Pure HTML defaults only
 * This app has NO CSS styling - just browser defaults.
 */

/* No CSS imports - pure HTML defaults */
```

**When to Use**:
- Understanding browser defaults
- Baseline comparison
- Testing semantic HTML structure

### MVP.css Only Configuration

**File**: `apps/mvp/app/globals.css`

```css
/**
 * MVP.css only - Semantic HTML styling
 * This app uses MVP.css for clean, minimal styling of semantic HTML.
 * No Tailwind, no custom CSS - just MVP.css.
 */

/* MVP.css - Minimalist stylesheet for semantic HTML (~10KB) */
@import "../../../packages/ui/src/styles/mvp.css";
```

**When to Use**:
- Rapid prototyping
- MVPs and early-stage projects
- Semantic HTML-focused development
- When you want styling without learning a framework

**Dependencies**: None (MVP.css is a local file)

### Tailwind CSS Only Configuration

**File**: `apps/tailwind/app/globals.css`

```css
/**
 * Tailwind CSS only - Utility-first styling
 * This app uses Tailwind CSS for utility-first styling.
 * No MVP.css, no custom CSS - just Tailwind.
 */

@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  /* Base styles */
}
```

**When to Use**:
- Component-based development
- When you need extensive utility classes
- Projects requiring fine-grained control
- When MVP.css styling conflicts with design needs

**Dependencies**:
- `tailwindcss`
- `autoprefixer`
- `postcss`

**Required Files**:
- `tailwind.config.ts` - Tailwind configuration
- `postcss.config.js` - PostCSS configuration

### Framework Exclusivity

**IMPORTANT**: CSS frameworks are **mutually exclusive**. You must choose ONE:
- ✅ **MVP.css** OR **Tailwind CSS** (never both)
- ✅ All frameworks include **normalize.css** as the base layer
- ✅ IdeaI CSS (`ideai.css`) is framework-agnostic and works with any framework

**File**: `apps/allcss/app/globals.css` (now uses Tailwind only)

```css
/**
 * Tailwind CSS only - Complete styling
 * This app uses Tailwind CSS exclusively.
 * NO MVP.css - frameworks are mutually exclusive.
 */

/* Normalize/Reset - Base styles */
@import "../../../packages/ui/src/styles/normalize.css";

/* Tailwind CSS base, components, utilities (EXCLUSIVE - no MVP.css) */
@import "../../../packages/ui/src/styles/globals.css";

/* IdeaI custom layer */
@import "../../../packages/ui/src/styles/ideai.css";
```

**When to Use**:
- Production applications
- When you want both semantic HTML styling and utility classes
- Full-featured styling solution
- Recommended for most IdeaI apps

**Dependencies**:
- `tailwindcss`
- `autoprefixer`
- `postcss`
- MVP.css (local file)

## Hot Reload

All apps support **hot reload** automatically via Next.js dev servers:

- **CSS Changes**: Hot reloaded instantly
- **Component Changes**: Fast Refresh (React Fast Refresh)
- **No Page Reload**: Changes appear without full page refresh
- **Works in All Apps**: All showcase apps support hot reload

### Testing Hot Reload

1. Start dev server: `pnpm --filter @repo/nocss dev`
2. Make a CSS change in `globals.css`
3. Save the file
4. Changes appear instantly in browser (no page reload)

## Running All Apps

### Start All Showcase Apps

```bash
# Start all CSS showcase apps
pnpm --filter @repo/nocss dev    # Port 3003
pnpm --filter @repo/mvp dev      # Port 3004
pnpm --filter @repo/tailwind dev # Port 3005
pnpm --filter @repo/allcss dev   # Port 3006
```

### Access URLs

- **No CSS**: http://localhost:3003
- **MVP.css Only**: http://localhost:3004
- **Tailwind Only**: http://localhost:3005
- **MVP.css + Tailwind**: http://localhost:3006

## Comparison Matrix

| Feature | No CSS | MVP.css | Tailwind | MVP + Tailwind |
|---------|--------|---------|----------|----------------|
| Semantic HTML styling | ❌ | ✅ | ❌ | ✅ |
| Utility classes | ❌ | ❌ | ✅ | ✅ |
| Class names required | ❌ | ❌ | ✅ | ✅ |
| File size | 0KB | ~10KB | ~50KB+ | ~60KB+ |
| Learning curve | None | Low | Medium | Medium |
| Customization | None | CSS variables | Config file | Both |
| Mobile-friendly | ❌ | ✅ | ✅ | ✅ |
| Production ready | ❌ | ✅ | ✅ | ✅ |

## Recommendations

### For New Projects

**Choose ONE framework** (frameworks are mutually exclusive):
- **MVP.css** (`/mvp` approach): Semantic HTML styling, no classes needed
- **Tailwind CSS** (`/tailwind` or `/allcss` approach): Utility-first, full control
- Both include normalize.css as base layer
- Production-ready with either approach

### For Rapid Prototyping

**Use MVP.css only** (`/mvp` approach):
- Fastest to get started
- No class names needed
- Clean, minimal styling
- Perfect for MVPs

### For Component Libraries

**Use Tailwind only** (`/tailwind` approach):
- Full control with utilities
- Component-based development
- Extensive customization options

## File Structure

```
apps/
├── nocss/          # No CSS - browser defaults
│   └── app/
│       └── globals.css  # Empty/minimal
├── mvp/            # MVP.css only
│   └── app/
│       └── globals.css  # MVP.css import
├── tailwind/       # Tailwind only
│   ├── app/
│   │   └── globals.css  # Tailwind directives
│   ├── tailwind.config.ts
│   └── postcss.config.js
└── allcss/         # Tailwind CSS only (previously MVP + Tailwind)
    ├── app/
    │   └── globals.css  # Tailwind only (normalize + Tailwind)
    ├── tailwind.config.ts
    └── postcss.config.js
```

## Related Documentation

- [Design System Architecture](./design-system.md)
- [UI Consistency Standards](./ui-consistency.md)
- [MVP.css Documentation](https://andybrewer.github.io/mvp/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

