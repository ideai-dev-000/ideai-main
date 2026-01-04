/**
 * @fileoverview ReactSpringLogo
 * 
 * @file react-spring-logo.tsx
 * @module ReactSpringLogo
 * @description
 * File auto-synced from v0. Ready for review and promotion to production.
 * 
 * @see {@link ../../v0-ideai/components/logos/react-spring-logo.tsx}
 * @since 2026-01-04
 * @version 0.1.0
 * 
 * @todo Review and apply IdeaI standards
 * @todo Test functionality
 * @todo Promote to production when ready
 */

"use client"

import { useEffect } from "react"
import { useSpring, animated } from "@react-spring/web"
import { IdeaiIcon } from "@/components/svgs/IdeaI-icon"
import { GeometricIcon } from "@/components/svgs/geometric-icon"
import { CircleIcon } from "@/components/svgs/circle-icon"

interface LogoProps {
  config: {
    duration: number
    delay: number
    loop: boolean
    animationType: string
  }
  selectedSvg: string
}

export function ReactSpringLogo({ config, selectedSvg }: LogoProps) {
  const [springs, api] = useSpring(() => ({
    from: { transform: "scale(0) rotate(0deg) translateX(0px)", opacity: 0 },
    to: { transform: "scale(1) rotate(0deg) translateX(0px)", opacity: 1 },
    config: { duration: config.duration * 1000 },
  }))

  useEffect(() => {
    const animate = () => {
      api.start({
        from: getFromValues(),
        to: { transform: "scale(1) rotate(0deg) translateX(0px)", opacity: 1 },
        delay: config.delay * 1000,
        config: { duration: config.duration * 1000 },
      })
    }

    animate()

    if (config.loop) {
      const interval = setInterval(
        () => {
          animate()
        },
        (config.duration + config.delay) * 1000 + 500,
      )
      return () => clearInterval(interval)
    }
  }, [config, api])

  const getFromValues = () => {
    switch (config.animationType) {
      case "spring":
        return { transform: "scale(0) rotate(0deg) translateX(0px)", opacity: 0 }
      case "fade":
        return { transform: "scale(1) rotate(0deg) translateX(0px)", opacity: 0 }
      case "slide":
        return { transform: "scale(1) rotate(0deg) translateX(-100px)", opacity: 0 }
      case "rotate":
        return { transform: "scale(1) rotate(-180deg) translateX(0px)", opacity: 0 }
      default:
        return { transform: "scale(0) rotate(0deg) translateX(0px)", opacity: 0 }
    }
  }

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
      <animated.div style={springs}>{renderSvg()}</animated.div>

      <animated.div style={{ opacity: springs.opacity }} className="text-center">
        <h2 className="text-3xl font-bold text-foreground">SpringLogo</h2>
        <p className="text-sm text-muted-foreground mt-2">Powered by React Spring</p>
      </animated.div>
    </div>
  )
}
