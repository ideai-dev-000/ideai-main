/**
 * @fileoverview CircleIcon
 * 
 * @file circle-icon.tsx
 * @module CircleIcon
 * @description
 * File auto-synced from v0. Ready for review and promotion to production.
 * 
 * @see {@link ../../v0-ideai/components/svgs/circle-icon.tsx}
 * @since 2026-01-04
 * @version 0.1.0
 * 
 * @todo Review and apply IdeaI standards
 * @todo Test functionality
 * @todo Promote to production when ready
 */

interface CircleIconProps {
  className?: string
}

export function CircleIcon({ className = "" }: CircleIconProps) {
  return (
    <svg
      width="500"
      height="500"
      viewBox="0 0 500 500"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect width="500" height="500" fill="#8B5CF6" />
      <circle cx="250" cy="250" r="150" stroke="#FFFFFF" strokeWidth="20" fill="none" />
      <circle cx="250" cy="250" r="80" fill="#FFFFFF" />
    </svg>
  )
}
