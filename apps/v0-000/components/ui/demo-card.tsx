/**
 * @fileoverview Demo Card UI Component
 *
 * @module DemoCard
 * @description
 * Simple card component demonstrating correct import patterns for v0.
 * Uses shadcn Card from @/components/ui/card
 */

"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface DemoCardProps {
  title?: string;
  description?: string;
  content?: React.ReactNode;
  footer?: React.ReactNode;
}

export function DemoCard({
  title = "Card Title",
  description = "Card description",
  content,
  footer,
}: DemoCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      {content && <CardContent>{content}</CardContent>}
      {footer && <CardFooter>{footer}</CardFooter>}
    </Card>
  );
}
