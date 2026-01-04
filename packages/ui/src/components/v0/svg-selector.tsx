/**
 * @fileoverview SvgSelector
 * 
 * @file svg-selector.tsx
 * @module SvgSelector
 * @description
 * File auto-synced from v0. Ready for review and promotion to production.
 * 
 * @see {@link ../../v0-ideai/blocks/svg-selector.tsx}
 * @since 2026-01-04
 * @version 0.1.0
 * 
 * @todo Review and apply IdeaI standards
 * @todo Test functionality
 * @todo Promote to production when ready
 */

"use client"

import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

interface SvgSelectorProps {
  selected: string
  onSelect: (svg: string) => void
}

const svgOptions = [
  { id: "IdeaI", name: "Robot Icon", description: "Robot with eyes and mouth" },
  { id: "cat", name: "Cat Icon", description: "Cat with ears, eyes, and tail" },
  { id: "rocket", name: "Rocket Icon", description: "Rocket with flames" },
  { id: "brain", name: "Brain Icon", description: "Brain with neural nodes" },
  { id: "music", name: "Music Icon", description: "Musical notes with waves" },
]

export function SvgSelector({ selected, onSelect }: SvgSelectorProps) {
  return (
    <Card className="p-6 bg-card">
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-1">Choose SVG</h3>
          <p className="text-xs text-muted-foreground">Select a logo to animate</p>
        </div>

        <RadioGroup value={selected} onValueChange={onSelect} className="space-y-3">
          {svgOptions.map((option) => (
            <div key={option.id} className="flex items-start space-x-3">
              <RadioGroupItem value={option.id} id={option.id} className="mt-1" />
              <Label htmlFor={option.id} className="flex-1 cursor-pointer">
                <div className="font-medium text-sm text-foreground">{option.name}</div>
                <div className="text-xs text-muted-foreground">{option.description}</div>
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>
    </Card>
  )
}
