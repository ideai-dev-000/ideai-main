# IdeaI Menu System

Extensible, unified menu component system with shadcn integration.

## Features

- **Multiple Display Modes**: Sidebar, Drawer, Navigation Menu, Popover
- **Position Support**: Top, Bottom, Left, Right, Floating
- **Trigger Modes**: Always visible, Button trigger, Hover trigger
- **Animation Modes**: Overlay (on top) or Push (moves content)
- **Touch Support**: Swipe to close on mobile
- **Section Management**: Collapsible sections with step-based progression
- **shadcn Integration**: Uses shadcn Sidebar, Drawer, NavigationMenu, Popover components

## Installation

```bash
pnpm add @repo/ui-ideai-menu
```

## Usage

### Basic Menu

```tsx
import { IdeAIMenu } from "@repo/ui-ideai-menu";

<IdeAIMenu position="left" trigger="always" size={280} title="Navigation">
  <IdeAIMenuSection id="nav" title="Navigation" defaultOpen>
    {/* Menu items */}
  </IdeAIMenuSection>
</IdeAIMenu>;
```

### Position-Based Component Selection

The menu automatically selects the appropriate shadcn component based on position:

- **Left/Right**: Uses `Sidebar` component
- **Bottom**: Uses `Drawer` component
- **Top**: Uses `NavigationMenu` component
- **Floating/Popover**: Uses `Popover` component

### Menu Modes

```tsx
// Sidebar mode (left/right)
<IdeAIMenu position="left" mode="sidebar" />

// Drawer mode (bottom)
<IdeAIMenu position="bottom" mode="drawer" />

// Navigation mode (top)
<IdeAIMenu position="top" mode="navigation" />

// Popover mode (any position)
<IdeAIMenu position="floating" mode="popover" />
```

## API

### IdeAIMenu Props

| Prop            | Type                                                           | Default     | Description                                   |
| --------------- | -------------------------------------------------------------- | ----------- | --------------------------------------------- |
| `position`      | `"top" \| "bottom" \| "left" \| "right" \| "floating"`         | `"right"`   | Menu position                                 |
| `trigger`       | `"always" \| "button" \| "hover"`                              | `"always"`  | How menu is triggered                         |
| `mode`          | `"auto" \| "sidebar" \| "drawer" \| "navigation" \| "popover"` | `"auto"`    | Display mode (auto selects based on position) |
| `size`          | `number`                                                       | `280`       | Menu width/height                             |
| `open`          | `boolean`                                                      | -           | Controlled open state                         |
| `onOpenChange`  | `(open: boolean) => void`                                      | -           | Open state change handler                     |
| `animationMode` | `"overlay" \| "push"`                                          | `"overlay"` | Animation mode                                |
| `swipeToClose`  | `boolean`                                                      | `true`      | Enable swipe to close on mobile               |

### IdeAIMenuSection Props

| Prop           | Type      | Default | Description                           |
| -------------- | --------- | ------- | ------------------------------------- |
| `id`           | `string`  | -       | Section ID (required)                 |
| `title`        | `string`  | -       | Section title                         |
| `defaultOpen`  | `boolean` | `false` | Open by default                       |
| `isCompleted`  | `boolean` | `false` | Mark as completed                     |
| `autoOpenNext` | `boolean` | `false` | Auto-open next section when completed |

## Architecture

The menu system is built on a composable architecture:

1. **Base Menu** (`ideai-menu-base.tsx`): Core functionality and shared patterns
2. **Mode Adapters**: Wrappers for shadcn components (Sidebar, Drawer, NavigationMenu, Popover)
3. **Unified Component** (`ideai-menu.tsx`): Main component that selects appropriate mode
4. **Section System**: Collapsible sections with context-based state management

## Extending

To add new menu modes or customize behavior:

1. Create a new mode adapter in `modes/`
2. Add it to the mode selection logic in `ideai-menu.tsx`
3. Export from `index.ts`

## License

MIT
