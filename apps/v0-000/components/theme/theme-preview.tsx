/**
 * @fileoverview Theme Preview Component
 *
 * @module ThemePreview
 * @description
 * Preview component showing how themes affect UI components.
 * Demonstrates that themes work seamlessly with any UI.
 */

"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function ThemePreview() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Theme Preview</CardTitle>
        <CardDescription>
          See how the current theme affects all UI components
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="text-sm font-semibold mb-2">Colors</h3>
          <div className="flex flex-wrap gap-2">
            <div className="w-16 h-16 rounded-lg bg-primary" title="Primary" />
            <div
              className="w-16 h-16 rounded-lg bg-secondary"
              title="Secondary"
            />
            <div className="w-16 h-16 rounded-lg bg-accent" title="Accent" />
            <div className="w-16 h-16 rounded-lg bg-muted" title="Muted" />
            <div
              className="w-16 h-16 rounded-lg bg-destructive"
              title="Destructive"
            />
          </div>
        </div>
        <div>
          <h3 className="text-sm font-semibold mb-2">Buttons</h3>
          <div className="flex flex-wrap gap-2">
            <Button variant="default">Default</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="destructive">Destructive</Button>
          </div>
        </div>
        <div>
          <h3 className="text-sm font-semibold mb-2">Badges</h3>
          <div className="flex flex-wrap gap-2">
            <Badge>Default</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="outline">Outline</Badge>
            <Badge variant="destructive">Destructive</Badge>
          </div>
        </div>
        <div className="p-4 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground">
            All components automatically use theme colors via CSS variables.
            Change the theme above to see them update instantly!
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
