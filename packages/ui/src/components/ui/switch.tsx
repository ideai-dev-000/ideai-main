import * as React from "react";
import { cn } from "../../lib/utils";

export interface SwitchProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "type" | "checked" | "onChange"
> {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  ({ className, checked, onCheckedChange, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onCheckedChange?.(e.target.checked);
    };

    return (
      <input
        ref={ref}
        type="checkbox"
        checked={checked}
        onChange={handleChange}
        className={cn(
          "h-5 w-9 rounded-full bg-slate-200 transition-colors appearance-none cursor-pointer relative dark:bg-slate-700",
          "before:absolute before:inset-y-0.5 before:left-0.5 before:w-4 before:h-4 before:rounded-full before:bg-white before:transition-transform before:shadow-sm",
          checked && "bg-blue-600 dark:bg-blue-500 before:translate-x-4",
          className,
        )}
        {...props}
      />
    );
  },
);
Switch.displayName = "Switch";

export { Switch };
