/**
 * @fileoverview GeometricIcon
 * 
 * @file geometric-icon.tsx
 * @module GeometricIcon
 * @description
 * File auto-synced from v0. Ready for review and promotion to production.
 * 
 * @see {@link ../../v0-ideai/components/svgs/geometric-icon.tsx}
 * @since 2026-01-04
 * @version 0.1.0
 * 
 * @todo Review and apply IdeaI standards
 * @todo Test functionality
 * @todo Promote to production when ready
 */

interface GeometricIconProps {
  className?: string
}

export function GeometricIcon({ className = "" }: GeometricIconProps) {
  return (
    <svg
      width="500"
      height="500"
      viewBox="0 0 500 500"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect width="500" height="500" fill="#2563EB" />
      <path d="M 250 100 L 400 250 L 250 400 L 100 250 Z" fill="#FFFFFF" />
      <circle cx="250" cy="250" r="60" fill="#2563EB" />
    </svg>
  )
}
