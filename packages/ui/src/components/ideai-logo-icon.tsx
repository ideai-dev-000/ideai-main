/**
 * @fileoverview IdeaI logo icon component (gear icon)
 * 
 * @module IdeAILogoIcon
 * @description
 * SVG logo icon component for IdeaI brand.
 * Displays the friendly gear icon with smiley face.
 * Used in header logo display.
 * 
 * @example
 * ```tsx
 * import { IdeAILogoIcon } from "@repo/ui/components/ideai-logo-icon";
 * 
 * <IdeAILogoIcon className="w-12 h-12" />
 * ```
 */

interface IdeAILogoIconProps {
  className?: string;
  width?: number | string;
  height?: number | string;
}

/**
 * IdeaI logo icon - friendly gear with smiley face
 * Optimized for accessibility and SEO
 */
export const IdeAILogoIcon = ({ 
  className = "", 
  width = 100, 
  height = 100 
}: IdeAILogoIconProps) => {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 100 100" 
      width={width} 
      height={height}
      className={className}
      aria-hidden="true"
      role="img"
    >
      <title>IdeaI Logo</title>
      <desc>IdeaI brand logo - friendly gear icon with smiley face</desc>
      
      {/* Yellow background circle for gear */}
      <circle cx="50" cy="50" r="50" fill="#FFD700"/>
      
      {/* Main gear (8 teeth) */}
      <g transform="translate(50, 50)">
        {/* Gear body */}
        <circle cx="0" cy="0" r="28" fill="white"/>
        <circle cx="0" cy="0" r="18" fill="#FFD700"/>
        
        {/* 8 gear teeth */}
        <rect x="-3" y="-35" width="6" height="12" fill="white" rx="2"/>
        <rect x="-3" y="23" width="6" height="12" fill="white" rx="2"/>
        <rect x="-35" y="-3" width="12" height="6" fill="white" rx="2"/>
        <rect x="23" y="-3" width="12" height="6" fill="white" rx="2"/>
        
        {/* Diagonal teeth */}
        <rect x="20" y="-20" width="6" height="12" fill="white" rx="2" transform="rotate(45)"/>
        <rect x="-26" y="20" width="6" height="12" fill="white" rx="2" transform="rotate(45)"/>
        <rect x="-20" y="-20" width="6" height="12" fill="white" rx="2" transform="rotate(-45)"/>
        <rect x="20" y="20" width="6" height="12" fill="white" rx="2" transform="rotate(-45)"/>
        
        {/* Eye gears (two smaller gears) */}
        <g transform="translate(-12, -8)">
          <circle cx="0" cy="0" r="6" fill="white"/>
          <circle cx="0" cy="0" r="3" fill="#FFD700"/>
          <rect x="-1.5" y="-9" width="3" height="4" fill="white" rx="1"/>
          <rect x="-1.5" y="5" width="3" height="4" fill="white" rx="1"/>
          <rect x="-9" y="-1.5" width="4" height="3" fill="white" rx="1"/>
          <rect x="5" y="-1.5" width="4" height="3" fill="white" rx="1"/>
        </g>
        
        <g transform="translate(12, -8)">
          <circle cx="0" cy="0" r="6" fill="white"/>
          <circle cx="0" cy="0" r="3" fill="#FFD700"/>
          <rect x="-1.5" y="-9" width="3" height="4" fill="white" rx="1"/>
          <rect x="-1.5" y="5" width="3" height="4" fill="white" rx="1"/>
          <rect x="-9" y="-1.5" width="4" height="3" fill="white" rx="1"/>
          <rect x="5" y="-1.5" width="4" height="3" fill="white" rx="1"/>
        </g>
        
        {/* Smile (curved line) */}
        <path d="M -12 8 Q 0 16 12 8" stroke="white" strokeWidth="3" fill="none" strokeLinecap="round"/>
      </g>
    </svg>
  );
};

