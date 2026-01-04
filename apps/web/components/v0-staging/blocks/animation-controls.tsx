/**
 * @fileoverview AnimationControls
 * 
 * @file animation-controls.tsx
 * @module AnimationControls
 * @description
 * File auto-synced from v0. Ready for review and promotion to production.
 * 
 * @see {@link ../../v0-ideai/blocks/animation-controls.tsx}
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
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'

interface AnimationControlsProps {
  config: {
    duration: number
    delay: number
    loop: boolean
    animationType: string
  }
  onChange: (config: unknown) => void
  library: string
}

const animationTypes: Record<string, string[]> = {
  "framer-motion": ["scale", "fade", "slide", "rotate", "bounce"],
  "react-spring": ["spring", "fade", "slide", "rotate"],
  kute: ["morph", "scale", "rotate", "translate"],
  "motion-one": ["scale", "fade", "slide", "rotate"],
  vivus: ["delayed", "sync", "oneByOne"],
  tsparticles: ["particles", "confetti", "fireworks"],
}

export function AnimationControls({ config, onChange, library }: AnimationControlsProps) {
  const types = animationTypes[library] || animationTypes["framer-motion"]

  return (
    <Card className="p-6 bg-card">
      <h3 className="text-sm font-semibold text-foreground mb-4">Animation Settings</h3>

      <div className="space-y-6">
        {/* Animation Type */}
        <div className="space-y-3">
          <Label className="text-sm text-foreground">Animation Type</Label>
          <div className="grid grid-cols-2 gap-2">
            {types.map((type) => (
              <Button
                key={type}
                variant={config.animationType === type ? "default" : "outline"}
                size="sm"
                onClick={() => onChange({ ...config, animationType: type })}
                className="capitalize"
              >
                {type}
              </Button>
            ))}
          </div>
        </div>

        {/* Duration */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm text-foreground">Duration</Label>
            <span className="text-xs text-muted-foreground font-mono">{config.duration}s</span>
          </div>
          <Slider
            value={[config.duration]}
            onValueChange={([value]) => onChange({ ...config, duration: value })}
            min={0.1}
            max={5}
            step={0.1}
            className="w-full"
          />
        </div>

        {/* Delay */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm text-foreground">Delay</Label>
            <span className="text-xs text-muted-foreground font-mono">{config.delay}s</span>
          </div>
          <Slider
            value={[config.delay]}
            onValueChange={([value]) => onChange({ ...config, delay: value })}
            min={0}
            max={3}
            step={0.1}
            className="w-full"
          />
        </div>

        {/* Loop */}
        <div className="flex items-center justify-between">
          <Label className="text-sm text-foreground">Loop Animation</Label>
          <Switch checked={config.loop} onCheckedChange={(loop) => onChange({ ...config, loop })} />
        </div>
      </div>
    </Card>
  )
}
