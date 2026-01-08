/**
 * @fileoverview Tasks & TODOs Page - Centralized task tracking
 *
 * @module TasksPage
 * @description
 * Filterable task list page with markdown support.
 * Shows all pending work, improvements, and future enhancements from across the codebase.
 */

"use client";

import * as React from "react";
import { IdeAIPageTemplate } from "@repo/ui/components/ideai-page-template";
import {
  Check,
  Filter,
  Search,
  AlertCircle,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { tasks } from "./tasks-data";

type Priority = "high" | "medium" | "low" | "completed";
type Status = "pending" | "in-progress" | "blocked" | "completed";
type Category = string;

interface Task {
  id: string;
  title: string;
  description?: string;
  priority: Priority;
  status: Status;
  category: Category;
  assignee?: string;
  tags?: string[];
  markdown?: string;
}

export default function TasksPage() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedPriority, setSelectedPriority] = React.useState<
    Priority | "all"
  >("all");
  const [selectedStatus, setSelectedStatus] = React.useState<Status | "all">(
    "all",
  );
  const [selectedCategory, setSelectedCategory] = React.useState<
    Category | "all"
  >("all");
  const [completedTasks, setCompletedTasks] = React.useState<Set<string>>(
    new Set(),
  );

  // Extract unique categories
  const categories = React.useMemo(() => {
    const cats = new Set<string>();
    tasks.forEach((task) => cats.add(task.category));
    return Array.from(cats).sort();
  }, []);

  // Filter tasks
  const filteredTasks = React.useMemo(() => {
    return tasks.filter((task) => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch =
          task.title.toLowerCase().includes(query) ||
          task.description?.toLowerCase().includes(query) ||
          task.tags?.some((tag) => tag.toLowerCase().includes(query));
        if (!matchesSearch) return false;
      }

      // Priority filter
      if (selectedPriority !== "all" && task.priority !== selectedPriority) {
        return false;
      }

      // Status filter
      const effectiveStatus = completedTasks.has(task.id)
        ? "completed"
        : task.status;
      if (selectedStatus !== "all" && effectiveStatus !== selectedStatus) {
        return false;
      }

      // Category filter
      if (selectedCategory !== "all" && task.category !== selectedCategory) {
        return false;
      }

      return true;
    });
  }, [
    searchQuery,
    selectedPriority,
    selectedStatus,
    selectedCategory,
    completedTasks,
  ]);

  // Group by category
  const groupedTasks = React.useMemo(() => {
    const groups: Record<string, Task[]> = {};
    filteredTasks.forEach((task) => {
      if (!groups[task.category]) {
        groups[task.category] = [];
      }
      groups[task.category].push(task);
    });
    return groups;
  }, [filteredTasks]);

  const toggleTask = (taskId: string) => {
    setCompletedTasks((prev) => {
      const next = new Set(prev);
      if (next.has(taskId)) {
        next.delete(taskId);
      } else {
        next.add(taskId);
      }
      return next;
    });
  };

  const getPriorityIcon = (priority: Priority) => {
    switch (priority) {
      case "high":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case "medium":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case "low":
        return <Clock className="h-4 w-4 text-blue-500" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: Status) => {
    const isCompleted = status === "completed";
    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
          isCompleted
            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
            : status === "in-progress"
              ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:bg-blue-200"
              : status === "blocked"
                ? "bg-red-100 text-red-800 dark:bg-red-900 dark:bg-red-200"
                : "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200"
        }`}
      >
        {isCompleted && <CheckCircle2 className="h-3 w-3" />}
        {status === "pending" && "Pending"}
        {status === "in-progress" && "In Progress"}
        {status === "blocked" && "Blocked"}
        {status === "completed" && "Completed"}
      </span>
    );
  };

  return (
    <IdeAIPageTemplate
      siteName="Tasks & TODOs"
      subtitle="Track all pending work and improvements"
    >
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Tasks & TODOs</h1>
          <p className="text-slate-600 dark:text-slate-400">
            Centralized task tracking across the entire codebase. Filter,
            search, and track progress.
          </p>
        </div>

        {/* Filters */}
        <div className="mb-6 space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Filter Row */}
          <div className="flex flex-wrap gap-4">
            {/* Priority Filter */}
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-slate-400" />
              <select
                value={selectedPriority}
                onChange={(e) =>
                  setSelectedPriority(e.target.value as Priority | "all")
                }
                className="px-3 py-1.5 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="all">All Priorities</option>
                <option value="high">High Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="low">Low Priority</option>
              </select>
            </div>

            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) =>
                setSelectedStatus(e.target.value as Status | "all")
              }
              className="px-3 py-1.5 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="blocked">Blocked</option>
              <option value="completed">Completed</option>
            </select>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-1.5 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            {/* Clear Filters */}
            {(selectedPriority !== "all" ||
              selectedStatus !== "all" ||
              selectedCategory !== "all" ||
              searchQuery) && (
              <button
                onClick={() => {
                  setSelectedPriority("all");
                  setSelectedStatus("all");
                  setSelectedCategory("all");
                  setSearchQuery("");
                }}
                className="px-3 py-1.5 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="mb-6 flex gap-4 text-sm">
          <div className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg">
            <span className="font-medium">{filteredTasks.length}</span> tasks
            shown
          </div>
          <div className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg">
            <span className="font-medium">{tasks.length}</span> total tasks
          </div>
          <div className="px-3 py-1.5 bg-green-100 dark:bg-green-900 rounded-lg">
            <span className="font-medium">{completedTasks.size}</span> completed
          </div>
        </div>

        {/* Tasks by Category */}
        {Object.keys(groupedTasks).length === 0 ? (
          <div className="text-center py-12 text-slate-500 dark:text-slate-400">
            No tasks match your filters.
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(groupedTasks).map(([category, categoryTasks]) => (
              <div
                key={category}
                className="border border-slate-200 dark:border-slate-700 rounded-lg p-6"
              >
                <h2 className="text-2xl font-semibold mb-4 pb-2 border-b border-slate-200 dark:border-slate-700">
                  {category}
                </h2>
                <div className="space-y-4">
                  {categoryTasks.map((task) => {
                    const isCompleted = completedTasks.has(task.id);
                    const effectiveStatus = isCompleted
                      ? "completed"
                      : task.status;
                    return (
                      <div
                        key={task.id}
                        className={`p-4 rounded-lg border ${
                          isCompleted
                            ? "bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 opacity-75"
                            : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <button
                            onClick={() => toggleTask(task.id)}
                            className={`mt-1 flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                              isCompleted
                                ? "bg-green-500 border-green-500 text-white"
                                : "border-slate-300 dark:border-slate-600 hover:border-primary"
                            }`}
                            aria-label={
                              isCompleted
                                ? "Mark as incomplete"
                                : "Mark as complete"
                            }
                          >
                            {isCompleted && <Check className="h-3 w-3" />}
                          </button>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-4 mb-2">
                              <h3
                                className={`text-lg font-medium ${
                                  isCompleted
                                    ? "line-through text-slate-500"
                                    : "text-slate-900 dark:text-slate-100"
                                }`}
                              >
                                {task.title}
                              </h3>
                              <div className="flex items-center gap-2 flex-shrink-0">
                                {getPriorityIcon(task.priority)}
                                {getStatusBadge(effectiveStatus)}
                              </div>
                            </div>
                            {task.description && (
                              <p className="text-slate-600 dark:text-slate-400 mb-2">
                                {task.description}
                              </p>
                            )}
                            {task.markdown && (
                              <div className="mt-3 prose prose-sm dark:prose-invert max-w-none">
                                <pre className="whitespace-pre-wrap text-sm text-slate-600 dark:text-slate-400 font-mono">
                                  {task.markdown}
                                </pre>
                              </div>
                            )}
                            {task.tags && task.tags.length > 0 && (
                              <div className="flex flex-wrap gap-2 mt-3">
                                {task.tags.map((tag) => (
                                  <span
                                    key={tag}
                                    className="px-2 py-1 text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded"
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </IdeAIPageTemplate>
  );
}
