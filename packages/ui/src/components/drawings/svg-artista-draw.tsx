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

    // Clear previous content and classes
    containerRef.current.innerHTML = "";
    containerRef.current.className = className || "";
    containerRef.current.classList.remove(
      "svg-artista",
      "svg-artista-stroke",
      "svg-artista-fill",
      "active",
    );

    // Parse SVG and add animation classes
    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(svgContent.trim(), "image/svg+xml");
    const svgElement = svgDoc.querySelector("svg");

    if (!svgElement) {
      console.warn("SVG Artista: Could not parse SVG content");
      return;
    }

    // Clone the SVG element to avoid modifying the original
    const clonedSvg = svgElement.cloneNode(true) as SVGElement;

    // Set SVG size
    clonedSvg.setAttribute("width", "120");
    clonedSvg.setAttribute("height", "120");
    clonedSvg.setAttribute("viewBox", "0 0 200 200");

    // Reset all stroke and fill properties on SVG elements
    const allElements = clonedSvg.querySelectorAll(
      "path, circle, rect, line, polyline, polygon",
    );
    allElements.forEach((el) => {
      const element = el as SVGElement;
      // Reset stroke properties
      if (animationType === "stroke" || animationType === "both") {
        element.style.strokeDasharray = "1000";
        element.style.strokeDashoffset = "1000";
      }
      // Reset fill properties
      if (animationType === "fill" || animationType === "both") {
        element.style.fillOpacity = "0";
        // Also set fill if not already set
        if (
          !element.getAttribute("fill") ||
          element.getAttribute("fill") === "none"
        ) {
          element.setAttribute("fill", "#3b82f6");
        }
      }
    });

    // Add SVG Artista animation classes to container
    containerRef.current.classList.add("svg-artista");
    if (animationType === "stroke" || animationType === "both") {
      containerRef.current.classList.add("svg-artista-stroke");
    }
    if (animationType === "fill" || animationType === "both") {
      containerRef.current.classList.add("svg-artista-fill");
    }

    // Set animation duration on container
    containerRef.current.style.setProperty("--duration", `${duration}s`);
    containerRef.current.style.setProperty("--delay", `${delay}s`);

    // Append SVG
    containerRef.current.appendChild(clonedSvg);

    // Trigger animation restart - force reflow to restart animation
    requestAnimationFrame(() => {
      if (containerRef.current) {
        containerRef.current.classList.remove("active");
        // Force reflow
        void containerRef.current.offsetWidth;
        requestAnimationFrame(() => {
          if (containerRef.current) {
            containerRef.current.classList.add("active");
          }
        });
      }
    });
  }, [svgContent, animationType, duration, delay, className]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        display: "inline-block",
        width: "120px",
        height: "120px",
      }}
    />
  );
}
