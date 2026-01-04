/**
 * @fileoverview BrainIcon
 * 
 * @file brain-icon.tsx
 * @module BrainIcon
 * @description
 * File auto-synced from v0. Ready for review and promotion to production.
 * 
 * @see {@link ../../v0-ideai/components/ui/brain-icon.tsx}
 * @since 2026-01-04
 * @version 0.1.0
 * 
 * @todo Review and apply IdeaI standards
 * @todo Test functionality
 * @todo Promote to production when ready
 */

interface BrainIconProps {
  className?: string
}

export function BrainIcon({ className = "" }: BrainIconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" className={className}>
      <defs>
        <style>
          {`
            .brain-bg { fill: #06b6d4; }
            .brain-fg { fill: #fff; }
            .brain-accent { fill: #06b6d4; }
          `}
        </style>
      </defs>
      <g id="brain-logo">
        <rect id="background" className="brain-bg" width="500" height="500" rx="80" />
        <g id="foreground">
          {/* Left hemisphere */}
          <g id="left-hemisphere">
            <path
              id="left-lobe"
              className="brain-fg"
              d="M180,150 Q140,180 140,230 Q140,280 160,310 Q180,340 210,350 L210,200 Q195,175 180,150 Z"
            />
            <circle id="left-node-1" className="brain-accent" cx="160" cy="190" r="8" />
            <circle id="left-node-2" className="brain-accent" cx="155" cy="250" r="8" />
            <circle id="left-node-3" className="brain-accent" cx="175" cy="310" r="8" />
          </g>
          {/* Right hemisphere */}
          <g id="right-hemisphere">
            <path
              id="right-lobe"
              className="brain-fg"
              d="M320,150 Q360,180 360,230 Q360,280 340,310 Q320,340 290,350 L290,200 Q305,175 320,150 Z"
            />
            <circle id="right-node-1" className="brain-accent" cx="340" cy="190" r="8" />
            <circle id="right-node-2" className="brain-accent" cx="345" cy="250" r="8" />
            <circle id="right-node-3" className="brain-accent" cx="325" cy="310" r="8" />
          </g>
          {/* Center connection */}
          <g id="center">
            <rect id="corpus" className="brain-fg" x="230" y="200" width="40" height="150" rx="10" />
            <circle id="center-node-1" className="brain-accent" cx="250" cy="230" r="8" />
            <circle id="center-node-2" className="brain-accent" cx="250" cy="280" r="8" />
            <circle id="center-node-3" className="brain-accent" cx="250" cy="330" r="8" />
          </g>
          {/* Neural connections */}
          <g id="connections" stroke="#06b6d4" strokeWidth="2" fill="none" opacity="0.5">
            <path d="M160,190 Q205,210 250,230" />
            <path d="M340,190 Q295,210 250,230" />
            <path d="M155,250 Q202,265 250,280" />
            <path d="M345,250 Q298,265 250,280" />
          </g>
        </g>
      </g>
    </svg>
  )
}
