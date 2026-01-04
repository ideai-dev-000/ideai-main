/**
 * @fileoverview MotionOneLogo
 * 
 * @file motion-one-logo.tsx
 * @module MotionOneLogo
 * @description
 * File auto-synced from v0. Ready for review and promotion to production.
 * 
 * @see {@link ../../v0-ideai/components/logos/motion-one-logo.tsx}
 * @since 2026-01-04
 * @version 0.1.0
 * 
 * @todo Review and apply IdeaI standards
 * @todo Test functionality
 * @todo Promote to production when ready
 */

"use client"

import { useEffect, useRef } from "react"
import { IdeaiIcon } from '@repo/ui/components/v0/IdeaI-icon'
import { GeometricIcon } from '@repo/ui/components/v0/geometric-icon'
import { CircleIcon } from '@repo/ui/components/v0/circle-icon'

interface LogoProps {
  config: {
    duration: number
    delay: number
    loop: boolean
    animationType: string
  }
  selectedSvg: string
}

export function MotionOneLogo({ config, selectedSvg }: LogoProps) {
  const logoRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window === "undefined") return

    const loadMotionOne = async () => {
      const { animate } = await import("motion")

      if (logoRef.current && textRef.current) {
        const animateLogo = () => {
          // Animate logo
          animate(
            logoRef.current!,
            { scale: [0, 1], opacity: [0, 1], rotate: [0, 360] },
            {
              duration: config.duration,
              delay: config.delay,
              easing: "ease-out",
            },
          )

          // Animate text
          animate(
            textRef.current!,
            { opacity: [0, 1], y: [20, 0] },
            {
              duration: 0.6,
              delay: config.delay + config.duration,
              easing: "ease-out",
            },
          )
        }

        animateLogo()

        if (config.loop) {
          const interval = setInterval(animateLogo, (config.duration + config.delay) * 1000 + 1000)
          return () => clearInterval(interval)
        }
      }
    }

    loadMotionOne()
  }, [config])

  const renderSvg = () => {
    const svgClassName = "w-[300px] h-[300px]"
    switch (selectedSvg) {
      case "IdeaI":
        return <IdeaiIcon className={svgClassName} />
      case "geometric":
        return <GeometricIcon className={svgClassName} />
      case "circle":
        return <CircleIcon className={svgClassName} />
      default:
        return <IdeaiIcon className={svgClassName} />
    }
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <div ref={logoRef} style={{ transformOrigin: "center", opacity: 0 }}>
        {renderSvg()}
      </div>

      <div ref={textRef} style={{ opacity: 0 }} className="text-center">
        <h2 className="text-3xl font-bold text-foreground">MotionOne</h2>
        <p className="text-sm text-muted-foreground mt-2">Lightweight Animation</p>
      </div>
    </div>
  )
}
