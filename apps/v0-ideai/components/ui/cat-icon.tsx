interface CatIconProps {
  className?: string
}

export function CatIcon({ className = "" }: CatIconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" className={className}>
      <defs>
        <style>
          {`
            .cat-bg { fill: #8b5cf6; }
            .cat-fg { fill: #fff; }
          `}
        </style>
      </defs>
      <g id="cat-logo">
        <rect id="background" className="cat-bg" width="500" height="500" rx="80" />
        <g id="foreground">
          {/* Left ear */}
          <path id="left-ear" className="cat-fg" d="M140,120 L100,60 L160,100 Z" />
          {/* Right ear */}
          <path id="right-ear" className="cat-fg" d="M360,120 L400,60 L340,100 Z" />
          {/* Head */}
          <circle id="head" className="cat-fg" cx="250" cy="220" r="100" />
          {/* Left eye */}
          <ellipse id="left-eye" fill="#8b5cf6" cx="215" cy="200" rx="12" ry="20" />
          {/* Right eye */}
          <ellipse id="right-eye" fill="#8b5cf6" cx="285" cy="200" rx="12" ry="20" />
          {/* Nose */}
          <path id="nose" fill="#8b5cf6" d="M250,230 L240,245 L260,245 Z" />
          {/* Mouth */}
          <g id="mouth" fill="none" stroke="#8b5cf6" strokeWidth="3" strokeLinecap="round">
            <path d="M250,245 L250,255" />
            <path d="M250,255 Q230,265 220,260" />
            <path d="M250,255 Q270,265 280,260" />
          </g>
          {/* Body */}
          <ellipse id="body" className="cat-fg" cx="250" cy="380" rx="90" ry="80" />
          {/* Tail */}
          <path id="tail" className="cat-fg" d="M330,370 Q380,340 400,380 Q390,400 360,390 Z" />
        </g>
      </g>
    </svg>
  )
}
