/**
 * @fileoverview IdeaI Side Menu Component
 *
 * @module IdeAISideMenu
 * @description
 * Composable side menu component for IdeaI customization controls.
 * Provides persistent sidebar on desktop and drawer on mobile.
 * Supports adding workflows, cards, controls, and blocks sections.
 *
 * Features:
 * - Workflow section populated from API
 * - Composable slots for custom cards, controls, and blocks
 * - Responsive design (sidebar on desktop, drawer on mobile)
 * - Follows IdeaI composability patterns
 *
 * @example
 * ```tsx
 * <IdeAISideMenu
 *   workflows={workflows}
 *   onLoadWorkflows={loadWorkflows}
 *   currentWorkflowId={currentId}
 * >
 *   <IdeAISideMenuCards>
 *     <YourCustomCard />
 *   </IdeAISideMenuCards>
 *   <IdeAISideMenuControls>
 *     <YourControl />
 *   </IdeAISideMenuControls>
 * </IdeAISideMenu>
 * ```
 *
 * @see {@link ./ideai-header.tsx} - Header component
 * @see {@link ./ideai-page-template.tsx} - Page template integration
 */

"use client";

import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Menu, X, Workflow, ChevronRight, Copy, Eraser } from "lucide-react";
import { cn } from "../lib/utils";
import { useRouter } from "next/navigation";

export interface WorkflowItem {
  id: string;
  name: string;
  href: string;
  updatedAt?: string;
}

export interface IdeAISideMenuProps {
  /** Workflow items to display in workflows section */
  workflows?: WorkflowItem[];
  /** Callback to load workflows (called on mount and when workflows section opens) */
  onLoadWorkflows?: () => Promise<void> | void;
  /** Currently active workflow ID */
  currentWorkflowId?: string | null;
  /** Callback to create a new workflow */
  onCreateWorkflow?: () => void | Promise<void>;
  /** Callback to clone/duplicate a workflow (receives workflowId and workflowName) */
  onCloneWorkflow?: (
    workflowId: string,
    workflowName: string,
  ) => void | Promise<void>;
  /** Callback to delete a workflow (receives workflowId and workflowName) */
  onDeleteWorkflow?: (
    workflowId: string,
    workflowName: string,
  ) => void | Promise<void>;
  /** Callback to clear the current workflow (clears all nodes and edges) */
  onClearWorkflow?: () => void | Promise<void>;
  /** Title for the workflows section (defaults to "Workflows") */
  workflowsTitle?: string;
  /** Cards section content (custom cards/blocks) */
  children?: React.ReactNode;
  /** Custom className */
  className?: string;
  /** Control sidebar open state externally */
  open?: boolean;
  /** Callback when open state changes */
  onOpenChange?: (open: boolean) => void;
}

interface IdeAISideMenuSectionProps {
  /** Section title */
  title?: string;
  /** Section content */
  children?: React.ReactNode;
  /** Custom className */
  className?: string;
}

/**
 * New Workflow Section - Button to create a new workflow
 * Styled to match the status card UI
 */
export function IdeAISideMenuNewWorkflow({
  onCreateWorkflow,
  className,
}: {
  onCreateWorkflow?: () => void | Promise<void>;
  className?: string;
}) {
  if (!onCreateWorkflow) return null;

  return (
    <div className={cn("px-4 py-3", className)}>
      <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm">
        <button
          type="button"
          className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold text-slate-900 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors rounded-lg"
          onClick={onCreateWorkflow}
        >
          <span className="text-lg leading-none">+</span>
          <span>New Workflow</span>
        </button>
      </div>
    </div>
  );
}

/**
 * Workflows Section - Shows list of workflows from API
 */
export function IdeAISideMenuWorkflows({
  workflows = [],
  onLoadWorkflows,
  currentWorkflowId,
  onCreateWorkflow,
  onCloneWorkflow,
  onDeleteWorkflow,
  onClearWorkflow,
  title = "Workflows",
  className,
}: {
  workflows?: WorkflowItem[];
  onLoadWorkflows?: () => Promise<void> | void;
  currentWorkflowId?: string | null;
  onCreateWorkflow?: () => void | Promise<void>;
  onCloneWorkflow?: (
    workflowId: string,
    workflowName: string,
  ) => void | Promise<void>;
  onDeleteWorkflow?: (
    workflowId: string,
    workflowName: string,
  ) => void | Promise<void>;
  onClearWorkflow?: () => void | Promise<void>;
  title?: string;
  className?: string;
}) {
  const [isExpanded, setIsExpanded] = React.useState(true);
  const [deletingId, setDeletingId] = React.useState<string | null>(null);
  const [cloningId, setCloningId] = React.useState<string | null>(null);
  const router = useRouter();

  // Don't auto-load workflows - parent component should handle loading
  // onLoadWorkflows is only used if parent explicitly wants to refresh

  const handleClone = async (workflowId: string, workflowName: string) => {
    if (onCloneWorkflow) {
      setCloningId(workflowId);
      try {
        await onCloneWorkflow(workflowId, workflowName);
        // Reload workflows after cloning
        if (onLoadWorkflows) {
          await onLoadWorkflows();
        }
      } finally {
        setCloningId(null);
      }
    }
  };

  const handleDelete = async (workflowId: string, workflowName: string) => {
    if (onDeleteWorkflow) {
      setDeletingId(workflowId);
      try {
        await onDeleteWorkflow(workflowId, workflowName);
        // Reload workflows after deletion
        if (onLoadWorkflows) {
          await onLoadWorkflows();
        }
      } finally {
        setDeletingId(null);
      }
    }
  };

  // Memoize workflow items to prevent re-renders
  const workflowItems = React.useMemo(() => {
    return workflows.map((workflow) => ({
      ...workflow,
      isActive: currentWorkflowId === workflow.id,
    }));
  }, [workflows, currentWorkflowId]);

  return (
    <div className={cn("ideai-side-menu-section", className)}>
      <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700">
        <button
          type="button"
          className="flex items-center gap-2 w-full text-left"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <Workflow className="h-4 w-4 text-slate-600 dark:text-slate-400" />
          <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            {title}
          </span>
          <ChevronRight
            className={cn(
              "h-4 w-4 ml-auto text-slate-600 dark:text-slate-400 transition-transform",
              isExpanded && "rotate-90",
            )}
          />
        </button>
      </div>
      {isExpanded && (
        <div className="ideai-side-menu-section-content">
          {/* Workflows List */}
          {workflowItems.length === 0 ? (
            <div className="ideai-side-menu-empty">No workflows found</div>
          ) : (
            <ul className="ideai-side-menu-list">
              {workflowItems.map((workflow) => (
                <WorkflowListItem
                  key={workflow.id}
                  workflow={workflow}
                  isActive={workflow.isActive}
                  onCloneWorkflow={onCloneWorkflow}
                  onDeleteWorkflow={onDeleteWorkflow}
                  onClearWorkflow={onClearWorkflow}
                  onClone={handleClone}
                  onDelete={handleDelete}
                  cloningId={cloningId}
                  deletingId={deletingId}
                  router={router}
                />
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * Memoized workflow list item to prevent unnecessary re-renders
 */
const WorkflowListItem = React.memo(function WorkflowListItem({
  workflow,
  isActive,
  onCloneWorkflow,
  onDeleteWorkflow,
  onClearWorkflow,
  onClone,
  onDelete,
  cloningId,
  deletingId,
  router,
}: {
  workflow: WorkflowItem & { isActive?: boolean };
  isActive: boolean;
  onCloneWorkflow?: (
    workflowId: string,
    workflowName: string,
  ) => void | Promise<void>;
  onDeleteWorkflow?: (
    workflowId: string,
    workflowName: string,
  ) => void | Promise<void>;
  onClearWorkflow?: () => void | Promise<void>;
  onClone: (workflowId: string, workflowName: string) => Promise<void>;
  onDelete: (workflowId: string, workflowName: string) => Promise<void>;
  cloningId: string | null;
  deletingId: string | null;
  router: ReturnType<typeof useRouter>;
}) {
  const handleClick = React.useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      // Clear localStorage to prevent redirect back to old workflow
      if (typeof window !== "undefined") {
        localStorage.removeItem("lastActiveWorkflowId");
      }
      router.push(workflow.href);
    },
    [workflow.href, router],
  );

  return (
    <li>
      <div className="ideai-side-menu-item-wrapper group">
        <button
          type="button"
          onClick={handleClick}
          className={cn(
            "ideai-side-menu-item",
            isActive && "ideai-side-menu-item--active",
            (onCloneWorkflow ||
              onDeleteWorkflow ||
              (onClearWorkflow && isActive)) &&
              "ideai-side-menu-item--with-actions",
          )}
        >
          <span className="ideai-side-menu-item-name">{workflow.name}</span>
          {workflow.updatedAt && (
            <span className="ideai-side-menu-item-meta">
              {new Date(workflow.updatedAt).toLocaleDateString()}
            </span>
          )}
        </button>
        {(onCloneWorkflow ||
          onDeleteWorkflow ||
          (onClearWorkflow && isActive)) && (
          <div className="ideai-side-menu-item-actions">
            {onCloneWorkflow && (
              <WorkflowCloneButton
                workflowId={workflow.id}
                workflowName={workflow.name}
                onClone={onClone}
                isCloning={cloningId === workflow.id}
              />
            )}
            {onClearWorkflow && isActive && (
              <WorkflowClearButton onClear={onClearWorkflow} />
            )}
            {onDeleteWorkflow && (
              <WorkflowDeleteButton
                workflowId={workflow.id}
                workflowName={workflow.name}
                onDelete={onDelete}
                isDeleting={deletingId === workflow.id}
              />
            )}
          </div>
        )}
      </div>
    </li>
  );
});

/**
 * Clone button for workflow items
 */
function WorkflowCloneButton({
  workflowId,
  workflowName,
  onClone,
  isCloning,
}: {
  workflowId: string;
  workflowName: string;
  onClone: (workflowId: string, workflowName: string) => void | Promise<void>;
  isCloning: boolean;
}) {
  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await onClone(workflowId, workflowName);
  };

  return (
    <button
      type="button"
      className="ideai-side-menu-clone-button"
      onClick={handleClick}
      disabled={isCloning}
      aria-label={`Clone ${workflowName}`}
      title={`Clone ${workflowName}`}
    >
      {isCloning ? "..." : <Copy className="h-3 w-3" />}
    </button>
  );
}

/**
 * Clear button for current workflow (clears all nodes and edges)
 */
function WorkflowClearButton({
  onClear,
}: {
  onClear: () => void | Promise<void>;
}) {
  const [showConfirm, setShowConfirm] = React.useState(false);

  const handleConfirm = async () => {
    setShowConfirm(false);
    await onClear();
  };

  return (
    <>
      <button
        type="button"
        className="ideai-side-menu-clear-button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setShowConfirm(true);
        }}
        aria-label="Clear workflow"
        title="Clear workflow"
      >
        <Eraser className="h-3 w-3" />
      </button>

      {showConfirm && typeof window !== "undefined" && (
        <WorkflowClearConfirmDialog
          onConfirm={handleConfirm}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </>
  );
}

/**
 * Confirmation dialog for clearing workflow
 */
function WorkflowClearConfirmDialog({
  onConfirm,
  onCancel,
}: {
  onConfirm: () => void;
  onCancel: () => void;
}) {
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onCancel();
      }
    };
    const handleClickOutside = () => {
      onCancel();
    };

    window.addEventListener("keydown", handleEscape);
    // Close on next frame to allow click event to complete
    requestAnimationFrame(() => {
      document.addEventListener("click", handleClickOutside, { once: true });
    });

    return () => {
      window.removeEventListener("keydown", handleEscape);
      document.removeEventListener("click", handleClickOutside);
    };
  }, [onCancel]);

  return (
    <div className="ideai-side-menu-confirm-overlay">
      <div
        className="ideai-side-menu-confirm-dialog"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="ideai-side-menu-confirm-content">
          <div className="ideai-side-menu-confirm-title">Clear Workflow</div>
          <div className="ideai-side-menu-confirm-message">
            Are you sure you want to clear all nodes and connections? This
            action cannot be undone.
          </div>
        </div>
        <div className="ideai-side-menu-confirm-actions">
          <button
            type="button"
            className="ideai-side-menu-confirm-cancel"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            type="button"
            className="ideai-side-menu-confirm-delete"
            onClick={onConfirm}
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Delete button with confirmation dialog for workflow items
 */
function WorkflowDeleteButton({
  workflowId,
  workflowName,
  onDelete,
  isDeleting,
}: {
  workflowId: string;
  workflowName: string;
  onDelete: (workflowId: string, workflowName: string) => void | Promise<void>;
  isDeleting: boolean;
}) {
  const [showConfirm, setShowConfirm] = React.useState(false);

  const handleConfirm = async () => {
    setShowConfirm(false);
    await onDelete(workflowId, workflowName);
  };

  return (
    <>
      <button
        type="button"
        className="ideai-side-menu-delete-button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setShowConfirm(true);
        }}
        disabled={isDeleting}
        aria-label={`Delete ${workflowName}`}
      >
        {isDeleting ? "..." : "×"}
      </button>

      {/* Simple confirmation dialog using native confirm for now */}
      {/* Can be replaced with AlertDialog if available */}
      {showConfirm && typeof window !== "undefined" && (
        <WorkflowDeleteConfirmDialog
          workflowName={workflowName}
          onConfirm={handleConfirm}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </>
  );
}

/**
 * Confirmation dialog for workflow deletion
 * Uses a simple overlay approach that can be styled
 */
function WorkflowDeleteConfirmDialog({
  workflowName,
  onConfirm,
  onCancel,
}: {
  workflowName: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onCancel();
      }
    };
    const handleClickOutside = () => {
      onCancel();
    };

    window.addEventListener("keydown", handleEscape);
    // Close on next frame to allow click event to complete
    requestAnimationFrame(() => {
      document.addEventListener("click", handleClickOutside, { once: true });
    });

    return () => {
      window.removeEventListener("keydown", handleEscape);
      document.removeEventListener("click", handleClickOutside);
    };
  }, [onCancel]);

  return (
    <div className="ideai-side-menu-confirm-overlay">
      <div
        className="ideai-side-menu-confirm-dialog"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="ideai-side-menu-confirm-header">
          <h3 className="ideai-side-menu-confirm-title">Delete Workflow?</h3>
        </div>
        <div className="ideai-side-menu-confirm-body">
          <p className="ideai-side-menu-confirm-message">
            Are you sure you want to delete <strong>{workflowName}</strong>?
            This action cannot be undone.
          </p>
        </div>
        <div className="ideai-side-menu-confirm-footer">
          <button
            type="button"
            className="ideai-side-menu-confirm-cancel"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            type="button"
            className="ideai-side-menu-confirm-delete"
            onClick={onConfirm}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Cards Section - For custom cards and blocks
 */
export function IdeAISideMenuCards({
  title = "Cards",
  children,
  className,
}: IdeAISideMenuSectionProps) {
  if (!children) return null;

  return (
    <div className={cn("ideai-side-menu-section", className)}>
      <div className="ideai-side-menu-section-header">
        <span className="ideai-side-menu-section-title">{title}</span>
      </div>
      <div className="ideai-side-menu-section-content">{children}</div>
    </div>
  );
}

/**
 * Controls Section - For customization controls
 */
export function IdeAISideMenuControls({
  title = "Controls",
  children,
  className,
}: IdeAISideMenuSectionProps) {
  if (!children) return null;

  return (
    <div className={cn("ideai-side-menu-section", className)}>
      <div className="ideai-side-menu-section-header">
        <span className="ideai-side-menu-section-title">{title}</span>
      </div>
      <div className="ideai-side-menu-section-content">{children}</div>
    </div>
  );
}

/**
 * Blocks Section - For additional blocks
 */
export function IdeAISideMenuBlocks({
  title = "Blocks",
  children,
  className,
}: IdeAISideMenuSectionProps) {
  if (!children) return null;

  return (
    <div className={cn("ideai-side-menu-section", className)}>
      <div className="ideai-side-menu-section-header">
        <span className="ideai-side-menu-section-title">{title}</span>
      </div>
      <div className="ideai-side-menu-section-content">{children}</div>
    </div>
  );
}

/**

/**
 * IdeaI Side Menu Component
 *
 * Composable side menu with workflows and custom slots for cards,
 * controls, and blocks. Persistent sidebar on desktop, drawer on mobile.
 */
export function IdeAISideMenu({
  workflows = [],
  onLoadWorkflows,
  currentWorkflowId,
  onCreateWorkflow,
  onCloneWorkflow,
  onDeleteWorkflow,
  onClearWorkflow,
  workflowsTitle = "Workflows",
  children,
  className,
  open: openProp,
  onOpenChange: onOpenChangeProp,
}: IdeAISideMenuProps) {
  const [open, setOpen] = React.useState(false);

  // Use controlled state if provided, otherwise use internal state
  const isOpen = openProp !== undefined ? openProp : open;
  const handleOpenChange =
    onOpenChangeProp !== undefined
      ? onOpenChangeProp
      : (newOpen: boolean) => setOpen(newOpen);

  // Load workflows on mount for the desktop sidebar
  React.useEffect(() => {
    if (onLoadWorkflows) {
      onLoadWorkflows();
    }
  }, [onLoadWorkflows]);

  // Memoize children check to prevent unnecessary re-renders
  const hasWorkflowsSection = React.useMemo(() => {
    return React.Children.toArray(children).some(
      (child) =>
        React.isValidElement(child) && child.type === IdeAISideMenuWorkflows,
    );
  }, [children]);

  // Memoize workflows content to prevent re-creating component on every render
  const workflowsContent = React.useMemo(() => {
    if (hasWorkflowsSection) return null;
    // Always show workflows section if workflows prop is provided or onLoadWorkflows exists
    // (even if empty - parent manages loading)
    if (!workflows && !onLoadWorkflows) return null;
    return (
      <IdeAISideMenuWorkflows
        workflows={workflows || []}
        onLoadWorkflows={onLoadWorkflows}
        currentWorkflowId={currentWorkflowId}
        onCreateWorkflow={onCreateWorkflow}
        onCloneWorkflow={onCloneWorkflow}
        onDeleteWorkflow={onDeleteWorkflow}
        onClearWorkflow={onClearWorkflow}
        title={workflowsTitle}
      />
    );
  }, [
    hasWorkflowsSection,
    workflows,
    onLoadWorkflows,
    currentWorkflowId,
    onCreateWorkflow,
    onDeleteWorkflow,
    onCloneWorkflow,
    onClearWorkflow,
    workflowsTitle,
  ]);

  const SideMenuContent = () => (
    <div className={cn("ideai-side-menu-content", className)}>
      <div className="ideai-side-menu-header">
        <h2 className="ideai-side-menu-title">IdeaI Menu</h2>
        <button
          type="button"
          className="ideai-side-menu-close"
          onClick={() => handleOpenChange(false)}
          aria-label="Close menu"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
      <div className="ideai-side-menu-body">
        {/* Custom Sections (Cards, Controls, Blocks, etc.) - render first for status card */}
        {children}

        {/* Auto-populated Workflows Section (if not provided in children) */}
        {workflowsContent}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop: Persistent Sidebar */}
      <aside className="ideai-side-menu ideai-side-menu--desktop">
        <SideMenuContent />
      </aside>

      {/* Mobile: Drawer */}
      <Dialog.Root open={isOpen} onOpenChange={handleOpenChange}>
        {/* Mobile trigger is rendered here but can be hidden if external trigger is used */}
        <Dialog.Trigger asChild>
          <button
            type="button"
            className="ideai-side-menu-trigger ideai-side-menu-trigger--mobile ideai-side-menu-trigger--internal"
            aria-label="Open IdeaI menu"
          >
            <Menu className="h-6 w-6" />
          </button>
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay className="ideai-side-menu-overlay" />
          <Dialog.Content className="ideai-side-menu-content ideai-side-menu-content--mobile">
            <SideMenuContent />
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}
