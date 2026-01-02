/**
 * @fileoverview Animation Demo Card Component
 * 
 * @module AnimationCard
 * @description
 * Reusable card component for displaying animation examples.
 * Shows effect description on left, demo on right.
 * 
 * @example
 * ```tsx
 * <AnimationCard example={exampleData} />
 * ```
 */

"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSpring, animated, config } from "@react-spring/web";
import { ExternalLink, Code2, Play } from "lucide-react";
import type { AnimationExample } from "./types";

interface AnimationCardProps {
  example: AnimationExample;
  library: "framer-motion" | "react-spring";
}

/**
 * Animation Demo Card
 * 
 * Displays animation example with description card on left and demo on right
 */
export function AnimationCard({ example, library }: AnimationCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showCode, setShowCode] = useState(false);

  // Render animation based on library
  const renderDemo = () => {
    if (library === "framer-motion") {
      return <FramerMotionDemo example={example} />;
    } else {
      return <ReactSpringDemo example={example} />;
    }
  };

  return (
    <div className="ideai-animation-card">
      <div className="ideai-animation-card__container">
        {/* Left: Description Card */}
        <div className="ideai-animation-card__info">
          <div className="ideai-animation-card__header">
            <div>
              <h3 className="ideai-animation-card__title">{example.title}</h3>
              <p className="ideai-animation-card__description">{example.description}</p>
            </div>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="ideai-animation-card__expand"
              aria-label={isExpanded ? "Collapse" : "Expand"}
            >
              {isExpanded ? "−" : "+"}
            </button>
          </div>

          <div className="ideai-animation-card__meta">
            <div className="ideai-animation-card__badges">
              <span className="ideai-animation-card__badge ideai-animation-card__badge--library">
                {example.library}
              </span>
              <span className="ideai-animation-card__badge ideai-animation-card__badge--category">
                {example.category}
              </span>
            </div>
            <div className="ideai-animation-card__tags">
              {example.tags.map((tag) => (
                <span key={tag} className="ideai-animation-card__tag">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="ideai-animation-card__expanded"
              >
                <div className="ideai-animation-card__actions">
                  <a
                    href={example.source}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ideai-animation-card__link"
                  >
                    <ExternalLink className="h-4 w-4" />
                    View Source
                  </a>
                  <button
                    onClick={() => setShowCode(!showCode)}
                    className="ideai-animation-card__code-toggle"
                  >
                    <Code2 className="h-4 w-4" />
                    {showCode ? "Hide" : "Show"} Code
                  </button>
                </div>

                {showCode && (
                  <motion.pre
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="ideai-animation-card__code"
                  >
                    <code>{example.code}</code>
                  </motion.pre>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right: Demo */}
        <div className="ideai-animation-card__demo">
          <div className="ideai-animation-card__demo-header">
            <Play className="h-4 w-4" />
            <span>Live Demo</span>
          </div>
          <div className="ideai-animation-card__demo-content">
            {renderDemo()}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Framer Motion Demo Renderer
 */
function FramerMotionDemo({ example }: { example: AnimationExample }) {
  const animConfig = example.config as any;
  const [isHovered, setIsHovered] = useState(false);
  
  // Build motion props from config
  const motionProps: any = {
    className: "ideai-animation-demo-box",
    style: {
      width: "100%",
      height: "200px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
  };

  // Apply config properties
  if (animConfig.initial) motionProps.initial = animConfig.initial;
  if (animConfig.animate) motionProps.animate = animConfig.animate;
  if (animConfig.whileHover) {
    motionProps.whileHover = animConfig.whileHover;
    motionProps.onMouseEnter = () => setIsHovered(true);
    motionProps.onMouseLeave = () => setIsHovered(false);
  }
  if (animConfig.drag) {
    motionProps.drag = animConfig.drag;
    motionProps.dragConstraints = animConfig.dragConstraints;
    motionProps.dragElastic = animConfig.dragElastic;
  }
  if (animConfig.transition) motionProps.transition = animConfig.transition;
  if (animConfig.whileInView) {
    motionProps.whileInView = animConfig.whileInView;
    motionProps.viewport = animConfig.viewport;
  }
  
  return (
    <motion.div {...motionProps}>
      <div className="ideai-animation-demo-content">
        {example.title}
      </div>
    </motion.div>
  );
}

/**
 * React Spring Demo Renderer
 */
function ReactSpringDemo({ example }: { example: AnimationExample }) {
  const config = example.config as any;
  const [toggle, setToggle] = useState(false);

  // Handle different React Spring patterns
  let springProps: any = {};
  
  if (example.id === "react-spring-1") {
    // Spring physics - scale
    springProps = useSpring({
      scale: toggle ? (config.to?.scale || 1.2) : (config.from?.scale || 1),
      config: config.config || config.wobbly,
    });
  } else if (example.id === "react-spring-2") {
    // Number animation
    springProps = useSpring({
      number: config.number || 100,
      from: config.from || { number: 0 },
      config: config.config || config.slow,
    });
  } else if (example.id === "react-spring-5") {
    // Color transition
    springProps = useSpring({
      backgroundColor: toggle ? "#3b82f6" : "#ef4444",
      config: config.config || config.gentle,
    });
  } else {
    // Default spring
    springProps = useSpring({
      from: config.from || { opacity: 0 },
      to: config.to || { opacity: 1 },
      config: config.config || config.gentle,
    });
  }

  const baseStyle: React.CSSProperties = {
    width: "100%",
    height: "200px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  };

  // Merge spring props with base style
  const combinedStyle = { ...baseStyle, ...springProps };

  return (
    <animated.div
      style={combinedStyle}
      className="ideai-animation-demo-box"
      onClick={() => setToggle(!toggle)}
    >
      <div className="ideai-animation-demo-content">
        {example.id === "react-spring-2" ? (
          <animated.div style={{ fontSize: "2rem", fontWeight: 700 }}>
            {springProps.number?.to((n: number) => Math.floor(n))}
          </animated.div>
        ) : (
          example.title
        )}
      </div>
    </animated.div>
  );
}

