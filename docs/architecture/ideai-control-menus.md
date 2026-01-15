# IdeaI Control Menus Architecture

## Overview

IdeaI uses a dual control menu system to provide contextual controls for IdeaI modules/services:

1. **Primary Control Menu** (`ideai-control-primary`)
   - Main IdeaI-level controls for modules/services
   - Appears on left side for workflow/vibe routes
   - Contains module-specific controls (workflows list, vibe chats, etc.)

2. **Secondary Control Menu** (`ideai-control-secondary`)
   - Additional contextual controls (e.g., actions list in workflow app)
   - Can appear on right side or other positions
   - Contains feature-specific controls (actions, tools, etc.)

## CSS Classes

Both menus use the following class structure:

```css
/* Target both menus */
.ideai-control {
  /* Shared styles for all IdeaI control menus */
}

/* Primary control menu */
.ideai-control-primary {
  /* Primary menu specific styles */
}

/* Secondary control menu */
.ideai-control-secondary {
  /* Secondary menu specific styles */
}
```

## Current Implementation

### Primary Control Menu

**Location**: `apps/ai-combo/components/ideai-side-menu-wrapper.tsx`

**Current Usage**:

- **Workflow routes** (`/workflow*`): Shows workflow controls
  - Status card
  - New workflow button
  - Workflows list
- **Vibe routes** (`/vibe*`): Shows vibe controls
  - New chat input (home only)
  - Vibe chats list
  - Chat UI panel (detail pages)

**CSS Classes**: `ideai-control ideai-control-primary`

**Position**: Left side (280px width)

**Auto-open/close**: Yes, based on route

### Secondary Control Menu

**Location**: Currently in workflow app (to be ported)

**Current Usage**:

- **Workflow routes**: Shows actions list (ActionGrid component)
  - Actions search
  - Actions grid/list view
  - Action categories
  - Action selection

**CSS Classes**: `ideai-control ideai-control-secondary` (to be added)

**Position**: Right side (to be determined)

**Auto-open/close**: To be determined

## Future Plans

### Static Workflow Integration

The static workflow solution will be ported into the secondary control menu:

1. **Actions List** → Secondary menu
   - All workflow actions
   - Search and filter
   - Category grouping

2. **Static Workflow Controls** → Secondary menu
   - Pre-defined workflow templates
   - Static workflow execution
   - Workflow diagram controls

### Menu Positioning

- **Primary**: Left side (fixed)
- **Secondary**: Right side or configurable position
- Both can be toggled independently
- Both respect user's manual close actions

## Component Structure

```tsx
// Primary Control Menu
<IdeAIMenuControls
  className="ideai-control ideai-control-primary"
  position="left"
  // ... other props
>
  {/* Module-specific controls */}
</IdeAIMenuControls>

// Secondary Control Menu (future)
<IdeAIMenuControls
  className="ideai-control ideai-control-secondary"
  position="right"
  // ... other props
>
  {/* Feature-specific controls (actions, tools, etc.) */}
</IdeAIMenuControls>
```

## Use Cases

### Primary Control Menu

- Module navigation (workflows list, chats list)
- Module status (workflow status, chat status)
- Module actions (new workflow, new chat)
- Module settings (workflow settings, chat settings)

### Secondary Control Menu

- Feature tools (actions list, tools panel)
- Contextual controls (node actions, edge actions)
- Static workflow controls (template selection, execution)
- Advanced features (export, import, etc.)

## Migration Path

1. **Phase 1** (Current):
   - Primary menu implemented and working
   - Secondary menu identified (ActionGrid in workflow)

2. **Phase 2** (Next):
   - Add CSS classes to both menus
   - Port ActionGrid to secondary menu component
   - Add secondary menu state management

3. **Phase 3** (Future):
   - Port static workflow controls to secondary menu
   - Add configurable positioning
   - Add independent auto-open/close logic

## Notes

- Both menus use the same `IdeAIMenuControls` component
- Both menus respect the same settings system
- Both menus can be styled independently via CSS classes
- Both menus can be targeted together with `.ideai-control`
- Secondary menu will be ported from existing workflow components
