# IdeaI Control Menu

A flexible, dynamic control menu component for IdeaI that supports multiple positioning, collapsible sections, step-based progression, and touch/swipe gestures.

## Features

- **Multiple Positioning**: Top, bottom, left, right, or floating
- **Trigger Modes**: Always open, button trigger, or hover-to-reveal
- **Collapsible Sections**: Open/close sections with step-based progression
- **Auto-Scroll**: Automatically scrolls when content overflows
- **Touch Support**: Full touch and swipe gesture support for mobile
- **Dynamic Modules**: Register service control UIs dynamically
- **Responsive**: Adapts to mobile and desktop screens

## Basic Usage

```tsx
import { IdeAIControlMenu, IdeAIControlSection } from "@repo/ui";

function MyApp() {
  return (
    <IdeAIControlMenu position="right" trigger="button">
      <IdeAIControlSection title="Settings" defaultOpen>
        <YourSettingsControls />
      </IdeAIControlSection>
      <IdeAIControlSection title="Advanced">
        <YourAdvancedControls />
      </IdeAIControlSection>
    </IdeAIControlMenu>
  );
}
```

## Positioning

The menu can be positioned on any screen edge or float:

```tsx
// Top edge
<IdeAIControlMenu position="top" />

// Bottom edge
<IdeAIControlMenu position="bottom" />

// Left edge
<IdeAIControlMenu position="left" />

// Right edge (default)
<IdeAIControlMenu position="right" />

// Floating (requires floatingPosition prop)
<IdeAIControlMenu
  position="floating"
  floatingPosition={{ top: 100, right: 20 }}
/>
```

## Trigger Modes

### Always Open

Menu is always visible:

```tsx
<IdeAIControlMenu trigger="always" />
```

### Button Trigger

Menu opens/closes via button:

```tsx
<IdeAIControlMenu trigger="button" buttonLabel="Open Controls" />
```

### Hover to Reveal

Menu appears on hover:

```tsx
<IdeAIControlMenu trigger="hover" />
```

## Sections

Sections can be open/closed independently:

```tsx
<IdeAIControlMenu>
  <IdeAIControlSection title="Step 1" defaultOpen>
    <Step1Controls />
  </IdeAIControlSection>

  <IdeAIControlSection title="Step 2">
    <Step2Controls />
  </IdeAIControlSection>
</IdeAIControlMenu>
```

## Step-Based Progression

Sections can auto-close when completed and open the next:

```tsx
<IdeAIControlSection
  title="Step 1"
  isCompleted={step1Done}
  autoOpenNext
>
  <Step1Controls onComplete={() => setStep1Done(true)} />
</IdeAIControlSection>

<IdeAIControlSection
  title="Step 2"
  defaultOpen={step1Done}
>
  <Step2Controls />
</IdeAIControlSection>
```

## Dynamic Module Registration

Register service control UIs dynamically:

```tsx
// In your service module
import { IdeAIControlMenu } from "@repo/ui";

export function registerServiceControls(menu: IdeAIControlMenu) {
  menu.addSection({
    id: "my-service",
    title: "My Service",
    component: <MyServiceControls />,
  });
}
```

## Touch and Swipe Support

The menu automatically supports touch gestures:

- **Right menu**: Swipe left to close
- **Left menu**: Swipe right to close
- **Top menu**: Swipe down to close
- **Bottom menu**: Swipe up to close

## Customization

### Size

Control menu dimensions:

```tsx
<IdeAIControlMenu size={400} /> // Width for left/right, height for top/bottom
```

### Controlled State

Control open state externally:

```tsx
const [isOpen, setIsOpen] = useState(false);

<IdeAIControlMenu open={isOpen} onOpenChange={setIsOpen} />;
```

## API Reference

### IdeAIControlMenu Props

| Prop               | Type                                                   | Default      | Description                     |
| ------------------ | ------------------------------------------------------ | ------------ | ------------------------------- |
| `position`         | `"top" \| "bottom" \| "left" \| "right" \| "floating"` | `"right"`    | Menu position                   |
| `trigger`          | `"always" \| "button" \| "hover"`                      | `"button"`   | How menu is shown               |
| `size`             | `number`                                               | `320`        | Width/height in pixels          |
| `open`             | `boolean`                                              | -            | Controlled open state           |
| `onOpenChange`     | `(open: boolean) => void`                              | -            | Open state change handler       |
| `buttonLabel`      | `string`                                               | `"Controls"` | Button label for button trigger |
| `floatingPosition` | `{ top?, right?, bottom?, left? }`                     | -            | Position for floating mode      |

### IdeAIControlSection Props

| Prop           | Type      | Default      | Description                           |
| -------------- | --------- | ------------ | ------------------------------------- |
| `id`           | `string`  | **required** | Unique section ID                     |
| `title`        | `string`  | **required** | Section title                         |
| `defaultOpen`  | `boolean` | `false`      | Open by default                       |
| `isCompleted`  | `boolean` | `false`      | Show completed indicator              |
| `autoOpenNext` | `boolean` | `false`      | Auto-open next section when completed |

## Examples

### Service Control Panel

```tsx
<IdeAIControlMenu position="right" trigger="button">
  <IdeAIControlSection title="Database" defaultOpen>
    <DatabaseControls />
  </IdeAIControlSection>
  <IdeAIControlSection title="API Keys">
    <APIKeyControls />
  </IdeAIControlSection>
  <IdeAIControlSection title="Integrations">
    <IntegrationControls />
  </IdeAIControlSection>
</IdeAIControlMenu>
```

### Wizard/Step Flow

```tsx
<IdeAIControlMenu position="right" trigger="always">
  <IdeAIControlSection
    id="step1"
    title="Connect Database"
    defaultOpen
    isCompleted={hasDatabase}
    autoOpenNext
  >
    <DatabaseConnectionForm />
  </IdeAIControlSection>

  <IdeAIControlSection
    id="step2"
    title="Configure API"
    defaultOpen={hasDatabase}
    isCompleted={hasAPI}
    autoOpenNext
  >
    <APIConfigForm />
  </IdeAIControlSection>

  <IdeAIControlSection id="step3" title="Deploy" defaultOpen={hasAPI}>
    <DeployControls />
  </IdeAIControlSection>
</IdeAIControlMenu>
```

## Styling

The component uses Tailwind CSS classes and can be customized via:

- Custom className props
- CSS variables (coming soon)
- Tailwind config overrides

## Accessibility

- Full keyboard navigation support
- ARIA labels and roles
- Screen reader friendly
- Focus management

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)
- Touch devices with gesture support
