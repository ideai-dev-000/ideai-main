/**
 * @fileoverview Static Action Grid Component
 *
 * @module StaticActionGrid
 * @description
 * Grid of static workflow actions - simplified version of ActionGrid
 * that only shows static workflow actions.
 */

"use client";

import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { getAllActions } from "@/plugins";

type ActionType = {
  id: string;
  label: string;
  description: string;
  category: string;
};

type StaticActionGridProps = {
  onSelectAction: (actionType: string) => void;
  disabled?: boolean;
};

export function StaticActionGrid({
  onSelectAction,
  disabled,
}: StaticActionGridProps) {
  const [filter, setFilter] = useState("");

  // Get only static workflow actions
  const staticActions = useMemo(() => {
    const allActions = getAllActions();
    return allActions
      .filter((action) => action.integration === "workflows-static")
      .map((action) => ({
        id: action.id,
        label: action.label,
        description: action.description,
        category: action.category,
      }));
  }, []);

  const filteredActions = staticActions.filter((action) => {
    const searchTerm = filter.toLowerCase();
    return (
      action.label.toLowerCase().includes(searchTerm) ||
      action.description.toLowerCase().includes(searchTerm) ||
      action.category.toLowerCase().includes(searchTerm)
    );
  });

  // Group by category
  const groupedActions = useMemo(() => {
    const groups: Record<string, ActionType[]> = {};
    filteredActions.forEach((action) => {
      if (!groups[action.category]) {
        groups[action.category] = [];
      }
      groups[action.category].push(action);
    });
    return groups;
  }, [filteredActions]);

  return (
    <div className="flex h-full flex-col">
      {/* Search */}
      <div className="border-b p-4">
        <Input
          className="w-full"
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Search actions..."
          value={filter}
        />
      </div>

      {/* Actions Grid */}
      <div className="flex-1 overflow-y-auto p-4">
        {Object.entries(groupedActions).map(([category, actions]) => (
          <div key={category} className="mb-6">
            <h3 className="mb-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
              {category}
            </h3>
            <div
              className="grid gap-2"
              style={{
                gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
              }}
            >
              {actions.map((action) => (
                <button
                  className={cn(
                    "flex flex-col items-center justify-center gap-2 rounded-lg border border-slate-200 dark:border-slate-700 p-4 text-center transition-colors hover:border-slate-300 hover:bg-slate-50 dark:hover:border-slate-600 dark:hover:bg-slate-800",
                    disabled && "pointer-events-none opacity-50",
                  )}
                  disabled={disabled}
                  key={action.id}
                  onClick={() => onSelectAction(action.id)}
                  type="button"
                >
                  <span className="font-medium text-sm">{action.label}</span>
                  {action.description && (
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {action.description}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        ))}
        {filteredActions.length === 0 && (
          <p className="py-8 text-center text-slate-500 dark:text-slate-400">
            No actions found
          </p>
        )}
      </div>
    </div>
  );
}
