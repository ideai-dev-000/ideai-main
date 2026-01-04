/**
 * @fileoverview MusicIcon
 * 
 * @file music-icon.tsx
 * @module MusicIcon
 * @description
 * File auto-synced from v0. Ready for review and promotion to production.
 * 
 * @see {@link ../../v0-ideai/components/ui/music-icon.tsx}
 * @since 2026-01-04
 * @version 0.1.0
 * 
 * @todo Review and apply IdeaI standards
 * @todo Test functionality
 * @todo Promote to production when ready
 */

interface MusicIconProps {
  className?: string
}

export function MusicIcon({ className = "" }: MusicIconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" className={className}>
      <defs>
        <style>
          {`
            .music-bg { fill: #10b981; }
            .music-fg { fill: #fff; }
          `}
        </style>
      </defs>
      <g id="music-logo">
        <rect id="background" className="music-bg" width="500" height="500" rx="80" />
        <g id="foreground">
          {/* Note stem 1 */}
          <rect id="stem-1" className="music-fg" x="180" y="120" width="8" height="200" />
          {/* Note stem 2 */}
          <rect id="stem-2" className="music-fg" x="280" y="100" width="8" height="220" />
          {/* Connecting beam */}
          <path id="beam" className="music-fg" d="M180,120 L288,100 L288,140 L180,160 Z" />
          {/* Left note head */}
          <ellipse
            id="left-note"
            className="music-fg"
            cx="170"
            cy="330"
            rx="25"
            ry="18"
            transform="rotate(-20 170 330)"
          />
          {/* Right note head */}
          <ellipse
            id="right-note"
            className="music-fg"
            cx="290"
            cy="330"
            rx="25"
            ry="18"
            transform="rotate(-20 290 330)"
          />
          {/* Sound waves */}
          <g id="sound-waves" stroke="#fff" strokeWidth="4" fill="none" opacity="0.6">
            <path id="wave-1" d="M340,200 Q360,200 360,220" />
            <path id="wave-2" d="M360,200 Q390,200 390,230" />
            <path id="wave-3" d="M380,190 Q420,190 420,240" />
          </g>
        </g>
      </g>
    </svg>
  )
}
