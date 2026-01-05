/**
 * @fileoverview Toggle Switch Tool
 *
 * @module ToggleSwitch
 * @description
 * Toggle switch tool demonstrating form controls.
 */

"use client";

import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface ToggleSwitchProps {
  label: string;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

export function ToggleSwitch({
  label,
  checked = false,
  onCheckedChange,
}: ToggleSwitchProps) {
  return (
    <div className="flex items-center space-x-2">
      <Switch
        id={label.toLowerCase().replace(/\s+/g, "-")}
        checked={checked}
        onCheckedChange={onCheckedChange}
      />
      <Label
        htmlFor={label.toLowerCase().replace(/\s+/g, "-")}
        className="cursor-pointer"
      >
        {label}
      </Label>
    </div>
  );
}
