# IdeaI Menu System

A flexible, composable menu system for IdeaI applications with shared base patterns and specialized variants.

## Structure

```
ideai/
├── ideai-menu.tsx          # Base component with shared patterns
├── ideai-menu-main.tsx      # Main navigation menu variant
├── ideai-menu-controls.tsx  # Control menu variant
└── index.ts                 # Centralized exports
```

## Architecture

All menu components inherit from the base `ideai-menu` component, which provides:

- **Shared Patterns**: Positioning, triggers, sections, touch support
- **Common Logic**: State management, step-based progression, auto-scroll
- **Base Components**: `IdeAIMenuSection` for collapsible sections
- **Hooks**: `useIdeAIMenuBase` for shared functionality

## Components

### Base: `ideai-menu.tsx`

Foundation for all menu variants. Provides:

- `IdeAIMenuSection` - Collapsible section component
- `useIdeAIMenuBase` - Shared menu hook
- `getMenuPositionStyles` - Position helper
- `IdeAIMenuContext` - Section state management

### Variant: `ideai-menu-main.tsx`

Main navigation menu for primary app navigation.

**Features:**

- Logo/branding support
- Main menu styling
- Optimized for navigation

**Usage:**

```tsx
<IdeAIMenuMain position="left" trigger="always">
  <IdeAIMenuSection id="nav" title="Navigation" defaultOpen>
    <NavigationItems />
  </IdeAIMenuSection>
</IdeAIMenuMain>
```

### Variant: `ideai-menu-controls.tsx`

Control menu for service control UIs and dynamic modules.

**Features:**

- Auto-scroll for overflow
- Control-specific styling
- Dynamic module integration

**Usage:**

```tsx
<IdeAIMenuControls position="right" trigger="button">
  <IdeAIMenuSection id="settings" title="Settings" defaultOpen>
    <SettingsControls />
  </IdeAIMenuSection>
</IdeAIMenuControls>
```

## Shared Features

All menu variants support:

- **Positioning**: `top`, `bottom`, `left`, `right`, `floating`
- **Triggers**: `always`, `button`, `hover`
- **Sections**: Collapsible with step-based progression
- **Touch Support**: Swipe gestures for mobile
- **Auto-Scroll**: Handles overflow content
- **Responsive**: Adapts to mobile and desktop

## Inheritance Pattern

```
ideai-menu (base)
├── ideai-menu-main (inherits)
└── ideai-menu-controls (inherits)
```

Both variants:

1. Import base patterns from `ideai-menu.tsx`
2. Use `useIdeAIMenuBase` hook
3. Extend with variant-specific features
4. Share the same CSS classes (from `ideai-menu.css`)

## Styling

All menus use shared CSS from `ideai-menu.css`:

- Base styles: `.ideai-menu-content`, `.ideai-menu-header`, `.ideai-menu-body`
- Section styles: `.ideai-menu-section`, `.ideai-menu-section-header`
- Variant classes: `.ideai-menu-main`, `.ideai-menu-controls`

## Adding New Variants

To create a new menu variant:

1. Import base patterns:

```tsx
import {
  IdeAIMenuBaseProps,
  useIdeAIMenuBase,
  getMenuPositionStyles,
  IdeAIMenuContext,
} from "./ideai-menu";
```

2. Create variant component:

```tsx
export function IdeAIMenuCustom(props: IdeAIMenuCustomProps) {
  const menuRef = React.useRef<HTMLDivElement>(null);
  const { contextValue, ... } = useIdeAIMenuBase({ ... });

  return (
    <div className="ideai-menu-content ideai-menu-custom">
      {/* Variant-specific content */}
    </div>
  );
}
```

3. Export from `index.ts`

## Semantic Naming

The folder structure makes relationships clear:

- `ideai-menu.tsx` - Base (shared patterns)
- `ideai-menu-main.tsx` - Main variant (inherits from base)
- `ideai-menu-controls.tsx` - Controls variant (inherits from base)

All components follow the `ideai-menu-*` naming pattern, making it clear they're part of the same system.

## Migration

If migrating from old `IdeAIControlMenu`:

```tsx
// Old
<IdeAIControlMenu>
  <IdeAIControlSection>...</IdeAIControlSection>
</IdeAIControlMenu>

// New
<IdeAIMenuControls>
  <IdeAIMenuSection>...</IdeAIMenuSection>
</IdeAIMenuControls>
```

The API is nearly identical, just updated naming for clarity.
