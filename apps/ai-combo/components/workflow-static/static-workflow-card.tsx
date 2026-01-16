/**
 * @fileoverview Static Workflow Card Component
 *
 * @module StaticWorkflowCard
 * @description
 * Card UI component for displaying and editing a single workflow step.
 * Shows step information, action code, and allows editing with security scoping.
 */

"use client";

import { useState, useMemo } from "react";
import { Play, Code, Check, X, Edit2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import dynamic from "next/dynamic";

// Dynamically import CodeEditor to avoid SSR issues
const CodeEditor = dynamic(
  () =>
    import("@/components/ui/code-editor").then((mod) => ({
      default: mod.CodeEditor,
    })),
  { ssr: false },
);
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface StaticWorkflowCardProps {
  stepId: string;
  label: string;
  order: number;
  isParallel?: boolean;
  isActive?: boolean;
  isCompleted?: boolean;
  actionCode?: string;
  onCodeChange?: (stepId: string, code: string) => void;
  onRun?: (stepId: string) => void;
}

export function StaticWorkflowCard({
  stepId,
  label,
  order,
  isParallel = false,
  isActive = false,
  isCompleted = false,
  actionCode,
  onCodeChange,
  onRun,
}: StaticWorkflowCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedCode, setEditedCode] = useState(actionCode || "");

  // Default action code template (scoped to only pass data to next node)
  const defaultCode = useMemo(() => {
    return `/**
 * ${label} Step
 * 
 * SECURITY: This function is scoped to only pass data to the next node.
 * No external API calls, file system access, or dangerous operations allowed.
 * 
 * @param {StepInput} input - Input from previous step
 * @returns {StepResult} - Data to pass to next step
 */
export async function ${stepId}Step(input) {
  // Process input from previous step
  const previousData = input.data || {};
  
  // Your logic here (scoped - only data transformation)
  const result = {
    ...previousData,
    step: "${stepId}",
    label: "${label}",
    timestamp: new Date().toISOString(),
    // Add your step-specific data here
  };
  
  // Return data for next step (only way to pass data forward)
  return result;
}`;
  }, [stepId, label]);

  const codeToDisplay = editedCode || actionCode || defaultCode;

  const handleSave = () => {
    if (onCodeChange) {
      onCodeChange(stepId, editedCode);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedCode(actionCode || defaultCode);
    setIsEditing(false);
  };

  return (
    <Card
      className={cn(
        "relative overflow-hidden transition-all",
        isActive && "ring-2 ring-blue-500 dark:ring-blue-400",
        isCompleted && "opacity-75",
      )}
    >
      {/* Step Order Badge */}
      <div className="absolute top-4 right-4 z-10">
        <Badge
          variant={isActive ? "default" : "secondary"}
          className={cn(
            "font-semibold",
            isActive && "bg-blue-500 text-white",
            isCompleted && "bg-green-500 text-white",
          )}
        >
          {order}
        </Badge>
      </div>

      {/* Card Header */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              {label}
            </h3>
            {isParallel && (
              <Badge variant="outline" className="mt-1">
                Parallel
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            {isEditing ? (
              <>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleCancel}
                  className="h-8"
                >
                  <X className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="default"
                  onClick={handleSave}
                  className="h-8"
                >
                  <Save className="h-4 w-4 mr-1" />
                  Save
                </Button>
              </>
            ) : (
              <>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setIsEditing(true)}
                  className="h-8"
                  title="Edit Code"
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
                {onRun && (
                  <Button
                    size="sm"
                    variant="default"
                    onClick={() => onRun(stepId)}
                    className="h-8"
                    disabled={isActive}
                    title="Run Step"
                  >
                    <Play className="h-4 w-4" />
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Code Editor */}
      <div className="p-4 bg-slate-50 dark:bg-slate-900/50">
        {isEditing ? (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <Code className="h-3 w-3" />
              <span>Editing action code (scoped to data passing only)</span>
            </div>
            <CodeEditor
              value={editedCode}
              onChange={setEditedCode}
              language="typescript"
              height="300px"
              className="rounded-md border border-slate-200 dark:border-slate-700"
            />
            <div className="text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 p-2 rounded border border-amber-200 dark:border-amber-800">
              <strong>Security:</strong> Code is scoped to only pass data to the
              next node. No external API calls or file system access allowed.
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <Code className="h-3 w-3" />
              <span>Action Code</span>
            </div>
            <pre className="text-xs bg-slate-900 dark:bg-slate-950 text-slate-100 p-3 rounded-md overflow-x-auto max-h-64 overflow-y-auto">
              <code>{codeToDisplay}</code>
            </pre>
          </div>
        )}
      </div>

      {/* Status Indicator */}
      {isCompleted && (
        <div className="absolute bottom-4 right-4">
          <div className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
            <Check className="h-3 w-3" />
            <span>Completed</span>
          </div>
        </div>
      )}
    </Card>
  );
}
