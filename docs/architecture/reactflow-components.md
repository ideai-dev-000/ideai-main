# React Flow Components Documentation

**Component Library**: `@repo/ui/components/reactflow`  
**Version**: 1.0.0  
**Last Updated**: 2026-01-05

## Overview

The IdeaI React Flow component library provides a complete set of reusable components for building interactive flow diagrams using React Flow. All components follow IdeaI design system standards and are fully integrated with the shared UI package.

### Features

- ✅ **Shared Components**: All React Flow components in `@repo/ui` for reuse across apps
- ✅ **IdeaI Design System**: Consistent styling with IdeaI theme tokens
- ✅ **Dark Mode Support**: Automatic dark mode styling
- ✅ **TypeScript**: Full type safety with exported types
- ✅ **Customizable**: Flexible props for customization
- ✅ **Production Ready**: Used in `ideai-reactflow` app

## Components

### `IdeaIReactFlowProvider`

React Flow context provider with IdeaI defaults.

**Location**: `packages/ui/src/components/reactflow/ideai-reactflow-provider.tsx`

**Props**:

```typescript
interface IdeaIReactFlowProviderProps {
  children: ReactNode;
}
```

**Usage**:

```tsx
import { IdeaIReactFlowProvider } from "@repo/ui";

function MyFlowDiagram() {
  return (
    <IdeaIReactFlowProvider>
      <ReactFlow nodes={nodes} edges={edges} />
    </IdeaIReactFlowProvider>
  );
}
```

**Features**:

- Wraps React Flow's `ReactFlowProvider`
- Imports React Flow CSS automatically
- Required for all React Flow components to work

**Example**:

```tsx
import { IdeaIReactFlowProvider } from "@repo/ui";
import ReactFlow, { Background, Controls } from "reactflow";

const nodes = [
  { id: "1", position: { x: 0, y: 0 }, data: { label: "Node 1" } },
];
const edges = [];

export function FlowDiagram() {
  return (
    <IdeaIReactFlowProvider>
      <ReactFlow nodes={nodes} edges={edges}>
        <Background />
        <Controls />
      </ReactFlow>
    </IdeaIReactFlowProvider>
  );
}
```

---

### `IdeaIReactFlowContainer`

Styled container component for React Flow diagrams with IdeaI design system.

**Location**: `packages/ui/src/components/reactflow/ideai-reactflow-container.tsx`

**Props**:

```typescript
interface IdeaIReactFlowContainerProps {
  children: ReactNode;
  className?: string;
  height?: string; // Default: "600px"
}
```

**Usage**:

```tsx
import { IdeaIReactFlowContainer } from "@repo/ui";

function MyFlowDiagram() {
  return (
    <IdeaIReactFlowContainer height="800px">
      <ReactFlow nodes={nodes} edges={edges} />
    </IdeaIReactFlowContainer>
  );
}
```

**Features**:

- Consistent borders and shadows
- Responsive sizing
- Dark mode support
- IdeaI design tokens
- Customizable height and className

**Styling**:

- Border: `border-slate-200` (light) / `border-slate-800` (dark)
- Background: `bg-white` (light) / `bg-slate-950` (dark)
- Shadow: `shadow-sm`
- Border radius: `rounded-lg`

**Example**:

```tsx
import { IdeaIReactFlowContainer } from "@repo/ui";
import ReactFlow from "reactflow";

export function FlowDiagram() {
  return (
    <IdeaIReactFlowContainer height="600px" className="my-4">
      <ReactFlow nodes={nodes} edges={edges} />
    </IdeaIReactFlowContainer>
  );
}
```

---

### `IdeaIReactFlowNode`

Custom React Flow node component with IdeaI design system styling.

**Location**: `packages/ui/src/components/reactflow/ideai-reactflow-node.tsx`

**Props**:

```typescript
interface IdeaIReactFlowNodeData {
  label: string;
  description?: string;
  icon?: React.ReactNode;
  variant?: "default" | "primary" | "success" | "warning" | "danger";
}
```

**Usage**:

```tsx
import { IdeaIReactFlowNode } from "@repo/ui";
import ReactFlow from "reactflow";

const nodeTypes = {
  ideai: IdeaIReactFlowNode,
};

const nodes = [
  {
    id: "1",
    type: "ideai",
    position: { x: 0, y: 0 },
    data: {
      label: "User Input",
      description: "Collects user data",
      icon: <Code className="h-4 w-4" />,
      variant: "primary",
    },
  },
];

export function FlowDiagram() {
  return <ReactFlow nodes={nodes} edges={[]} nodeTypes={nodeTypes} />;
}
```

**Features**:

- Multiple variants: `default`, `primary`, `success`, `warning`, `danger`
- Icon support
- Description text
- Selection highlighting
- Connection handles (top/bottom)
- Dark mode support

**Variants**:

| Variant   | Light Mode                              | Dark Mode                                |
| --------- | --------------------------------------- | ---------------------------------------- |
| `default` | White background, slate border          | Slate background                         |
| `primary` | Blue-50 background, blue-300 border     | Blue-950 background, blue-700 border     |
| `success` | Green-50 background, green-300 border   | Green-950 background, green-700 border   |
| `warning` | Yellow-50 background, yellow-300 border | Yellow-950 background, yellow-700 border |
| `danger`  | Red-50 background, red-300 border       | Red-950 background, red-700 border       |

**Example with All Variants**:

```tsx
import { IdeaIReactFlowNode } from "@repo/ui";
import ReactFlow from "reactflow";
import { Code, Zap, Database, Server } from "lucide-react";

const nodeTypes = {
  ideai: IdeaIReactFlowNode,
};

const nodes = [
  {
    id: "1",
    type: "ideai",
    position: { x: 0, y: 0 },
    data: {
      label: "Input",
      description: "User input",
      icon: <Code className="h-4 w-4" />,
      variant: "primary",
    },
  },
  {
    id: "2",
    type: "ideai",
    position: { x: 200, y: 0 },
    data: {
      label: "Process",
      description: "Data processing",
      icon: <Zap className="h-4 w-4" />,
      variant: "success",
    },
  },
  {
    id: "3",
    type: "ideai",
    position: { x: 400, y: 0 },
    data: {
      label: "Store",
      description: "Database storage",
      icon: <Database className="h-4 w-4" />,
      variant: "default",
    },
  },
  {
    id: "4",
    type: "ideai",
    position: { x: 600, y: 0 },
    data: {
      label: "Response",
      description: "API response",
      icon: <Server className="h-4 w-4" />,
      variant: "warning",
    },
  },
];

export function FlowDiagram() {
  return <ReactFlow nodes={nodes} edges={[]} nodeTypes={nodeTypes} />;
}
```

---

## Complete Example

Full example using all components together:

```tsx
"use client";

import { useCallback, useMemo } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
  type Node,
  type Edge,
  type Connection,
} from "reactflow";
import {
  IdeaIReactFlowProvider,
  IdeaIReactFlowContainer,
  IdeaIReactFlowNode,
} from "@repo/ui";
import { Code, Zap, Database, Server } from "lucide-react";

// Custom node types
const nodeTypes = {
  ideai: IdeaIReactFlowNode,
};

export function CompleteFlowExample() {
  // Initial nodes
  const initialNodes: Node[] = useMemo(
    () => [
      {
        id: "1",
        type: "ideai",
        position: { x: 250, y: 100 },
        data: {
          label: "User Input",
          description: "Collects user data",
          icon: <Code className="h-4 w-4" />,
          variant: "primary" as const,
        },
      },
      {
        id: "2",
        type: "ideai",
        position: { x: 100, y: 250 },
        data: {
          label: "Process Data",
          description: "Validates and transforms",
          icon: <Zap className="h-4 w-4" />,
          variant: "success" as const,
        },
      },
      {
        id: "3",
        type: "ideai",
        position: { x: 400, y: 250 },
        data: {
          label: "Store Data",
          description: "Saves to database",
          icon: <Database className="h-4 w-4" />,
          variant: "default" as const,
        },
      },
      {
        id: "4",
        type: "ideai",
        position: { x: 250, y: 400 },
        data: {
          label: "API Response",
          description: "Returns result",
          icon: <Server className="h-4 w-4" />,
          variant: "warning" as const,
        },
      },
    ],
    [],
  );

  const initialEdges: Edge[] = useMemo(
    () => [
      { id: "e1-2", source: "1", target: "2" },
      { id: "e1-3", source: "1", target: "3" },
      { id: "e2-4", source: "2", target: "4" },
      { id: "e3-4", source: "3", target: "4" },
    ],
    [],
  );

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: Connection) => {
      setEdges((eds) => addEdge(params, eds));
    },
    [setEdges],
  );

  return (
    <IdeaIReactFlowProvider>
      <IdeaIReactFlowContainer height="600px">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView
        >
          <Background />
          <Controls />
          <MiniMap />
        </ReactFlow>
      </IdeaIReactFlowContainer>
    </IdeaIReactFlowProvider>
  );
}
```

---

## Import Paths

All components can be imported from the main `@repo/ui` package:

```tsx
import {
  IdeaIReactFlowProvider,
  IdeaIReactFlowContainer,
  IdeaIReactFlowNode,
} from "@repo/ui";

// Types are also exported
import type {
  IdeaIReactFlowProviderProps,
  IdeaIReactFlowContainerProps,
  IdeaIReactFlowNodeData,
} from "@repo/ui";
```

**Alternative import path** (for future flexibility):

```tsx
import {
  IdeaIReactFlowProvider,
  IdeaIReactFlowContainer,
  IdeaIReactFlowNode,
} from "@repo/ui/components/reactflow";
```

---

## Integration Guide

### Step 1: Install Dependencies

React Flow components require `reactflow` and `zustand`:

```bash
pnpm add reactflow zustand
```

**Note**: These are already included in `@repo/ui` package dependencies.

### Step 2: Import Components

```tsx
import {
  IdeaIReactFlowProvider,
  IdeaIReactFlowContainer,
  IdeaIReactFlowNode,
} from "@repo/ui";
```

### Step 3: Set Up Node Types

```tsx
const nodeTypes = {
  ideai: IdeaIReactFlowNode,
};
```

### Step 4: Create Nodes with IdeaI Node Type

```tsx
const nodes = [
  {
    id: "1",
    type: "ideai", // Use "ideai" type
    position: { x: 0, y: 0 },
    data: {
      label: "My Node",
      variant: "primary",
    },
  },
];
```

### Step 5: Wrap with Provider and Container

```tsx
<IdeaIReactFlowProvider>
  <IdeaIReactFlowContainer>
    <ReactFlow nodes={nodes} edges={edges} nodeTypes={nodeTypes} />
  </IdeaIReactFlowContainer>
</IdeaIReactFlowProvider>
```

---

## Best Practices

### 1. Always Use the Provider

The `IdeaIReactFlowProvider` is required for React Flow to work correctly:

```tsx
// ✅ Good
<IdeaIReactFlowProvider>
  <ReactFlow ... />
</IdeaIReactFlowProvider>

// ❌ Bad - Missing provider
<ReactFlow ... />
```

### 2. Use Container for Consistent Styling

Wrap your React Flow instance in `IdeaIReactFlowContainer` for consistent styling:

```tsx
// ✅ Good
<IdeaIReactFlowContainer>
  <ReactFlow ... />
</IdeaIReactFlowContainer>

// ❌ Bad - Inconsistent styling
<div className="custom-container">
  <ReactFlow ... />
</div>
```

### 3. Use IdeaI Node Type

Use the `ideai` node type for consistent node styling:

```tsx
// ✅ Good
const nodeTypes = {
  ideai: IdeaIReactFlowNode,
};
const nodes = [
  { id: "1", type: "ideai", ... },
];

// ❌ Bad - Custom node without IdeaI styling
const nodes = [
  { id: "1", type: "default", ... },
];
```

### 4. Use Variants Appropriately

Choose variants that match the semantic meaning:

```tsx
// ✅ Good
{
  variant: "primary";
} // For main actions
{
  variant: "success";
} // For successful operations
{
  variant: "warning";
} // For warnings
{
  variant: "danger";
} // For errors
{
  variant: "default";
} // For neutral nodes

// ❌ Bad - Using wrong variant
{
  variant: "danger";
} // For a success node
```

### 5. Include Icons and Descriptions

Make nodes more informative:

```tsx
// ✅ Good
{
  label: "Process Data",
  description: "Validates and transforms input",
  icon: <Zap className="h-4 w-4" />,
  variant: "success",
}

// ❌ Bad - Minimal information
{
  label: "Node",
}
```

---

## TypeScript Support

All components are fully typed:

```typescript
import type {
  IdeaIReactFlowProviderProps,
  IdeaIReactFlowContainerProps,
  IdeaIReactFlowNodeData,
} from "@repo/ui";

// Type-safe node data
const nodeData: IdeaIReactFlowNodeData = {
  label: "My Node",
  description: "Optional description",
  icon: <Icon />,
  variant: "primary", // TypeScript will autocomplete variants
};
```

---

## Styling Customization

### Container Styling

Customize the container with `className` and `height`:

```tsx
<IdeaIReactFlowContainer
  height="800px"
  className="my-8 border-2"
>
  <ReactFlow ... />
</IdeaIReactFlowContainer>
```

### Node Styling

Node styling is controlled by the `variant` prop. For custom styling, you can extend the component or use CSS variables from IdeaI design system.

---

## Examples in Codebase

### Real-World Example

See `apps/ideai-reactflow/app/page.tsx` for a complete, production-ready example using all React Flow components.

**Key Features Demonstrated**:

- Multiple nodes with different variants
- Interactive connections
- Background, controls, and minimap
- Responsive layout
- Full TypeScript typing

---

## Troubleshooting

### Issue: Nodes Not Rendering

**Solution**: Ensure you're using `IdeaIReactFlowProvider`:

```tsx
<IdeaIReactFlowProvider>
  <ReactFlow ... />
</IdeaIReactFlowProvider>
```

### Issue: Node Type Not Found

**Solution**: Register the node type:

```tsx
const nodeTypes = {
  ideai: IdeaIReactFlowNode,
};

<ReactFlow nodeTypes={nodeTypes} ... />
```

### Issue: Styling Not Applied

**Solution**: Use `IdeaIReactFlowContainer`:

```tsx
<IdeaIReactFlowContainer>
  <ReactFlow ... />
</IdeaIReactFlowContainer>
```

### Issue: TypeScript Errors

**Solution**: Import types from `@repo/ui`:

```tsx
import type { IdeaIReactFlowNodeData } from "@repo/ui";
```

---

## Related Documentation

- [React Flow Official Documentation](https://reactflow.dev/)
- [IdeaI Design System](./design-system.md)
- [UI Consistency Standards](./ui-consistency.md)
- [Component Architecture](./parent-child-complete.md)

---

## Version History

- **1.0.0** (2026-01-05): Initial release
  - `IdeaIReactFlowProvider` component
  - `IdeaIReactFlowContainer` component
  - `IdeaIReactFlowNode` component
  - Full TypeScript support
  - Dark mode support
  - Multiple node variants

---

## Support

For questions or issues:

1. Check this documentation
2. Review `apps/ideai-reactflow/app/page.tsx` for examples
3. Check React Flow documentation: https://reactflow.dev/
4. Open an issue on GitHub
