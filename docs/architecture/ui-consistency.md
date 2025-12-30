---
title: UI Consistency Standards
description: Strict UI consistency rules for the IdeaI monorepo to ensure identical appearance across all apps.
---

# UI Consistency Standards

**CRITICAL**: All IdeaI applications must have **identical** UI appearance, interactions, and styling. This document defines the strict standards for maintaining perfect UI consistency through centralized CSS.

## Core Principle

> **Every UI element, interaction, and style must be identical across all IdeaI apps. No exceptions.**
>
> **All styles come from centralized @repo/ui. NO custom CSS in apps.**

## Centralized CSS Architecture

### Two-Layer System

IdeaI uses a two-layer CSS architecture:

1. **Base Layer** (`packages/ui/src/styles/globals.css`):
   - Tailwind CSS base, components, utilities
   - Standard Tailwind colors and utilities
   - Base typography and layout

2. **IdeaI Layer** (`packages/ui/src/styles/ideai.css`):
   - Custom IdeaI-specific styles
   - Finesse and polish
   - Brand-specific components (buttons, typography, layouts)

### Import Pattern (MANDATORY)

Every app's `globals.css` MUST import both layers:

```css
/* apps/*/app/globals.css */
@import "../../../packages/ui/src/styles/globals.css";
@import "../../../packages/ui/src/styles/ideai.css";
```

**NO exceptions. NO custom CSS in app globals.css.**

## Using Centralized IdeaI Styles

### CSS Variables

All apps have access to IdeaI CSS variables from `ideai.css`:

- `--ideai-gray-rgb` - Gray RGB values (light/dark)
- `--ideai-gray-alpha-200` - Gray alpha for borders
- `--ideai-gray-alpha-100` - Gray alpha for backgrounds

### CSS Module Usage

CSS modules should use **standard Tailwind classes** directly. The centralized `ideai.css` provides CSS variables and ensures consistency.

```css
/* ✅ CORRECT - Use standard Tailwind + CSS variables */
.page {
  @apply grid items-center justify-items-center min-h-screen p-20 gap-16;
  grid-template-rows: 20px 1fr 20px;
  font-synthesis: none;
}

.main {
  @apply flex flex-col gap-8 items-center text-center max-w-[600px] w-full;
  grid-row-start: 2;
}

.main h1 {
  font-family: var(--font-geist-sans);
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 700;
  line-height: 1.1;
  letter-spacing: -0.02em;
  @apply m-0 text-slate-900 dark:text-slate-50;
}

.secondary {
  @apply border-slate-300 dark:border-slate-700;
  @apply bg-transparent text-slate-900 dark:text-slate-50;
  @apply transition-all duration-200;
  @apply min-w-[180px] rounded-[128px] h-12 px-5;
  border: 1px solid;
}

@media (hover: hover) and (pointer: fine) {
  .secondary:hover {
    @apply bg-slate-100 dark:bg-slate-800;
    border-color: transparent;
  }
}
```

```css
/* ❌ WRONG - NO custom colors or duplicate styles */
.secondary:hover {
  background: #f0f0f0; /* NO - use @apply bg-slate-100 */
}

.page {
  padding: 100px; /* NO - must match exactly: p-20 (80px) */
}
```

### App-Specific CSS

CSS modules should ONLY contain:
- App-specific layout adjustments (like `.docsContent`)
- App-specific component variations (documented and justified)
- NO shared styles (those go in `ideai.css`)

### Adding New IdeaI Styles

When adding new shared styles:

1. **Add CSS variables**: Add to `:root` in `ideai.css` for shared values
2. **Use Tailwind layers**: `@layer utilities` for reusable utility classes
3. **Document**: Add JSDoc comments explaining the variable/utility
4. **Update all apps**: Apps use the variables/utilities in their CSS modules
5. **Test**: Verify all apps automatically get the new styles

**Example - Adding CSS Variable**:
```css
/* In ideai.css */
:root {
  --ideai-spacing-xl: 80px;
}

/* In app CSS modules - all apps use same value */
.page {
  padding: var(--ideai-spacing-xl);
}
```

**Example - Adding Utility Class**:
```css
/* In ideai.css */
@layer utilities {
  .ideai-hover-card {
    @apply bg-slate-50 dark:bg-slate-900;
  }
}

/* In app CSS modules */
.card:hover {
  @apply ideai-hover-card;
}
```

**NEVER add shared styles to app CSS modules. Always centralize.**

### Color Standards

All colors must use **standard Tailwind colors only**:
- Backgrounds: `bg-white` / `bg-slate-950` (dark)
- Text: `text-slate-900` / `text-slate-50` (dark)
- Borders: `border-slate-300` / `border-slate-700` (dark)
- Hover: `bg-slate-100` / `bg-slate-800` (dark)

**NO custom colors** - only standard Tailwind palette.

### Typography

All typography must be identical:
- Font families: `var(--font-geist-sans)`, `var(--font-geist-mono)`
- Font sizes: Use `clamp()` for fluid typography
- Line heights: Identical across all apps
- Letter spacing: Identical across all apps

### Spacing and Layout

All spacing must be identical:
- Padding: `80px` (desktop), `32px` (mobile)
- Gaps: `64px` (page), `32px` (main content)
- Max widths: `600px` (main content)
- Border radius: `128px` (buttons)

## Verification Checklist

Before committing any UI changes:

- [ ] **Centralized CSS** - All shared styles in `ideai.css` (not app CSS)
- [ ] **No duplicate CSS** - No custom styles in app CSS modules
- [ ] **Using IdeaI classes** - Apps use `@apply ideai-*` classes
- [ ] **Both layers imported** - `globals.css` and `ideai.css` imported
- [ ] **Tested in all apps** - Verify styles work identically
- [ ] **Documented** - New IdeaI classes documented in `ideai.css`

## CSS Module Guidelines

When creating/updating CSS modules:

1. **Use centralized classes first**:
   ```css
   .page { @apply ideai-page; }
   .main { @apply ideai-main; }
   ```

2. **Only add app-specific styles**:
   ```css
   /* Only if truly app-specific */
   .docsContent {
     margin-top: 48px; /* Docs-specific layout */
   }
   ```

3. **Never duplicate centralized styles**:
   - ❌ Don't recreate button styles
   - ❌ Don't recreate typography
   - ❌ Don't recreate layouts
   - ✅ Use `@apply ideai-*` classes

4. **If you need new shared styles**:
   - Add to `packages/ui/src/styles/ideai.css`
   - All apps automatically get it
   - Document the new class

## Shared Components

All shared components in `@repo/ui` must:
- Use **only** standard Tailwind classes
- Have **identical** styling across all apps
- Support dark mode with **identical** dark mode colors
- Have **identical** hover and focus states

## Dark Mode Consistency

Dark mode must be **identical** across all apps:
- Same color palette (slate-950, slate-50, slate-800, etc.)
- Same hover states
- Same transitions
- Same opacity values

## Responsive Design Consistency

All responsive breakpoints must be **identical**:
- Mobile: `@media (max-width: 600px)`
- Hover: `@media (hover: hover) and (pointer: fine)`
- Dark mode: `@media (prefers-color-scheme: dark)`

## Testing UI Consistency

### Visual Comparison

1. Open both apps side-by-side
2. Compare:
   - Button hover colors
   - Text colors
   - Spacing
   - Typography
   - Borders
   - Transitions

### Automated Checks

- Use browser DevTools to inspect computed styles
- Compare CSS values side-by-side
- Verify Tailwind classes are identical

## Common Issues

### ❌ Different Hover Colors

**Wrong**:
```css
/* App 1 */
.secondary:hover { background: #f0f0f0; }

/* App 2 */
.secondary:hover { background: #e0e0e0; }
```

**Correct**:
```css
/* Both apps - IDENTICAL */
.secondary:hover {
  @apply bg-slate-100 dark:bg-slate-800;
}
```

### ❌ Different Transitions

**Wrong**:
```css
/* App 1 */
transition: background 0.2s;

/* App 2 */
transition: background 0.3s;
```

**Correct**:
```css
/* Both apps - IDENTICAL */
transition: background 0.2s, color 0.2s, border-color 0.2s;
```

### ❌ Different Spacing

**Wrong**:
```css
/* App 1 */
padding: 80px;

/* App 2 */
padding: 100px;
```

**Correct**:
```css
/* Both apps - IDENTICAL */
padding: 80px;
```

## Enforcement

This standard is enforced through:
1. **Code review** - All UI changes must be reviewed for consistency
2. **Visual testing** - Side-by-side comparison required
3. **Documentation** - All differences must be documented
4. **Cursor rules** - Automated checks via `.cursorrules`

## Related Documentation

- [Design System Architecture](./design-system.md)
- [Tailwind Configuration](../setup/tailwind.md)
- [Component Standards](../development/components.md)

