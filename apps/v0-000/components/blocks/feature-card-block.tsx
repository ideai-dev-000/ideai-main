/**
 * @fileoverview Feature Card Block
 * 
 * @module FeatureCardBlock
 * @description
 * Composite block component demonstrating how to combine UI elements.
 * This is a "block" - a complete, reusable layout component.
 */

"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { BrainIcon, CatIcon, MusicIcon, RocketIcon } from "@repo/ui";

interface FeatureCardBlockProps {
  icon: "brain" | "cat" | "music" | "rocket";
  title: string;
  description: string;
}

const iconMap = {
  brain: BrainIcon,
  cat: CatIcon,
  music: MusicIcon,
  rocket: RocketIcon,
};

export function FeatureCardBlock({ icon, title, description }: FeatureCardBlockProps) {
  const IconComponent = iconMap[icon];
  
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <IconComponent className="w-6 h-6 text-primary" />
          </div>
          <CardTitle>{title}</CardTitle>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          This is a complete block component that combines UI elements from both
          @repo/ui (icons) and @/components/ui/* (shadcn components).
        </p>
      </CardContent>
    </Card>
  );
}

