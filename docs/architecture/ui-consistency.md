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

**CRITICAL**: All colors use **explicit RGB values** to prevent dark mode auto-application and ensure perfect consistency.

#### Explicit Color Approach

All shared component styles use explicit `rgb()` color values instead of relying on Tailwind's `dark:` classes. This ensures:
- Identical rendering regardless of browser dark mode settings
- No unexpected color changes from `prefers-color-scheme` media queries
- Perfect consistency across all apps

**Color Values Used**:
- **Text (light)**: `rgb(15 23 42)` - slate-900
- **Text (dark)**: `rgb(248 250 252)` - slate-50
- **Background (light)**: `rgb(255 255 255)` - white
- **Background (dark)**: `rgb(2 6 23)` - slate-950
- **Borders (light)**: `rgb(203 213 225)` - slate-300
- **Borders (dark)**: `rgb(51 65 85)` - slate-700
- **Hover (light)**: `rgb(241 245 249)` - slate-100
- **Hover (dark)**: `rgb(30 41 59)` - slate-800

**Example from `ideai-components.css`**:
```css
.ideai-header__title {
  color: rgb(15 23 42); /* slate-900 - explicit */
}

.ideai-footer__button:hover {
  background-color: rgb(241 245 249); /* slate-100 - explicit */
  border-color: transparent;
}
```

**Why Explicit Colors?**
- Prevents browser dark mode from auto-applying colors
- Ensures identical rendering across all apps
- No dependency on `prefers-color-scheme` media queries
- Consistent text colors regardless of system settings

**In CSS Modules**: Apps can still use Tailwind classes, but shared component CSS uses explicit RGB values.

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
- [ ] **Explicit colors** - Shared components use explicit RGB values
- [ ] **No duplicate CSS** - No custom styles in app CSS modules
- [ ] **Both layers imported** - `globals.css` and `ideai.css` imported in all apps
- [ ] **DOM inspection** - Checked rendered HTML/CSS in browser
- [ ] **Visual testing** - Screenshots taken, compared side-by-side
- [ ] **Tested in all apps** - Verified in `/web`, `/docs`, and `/all` (3000, 3001, 3002)
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
- Use **explicit RGB color values** in CSS (not `dark:` classes)
- Have **identical** styling across all apps
- Have **identical** hover and focus states
- Use standard Tailwind classes in JSX where appropriate
- Be tested in all three apps (`/web`, `/docs`, `/all`)

### Current Shared Components:
- `IdeaIHeader` - Header with site name support (`siteName` prop)
- `IdeAIFooter` - Footer with consistent styling
- `IdeAIButton` - Button component with consistent styling
- `IdeAIContent` - Documentation index content
- `IdeAILogo` - Logo component with SEO metadata
- `IdeAIHTMLTest` - Comprehensive HTML5 test page component

## Dark Mode Consistency

**Note**: Current implementation uses explicit RGB colors to prevent dark mode auto-application. This ensures consistent rendering regardless of system dark mode settings.

If dark mode is needed in the future:
- Dark mode must be **identical** across all apps
- Same color palette (slate-950, slate-50, slate-800, etc.)
- Same hover states
- Same transitions
- Same opacity values
- Use explicit RGB values (not `dark:` classes) for consistency

## Responsive Design Consistency

All responsive breakpoints must be **identical**:
- Mobile: `@media (max-width: 600px)`
- Hover: `@media (hover: hover) and (pointer: fine)`
- Dark mode: `@media (prefers-color-scheme: dark)`

## Testing UI Consistency

### DOM Inspection Workflow (MANDATORY)

**CRITICAL**: Always check the rendered DOM, not just source code. Many issues are only visible in the rendered HTML.

#### Before Making Changes

1. **Navigate to all apps in browser**:
   - `http://localhost:3000` (web)
   - `http://localhost:3001` (docs)
   - `http://localhost:3002` (all)

2. **Take full-page screenshots**:
   - Compare side-by-side visually
   - Use browser DevTools to inspect elements

3. **Capture DOM snapshots**:
   - Inspect HTML structure
   - Check computed CSS values
   - Verify classes match

#### During Debugging

1. **Extract and compare HTML**:
   ```bash
   # Get all classes from each app
   curl -s http://localhost:3000 | grep -o 'class="[^"]*"' | sort | uniq > /tmp/web-classes.txt
   curl -s http://localhost:3001 | grep -o 'class="[^"]*"' | sort | uniq > /tmp/docs-classes.txt
   curl -s http://localhost:3002 | grep -o 'class="[^"]*"' | sort | uniq > /tmp/all-classes.txt
   
   # Compare differences
   comm -23 /tmp/web-classes.txt /tmp/docs-classes.txt  # Classes in web but not docs
   comm -13 /tmp/web-classes.txt /tmp/docs-classes.txt  # Classes in docs but not web
   ```

2. **Check rendered CSS**:
   ```bash
   # Inspect specific elements
   curl -s http://localhost:3000 | grep -A 50 'class="ideai-footer'
   curl -s http://localhost:3001 | grep -A 50 'class="ideai-footer'
   ```

3. **Compare CSS files loaded**:
   ```bash
   curl -s http://localhost:3000 | grep -o 'href="[^"]*\.css[^"]*"'
   curl -s http://localhost:3001 | grep -o 'href="[^"]*\.css[^"]*"'
   ```

#### After Making Changes

- **ALWAYS** take new screenshots to verify visual consistency
- **ALWAYS** check the DOM again to ensure classes match
- **ALWAYS** verify rendered CSS is identical
- Compare before/after screenshots

### Visual Comparison Checklist

1. Open all three apps side-by-side (3000, 3001, 3002)
2. Compare:
   - [ ] Text colors (must be identical)
   - [ ] Background colors (must be identical)
   - [ ] Button hover states (must be identical)
   - [ ] Spacing/padding (must be identical)
   - [ ] Typography (font sizes, weights, line heights)
   - [ ] Borders (colors, widths, radius)
   - [ ] Transitions (duration, easing)
   - [ ] Footer rendering (identical HTML structure)
   - [ ] Header rendering (identical HTML structure)

### Using the `/all` App for Testing

The `/all` app (`apps/all`) serves as a comprehensive UI test page:
- Contains all HTML5 elements (forms, tables, lists, media)
- Includes documentation index (same as `/docs`)
- Perfect for side-by-side visual comparison
- Use to verify all elements render identically

### Automated Checks

- Use browser DevTools to inspect computed styles
- Compare CSS values side-by-side
- Verify Tailwind classes are identical
- Check that explicit RGB values match
- Verify no unexpected inherited styles

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

