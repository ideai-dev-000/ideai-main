/**
 * @fileoverview FramerMotionLogo
 * 
 * @file framer-motion-logo.tsx
 * @module FramerMotionLogo
 * @description
 * File auto-synced from v0. Ready for review and promotion to production.
 * 
 * @see {@link ../../v0-ideai/components/logos/framer-motion-logo.tsx}
 * @since 2026-01-04
 * @version 0.1.0
 * 
 * @todo Review and apply IdeaI standards
 * @todo Test functionality
 * @todo Promote to production when ready
 */

"use client"

import { motion } from "framer-motion"
import { IdeaiIcon } from "@/components/svgs/IdeaI-icon"
import { CatIcon } from "@/components/svgs/cat-icon"
import { RocketIcon } from "@/components/svgs/rocket-icon"
import { BrainIcon } from "@/components/svgs/brain-icon"
import { MusicIcon } from "@/components/svgs/music-icon"

interface LogoProps {
  config: {
    duration: number
    delay: number
    loop: boolean
    animationType: string
  }
  selectedSvg: string
}

export function FramerMotionLogo({ config, selectedSvg }: LogoProps) {
  const getAnimationProps = () => {
    const baseProps = {
      transition: {
        duration: config.duration,
        delay: config.delay,
        repeat: config.loop ? Number.POSITIVE_INFINITY : 0,
        repeatType: "loop" as const,
      },
    }

    switch (config.animationType) {
      case "scale":
        return {
          initial: { scale: 0, opacity: 0 },
          animate: { scale: 1, opacity: 1 },
          ...baseProps,
        }
      case "fade":
        return {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          ...baseProps,
        }
      case "slide":
        return {
          initial: { x: -100, opacity: 0 },
          animate: { x: 0, opacity: 1 },
          ...baseProps,
        }
      case "rotate":
        return {
          initial: { rotate: -180, opacity: 0 },
          animate: { rotate: 0, opacity: 1 },
          ...baseProps,
        }
      case "bounce":
        return {
          initial: { y: -50, opacity: 0 },
          animate: { y: 0, opacity: 1 },
          transition: {
            ...baseProps.transition,
            type: "spring",
            stiffness: 300,
            damping: 10,
          },
        }
      default:
        return {
          initial: { scale: 0 },
          animate: { scale: 1 },
          ...baseProps,
        }
    }
  }

  const renderSvg = () => {
    const svgClassName = "w-[300px] h-[300px]"
    switch (selectedSvg) {
      case "IdeaI":
        return <IdeaiIcon className={svgClassName} />
      case "cat":
        return <CatIcon className={svgClassName} />
      case "rocket":
        return <RocketIcon className={svgClassName} />
      case "brain":
        return <BrainIcon className={svgClassName} />
      case "music":
        return <MusicIcon className={svgClassName} />
      default:
        return <IdeaiIcon className={svgClassName} />
    }
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <motion.div {...getAnimationProps()}>{renderSvg()}</motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: config.delay + config.duration }}
        className="text-center"
      >
        <h2 className="text-3xl font-bold text-foreground">MotionLogo</h2>
        <p className="text-sm text-muted-foreground mt-2">Animated with Framer Motion</p>
      </motion.div>
    </div>
  )
}
