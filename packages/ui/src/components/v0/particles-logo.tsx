/**
 * @fileoverview ParticlesLogo
 *
 * @file particles-logo.tsx
 * @module ParticlesLogo
 * @description
 * File auto-synced from v0. Ready for review and promotion to production.
 *
 * @see {@link ../../v0-ideai/components/logos/particles-logo.tsx}
 * @since 2026-01-04
 * @version 0.1.0
 *
 * @todo Review and apply IdeaI standards
 * @todo Test functionality
 * @todo Promote to production when ready
 */

"use client";

import { useEffect, useRef } from "react";
import { IdeaiIcon } from "@repo/ui/components/v0/ideai-icon";
import { GeometricIcon } from "@repo/ui/components/v0/geometric-icon";
import { CircleIcon } from "@repo/ui/components/v0/circle-icon";

interface LogoProps {
  config: {
    duration: number;
    delay: number;
    loop: boolean;
    animationType: string;
  };
  selectedSvg: string;
}

export function ParticlesLogo({ config, selectedSvg }: LogoProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !containerRef.current) return;

    const loadParticles = async () => {
      const tsparticles = await import("@tsparticles/engine");
      const { loadSlim } = await import("@tsparticles/slim");
      const tsParticles = tsparticles.default || tsparticles;

      await loadSlim(tsParticles as any);

      const particleConfig = {
        particles: {
          number: {
            value: config.animationType === "confetti" ? 100 : 80,
            density: { enable: true, area: 800 },
          },
          color: { value: ["#8B5CF6", "#3B82F6", "#10B981"] },
          shape: {
            type:
              config.animationType === "confetti"
                ? ["circle", "square"]
                : "circle",
          },
          opacity: {
            value: 0.6,
            animation: { enable: true, speed: 1, minimumValue: 0.1 },
          },
          size: {
            value: config.animationType === "fireworks" ? 3 : 4,
            random: true,
            animation: { enable: true, speed: 2, minimumValue: 0.5 },
          },
          move: {
            enable: true,
            speed: config.animationType === "confetti" ? 3 : 2,
            direction: config.animationType === "confetti" ? "bottom" : "none",
            outModes: { default: "out" },
          },
        },
        interactivity: {
          events: {
            onHover: { enable: true, mode: "repulse" },
          },
        },
      };

      if (containerRef.current) {
        await (tsParticles as any).load({
          id: "particles-container",
          element: containerRef.current,
          options: particleConfig as any,
        });
      }
    };

    loadParticles();
  }, [config]);

  const renderSvg = () => {
    const svgClassName = "w-[200px] h-[200px]";
    switch (selectedSvg) {
      case "IdeaI":
        return <IdeaiIcon className={svgClassName} />;
      case "geometric":
        return <GeometricIcon className={svgClassName} />;
      case "circle":
        return <CircleIcon className={svgClassName} />;
      default:
        return <IdeaiIcon className={svgClassName} />;
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 relative">
      <div className="relative w-[300px] h-[300px]">
        <div
          id="particles-container"
          ref={containerRef}
          className="absolute inset-0"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          {renderSvg()}
        </div>
      </div>

      <div className="text-center">
        <h2 className="text-3xl font-bold text-foreground">ParticleLogo</h2>
        <p className="text-sm text-muted-foreground mt-2">
          Powered by tsParticles
        </p>
      </div>
    </div>
  );
}
