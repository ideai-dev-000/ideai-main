/**
 * @fileoverview VivusLogo
 * 
 * @file vivus-logo.tsx
 * @module VivusLogo
 * @description
 * File auto-synced from v0. Ready for review and promotion to production.
 * 
 * @see {@link ../../v0-ideai/components/logos/vivus-logo.tsx}
 * @since 2026-01-04
 * @version 0.1.0
 * 
 * @todo Review and apply IdeaI standards
 * @todo Test functionality
 * @todo Promote to production when ready
 */

"use client"

import { useEffect, useRef } from "react"

interface LogoProps {
  config: {
    duration: number
    delay: number
    loop: boolean
    animationType: string
  }
  selectedSvg: string
}

export function VivusLogo({ config, selectedSvg }: LogoProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const textRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window === "undefined" || !svgRef.current) return

    const loadVivus = async () => {
      // @ts-ignore
      const Vivus = (await import("vivus")).default

      const animationType =
        config.animationType === "delayed" ? "delayed" : config.animationType === "sync" ? "sync" : "oneByOne"

      const vivus = new Vivus(
        svgRef.current,
        {
          type: animationType,
          duration: config.duration * 60,
          delay: config.delay * 60,
          start: "autostart",
        },
        () => {
          if (textRef.current) {
            textRef.current.style.opacity = "1"
            textRef.current.style.transform = "translateY(0)"
          }
        },
      )

      if (config.loop) {
        const interval = setInterval(
          () => {
            vivus.reset().play()
            if (textRef.current) {
              textRef.current.style.opacity = "0"
              textRef.current.style.transform = "translateY(20px)"
            }
          },
          (config.duration + config.delay) * 1000 + 1000,
        )
        return () => clearInterval(interval)
      }
    }

    loadVivus()
  }, [config])

  const renderSvgPath = () => {
    switch (selectedSvg) {
      case "IdeaI":
        return (
          <>
            <circle cx="100" cy="100" r="80" stroke="#06B6D4" strokeWidth="4" fill="none" />
            <path
              d="M 60 80 L 70 90 L 90 70"
              stroke="#06B6D4"
              strokeWidth="4"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M 110 80 L 120 90 L 140 70"
              stroke="#06B6D4"
              strokeWidth="4"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path d="M 70 120 Q 100 140 130 120" stroke="#06B6D4" strokeWidth="4" fill="none" strokeLinecap="round" />
          </>
        )
      case "geometric":
        return (
          <>
            <path
              d="M 100 20 L 180 100 L 100 180 L 20 100 Z"
              stroke="#06B6D4"
              strokeWidth="6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M 100 50 L 150 100 L 100 150 L 50 100 Z"
              stroke="#06B6D4"
              strokeWidth="6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </>
        )
      case "circle":
        return (
          <>
            <circle cx="100" cy="100" r="80" stroke="#06B6D4" strokeWidth="6" fill="none" />
            <circle cx="100" cy="100" r="50" stroke="#06B6D4" strokeWidth="6" fill="none" />
            <circle cx="100" cy="100" r="15" stroke="#06B6D4" strokeWidth="6" fill="none" />
          </>
        )
      default:
        return (
          <>
            <circle cx="100" cy="100" r="80" stroke="#06B6D4" strokeWidth="4" fill="none" />
          </>
        )
    }
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <div ref={containerRef}>
        <svg ref={svgRef} width="300" height="300" viewBox="0 0 200 200">
          {renderSvgPath()}
        </svg>
      </div>

      <div
        ref={textRef}
        style={{ opacity: 0, transform: "translateY(20px)", transition: "all 0.5s ease-out" }}
        className="text-center"
      >
        <h2 className="text-3xl font-bold text-foreground">VivusLogo</h2>
        <p className="text-sm text-muted-foreground mt-2">SVG Drawing Animation</p>
      </div>
    </div>
  )
}
