# IdeaI Control Menu

A flexible, dynamic control menu component for IdeaI applications.

## Overview

The IdeaI Control Menu is a highly flexible component designed for service control UIs, dynamic module integration, and step-based workflows. It supports multiple positioning options, collapsible sections, touch gestures, and auto-scrolling.

## Quick Start

```tsx
import { IdeAIControlMenu, IdeAIControlSection } from "@repo/ui";

export function MyApp() {
  return (
    <IdeAIControlMenu position="right" trigger="button">
      <IdeAIControlSection title="Settings" defaultOpen>
        <YourControls />
      </IdeAIControlSection>
    </IdeAIControlMenu>
  );
}
```

## Key Features

### 1. Flexible Positioning

- **Top/Bottom**: Horizontal menu bars
- **Left/Right**: Vertical sidebars
- **Floating**: Positioned anywhere on screen

### 2. Multiple Trigger Modes

- **Always Open**: Menu always visible
- **Button Trigger**: Toggle via button
- **Hover to Reveal**: Appears on hover

### 3. Collapsible Sections

- Independent open/close state
- Step-based progression support
- Auto-open next section on completion

### 4. Touch & Swipe Support

- Full touch gesture support
- Swipe to close on mobile
- Optimized for touch devices

### 5. Auto-Scroll

- Automatically scrolls when content overflows
- Smooth scrolling on touch devices
- Custom scrollbar styling

## Architecture

### Component Structure

```
IdeAIControlMenu (Container)
├── Trigger (Button/Hover/None)
└── MenuContent
    ├── Header
    └── Body (Scrollable)
        └── IdeAIControlSection (Multiple)
            ├── Header (Collapsible)
            └── Content
```

### Module Integration

Services can register their control UIs:

```tsx
// Service module
export function MyServiceControls() {
  return (
    <IdeAIControlSection title="My Service">
      <MyControls />
    </IdeAIControlSection>
  );
}

// App integration
<IdeAIControlMenu>
  <MyServiceControls />
  <AnotherServiceControls />
</IdeAIControlMenu>;
```

## Positioning Guide

### Right Sidebar (Default)

Best for: Settings, controls, side panels

```tsx
<IdeAIControlMenu position="right" size={320} />
```

### Left Sidebar

Best for: Navigation, primary controls

```tsx
<IdeAIControlMenu position="left" size={280} />
```

### Top Bar

Best for: Toolbars, global controls

```tsx
<IdeAIControlMenu position="top" size={200} />
```

### Bottom Bar

Best for: Mobile controls, action buttons

```tsx
<IdeAIControlMenu position="bottom" size={300} />
```

### Floating

Best for: Overlays, temporary controls

```tsx
<IdeAIControlMenu
  position="floating"
  floatingPosition={{ top: 100, right: 20 }}
  size={400}
/>
```

## Section Management

### Basic Sections

```tsx
<IdeAIControlSection title="Section 1" defaultOpen>
  <Content />
</IdeAIControlSection>
```

### Step-Based Flow

```tsx
<IdeAIControlSection
  id="step1"
  title="Step 1: Setup"
  defaultOpen
  isCompleted={step1Done}
  autoOpenNext
>
  <Step1Form onComplete={() => setStep1Done(true)} />
</IdeAIControlSection>

<IdeAIControlSection
  id="step2"
  title="Step 2: Configure"
  defaultOpen={step1Done}
>
  <Step2Form />
</IdeAIControlSection>
```

## Touch Gestures

The menu automatically handles touch gestures:

- **Swipe Left** (right menu): Close
- **Swipe Right** (left menu): Close
- **Swipe Down** (top menu): Close
- **Swipe Up** (bottom menu): Close

Gesture threshold: 50px minimum swipe distance

## Styling

### Custom Classes

```tsx
<IdeAIControlMenu className="my-custom-menu">
  <IdeAIControlSection className="my-section">
    <Content />
  </IdeAIControlSection>
</IdeAIControlMenu>
```

### CSS Variables (Future)

```css
.ideai-control-menu {
  --control-menu-bg: white;
  --control-menu-border: #e2e8f0;
  --control-menu-width: 320px;
}
```

## Performance

- Lazy rendering of sections
- Virtual scrolling for large lists (future)
- Optimized touch event handling
- Minimal re-renders

## Accessibility

- Full keyboard navigation
- ARIA labels and roles
- Screen reader support
- Focus trap when open

## Browser Support

- Chrome/Edge: ✅
- Firefox: ✅
- Safari: ✅
- Mobile Safari: ✅
- Chrome Mobile: ✅

## Migration from IdeAISideMenu

If you're currently using `IdeAISideMenu`, the Control Menu is a more flexible alternative:

```tsx
// Old
<IdeAISideMenu>
  <Content />
</IdeAISideMenu>

// New
<IdeAIControlMenu position="left" trigger="always">
  <IdeAIControlSection title="Menu" defaultOpen>
    <Content />
  </IdeAIControlSection>
</IdeAIControlMenu>
```

## Contributing

When adding new features:

1. Maintain flexibility as core principle
2. Support all positioning options
3. Ensure touch/mobile compatibility
4. Update documentation

## License

Part of IdeaI UI package.
