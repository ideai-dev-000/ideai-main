/**
 * @fileoverview Static Configuration Overlay Component
 *
 * @module StaticConfigurationOverlay
 * @description
 * Configuration overlay for static workflows - IDENTICAL to regular ConfigurationOverlay
 * but shows static workflow actions and code editing.
 */

"use client";

import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { Code, FileCode } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { SmartOverlayHeader } from "@/components/overlays/overlay-header";
import { Button } from "@/components/ui/button";
import { CodeEditor } from "@/components/ui/code-editor";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  currentWorkflowIdAtom,
  nodesAtom,
  propertiesPanelActiveTabAtom,
  selectedNodeAtom,
  updateNodeDataAtom,
} from "@/lib/workflow-store";
import { findActionById } from "@/plugins";
import { StaticActionGrid } from "./static-action-grid";
import { generateNodeCode } from "../workflow/utils/code-generators";
import type { OverlayComponentProps } from "@/components/overlays/types";

type StaticConfigurationOverlayProps = OverlayComponentProps;

export function StaticConfigurationOverlay({
  overlayId,
}: StaticConfigurationOverlayProps) {
  const [selectedNodeId] = useAtom(selectedNodeAtom);
  const [nodes] = useAtom(nodesAtom);
  const [activeTab, setActiveTab] = useAtom(propertiesPanelActiveTabAtom);
  const updateNodeData = useSetAtom(updateNodeDataAtom);
  const currentWorkflowId = useAtomValue(currentWorkflowIdAtom);

  const selectedNode = nodes.find((node) => node.id === selectedNodeId);

  // Auto-switch to properties tab when node is selected
  useEffect(() => {
    if (selectedNode && activeTab !== "properties") {
      setActiveTab("properties");
    }
  }, [selectedNode, activeTab, setActiveTab]);

  if (!selectedNode) {
    return (
      <div className="flex h-full flex-col">
        <SmartOverlayHeader overlayId={overlayId} title="Properties" />
        <div className="flex-1 flex items-center justify-center p-6">
          <p className="text-slate-500 dark:text-slate-400">
            Select a node to configure
          </p>
        </div>
      </div>
    );
  }

  const handleUpdateConfig = useCallback(
    (key: string, value: unknown) => {
      if (!selectedNode) return;
      const newConfig = {
        ...selectedNode.data.config,
        [key]: value,
      };
      updateNodeData({
        id: selectedNode.id,
        data: { config: newConfig },
      });
    },
    [selectedNode, updateNodeData],
  );

  // Generate node code
  const nodeCode = useMemo(() => {
    if (!selectedNode) return "";
    return generateNodeCode(selectedNode);
  }, [selectedNode]);

  // Get action info
  const actionType = selectedNode.data.config?.actionType as string | undefined;
  const action = actionType ? findActionById(actionType) : null;

  const getTabTitle = () => {
    if (activeTab === "properties") return "Properties";
    if (activeTab === "code") return "Code";
    return "Properties";
  };

  return (
    <div className="flex h-full max-h-[80vh] flex-col">
      {/* Header */}
      <SmartOverlayHeader overlayId={overlayId} title={getTabTitle()} />

      {/* Tabs */}
      <Tabs
        className="flex flex-1 flex-col overflow-hidden"
        onValueChange={(value) => setActiveTab(value as "properties" | "code")}
        value={activeTab}
      >
        <TabsList className="mx-4 mt-2">
          <TabsTrigger value="properties">
            <Code className="mr-2 size-4" />
            Properties
          </TabsTrigger>
          <TabsTrigger value="code">
            <FileCode className="mr-2 size-4" />
            Code
          </TabsTrigger>
        </TabsList>

        {/* Properties Tab */}
        <TabsContent className="flex-1 overflow-y-auto" value="properties">
          <div className="space-y-4 px-6 pt-4 pb-6">
            {/* Action selection - show grid if no action selected */}
            {selectedNode.data.type === "action" &&
              !selectedNode.data.config?.actionType && (
                <StaticActionGrid
                  disabled={false}
                  onSelectAction={(actionType) => {
                    handleUpdateConfig("actionType", actionType);
                  }}
                />
              )}

            {/* Action config - show if action is selected */}
            {selectedNode.data.type === "action" &&
              selectedNode.data.config?.actionType && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-semibold mb-2">
                      {action?.label || "Action"}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {action?.description || ""}
                    </p>
                  </div>
                  {/* Static workflow actions have no config fields - just show info */}
                  <div className="rounded-lg border border-slate-200 dark:border-slate-700 p-4 bg-slate-50 dark:bg-slate-900/50">
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      This is a static workflow action. Edit the code in the
                      Code tab.
                    </p>
                  </div>
                </div>
              )}

            {/* Trigger config */}
            {selectedNode.data.type === "trigger" && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-semibold mb-2">Trigger</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Start the static workflow
                  </p>
                </div>
              </div>
            )}
          </div>
        </TabsContent>

        {/* Code Tab */}
        <TabsContent
          className="flex flex-1 flex-col overflow-hidden"
          value="code"
        >
          <div className="flex shrink-0 items-center justify-between border-b bg-muted/30 px-3 pb-2">
            <div className="flex items-center gap-2">
              <FileCode className="size-3.5 text-muted-foreground" />
              <code className="text-muted-foreground text-xs">
                {actionType
                  ? `steps/${actionType.toLowerCase().replace(/\s+/g, "-")}-step.ts`
                  : "step.ts"}
              </code>
            </div>
          </div>
          <div className="flex-1 overflow-hidden">
            <CodeEditor
              height="100%"
              language="typescript"
              options={{
                readOnly: false, // Allow editing for static workflow
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                fontSize: 13,
                lineNumbers: "on",
                folding: true,
                wordWrap: "off",
                padding: { top: 16, bottom: 16 },
              }}
              value={nodeCode}
              onChange={(value) => {
                // TODO: Save edited code to node data
                // For now, just update the display
              }}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
