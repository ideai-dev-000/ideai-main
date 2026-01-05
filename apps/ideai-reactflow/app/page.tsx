/**
 * @fileoverview IdeaI React Flow Landing Page
 *
 * @file page.tsx
 * @module IdeaIReactFlowLanding
 * @description
 * Landing page showcasing React Flow with detailed examples and shared components.
 * Demonstrates IdeaI best practices for React Flow integration.
 */

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
import { IdeAIPageTemplate } from "@repo/ui/components/ideai-page-template";
import {
  IdeaIReactFlowProvider,
  IdeaIReactFlowContainer,
  IdeaIReactFlowNode,
} from "@repo/ui";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Workflow,
  GitBranch,
  Database,
  Server,
  Code,
  Zap,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

// Custom node types
const nodeTypes = {
  ideai: IdeaIReactFlowNode,
};

export default function IdeaIReactFlowPage() {
  // Initial nodes with IdeaI styling
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
      {
        id: "5",
        type: "ideai",
        position: { x: 250, y: 550 },
        data: {
          label: "Complete",
          description: "Workflow finished",
          icon: <CheckCircle2 className="h-4 w-4" />,
          variant: "success" as const,
        },
      },
    ],
    [],
  );

  const initialEdges: Edge[] = useMemo(
    () => [
      {
        id: "e1-2",
        source: "1",
        target: "2",
        animated: true,
        style: { stroke: "#3b82f6" },
      },
      {
        id: "e1-3",
        source: "1",
        target: "3",
        animated: true,
        style: { stroke: "#3b82f6" },
      },
      {
        id: "e2-4",
        source: "2",
        target: "4",
        animated: true,
        style: { stroke: "#10b981" },
      },
      {
        id: "e3-4",
        source: "3",
        target: "4",
        animated: true,
        style: { stroke: "#10b981" },
      },
      {
        id: "e4-5",
        source: "4",
        target: "5",
        animated: true,
        style: { stroke: "#f59e0b" },
      },
    ],
    [],
  );

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  return (
    <IdeAIPageTemplate siteName="IdeaI React Flow">
      <div className="container mx-auto py-8 px-4">
        {/* Hero Section */}
        <div className="mb-12 text-center">
          <div className="mb-4 flex items-center justify-center gap-2">
            <Workflow className="h-8 w-8 text-blue-600" />
            <h1 className="text-4xl font-bold tracking-tight">
              IdeaI React Flow
            </h1>
          </div>
          <p className="mx-auto max-w-2xl text-lg text-slate-600 dark:text-slate-400">
            Interactive flow diagrams built with React Flow, Tailwind CSS, and
            Shadcn/UI. Featuring shared components and IdeaI best practices.
          </p>
        </div>

        {/* Features Grid */}
        <div className="mb-12 grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GitBranch className="h-5 w-5" />
                Shared Components
              </CardTitle>
              <CardDescription>
                Reusable React Flow components in @repo/ui package
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <Badge>IdeaIReactFlowProvider</Badge>
                <Badge>IdeaIReactFlowContainer</Badge>
                <Badge>IdeaIReactFlowNode</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Best Practices
              </CardTitle>
              <CardDescription>
                Follows IdeaI forward-facing architecture patterns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  Semantic component naming
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  Shared package architecture
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  TypeScript strict mode
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5" />
                Extensible
              </CardTitle>
              <CardDescription>
                Easy to extend and use in all IdeaI apps
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Import components from @repo/ui and customize as needed. All
                components follow IdeaI design system.
              </p>
            </CardContent>
          </Card>
        </div>

        <Separator className="my-12" />

        {/* React Flow Example */}
        <div className="mb-12">
          <div className="mb-6">
            <h2 className="mb-2 text-3xl font-bold">
              Interactive Flow Example
            </h2>
            <p className="text-slate-600 dark:text-slate-400">
              A complete workflow diagram demonstrating React Flow capabilities
              with IdeaI shared components. Drag nodes, connect them, and
              explore the interactive features.
            </p>
          </div>

          <IdeaIReactFlowContainer height="700px">
            <IdeaIReactFlowProvider>
              <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                nodeTypes={nodeTypes}
                fitView
                className="bg-slate-50 dark:bg-slate-900"
              >
                <Background />
                <Controls />
                <MiniMap
                  nodeColor={(node) => {
                    const variant = (node.data?.variant || "default") as
                      | "default"
                      | "primary"
                      | "success"
                      | "warning"
                      | "danger";
                    const colors: Record<
                      "default" | "primary" | "success" | "warning" | "danger",
                      string
                    > = {
                      default: "#cbd5e1",
                      primary: "#3b82f6",
                      success: "#10b981",
                      warning: "#f59e0b",
                      danger: "#ef4444",
                    };
                    return colors[variant] || colors.default;
                  }}
                  className="!bg-white dark:!bg-slate-800"
                />
              </ReactFlow>
            </IdeaIReactFlowProvider>
          </IdeaIReactFlowContainer>
        </div>

        {/* Usage Example */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle>Usage Example</CardTitle>
            <CardDescription>
              How to use IdeaI React Flow components in your app
            </CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="overflow-x-auto rounded-lg bg-slate-100 p-4 text-sm dark:bg-slate-800">
              <code>{`import {
  IdeaIReactFlowProvider,
  IdeaIReactFlowContainer,
  IdeaIReactFlowNode,
} from "@repo/ui/components/reactflow";

const nodeTypes = {
  ideai: IdeaIReactFlowNode,
};

<IdeaIReactFlowContainer>
  <IdeaIReactFlowProvider>
    <ReactFlow
      nodes={nodes}
      edges={edges}
      nodeTypes={nodeTypes}
    >
      <Background />
      <Controls />
    </ReactFlow>
  </IdeaIReactFlowProvider>
</IdeaIReactFlowContainer>`}</code>
            </pre>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ArrowRight className="h-5 w-5" />
              Next Steps
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-500" />
                <div>
                  <strong>Extend Components:</strong> Create custom node types
                  by extending IdeaIReactFlowNode
                </div>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-500" />
                <div>
                  <strong>Use in Other Apps:</strong> Import components from
                  @repo/ui in any IdeaI app
                </div>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-500" />
                <div>
                  <strong>Customize Styling:</strong> All components use IdeaI
                  design tokens and support dark mode
                </div>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </IdeAIPageTemplate>
  );
}
