/**
 * @fileoverview Footer indicators component - Human/Bot concept visualization
 *
 * @module IdeAIFooterIndicators
 * @description
 * Subtle footer indicators showing the conceptual separation: humans (IRL contact) on left,
 * bots (autonomous/social media) on right. Used to showcase different technologies via
 * tooltips and visual hints.
 *
 * @example
 * ```tsx
 * <IdeAIFooterIndicators side="left" />
 * <IdeAIFooterIndicators side="right" />
 * ```
 */

"use client";

import * as React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

interface IdeAIFooterIndicatorsProps {
  side: "left" | "right";
}

/**
 * Human icon indicator for left side (IRL contact info)
 */
const HumanIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="ideai-footer-indicator__icon"
  >
    <path
      d="M8 8C9.65685 8 11 6.65685 11 5C11 3.34315 9.65685 2 8 2C6.34315 2 5 3.34315 5 5C5 6.65685 6.34315 8 8 8Z"
      fill="currentColor"
    />
    <path
      d="M8 9C5.23858 9 3 11.2386 3 14H13C13 11.2386 10.7614 9 8 9Z"
      fill="currentColor"
    />
  </svg>
);

/**
 * Bot icon indicator for right side (autonomous/social media)
 */
const BotIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="ideai-footer-indicator__icon"
  >
    <rect x="4" y="6" width="8" height="6" rx="1" fill="currentColor" />
    <circle cx="6" cy="3" r="1.5" fill="currentColor" />
    <circle cx="10" cy="3" r="1.5" fill="currentColor" />
    <rect x="6" y="9" width="1" height="2" fill="currentColor" />
    <rect x="9" y="9" width="1" height="2" fill="currentColor" />
  </svg>
);

export const IdeAIFooterIndicators = ({ side }: IdeAIFooterIndicatorsProps) => {
  const isLeft = side === "left";
  const tooltipText = isLeft
    ? "Humans on left, bots right"
    : "Humans on left, bots right";

  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          <span
            className={`ideai-footer-indicator ideai-footer-indicator--${side}`}
            aria-label={
              isLeft ? "Human contact information" : "Bot-controlled services"
            }
          >
            {isLeft ? <HumanIcon /> : <BotIcon />}
          </span>
        </TooltipTrigger>
        <TooltipContent side="top" sideOffset={8}>
          <p className="text-xs">{tooltipText}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
