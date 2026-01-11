# Workflows/Vibes Toggle Menu

**Date**: 2026-01-15  
**Status**: ✅ Implemented

## Overview

The IdeaI side menu now supports toggling between **Workflows** and **Vibes** (vibe coded chats), allowing users to access both types of content from a unified left sidebar across all IdeaI apps.

## Features

1. **Toggle Between Modes**: Switch between "Workflows" and "Vibes" tabs at the top of the side menu
2. **Automatic Route Detection**: Menu automatically switches mode based on current route:
   - `/workflow/*` → Workflows mode
   - `/vibe/*` or `/chats/*` → Vibes mode
3. **Cross-App Support**: Works across all IdeaI apps that use `IdeAISideMenu`
4. **Unified Navigation**: Access both workflows and vibe coded components from the same menu

## Implementation

### Components

**New Components in `@repo/ui`**:

- `IdeAISideMenuVibes` - Vibes section component (similar to `IdeAISideMenuWorkflows`)
- `ContentModeToggle` - Toggle button component for switching modes
- `ContentMode` type - `"workflows" | "vibes"`

**Updated Components**:

- `IdeAISideMenu` - Now accepts `vibes`, `onLoadVibes`, `currentVibeId`, `onCreateVibe`, `contentMode`, and `onContentModeChange` props
- `IdeAISideMenuWrapper` (capabilities app) - Fetches and displays vibes

### API Integration

The wrapper component fetches vibes (chats) from the vibecoder API:

- **Endpoint**: `/api/chats` (from vibecoder app on port 3020)
- **Format**: Returns array of chat objects with `id`, `name`, `createdAt`, `privacy`
- **Mapping**: Converts chats to `VibeItem[]` format for display

### Routing

- **Workflows**: Routes to `/workflow/workflows/{workflowId}`
- **Vibes**: Routes to `/chats/{chatId}` or `/vibe/chats/{chatId}` depending on app context
- **New Vibe**: Navigates to vibecoder app (`http://localhost:3020/`)

## Usage

### In Apps with Workflows Only

```tsx
<IdeAISideMenu
  workflows={workflows}
  onLoadWorkflows={loadWorkflows}
  currentWorkflowId={currentWorkflowId}
  onCreateWorkflow={handleCreateWorkflow}
  // ... other workflow handlers
/>
```

### In Apps with Both Workflows and Vibes

```tsx
<IdeAISideMenu
  workflows={workflows}
  vibes={vibes}
  onLoadWorkflows={loadWorkflows}
  onLoadVibes={loadVibes}
  currentWorkflowId={currentWorkflowId}
  currentVibeId={currentVibeId}
  onCreateWorkflow={handleCreateWorkflow}
  onCreateVibe={handleCreateVibe}
  contentMode={contentMode}
  onContentModeChange={setContentMode}
  // ... other handlers
/>
```

### Auto-Detection Mode

The menu automatically detects the current mode from the route:

```tsx
// In wrapper component
useEffect(() => {
  if (pathname?.startsWith("/vibe") || pathname?.startsWith("/chats/")) {
    setContentMode("vibes");
  } else if (pathname?.startsWith("/workflow")) {
    setContentMode("workflows");
  }
}, [pathname]);
```

## Styling

New CSS classes added to `ideai-components.css`:

- `.ideai-side-menu-mode-toggle` - Container for toggle buttons
- `.ideai-side-menu-mode-button` - Individual toggle button
- `.ideai-side-menu-mode-button--active` - Active state
- `.ideai-side-menu-item-icon` - Icon in list items (for MessageSquare in vibes)

## Files Changed

1. **packages/ui/src/components/ideai-side-menu.tsx**
   - Added `IdeAISideMenuVibes` component
   - Added `ContentModeToggle` component
   - Added vibes support to `IdeAISideMenu`
   - Added `VibeItem` and `ContentMode` types

2. **packages/ui/src/styles/ideai-components.css**
   - Added toggle button styles
   - Added icon styles for vibe items

3. **packages/ui/src/index.ts**
   - Exported new types and components

4. **apps/ideai-capabilities/components/ideai-side-menu-wrapper.tsx**
   - Added vibes fetching logic
   - Added content mode state management
   - Integrated vibes into menu

## Future Enhancements

- [ ] Add vibes support to other IdeaI apps (docs, web, etc.)
- [ ] Add delete/clone actions for vibes (similar to workflows)
- [ ] Add search/filter for vibes list
- [ ] Cache vibes list to reduce API calls
- [ ] Add loading states for vibes fetching

## Related Files

- `packages/ui/src/components/ideai-side-menu.tsx` - Main menu component
- `apps/ideai-capabilities/components/ideai-side-menu-wrapper.tsx` - Capabilities wrapper
- `apps/ideai-vibecoder/components/shared/chat-selector.tsx` - Original chat selector
- `apps/ideai-vibecoder/app/api/chats/route.ts` - Chats API endpoint
