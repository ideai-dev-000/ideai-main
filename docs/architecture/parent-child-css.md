---
title: Parent-Child CSS Compatibility
description: Ensuring parent app has all CSS libraries that child apps need
---

# Parent-Child CSS Compatibility

**KEY PRINCIPLE**: Parent app must have all CSS libraries that its child apps use to ensure compatibility when serving child apps.

## Current CSS Architecture

### Framework Exclusivity Rule

**CRITICAL**: CSS frameworks are **mutually exclusive**. Each app uses **ONE framework only**:

- ✅ **MVP.css** OR **Tailwind CSS** (never both)
- ✅ All frameworks built on top of **normalize.css** for consistent base styles
- ✅ IdeaI CSS (`ideai.css`) is framework-agnostic and can be used with any framework

### Parent App (`web`)

Currently imports:

- ✅ Normalize.css (base styles)
- ✅ Tailwind CSS (via globals.css) - **EXCLUSIVE, no MVP.css**
- ✅ IdeaI CSS (via ideai.css)

### Child Apps CSS Requirements

| Child App   | CSS Framework     | Base           |
| ----------- | ----------------- | -------------- |
| `web`       | Tailwind CSS only | Normalize      |
| `docs`      | Tailwind CSS only | Normalize      |
| `all`       | Tailwind CSS only | Normalize      |
| `nocss`     | None (pure HTML)  | Normalize only |
| `mvp`       | MVP.css only      | Normalize      |
| `pico`      | Pico CSS only     | Normalize      |
| `tailwind`  | Tailwind CSS only | Normalize      |
| `allcss`    | Tailwind CSS only | Normalize      |
| `bootstrap` | Bootstrap only    | Normalize      |
| `unocss`    | UnoCSS only       | Normalize      |
| `shadcn`    | Tailwind CSS only | Normalize      |
| `radix`     | Tailwind CSS only | Normalize      |
| `material`  | Material UI only  | Normalize      |
| `chakra`    | Chakra UI only    | Normalize      |

## CSS Compatibility Strategy

### Option 1: Parent Includes All CSS (Recommended for Unified Build)

Parent app imports ALL CSS that any child might need:

\`\`\`css
/_ apps/web/app/globals.css _/
/_ MVP.css - for mvp, allcss, docs, all _/
@import "../../../packages/ui/src/styles/mvp.css";

/_ Tailwind CSS - for tailwind, allcss, docs, all, shadcn _/
@import "../../../packages/ui/src/styles/globals.css";

/_ IdeaI CSS - for all apps _/
@import "../../../packages/ui/src/styles/ideai.css";

/_ Bootstrap CSS - for bootstrap child _/
@import "bootstrap/dist/css/bootstrap.min.css";

/_ UnoCSS - for unocss child _/
/_ Note: UnoCSS is build-time, may need different approach _/
\`\`\`

**Pros**:

- ✅ All child apps work
- ✅ No CSS conflicts (if scoped properly)
- ✅ Unified build

**Cons**:

- ⚠️ Larger bundle size
- ⚠️ Potential CSS conflicts

### Option 2: Iframe Isolation (Current)

Each child app loads in iframe with its own CSS.

**Pros**:

- ✅ Complete CSS isolation
- ✅ No conflicts
- ✅ Smaller parent bundle

**Cons**:

- ⚠️ Not "one unified app"
- ⚠️ Iframe overhead

### Option 3: Dynamic CSS Loading

Parent detects which child is being viewed and loads only needed CSS.

**Pros**:

- ✅ Smaller bundle
- ✅ No conflicts
- ✅ Flexible

**Cons**:

- ⚠️ More complex
- ⚠️ Loading delays

## Recommended Approach

For "one unified app" goal, use **Option 1** with CSS scoping:

1. Parent imports all CSS libraries
2. Use CSS modules or scoped styles for isolation
3. Child apps use scoped CSS classes
4. Build everything together

## Implementation Checklist

- [ ] Audit all child app CSS requirements
- [ ] Add missing CSS to parent (Bootstrap, UnoCSS)
- [ ] Test CSS compatibility
- [ ] Ensure no conflicts
- [ ] Verify all child apps render correctly
- [ ] Test in production build

## Notes

- Iframe approach provides isolation but isn't "one app"
- Unified build requires careful CSS management
- CSS variables from ideai.css help with consistency
