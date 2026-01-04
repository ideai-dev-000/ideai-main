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
