# Mode System

This system allows the React Flow UI to work with different node types and behaviors based on the `APP_MODE` environment variable.

## How It Works

- **Default/Parent Mode**: `workflow` (current behavior - no changes if APP_MODE not set)
- **Child Modes**: Can define custom node types, templates, and behaviors
- **Configuration**: Via `APP_MODE` or `NEXT_PUBLIC_APP_MODE` env variable

## Structure

```
lib/modes/
  config.ts              # Mode detection and utilities
  index.ts               # Main entry point - exports node types/templates
  workflow/
    nodes.ts             # Workflow mode nodes (parent/default)
  architecture/
    nodes.tsx            # Architecture mode nodes (example child mode)
```

## Usage

### Setting Mode

In `.env.local`:
```env
# Server-side
APP_MODE=workflow  # or "architecture"

# Client-side (required for React components)
NEXT_PUBLIC_APP_MODE=workflow  # or "architecture"
```

### Creating a New Mode

1. Create folder: `lib/modes/your-mode/`
2. Create `nodes.tsx` with:
   - `yourModeNodeTypes` - Object mapping node type names to React components
   - `yourModeNodeTemplates` - Array of node templates for the context menu

3. Update `lib/modes/index.ts` to include your mode

4. Update `lib/modes/config.ts` to add your mode to the `AppMode` type

## Example: Architecture Mode

The architecture mode demonstrates:
- 5 different shape nodes (rectangle, circle, diamond, square, hexagon)
- Custom node components
- Mode-specific node templates

This can be extended to support full diagramming with 10+ shapes, custom code generation, etc.

## Notes

- **No breaking changes**: If `APP_MODE` is not set, defaults to `workflow` mode
- **Same app structure**: Toolbar, canvas, execution engine all stay the same
- **Only nodes change**: Mode only affects node types and templates
- **Shared features**: Play, code generation, etc. work for all modes

