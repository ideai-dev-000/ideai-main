/**
 * @fileoverview Static Workflow Stage Component
 *
 * @module StaticWorkflowStage
 * @description
 * Main stage component that displays workflow steps as cards in order.
 * Shows the flow progression and allows interaction with each step.
 */

"use client";

import { useState, useMemo } from "react";
import { createStaticWorkflow } from "@/plugins/workflows-static/workflow-definition";
import { StaticWorkflowCard } from "./static-workflow-card";
import { cn } from "@/lib/utils";

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

export function StaticWorkflowStage() {
  const [activeStep, setActiveStep] = useState<string | null>(null);
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());
  const [stepCode, setStepCode] = useState<Record<string, string>>({});

  // Group steps by order to show parallel steps together
  const groupedSteps = useMemo(() => {
    const groups: Array<Array<(typeof WORKFLOW_STEPS)[number]>> = [];
    let currentOrder = 0;
    let currentGroup: Array<(typeof WORKFLOW_STEPS)[number]> = [];

    WORKFLOW_STEPS.forEach((step) => {
      if (step.order !== currentOrder) {
        if (currentGroup.length > 0) {
          groups.push(currentGroup);
        }
        currentGroup = [step];
        currentOrder = step.order;
      } else {
        currentGroup.push(step);
      }
    });

    if (currentGroup.length > 0) {
      groups.push(currentGroup);
    }

    return groups;
  }, []);

  const handleCodeChange = (stepId: string, code: string) => {
    setStepCode((prev) => ({ ...prev, [stepId]: code }));
  };

  const handleRun = async (stepId: string) => {
    setActiveStep(stepId);
    // TODO: Execute step with scoped code
    // For now, just mark as completed after a delay
    setTimeout(() => {
      setCompletedSteps((prev) => new Set(prev).add(stepId));
      setActiveStep(null);
    }, 1000);
  };

  return (
    <div className="w-full h-full overflow-y-auto p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
            Static Workflow
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Pre-defined workflow with editable action code. Each step processes
            data and passes it to the next.
          </p>
        </div>

        {/* Workflow Steps */}
        <div className="space-y-6">
          {groupedSteps.map((group, groupIndex) => (
            <div key={groupIndex} className="space-y-4">
              {/* Parallel Steps Group */}
              {group.length > 1 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {group.map((step) => (
                    <StaticWorkflowCard
                      key={step.id}
                      stepId={step.id}
                      label={step.label}
                      order={step.order}
                      isParallel={step.parallel}
                      isActive={activeStep === step.id}
                      isCompleted={completedSteps.has(step.id)}
                      actionCode={stepCode[step.id]}
                      onCodeChange={handleCodeChange}
                      onRun={handleRun}
                    />
                  ))}
                </div>
              ) : (
                // Single Step
                <div className="max-w-2xl mx-auto">
                  <StaticWorkflowCard
                    stepId={group[0].id}
                    label={group[0].label}
                    order={group[0].order}
                    isActive={activeStep === group[0].id}
                    isCompleted={completedSteps.has(group[0].id)}
                    actionCode={stepCode[group[0].id]}
                    onCodeChange={handleCodeChange}
                    onRun={handleRun}
                  />
                </div>
              )}

              {/* Flow Arrow (except last group) */}
              {groupIndex < groupedSteps.length - 1 && (
                <div className="flex justify-center">
                  <div className="w-0.5 h-8 bg-slate-300 dark:bg-slate-600 mx-auto" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
