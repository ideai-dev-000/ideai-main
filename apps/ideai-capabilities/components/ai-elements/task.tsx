import React from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@repo/ui/components/collapsible";
import { ChevronDown, ChevronRight, FileText } from "lucide-react";

interface TaskProps {
  className?: string;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

export const Task = ({
  className = "",
  defaultOpen = false,
  onOpenChange,
  children,
}: TaskProps) => {
  const [open, setOpen] = React.useState(defaultOpen);

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    onOpenChange?.(newOpen);
  };

  return (
    <Collapsible
      open={open}
      onOpenChange={handleOpenChange}
      className={`border border-gray-200 dark:border-gray-800 rounded-lg ${className}`}
    >
      {children}
    </Collapsible>
  );
};

interface TaskTriggerProps {
  title: string;
}

export const TaskTrigger = ({ title }: TaskTriggerProps) => {
  return (
    <CollapsibleTrigger className="w-full flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors rounded-t-lg">
      <div className="flex items-center gap-2">
        <ChevronRight className="w-4 h-4 text-gray-500 dark:text-gray-400 data-[state=open]:rotate-90 transition-transform" />
        <FileText className="w-4 h-4 text-gray-500 dark:text-gray-400" />
        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
          {title}
        </span>
      </div>
    </CollapsibleTrigger>
  );
};

interface TaskContentProps {
  children: React.ReactNode;
}

export const TaskContent = ({ children }: TaskContentProps) => {
  return (
    <CollapsibleContent className="px-3 pb-3 border-t border-gray-200 dark:border-gray-800">
      <div className="pt-3 space-y-2">{children}</div>
    </CollapsibleContent>
  );
};

interface TaskItemProps {
  children: React.ReactNode;
}

export const TaskItem = ({ children }: TaskItemProps) => {
  return (
    <div className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
      {children}
    </div>
  );
};

interface TaskItemFileProps {
  children: React.ReactNode;
}

export const TaskItemFile = ({ children }: TaskItemFileProps) => {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-xs font-mono text-gray-900 dark:text-gray-100">
      <FileText className="w-3 h-3" />
      {children}
    </span>
  );
};
