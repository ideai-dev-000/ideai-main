/**
 * @fileoverview Static Workflow Steps List Component
 *
 * @module StaticWorkflowStepsList
 * @description
 * Lists all steps in the static workflow with their order and status.
 */

"use client";

import { useMemo } from "react";
import { createStaticWorkflow } from "@/plugins/workflows-static/workflow-definition";

const WORKFLOW_STEPS = [
  { id: "trigger", label: "Trigger", order: 1 },
  { id: "requirement-taker", label: "Requirement Taker", order: 2 },
  { id: "task-generator", label: "Task Generator", order: 3 },
  { id: "development", label: "Development", order: 4, parallel: true },
  { id: "design", label: "Design", order: 4, parallel: true },
  { id: "data", label: "Data", order: 4, parallel: true },
  { id: "build", label: "Build", order: 5 },
  { id: "qa", label: "QA", order: 6 },
  { id: "deploy", label: "Deploy", order: 7 },
  { id: "maintain", label: "Maintain", order: 8 },
  { id: "archive", label: "Archive", order: 9 },
] as const;

export function StaticWorkflowStepsList() {
  const steps = useMemo(() => WORKFLOW_STEPS, []);

  return (
    <div className="space-y-2">
      {steps.map((step) => (
        <div
          key={step.id}
          className="flex items-center gap-2 p-2 rounded-md bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700"
        >
          <div className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xs font-semibold text-slate-700 dark:text-slate-300">
            {step.order}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-slate-900 dark:text-slate-100">
              {step.label}
            </div>
            {step.parallel && (
              <div className="text-xs text-slate-500 dark:text-slate-400">
                Parallel
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
