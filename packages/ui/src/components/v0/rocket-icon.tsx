/**
 * @fileoverview RocketIcon
 * 
 * @file rocket-icon.tsx
 * @module RocketIcon
 * @description
 * File auto-synced from v0. Ready for review and promotion to production.
 * 
 * @see {@link ../../v0-ideai/components/ui/rocket-icon.tsx}
 * @since 2026-01-04
 * @version 0.1.0
 * 
 * @todo Review and apply IdeaI standards
 * @todo Test functionality
 * @todo Promote to production when ready
 */

interface RocketIconProps {
  className?: string
}

export function RocketIcon({ className = "" }: RocketIconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" className={className}>
      <defs>
        <style>
          {`
            .rocket-bg { fill: #ec4899; }
            .rocket-body { fill: #fff; }
            .rocket-window { fill: #ec4899; }
            .rocket-accent { fill: #fbbf24; }
          `}
        </style>
      </defs>
      <g id="rocket-logo">
        <rect id="background" className="rocket-bg" width="500" height="500" rx="80" />
        <g id="foreground">
          {/* Main rocket body */}
          <path id="body" className="rocket-body" d="M250,80 L200,280 L200,350 L300,350 L300,280 Z" />
          {/* Nose cone */}
          <path id="nose" className="rocket-body" d="M250,80 L200,180 L300,180 Z" />
          {/* Window */}
          <circle id="window" className="rocket-window" cx="250" cy="200" r="25" />
          {/* Left fin */}
          <path id="left-fin" className="rocket-accent" d="M200,280 L150,350 L200,350 Z" />
          {/* Right fin */}
          <path id="right-fin" className="rocket-accent" d="M300,280 L350,350 L300,350 Z" />
          {/* Left flame */}
          <path id="left-flame" className="rocket-accent" d="M210,350 L200,420 L220,380 L230,350 Z" />
          {/* Center flame */}
          <path id="center-flame" className="rocket-accent" d="M240,350 L250,450 L260,350 Z" />
          {/* Right flame */}
          <path id="right-flame" className="rocket-accent" d="M270,350 L280,380 L300,420 L290,350 Z" />
        </g>
      </g>
    </svg>
  )
}
