/**
 * @fileoverview SVG Artista Drawing Component
 * 
 * @module SVGArtistaDraw
 * @description
 * Component for SVG Artista-style animations.
 * SVG Artista is a tool that generates CSS-based SVG animations.
 * This component provides a React wrapper for those patterns.
 * 
 * @example
 * ```tsx
 * <SVGArtistaDraw
 *   svgContent={svgString}
 *   animationType="stroke"
 *   duration={2}
 * />
 * ```
 */

"use client";

import { useEffect, useRef } from "react";

interface SVGArtistaDrawProps {
  svgContent: string;
  animationType?: "stroke" | "fill" | "both";
  duration?: number;
  delay?: number;
  className?: string;
}

export function SVGArtistaDraw({
  svgContent,
  animationType = "stroke",
  duration = 2,
  delay = 0,
  className,
}: SVGArtistaDrawProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Parse SVG and add animation classes
    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(svgContent, "image/svg+xml");
    const svgElement = svgDoc.querySelector("svg");

    if (!svgElement) return;

    // Add SVG Artista animation classes
    svgElement.classList.add("svg-artista");
    if (animationType === "stroke" || animationType === "both") {
      svgElement.classList.add("svg-artista-stroke");
    }
    if (animationType === "fill" || animationType === "both") {
      svgElement.classList.add("svg-artista-fill");
    }

    // Set animation duration
    svgElement.style.setProperty("--duration", `${duration}s`);
    svgElement.style.setProperty("--delay", `${delay}s`);

    // Clear and append
    containerRef.current.innerHTML = "";
    containerRef.current.appendChild(svgElement);

    // Trigger animation
    setTimeout(() => {
      svgElement.classList.add("active");
    }, delay * 1000);
  }, [svgContent, animationType, duration, delay]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        display: "inline-block",
      }}
    />
  );
}

