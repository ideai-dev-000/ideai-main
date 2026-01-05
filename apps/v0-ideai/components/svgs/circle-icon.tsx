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
