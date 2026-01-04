/**
 * @fileoverview KuteLogo
 * 
 * @file kute-logo.tsx
 * @module KuteLogo
 * @description
 * File auto-synced from v0. Ready for review and promotion to production.
 * 
 * @see {@link ../../v0-ideai/components/logos/kute-logo.tsx}
 * @since 2026-01-04
 * @version 0.1.0
 * 
 * @todo Review and apply IdeaI standards
 * @todo Test functionality
 * @todo Promote to production when ready
 */

"use client"

import { useEffect, useRef } from "react"
import { IdeaiIcon } from '@repo/ui/components/v0/ideai-icon'
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

export function KuteLogo({ config, selectedSvg }: LogoProps) {
  const logoRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window === "undefined") return

    const loadKute = async () => {
      // @ts-ignore
      const KUTE = (await import("kute.js")).default

      if (logoRef.current && textRef.current) {
        const logo = logoRef.current
        const text = textRef.current

        const animateLogo = () => {
          // Reset initial state
          logo.style.transform = "scale(0) rotate(0deg)"
          logo.style.opacity = "0"
          text.style.opacity = "0"
          text.style.transform = "translateY(20px)"

          // Animate logo
          KUTE.fromTo(
            logo,
            { scale: 0, rotate: -180, opacity: 0 },
            { scale: 1, rotate: 0, opacity: 1 },
            {
              duration: config.duration * 1000,
              delay: config.delay * 1000,
              easing: "easingCubicOut",
            },
          ).start()

          // Animate text
          setTimeout(
            () => {
              KUTE.fromTo(
                text,
                { opacity: 0, translateY: 20 },
                { opacity: 1, translateY: 0 },
                { duration: 500, easing: "easingCubicOut" },
              ).start()
            },
            (config.delay + config.duration) * 1000,
          )
        }

        animateLogo()

        if (config.loop) {
          const interval = setInterval(animateLogo, (config.duration + config.delay) * 1000 + 1000)
          return () => clearInterval(interval)
        }
      }
    }

    loadKute()
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
      <div ref={logoRef} style={{ transformOrigin: "center" }}>
        {renderSvg()}
      </div>

      <div ref={textRef} className="text-center">
        <h2 className="text-3xl font-bold text-foreground">KuteLogo</h2>
        <p className="text-sm text-muted-foreground mt-2">Animated with KUTE.js</p>
      </div>
    </div>
  )
}
