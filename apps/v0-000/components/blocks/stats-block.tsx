/**
 * @fileoverview Stats Block
 *
 * @module StatsBlock
 * @description
 * Stats display block demonstrating layout and styling patterns.
 */

"use client";

import { Card, CardContent } from "@/components/ui/card";

interface Stat {
  label: string;
  value: string | number;
}

interface StatsBlockProps {
  stats: Stat[];
}

export function StatsBlock({ stats }: StatsBlockProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardContent className="p-6">
            <div className="text-2xl font-bold">{stat.value}</div>
            <div className="text-sm text-muted-foreground mt-1">
              {stat.label}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
